# server.py
# Backend API for Airline Passenger Satisfaction (RandomForest from scratch + pickle)

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import re
import math
import pandas as pd

# -------------------- Flask setup --------------------

app = Flask(__name__)
CORS(app)  # allow React app on localhost:3000


# =====================================================
#  A. MODEL CODE (copied from your Colab classification)
#     Needed so pickle can reconstruct the objects.
# =====================================================


def sigmoid(z):
    return 1.0 / (1.0 + np.exp(-z))


def roc_auc_score_from_probs(y_true, y_score):
    """Rank-based AUC: P(score_pos > score_neg). Used only during training."""
    y_true = np.asarray(y_true).astype(int)
    y_score = np.asarray(y_score).astype(float)
    pos = y_score[y_true == 1]
    neg = y_score[y_true == 0]
    if len(pos) == 0 or len(neg) == 0:
        return 0.5
    combined = np.concatenate([pos, neg])
    order = np.argsort(combined)
    ranks = np.empty_like(order, dtype=float)
    ranks[order] = np.arange(len(order))
    r_pos = ranks[:len(pos)].sum()
    auc = (r_pos - len(pos) * (len(pos) - 1) / 2) / (len(pos) * len(neg))
    return float(auc)


class Node:
    __slots__ = ("feature", "threshold", "left", "right", "proba", "is_leaf")

    def __init__(
        self,
        proba=None,
        is_leaf=False,
        feature=None,
        threshold=None,
        left=None,
        right=None,
    ):
        self.feature = feature
        self.threshold = threshold
        self.left = left
        self.right = right
        self.proba = proba
        self.is_leaf = is_leaf


def gini_of_labels(y):
    if len(y) == 0:
        return 0.0
    p = y.mean()
    return 2 * p * (1 - p)  # gini


def best_split_numeric(X, y, feat_idx, min_leaf):
    x = X[:, feat_idx]
    order = np.argsort(x)
    x_sorted, y_sorted = x[order], y[order]
    n = len(y)

    g_parent = gini_of_labels(y_sorted)
    left_count = left_pos = 0
    right_count = n
    right_pos = y_sorted.sum()

    best_gain, best_thr = 0.0, None

    for i in range(n - 1):
        left_count += 1
        left_pos += y_sorted[i]
        right_count -= 1
        right_pos -= y_sorted[i]

        if x_sorted[i] == x_sorted[i + 1]:
            continue
        if left_count < min_leaf or right_count < min_leaf:
            continue

        pL = left_pos / left_count
        pR = right_pos / right_count if right_count > 0 else 0
        g_left = 2 * pL * (1 - pL)
        g_right = 2 * pR * (1 - pR)

        g = (left_count / n) * g_left + (right_count / n) * g_right
        gain = g_parent - g

        if gain > best_gain:
            best_gain = gain
            best_thr = (x_sorted[i] + x_sorted[i + 1]) / 2.0

    return best_gain, best_thr


class CARTTree:
    def __init__(self, max_depth=6, min_samples_leaf=10, max_features=None, random_state=42):
        self.max_depth = max_depth
        self.min_samples_leaf = min_samples_leaf
        self.max_features = max_features
        self.random_state = random_state
        self.root = None
        self.d_ = None

    def fit(self, X, y):
        self.d_ = X.shape[1]
        rng = np.random.default_rng(self.random_state)

        def grow(Xi, yi, depth):
            proba = yi.mean() if len(yi) > 0 else 0.5
            if (
                depth >= self.max_depth
                or len(yi) <= 2 * self.min_samples_leaf
                or yi.min() == yi.max()
            ):
                return Node(proba=float(proba), is_leaf=True)

            feats = (
                rng.choice(self.d_, size=self.max_features, replace=False)
                if self.max_features
                else np.arange(self.d_)
            )

            best_feat = best_thr = None
            best_gain = 0.0

            for f in feats:
                gain, thr = best_split_numeric(Xi, yi, f, self.min_samples_leaf)
                if thr is not None and gain > best_gain:
                    best_gain, best_thr, best_feat = gain, thr, f

            if best_thr is None:
                return Node(proba=float(proba), is_leaf=True)

            mask = Xi[:, best_feat] <= best_thr
            left = grow(Xi[mask], yi[mask], depth + 1)
            right = grow(Xi[~mask], yi[~mask], depth + 1)
            return Node(
                proba=float(proba),
                feature=int(best_feat),
                threshold=float(best_thr),
                left=left,
                right=right,
                is_leaf=False,
            )

        self.root = grow(X, y, 0)
        return self

    def predict_proba(self, X):
        out = np.zeros(X.shape[0])
        for i in range(X.shape[0]):
            node = self.root
            while not node.is_leaf:
                node = node.left if X[i, node.feature] <= node.threshold else node.right
            out[i] = node.proba
        return out

    def predict(self, X, threshold=0.5):
        return (self.predict_proba(X) >= threshold).astype(int)


