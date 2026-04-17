import pandas as pd
import numpy as np
import pickle
from sklearn.neighbors import KNeighborsClassifier

# LOAD DATA
df = pd.read_csv("data/parkinsons.csv")

# ✅ USE REAL COLUMNS
X = df[["MDVP:Jitter(%)", "MDVP:Shimmer"]].values
y = df["status"].values  # 0 = healthy, 1 = Parkinson's

# NORMALIZATION
mean = X.mean(axis=0)
std = X.std(axis=0)
X_norm = (X - mean) / std

# MODEL (your "PNN" = KNN approximation)
model = KNeighborsClassifier(n_neighbors=5)
model.fit(X_norm, y)

# SAVE MODEL
with open("models/pnn.pkl", "wb") as f:
    pickle.dump({
        "model": model,
        "mean": mean,
        "std": std
    }, f)

print("✅ Model trained successfully")