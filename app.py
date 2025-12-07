from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)  # allow React dev server to call this API


# ---------- helpers to load and decode data ----------

def get_class_series(df: pd.DataFrame) -> pd.Series:
    """Return a readable 'Class' series from the cleaned data."""
    if "Class" in df.columns:
        return df["Class"].astype(str).str.strip()

    bis = df["Class_Business"] == 1 if "Class_Business" in df.columns else None
    eco = df["Class_Eco"] == 1 if "Class_Eco" in df.columns else None
    eco_plus = df["Class_Eco Plus"] == 1 if "Class_Eco Plus" in df.columns else None

    if bis is not None:
        return pd.Series(
            np.where(bis, "Business",
                     np.where(eco, "Eco", "Eco Plus")),
            index=df.index
        )
    else:
        return pd.Series(
            np.where(eco == 1, "Eco",
                     np.where(eco_plus == 1, "Eco Plus", "Business")),
            index=df.index
        )


def load_clean_data():
    """Load train_cleaned.csv and add human-readable labels."""
    df = pd.read_csv("data/data_dm/train_cleaned.csv")

    # satisfaction: 0/1 -> text
    df["satisfaction_label"] = df["satisfaction"].map(
        {1: "Satisfied", 0: "Not satisfied"}
    )

    # gender
    if "Gender" in df.columns:
        df["gender_label"] = df["Gender"].map({1: "Female", 0: "Male"})
    else:
        df["gender_label"] = np.nan

    # customer type
    if "Customer Type" in df.columns:
        df["customer_type_label"] = df["Customer Type"].map(
            {1: "Loyal Customer", 0: "Disloyal Customer"}
        )
    else:
        df["customer_type_label"] = np.nan

    # type of travel
    travel_col = None
    for c in ["Type of Travel", "Type_of_Travel", "Type_of_travel", "type_of_travel"]:
        if c in df.columns:
            travel_col = c
            break

    if travel_col is not None:
        df["travel_label"] = df[travel_col].map(
            {1: "Business Travel", 0: "Personal Travel"}
        )
    else:
        df["travel_label"] = np.nan

    # class
    df["class_label"] = get_class_series(df)

    return df


def dist_percent(series: pd.Series):
    """Return value -> percentage dict (rounded to 1 decimal)."""
    counts = series.value_counts(dropna=True)
    total = counts.sum()
    return {str(k): round(float(v) / total * 100, 1) for k, v in counts.items()}


def cross_counts(df: pd.DataFrame, cat_col: str):
    """Return {category: {satisfaction_label: count}}."""
    ct = pd.crosstab(df[cat_col], df["satisfaction_label"])
    result = {}
    for cat in ct.index:
        row = ct.loc[cat]
        result[str(cat)] = {str(k): int(row[k]) for k in row.index}
    return result


# Load data once when app starts
df_clean = load_clean_data()


# ---------- API route ----------

@app.route("/api/dashboard-summary", methods=["GET"])
def dashboard_summary():
    df = df_clean

    total_passengers = int(len(df))
    satisfied_pct = float((df["satisfaction"] == 1).mean() * 100)
    loyal_pct = float((df["customer_type_label"] == "Loyal Customer").mean() * 100)

    summary = {
        "total_passengers": total_passengers,
        "satisfied_pct": round(satisfied_pct, 1),
        "loyal_pct": round(loyal_pct, 1),
        "distributions": {
            "satisfaction": dist_percent(df["satisfaction_label"]),
            "gender": dist_percent(df["gender_label"]),
            "customer_type": dist_percent(df["customer_type_label"]),
            "travel": dist_percent(df["travel_label"]),
            "class": dist_percent(df["class_label"]),
        },
        "by_category": {
            "gender": cross_counts(df, "gender_label"),
            "customer_type": cross_counts(df, "customer_type_label"),
            "travel": cross_counts(df, "travel_label"),
            "class": cross_counts(df, "class_label"),
        },
    }

    return jsonify(summary)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