class RandomForest:
    def __init__(
        self,
        n_trees=80,
        max_depth=8,
        min_samples_leaf=10,
        max_features=None,
        random_state=42,
    ):
        self.n_trees = n_trees
        self.max_depth = max_depth
        self.min_samples_leaf = min_samples_leaf
        self.max_features = max_features
        self.random_state = random_state
        self.trees_ = []
        self.boot_index_ = []
        self.oob_score_ = None  # ROC–AUC on OOB

    def fit(self, X, y):
        rng = np.random.default_rng(self.random_state)
        n, d = X.shape
        self.trees_.clear()
        self.boot_index_.clear()

        # collect OOB predictions
        oob_lists = [[] for _ in range(n)]

        for t in range(self.n_trees):
            idx_boot = rng.integers(0, n, size=n)
            self.boot_index_.append(idx_boot)

            Xb, yb = X[idx_boot], y[idx_boot]
            mfeat = self.max_features or max(1, int(np.sqrt(d)))

            tree = CARTTree(
                max_depth=self.max_depth,
                min_samples_leaf=self.min_samples_leaf,
                max_features=mfeat,
                random_state=int(self.random_state + 137 * t),
            ).fit(Xb, yb)
            self.trees_.append(tree)

            # OOB predictions for this tree
            mask_oob = np.ones(n, dtype=bool)
            mask_oob[idx_boot] = False
            if mask_oob.any():
                probs = tree.predict_proba(X[mask_oob])
                for pi, gi in enumerate(np.where(mask_oob)[0]):
                    oob_lists[gi].append(probs[pi])

        # Compute OOB AUC (if any OOB predictions exist)
        have = np.array([len(v) > 0 for v in oob_lists])
        if have.any():
            y_true = y[have]
            y_prob = np.array(
                [np.mean(v) for v in np.array(oob_lists, dtype=object)[have]]
            )
            self.oob_score_ = roc_auc_score_from_probs(y_true, y_prob)
        else:
            self.oob_score_ = None

        return self

    def predict_proba(self, X):
        if not self.trees_:
            return np.zeros(X.shape[0], dtype=float)
        s = np.zeros(X.shape[0], dtype=float)
        for tr in self.trees_:
            s += tr.predict_proba(X)
        return s / len(self.trees_)

    def predict(self, X, threshold=0.5):
        return (self.predict_proba(X) >= threshold).astype(int)


# =====================================================
#  B. LOAD THE PICKLED ARTIFACT
# =====================================================

with open("model.pkl", "rb") as f:
    artifact = pickle.load(f)

# artifact structure from your Colab:
# {
#   "model_type": "RandomForest_from_scratch",
#   "best_params": ...,
#   "oob_auc": ...,
#   "n_features": int,
#   "feature_names": [...],
#   "trained_at": "...",
#   "model": rf_best,
# }

rf_model: RandomForest = artifact["model"]
feature_names = artifact["feature_names"]  # list of column names used in training

rf_model: RandomForest = artifact["model"]
feature_names = artifact["feature_names"]  # list of column names used in training

# --- debug: prove pickle loaded correctly ---
print("=== MODEL LOADED FROM PICKLE ===")
print("Model type:", artifact.get("model_type"))
print("OOB AUC:", artifact.get("oob_auc"))
print("Num features:", len(feature_names))
print("First 10 features:", feature_names[:10], flush=True)


# =====================================================
#  C. ENCODER: React formData  -> model feature vector
# =====================================================

