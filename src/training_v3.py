import os, json, warnings, numpy as np, pandas as pd
from datetime import datetime
warnings.filterwarnings("ignore")

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.metrics import (accuracy_score, f1_score, precision_score, recall_score,
                             confusion_matrix, classification_report,
                             mean_absolute_error, mean_squared_error, r2_score)
from sklearn.linear_model import LogisticRegression, LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.svm import SVC, SVR
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from joblib import dump
import matplotlib.pyplot as plt

print("="*70)
print("ML Model Training Pipeline v3".center(70))
print("="*70)

CSV_PATH = "data/merged_all_missions.csv"
MODELS_DIR = "models"
OUTPUT_DIR = "output"
TIMESTAMP = datetime.now().strftime("%Y%m%d_%H%M%S")

os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
print(f"\n✓ Created directories:")
print(f"  - Models: {MODELS_DIR}")
print(f"  - Output: {OUTPUT_DIR}")

print(f"\n{'='*70}")
print("STEP 1: Loading Data")
print(f"{'='*70}")
print(f"Loading data from {CSV_PATH}...")
df = pd.read_csv(CSV_PATH).dropna(axis=1, how="all").drop_duplicates()
print(f"✓ Data loaded: {df.shape[0]} rows, {df.shape[1]} columns")

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
print(f"\n✓ Target column: '{target_col}'")
print(f"✓ Task type: {task.upper()}")
print(f"✓ Target classes/values: {y.nunique()}")
if task == "classification":
    print(f"✓ Class distribution:\n{y.value_counts().to_string()}")

print(f"\n{'='*70}")
print("STEP 2: Splitting Data")
print(f"{'='*70}")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, 
    stratify=y if task=="classification" and y.nunique()>1 else None
)

numeric_features = X.select_dtypes(include=[np.number]).columns.tolist()
categorical_features = [c for c in X.columns if c not in numeric_features]
print(f"✓ Features: {len(numeric_features)} numeric, {len(categorical_features)} categorical")
print(f"✓ Training set: {X_train.shape[0]} samples")
print(f"✓ Test set: {X_test.shape[0]} samples")

preprocessor = ColumnTransformer([
    ("num", Pipeline([
        ("imputer", SimpleImputer(strategy="median")), 
        ("scaler", StandardScaler(with_mean=False))
    ]), numeric_features),
    ("cat", Pipeline([
        ("imputer", SimpleImputer(strategy="most_frequent")), 
        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=True))
    ]), categorical_features)
])

print(f"\n{'='*70}")
print("STEP 3: Training Models")
print(f"{'='*70}")

if task == "classification":
    candidates = [
        ("LogisticRegression", LogisticRegression(max_iter=500, random_state=42)),
        ("RandomForest", RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)),
        ("GradientBoosting", GradientBoostingClassifier(n_estimators=100, random_state=42)),
        ("DecisionTree", DecisionTreeClassifier(random_state=42, max_depth=10)),
        ("SVM", SVC(probability=True, kernel="rbf", C=1.0, random_state=42)),
        ("NaiveBayes", GaussianNB()),
        ("KNN", KNeighborsClassifier(n_neighbors=5, n_jobs=-1)),
    ]
else:
    candidates = [
        ("LinearRegression", LinearRegression()),
        ("Ridge", Ridge(alpha=1.0, random_state=42)),
        ("Lasso", Lasso(alpha=1.0, random_state=42)),
        ("RandomForest", RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)),
        ("GradientBoosting", GradientBoostingRegressor(n_estimators=100, random_state=42)),
        ("DecisionTree", DecisionTreeRegressor(random_state=42, max_depth=10)),
        ("SVR", SVR(kernel="rbf", C=1.0)),
        ("KNN", KNeighborsRegressor(n_neighbors=5, n_jobs=-1)),
    ]

print(f"Training {len(candidates)} models...\n")

results = []
trained_models = []
best_name, best_score, best_pipe = None, -1e18, None

