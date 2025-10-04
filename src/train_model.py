"""Train a Random Forest classifier to identify exoplanet candidates.

This module loads the cleaned NASA Kepler cumulative catalog, performs a
train/test split, fits a RandomForestClassifier, reports evaluation metrics,
and persists the fitted estimator to disk.
"""

from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

# Project paths
PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = PROJECT_ROOT / "data" / "raw" / "cumulative.csv"
MODEL_DIR = PROJECT_ROOT / "models"
MODEL_PATH = MODEL_DIR / "exoplanet_model.joblib"


def load_data(csv_path: Path) -> pd.DataFrame:
    """Read the cumulative Kepler dataset from ``csv_path``."""
    if not csv_path.exists():
        raise FileNotFoundError(
            f"Dataset not found at {csv_path}. Download it into data/raw before running."
        )
    return pd.read_csv(csv_path)


def preprocess(df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series]:
    """Drop unused columns, remove missing rows, and split features/labels."""
    columns_to_drop = [
        "rowid",
        "kepid",
        "kepoi_name",
        "kepler_name",
        "koi_pdisposition",
        "koi_score",
        "koi_tce_delivname",
        "koi_teq_err1",
        "koi_teq_err2",
    ]
    cleaned = df.drop(columns=columns_to_drop, errors="ignore")
    cleaned = cleaned.dropna()

    y = cleaned["koi_disposition"]
    X = cleaned.drop(columns=["koi_disposition"])
    return X, y


def train_model(X: pd.DataFrame, y: pd.Series) -> RandomForestClassifier:
    """Fit a RandomForestClassifier on the provided features and labels."""
    model = RandomForestClassifier(random_state=42)
    model.fit(X, y)
    return model


def main() -> None:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    df = load_data(DATA_PATH)
    X, y = preprocess(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print("Training the Random Forest model...")
    model = train_model(X_train, y_train)
    print("Model training complete!")

    print("\n--- Evaluating Model Performance ---")
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f"Overall Accuracy: {accuracy:.4f}")

    report = classification_report(y_test, predictions)
    print("\n--- Classification Report ---")
    print(report)

    joblib.dump(model, MODEL_PATH)
    print(f"\nModel saved to '{MODEL_PATH.relative_to(PROJECT_ROOT)}'")


if __name__ == "__main__":
    main()