def encode_form(form: dict) -> np.ndarray:
    """
    Build a 1×n feature vector in the same order as artifact['feature_names'].
    `form` is exactly your React formData object.
    """
    def norm(s: str) -> str:
        return re.sub(r"[^a-z0-9]+", "", s.lower())

    gender = (form.get("gender") or "").strip().lower()      # "male"/"female"
    cust = (form.get("customerType") or "").strip().lower()  # "loyal"/"disloyal"
    trvl = (form.get("travelType") or "").strip().lower()    # "business"/"personal"

    x = []

    for col in feature_names:
        val = 0.0
        col_norm = norm(col)

        # ---- direct numeric columns ----
        if col_norm == "age":
            val = float(form.get("age") or 0)
        elif col_norm == "flightdistance":
            val = float(form.get("flightDistance") or 0)
        elif col_norm == "departuredelayinminutes":
            val = float(form.get("departureDelay") or 0)
        elif col_norm == "arrivaldelayinminutes":
            # we don't ask arrival delay in UI; assume 0
            val = 0.0

        # service ratings that exist in the UI (0–5)
        elif col_norm == "inflightwifiservice":
            val = float(form.get("inflightWifi") or 0)
        elif col_norm == "onlineboarding":
            val = float(form.get("onlineBoarding") or 0)
        elif col_norm == "cleanliness":
            val = float(form.get("cleanliness") or 0)
        elif col_norm == "baggagehandling":
            val = float(form.get("baggageHandling") or 0)
        elif col_norm == "gatelocation":
            val = float(form.get("gateLocation") or 0)
        elif col_norm == "seatcomfort":
            val = float(form.get("seatComfort") or 0)
        elif col_norm == "inflightentertainment":
            val = float(form.get("inflightEntertainment") or 0)

        # other service columns used in training but not in UI -> neutral default (3)
        elif col_norm in {
            "departurearrivaltimeconvenient",
            "easeofonlinebooking",
            "foodanddrink",
            "onboardservice",
            "legroomservice",
            "checkinservice",
            "inflightservice",
        }:
            val = 3.0

        # ---- one-hot dummies from get_dummies() ----

        # gender_xxx
        elif col.lower().startswith("gender_"):
            cat = col.split("_", 1)[1].strip().lower()
            if "male" in cat and gender == "male":
                val = 1.0
            elif "female" in cat and gender == "female":
                val = 1.0
            else:
                val = 0.0

        # customer_type_xxx  (remember original values were "Loyal Customer", "disloyal Customer")
        elif col.lower().startswith("customer_type_"):
            cat = col.split("_", 1)[1].strip().lower()
            if "loyal" in cat and cust.startswith("loyal"):
                val = 1.0
            elif "disloyal" in cat and cust.startswith("disloyal"):
                val = 1.0
            else:
                val = 0.0

        # type_of_travel_xxx  ("Business travel", "Personal travel")
        elif col.lower().startswith("type_of_travel_"):
            cat = col.split("_", 1)[1].strip().lower()
            if "business" in cat and trvl.startswith("business"):
                val = 1.0
            elif "personal" in cat and trvl.startswith("personal"):
                val = 1.0
            else:
                val = 0.0

        # class_xxx – we don't ask class in the UI, so choose a reasonable default
        elif col.lower().startswith("class_"):
            # e.g. treat every UI input as "Eco Plus" if that dummy exists
            cat = col.split("_", 1)[1].strip().lower()
            if "eco plus" in cat:
                val = 1.0
            else:
                val = 0.0

        # anything else -> remain 0.0 (rare/dropped columns)

        x.append(val)

    return np.array(x, dtype=float).reshape(1, -1)


# =====================================================
#  D. API ENDPOINT
# =====================================================

@app.post("/predict")
def predict():
    form = request.get_json(force=True) or {}
    X = encode_form(form)

    # RandomForest.predict_proba returns probability for class 1 (satisfied)
    probs = rf_model.predict_proba(X)
    p1 = float(probs[0])
    label = "Satisfied" if p1 >= 0.5 else "Not satisfied"


    print("\n---- NEW PREDICTION ----")
    print("Raw form:", form)
    print("Encoded X shape:", X.shape)
    print("Encoded X row:", X.tolist())
    print("Model probability (class=1):", p1)
    print("Predicted label:", label, flush=True)

    
    return jsonify({"prediction": label, "probability": p1})
# -----------------------------------------------------------
# 1. Load the cleaned / trained CSV
#    CHANGE THE FILENAME HERE IF NEEDED
# -----------------------------------------------------------
CSV_PATH = "data/data_dm/train_cleaned.csv"  # or "data/airline_cleaned_train.csv"
df_raw = pd.read_csv(CSV_PATH)

# clean up any accidental spaces in column names
df_raw.columns = df_raw.columns.str.strip()
print(df_raw.head())
print(df_raw.columns.tolist())
print(df_raw)

# -----------------------------------------------------------
# 2. Rebuild the labelled categorical features
#    (this mirrors your Seaborn plotting code)
# -----------------------------------------------------------
cat_cols = {}

# Gender: 0/1 -> Male/Female
if "Gender" in df_raw.columns:
    cat_cols["Gender"] = df_raw["Gender"].map({1: "Female", 0: "Male"})