for idx, (name, model) in enumerate(candidates, 1):
    print(f"[{idx}/{len(candidates)}] Training {name}...")
    
    try:
        pipe = Pipeline([("pre", preprocessor), ("model", model)])
        pipe.fit(X_train, y_train)
        pred = pipe.predict(X_test)
        
        if task == "classification":
            acc = accuracy_score(y_test, pred)
            f1m = f1_score(y_test, pred, average="macro")
            precision = precision_score(y_test, pred, average="macro", zero_division=0)
            recall = recall_score(y_test, pred, average="macro", zero_division=0)
            score = 0.7*f1m + 0.3*acc  
            
            print(f"  ✓ Accuracy: {acc:.4f} | F1: {f1m:.4f} | Precision: {precision:.4f} | Recall: {recall:.4f}")
            
            results.append({
                "model": name,
                "accuracy": float(acc),
                "f1_macro": float(f1m),
                "precision_macro": float(precision),
                "recall_macro": float(recall),
                "score": float(score)
            })
        else:
            r2 = r2_score(y_test, pred)
            rmse = mean_squared_error(y_test, pred, squared=False)
            mae = mean_absolute_error(y_test, pred)
            score = r2
            
            print(f"  ✓ R²: {r2:.4f} | RMSE: {rmse:.4f} | MAE: {mae:.4f}")
            
            results.append({
                "model": name,
                "r2": float(r2),
                "rmse": float(rmse),
                "mae": float(mae),
                "score": float(score)
            })
        
        
        model_filename = f"{name}_{task}_{TIMESTAMP}.joblib"
        model_path = os.path.join(MODELS_DIR, model_filename)
        dump(pipe, model_path)
        
        trained_models.append({
            "name": name,
            "path": model_path,
            "score": score
        })
        
        
        if score > best_score:
            best_score = score
            best_name = name
            best_pipe = pipe
            
    except Exception as e:
        print(f"  ✗ Failed: {str(e)}")
        continue

print(f"\n{'='*70}")
print("STEP 4: Saving Results")
print(f"{'='*70}")

results_df = pd.DataFrame(results).sort_values("score", ascending=False)
results_csv = os.path.join(OUTPUT_DIR, f"model_results_{TIMESTAMP}.csv")
results_df.to_csv(results_csv, index=False)
print(f"✓ Results saved to: {results_csv}")

print(f"\n{'='*70}")
print("Model Performance Comparison")
print(f"{'='*70}")
print(results_df.to_string(index=False))

if best_pipe is not None:
    best_model_path = os.path.join(MODELS_DIR, f"best_model_{task}_{TIMESTAMP}.joblib")
    dump(best_pipe, best_model_path)
    print(f"\n{'='*70}")
    print(f"✓ BEST MODEL: {best_name}")
    print(f"✓ Score: {best_score:.4f}")
    print(f"✓ Saved to: {best_model_path}")
    print(f"{'='*70}")

print(f"\n{'='*70}")
print("STEP 5: Generating Visualizations")
print(f"{'='*70}")

if task == "classification" and best_pipe is not None:
    
    pred = best_pipe.predict(X_test)
    cm = confusion_matrix(y_test, pred, labels=np.unique(y_test))
    
    fig = plt.figure(figsize=(8, 6))
    plt.imshow(cm, interpolation="nearest", cmap="Blues")
    plt.title(f"Confusion Matrix: {best_name}", fontsize=14, fontweight='bold')
    plt.colorbar()
    
    tick_marks = np.arange(len(np.unique(y_test)))
    unique_labels = [str(label) for label in np.unique(y_test)]
    plt.xticks(tick_marks, unique_labels, rotation=45, ha="right")
    plt.yticks(tick_marks, unique_labels)
    
    
    thresh = cm.max() / 2.
    for i, j in np.ndindex(cm.shape):
        plt.text(j, i, format(cm[i, j], 'd'),
                ha="center", va="center",
                color="white" if cm[i, j] > thresh else "black")
    
    plt.xlabel("Predicted Label", fontsize=12)
    plt.ylabel("True Label", fontsize=12)
    plt.tight_layout()
    
    cm_path = os.path.join(OUTPUT_DIR, f"confusion_matrix_{TIMESTAMP}.png")
    plt.savefig(cm_path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"✓ Confusion matrix saved to: {cm_path}")
    
    
    fig, ax = plt.subplots(figsize=(10, 6))
    models = results_df['model'].tolist()
    scores = results_df['accuracy'].tolist()
    colors = ['green' if m == best_name else 'steelblue' for m in models]
    
    bars = ax.barh(models, scores, color=colors)
    ax.set_xlabel('Accuracy', fontsize=12)
    ax.set_title('Model Comparison - Accuracy', fontsize=14, fontweight='bold')
    ax.set_xlim(0, 1.0)
    
    for i, (bar, score) in enumerate(zip(bars, scores)):
        ax.text(score + 0.01, i, f'{score:.4f}', va='center', fontsize=10)
    
    plt.tight_layout()
    comparison_path = os.path.join(OUTPUT_DIR, f"model_comparison_{TIMESTAMP}.png")
    plt.savefig(comparison_path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"✓ Model comparison chart saved to: {comparison_path}")

