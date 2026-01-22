# Airline Passenger Satisfaction — Data Mining Project

This repository contains an end-to-end data mining project built around a simple goal: **understand what drives airline passenger satisfaction and predict it reliably**.  
Along with model training and evaluation, a working **React and Flask web app** is included so predictions and insights can be explored through a clean dashboard instead of only notebooks.

---

## Project Demo (YouTube)
https://youtu.be/TPWopQruvhI

---

## GitHub Repository
https://github.com/ttabirami12062/DataMining-AirlineSatisfaction

---

## What this project does

This project supports three useful outcomes:

**1) Predict satisfaction for an individual passenger**  
Given travel + service details, the system returns:
- a **Satisfaction label** (Satisfied / Not Satisfied)
- a **Satisfaction score** (0–1 style score from a regression model)
- a **Passenger segment** (cluster assignment)

**2) Explain the main drivers behind satisfaction**  
Regression models are used to make the relationship between features and satisfaction easier to interpret (service scores, delays, and travel context).

**3) Segment passengers into groups**  
PCA + K-Means are used to group passengers into clusters that represent different experience patterns (ex: high-service vs low-service groups).

---

## Methods Included

### Regression (scoring + interpretability)
Used to produce a satisfaction score and understand feature impact:
- OLS
- Ridge
- Lasso
- Piecewise regression (where applicable)

### Clustering (passenger segmentation)
- PCA for dimensionality reduction
- K-Means for clustering
- Cluster quality checked using standard metrics (Elbow / Silhouette / CH score depending on the experiment design)

### Classification (main prediction)
- Random Forest (implemented from scratch in the project workflow)
- Tuned to improve generalization and reduce overfitting

---

## Dataset
Dataset source: **Kaggle – Airline Passenger Satisfaction**  
Typical fields include passenger type, travel type/class, delays, and multiple service rating categories.  
The target is converted into a binary label:
- `Satisfied = 1`
- `Neutral/Dissatisfied = 0`

---

## Data Preparation (high-level)

The dataset is prepared for modeling by:
- removing non-informative ID columns
- handling missing values (median for numeric, mode for categorical)
- encoding categorical variables (binary mapping + one-hot encoding where needed)
- engineering practical features such as:
  - **Total_Delay = Departure Delay + Arrival Delay**
  - **Total_Service_Score = average of service rating features**

---

## Web App Overview (React + Flask)

**Frontend (React)**
- Pages commonly include: Home, About, Predict, Reports, Dashboard
- Predict page allows user input and shows model outputs clearly

**Backend (Flask)**
- Loads trained models (`.pkl`)
- Recreates engineered features during inference
- Exposes endpoints for predictions and dashboard summaries

Example endpoints:
- `POST /api/predict`
- `GET /api/dashboard-summary`

