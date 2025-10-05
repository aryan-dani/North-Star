
import os, json, warnings, numpy as np, pandas as pd
warnings.filterwarnings("ignore")

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics import (accuracy_score, f1_score, confusion_matrix,
                             mean_absolute_error, mean_squared_error, r2_score)
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.svm import SVC, SVR
from joblib import dump
import matplotlib.pyplot as plt

CSV_PATH = "../data/merged_all_missions.csv"
print(f"Loading data from {CSV_PATH}...")
df = pd.read_csv(CSV_PATH).dropna(axis=1, how="all").drop_duplicates()
print(f"Data loaded: {df.shape[0]} rows, {df.shape[1]} columns")

def detect_target(dataframe: pd.DataFrame):
    cols = list(dataframe.columns)
    for name in ["target", "label", "class", "y"]:
        for c in cols:
            if c.strip().lower() == name:
                return c
    for c in reversed(cols):
        if dataframe[c].nunique(dropna=True) <= 20:
            return c
    return cols[-1]

target_col = detect_target(df)
y = df[target_col]
X = df.drop(columns=[target_col])

mask = ~y.isna()
X = X.loc[mask].reset_index(drop=True)
y = y.loc[mask].reset_index(drop=True)

def is_classification(y_series: pd.Series):
    return y_series.dtype == "O" or y_series.nunique() <= 20

task = "classification" if is_classification(y) else "regression"
print(f"\nDetected task: {task}")
print(f"Target column: {target_col}")
print(f"Target classes/values: {y.nunique()}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y if task=="classification" and y.nunique()>1 else None
)

numeric_features = X.select_dtypes(include=[np.number]).columns.tolist()
categorical_features = [c for c in X.columns if c not in numeric_features]
print(f"\nFeatures: {len(numeric_features)} numeric, {len(categorical_features)} categorical")
print(f"Training set: {X_train.shape[0]} samples, Test set: {X_test.shape[0]} samples\n")

preprocessor = ColumnTransformer([
    ("num", Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler(with_mean=False))]), numeric_features),
    ("cat", Pipeline([("imputer", SimpleImputer(strategy="most_frequent")), ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=True))]), categorical_features)
])

if task=="classification":
    candidates = [
        ("LogisticRegression", LogisticRegression(max_iter=300)),
        ("RandomForestClassifier", RandomForestClassifier(n_estimators=150, random_state=42)),
        ("SVC", SVC(probability=True, kernel="rbf", C=1.0, gamma="scale", random_state=42)),
    ]
else:
    candidates = [
        ("LinearRegression", LinearRegression()),
        ("RandomForestRegressor", RandomForestRegressor(n_estimators=200, random_state=42)),
        ("SVR", SVR(kernel="rbf", C=1.0, gamma="scale")),
    ]

results = []
best_name, best_score, best_pipe = None, -1e18, None

for name, model in candidates:
    print(f"Training {name}...")
    pipe = Pipeline([("pre", preprocessor), ("model", model)])
    pipe.fit(X_train, y_train)
    if task=="classification":
        pred = pipe.predict(X_test)
        f1m = f1_score(y_test, pred, average="macro")
        acc = accuracy_score(y_test, pred)
        score = 0.7*f1m + 0.3*acc  
        print(f"  Accuracy: {acc:.4f}, F1-Macro: {f1m:.4f}")
        results.append({"model": name, "holdout_accuracy": float(acc), "holdout_f1_macro": float(f1m)})
    else:
        pred = pipe.predict(X_test)
        r2 = r2_score(y_test, pred)
        rmse = mean_squared_error(y_test, pred, squared=False)
        mae = mean_absolute_error(y_test, pred)
        score = r2
        print(f"  R²: {r2:.4f}, RMSE: {rmse:.4f}, MAE: {mae:.4f}")
        results.append({"model": name, "holdout_r2": float(r2), "holdout_rmse": float(rmse), "holdout_mae": float(mae)})
    if score > best_score:
        best_score = score
        best_name = name
        best_pipe = pipe

print(f"\n{'='*50}")
print(f"Best model: {best_name}")
print(f"{'='*50}\n")

results_df = pd.DataFrame(results)
output_dir = "../output"
os.makedirs(output_dir, exist_ok=True)
results_csv = os.path.join(output_dir, "model_results_quick.csv")
results_df.to_csv(results_csv, index=False)
print(f"Results saved to: {results_csv}")
print("\nModel Comparison:")
print(results_df.to_string(index=False))

artifacts = {"results_csv": results_csv}

if task=="classification":
    from sklearn.metrics import confusion_matrix
    pred = best_pipe.predict(X_test)  # type: ignore
    cm = confusion_matrix(y_test, pred, labels=np.unique(y_test))
    fig = plt.figure(figsize=(6,6))
    plt.imshow(cm, interpolation="nearest")
    plt.title(f"Confusion Matrix: {best_name}")
    unique_labels = [str(label) for label in np.unique(y_test)]
    plt.xticks(ticks=np.arange(len(unique_labels)), labels=unique_labels, rotation=45, ha="right")
    plt.yticks(ticks=np.arange(len(unique_labels)), labels=unique_labels)
    plt.xlabel("Predicted")
    plt.ylabel("True")
    plt.tight_layout()
    cm_path = os.path.join(output_dir, "confusion_matrix.png")
    plt.savefig(cm_path, bbox_inches="tight"); plt.close(fig)
    print(f"Confusion matrix saved to: {cm_path}")
else:
    pred = best_pipe.predict(X_test)  # type: ignore
    fig = plt.figure(figsize=(6,4))
    plt.scatter(range(len(y_test)), y_test - pred)
    plt.axhline(0)
    plt.title(f"Residuals: {best_name}")
    plt.xlabel("Sample")
    plt.ylabel("Residual")
    plt.tight_layout()
    resid_path = os.path.join(output_dir, "residuals_plot.png")
    plt.savefig(resid_path, bbox_inches="tight"); plt.close(fig)
    print(f"Residuals plot saved to: {resid_path}")
    artifacts["residuals_plot"] = resid_path

colinfo_path = os.path.join(output_dir, "feature_columns.json")
with open(colinfo_path, "w") as f:
    json.dump({"task": task, "target_col": target_col,
               "numeric_features": list(numeric_features),
               "categorical_features": list(categorical_features)}, f, indent=2)
artifacts["feature_columns_json"] = colinfo_path
print(f"Feature info saved to: {colinfo_path}")

model_path = os.path.join(output_dir, "best_model_quick.joblib")
dump(best_pipe, model_path)
artifacts["best_model_joblib"] = model_path
print(f"Best model saved to: {model_path}")

print("\n" + "="*50)
print("Training completed successfully!")
print("="*50)

summary = {"task": task, "target_col": target_col, "best_model": best_name, "artifacts": artifacts}
print(f"\nSummary:")
print(json.dumps(summary, indent=2))