else:  
    if best_pipe is not None:
        
        pred = best_pipe.predict(X_test)
        residuals = y_test - pred
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
        
        
        ax1.scatter(pred, residuals, alpha=0.5, edgecolors='k')
        ax1.axhline(0, color='red', linestyle='--', linewidth=2)
        ax1.set_xlabel('Predicted Values', fontsize=12)
        ax1.set_ylabel('Residuals', fontsize=12)
        ax1.set_title(f'Residual Plot: {best_name}', fontsize=14, fontweight='bold')
        ax1.grid(True, alpha=0.3)
        
        
        ax2.scatter(y_test, pred, alpha=0.5, edgecolors='k')
        ax2.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 
                'r--', linewidth=2, label='Perfect Prediction')
        ax2.set_xlabel('Actual Values', fontsize=12)
        ax2.set_ylabel('Predicted Values', fontsize=12)
        ax2.set_title(f'Actual vs Predicted: {best_name}', fontsize=14, fontweight='bold')
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        resid_path = os.path.join(OUTPUT_DIR, f"residuals_plot_{TIMESTAMP}.png")
        plt.savefig(resid_path, dpi=150, bbox_inches="tight")
        plt.close(fig)
        print(f"✓ Residuals plot saved to: {resid_path}")
        
        
        fig, ax = plt.subplots(figsize=(10, 6))
        models = results_df['model'].tolist()
        scores = results_df['r2'].tolist()
        colors = ['green' if m == best_name else 'steelblue' for m in models]
        
        bars = ax.barh(models, scores, color=colors)
        ax.set_xlabel('R² Score', fontsize=12)
        ax.set_title('Model Comparison - R² Score', fontsize=14, fontweight='bold')
        
        for i, (bar, score) in enumerate(zip(bars, scores)):
            ax.text(score + 0.01, i, f'{score:.4f}', va='center', fontsize=10)
        
        plt.tight_layout()
        comparison_path = os.path.join(OUTPUT_DIR, f"model_comparison_{TIMESTAMP}.png")
        plt.savefig(comparison_path, dpi=150, bbox_inches="tight")
        plt.close(fig)
        print(f"✓ Model comparison chart saved to: {comparison_path}")

print(f"\n{'='*70}")
print("STEP 6: Saving Metadata")
print(f"{'='*70}")

metadata = {
    "timestamp": TIMESTAMP,
    "task": task,
    "target_column": target_col,
    "dataset": {
        "total_samples": len(df),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "numeric_features": len(numeric_features),
        "categorical_features": len(categorical_features),
        "target_classes": int(y.nunique())
    },
    "best_model": {
        "name": best_name,
        "score": float(best_score),
        "path": best_model_path if best_pipe else None
    },
    "all_models": trained_models,
    "results_file": results_csv
}

metadata_path = os.path.join(OUTPUT_DIR, f"training_metadata_{TIMESTAMP}.json")
with open(metadata_path, "w") as f:
    json.dump(metadata, f, indent=2)
print(f"✓ Metadata saved to: {metadata_path}")

feature_info = {
    "task": task,
    "target_column": target_col,
    "numeric_features": numeric_features,
    "categorical_features": categorical_features,
    "total_features": len(numeric_features) + len(categorical_features)
}

feature_info_path = os.path.join(OUTPUT_DIR, f"feature_info_{TIMESTAMP}.json")
with open(feature_info_path, "w") as f:
    json.dump(feature_info, f, indent=2)
print(f"✓ Feature info saved to: {feature_info_path}")

print(f"\n{'='*70}")
print("TRAINING COMPLETED SUCCESSFULLY!")
print(f"{'='*70}")
print(f"\n📊 Summary:")
print(f"  • Models trained: {len(trained_models)}")
print(f"  • Best model: {best_name} (score: {best_score:.4f})")
print(f"  • Models saved in: {MODELS_DIR}")
print(f"  • Outputs saved in: {OUTPUT_DIR}")
print(f"\n✓ All files saved with timestamp: {TIMESTAMP}")
print(f"{'='*70}\n")