# Customer Type: 0/1 -> Loyal / Disloyal
if "Customer Type" in df_raw.columns:
    cat_cols["Customer Type"] = df_raw["Customer Type"].map(
        {1: "Loyal Customer", 0: "Disloyal Customer"}
    )

# Type of Travel: 0/1 -> Business / Personal
if "Type of Travel" in df_raw.columns:
    cat_cols["Type of Travel"] = df_raw["Type of Travel"].map(
        {1: "Business Travel", 0: "Personal Travel"}
    )

# Class: reconstruct from one-hot columns (Business / Eco / Eco Plus)
if ("Class_Business" in df_raw.columns) or ("Class_Eco" in df_raw.columns):
    class_labels = np.select(
        [
            df_raw.get("Class_Business", 0).eq(1),
            df_raw.get("Class_Eco", 0).eq(1),
        ],
        ["Business", "Eco"],
        default="Eco Plus",
    )
    cat_cols["Class"] = pd.Series(class_labels, index=df_raw.index)

# Satisfaction: 0/1 -> Not satisfied / Satisfied
sat_labels = df_raw["satisfaction"].map({1: "Satisfied", 0: "Not satisfied"})

# Build a “dashboard ready” DataFrame
df_dash = pd.DataFrame(cat_cols)
df_dash["satisfaction"] = sat_labels

# Drop rows where satisfaction is missing (just in case)
df_dash = df_dash.dropna(subset=["satisfaction"])

# -----------------------------------------------------------
# 3. Helper functions for distributions and cross-tabs
# -----------------------------------------------------------
def percentage_distribution(series: pd.Series) -> dict:
    """Return {label: percentage} for a categorical column."""
    valid = series.dropna()
    if valid.empty:
        return {}
    counts = valid.value_counts(normalize=True) * 100
    return {str(k): round(v, 1) for k, v in counts.to_dict().items()}


def build_cross_tab(col_name: str) -> dict:
    """
    Build nested dict like:
    {
      "Male":   {"Not satisfied": 28000, "Satisfied": 22000},
      "Female": {"Not satisfied": 30000, "Satisfied": 21000},
      ...
    }
    for use in the stacked Bar charts.
    """
    if col_name not in df_dash.columns:
        print(f"[dashboard] WARNING: column '{col_name}' not found in df_dash")
        return {}

    ct = (
        df_dash
        .groupby([col_name, "satisfaction"])
        .size()
        .unstack(fill_value=0)
    )

    out = {}
    for level in ct.index:
        row = ct.loc[level]
        out[str(level)] = {
            "Not satisfied": int(row.get("Not satisfied", 0)),
            "Satisfied": int(row.get("Satisfied", 0)),
        }
    return out


# -----------------------------------------------------------
# 4. API endpoint consumed by Dashboard.js
# -----------------------------------------------------------
@app.route("/api/dashboard-summary", methods=["GET"])
def dashboard_summary():
    total_passengers = int(len(df_dash))

    # Overall distributions (for the pie charts)
    dist_gender        = percentage_distribution(df_dash["Gender"])
    dist_customer_type = percentage_distribution(df_dash["Customer Type"])
    dist_travel        = percentage_distribution(df_dash["Type of Travel"])
    dist_class         = percentage_distribution(df_dash["Class"])
    dist_satisfaction  = percentage_distribution(df_dash["satisfaction"])

    # Cross-tab counts (for the bar charts)
    by_gender        = build_cross_tab("Gender")
    by_customer_type = build_cross_tab("Customer Type")
    by_travel        = build_cross_tab("Type of Travel")
    by_class         = build_cross_tab("Class")

    summary = {
        "total_passengers": total_passengers,
            "pie": {
            "gender":        percentage_distribution(df_dash["Gender"]),
            "customer_type": percentage_distribution(df_dash["Customer Type"]),
            "travel":        percentage_distribution(df_dash["Type of Travel"]),
            "class":         percentage_distribution(df_dash["Class"]),
            "satisfaction":  percentage_distribution(df_dash["satisfaction"])
        },

        "distributions": {
            "gender":        dist_gender,
            "customer_type": dist_customer_type,
            "travel":        dist_travel,
            "class":         dist_class,
            "satisfaction":  dist_satisfaction,
        },
        "by_category": {
            "gender":        by_gender,
            "customer_type": by_customer_type,
            "travel":        by_travel,
            "class":         by_class,
        },
    }

    return jsonify(summary)

if __name__ == "__main__":
    # Run:  python server.py
    # React will call http://localhost:5000/predict
    app.run(port=5000, debug=True)
