"""Training service for model retraining and hyperparameter tuning."""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
from joblib import dump
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import (
    GradientBoostingClassifier,
    RandomForestClassifier,
)
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

logger = logging.getLogger(__name__)

# Paths
PROJECT_ROOT = Path(__file__).resolve().parents[3]
MODELS_DIR = PROJECT_ROOT / "models"
OUTPUT_DIR = PROJECT_ROOT / "output"
DATA_DIR = PROJECT_ROOT / "data"

MODELS_DIR.mkdir(parents=True, exist_ok=True)
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


class TrainingService:
    """Service for training and hyperparameter tuning of ML models."""

    def __init__(self):
        """Initialize the training service."""
        self.current_training = None
        self.training_history: List[Dict[str, Any]] = []

    def get_model_hyperparameters(self, model_name: str) -> Dict[str, Any]:
        """Get available hyperparameters for a specific model."""
        hyperparameters = {
            "RandomForest": {
                "n_estimators": {
                    "type": "int",
                    "default": 100,
                    "min": 10,
                    "max": 500,
                    "description": "Number of trees in the forest",
                },
                "max_depth": {
                    "type": "int",
                    "default": None,
                    "min": 1,
                    "max": 50,
                    "description": "Maximum depth of trees (None = unlimited)",
                },
                "min_samples_split": {
                    "type": "int",
                    "default": 2,
                    "min": 2,
                    "max": 20,
                    "description": "Minimum samples required to split a node",
                },
                "min_samples_leaf": {
                    "type": "int",
                    "default": 1,
                    "min": 1,
                    "max": 20,
                    "description": "Minimum samples required at leaf node",
                },
                "max_features": {
                    "type": "select",
                    "default": "sqrt",
                    "options": ["sqrt", "log2", None],
                    "description": "Number of features to consider for best split",
                },
            },
            "GradientBoosting": {
                "n_estimators": {
                    "type": "int",
                    "default": 100,
                    "min": 10,
                    "max": 500,
                    "description": "Number of boosting stages",
                },
                "learning_rate": {
                    "type": "float",
                    "default": 0.1,
                    "min": 0.001,
                    "max": 1.0,
                    "description": "Learning rate shrinks contribution of each tree",
                },
                "max_depth": {
                    "type": "int",
                    "default": 3,
                    "min": 1,
                    "max": 20,
                    "description": "Maximum depth of individual trees",
                },
                "subsample": {
                    "type": "float",
                    "default": 1.0,
                    "min": 0.1,
                    "max": 1.0,
                    "description": "Fraction of samples used for fitting trees",
                },
            },
            "SVM": {
                "C": {
                    "type": "float",
                    "default": 1.0,
                    "min": 0.001,
                    "max": 100.0,
                    "description": "Regularization parameter",
                },
                "kernel": {
                    "type": "select",
                    "default": "rbf",
                    "options": ["linear", "poly", "rbf", "sigmoid"],
                    "description": "Kernel type",
                },
                "gamma": {
                    "type": "select",
                    "default": "scale",
                    "options": ["scale", "auto"],
                    "description": "Kernel coefficient",
                },
            },
            "DecisionTree": {
                "max_depth": {
                    "type": "int",
                    "default": None,
                    "min": 1,
                    "max": 50,
                    "description": "Maximum depth of the tree",
                },
                "min_samples_split": {
                    "type": "int",
                    "default": 2,
                    "min": 2,
                    "max": 20,
                    "description": "Minimum samples required to split a node",
                },
                "criterion": {
                    "type": "select",
                    "default": "gini",
                    "options": ["gini", "entropy"],
                    "description": "Function to measure split quality",
                },
            },
            "LogisticRegression": {
                "C": {
                    "type": "float",
                    "default": 1.0,
                    "min": 0.001,
                    "max": 100.0,
                    "description": "Inverse of regularization strength",
                },
                "max_iter": {
                    "type": "int",
                    "default": 500,
                    "min": 100,
                    "max": 2000,
                    "description": "Maximum number of iterations",
                },
                "solver": {
                    "type": "select",
                    "default": "lbfgs",
                    "options": ["lbfgs", "liblinear", "saga"],
                    "description": "Optimization algorithm",
                },
            },
            "KNN": {
                "n_neighbors": {
                    "type": "int",
                    "default": 5,
                    "min": 1,
                    "max": 50,
                    "description": "Number of neighbors to consider",
                },
                "weights": {
                    "type": "select",
                    "default": "uniform",
                    "options": ["uniform", "distance"],
                    "description": "Weight function",
                },
                "algorithm": {
                    "type": "select",
                    "default": "auto",
                    "options": ["auto", "ball_tree", "kd_tree", "brute"],
                    "description": "Algorithm used to compute neighbors",
                },
            },
        }

        return hyperparameters.get(model_name, {})

    def create_model(self, model_name: str, hyperparameters: Dict[str, Any]):
        """Create a model instance with specified hyperparameters."""
        # Clean hyperparameters (remove None values for max_depth etc.)
        clean_params = {
            k: v for k, v in hyperparameters.items() if v is not None and v != "None"
        }

        model_map = {
            "RandomForest": RandomForestClassifier,
            "GradientBoosting": GradientBoostingClassifier,
            "SVM": SVC,
            "DecisionTree": DecisionTreeClassifier,
            "LogisticRegression": LogisticRegression,
            "KNN": KNeighborsClassifier,
            "NaiveBayes": GaussianNB,
        }

        model_class = model_map.get(model_name)
        if not model_class:
            raise ValueError(f"Unknown model: {model_name}")

        # Add required defaults
        if model_name == "SVM":
            clean_params.setdefault("probability", True)
            clean_params.setdefault("random_state", 42)
        elif model_name in ["RandomForest", "GradientBoosting", "DecisionTree", "LogisticRegression"]:
            clean_params.setdefault("random_state", 42)
        elif model_name == "KNN":
            clean_params.setdefault("n_jobs", -1)

        try:
            return model_class(**clean_params)
        except Exception as e:
            logger.error(f"Error creating model {model_name}: {e}")
            raise

    async def train_model(
        self,
        data: pd.DataFrame,
        target_column: str,
        model_name: str,
        hyperparameters: Dict[str, Any],
        test_size: float = 0.2,
        progress_callback=None,
        session_id: str | None = None,
    ) -> Dict[str, Any]:
        """Train a model with specified hyperparameters."""
        training_id = datetime.now().strftime("%Y%m%d_%H%M%S")
        timestamp = datetime.now().isoformat()

        # Helper function to send progress
        async def send_progress(progress: int, stage: str, message: str, metrics: Dict[str, Any] | None = None):
            progress_data = {"progress": progress, "stage": stage, "message": message}
            if progress_callback:
                await progress_callback(progress_data)
            if session_id:
                from .websocket_manager import manager as ws_manager
                await ws_manager.send_training_progress(session_id, progress, stage, message, metrics)
                await asyncio.sleep(0.3)  # Allow UI to update

        try:
            # Progress: 10%
            await send_progress(10, "preprocessing", "Preparing data...")

            # Prepare data
            y = data[target_column]
            X = data.drop(columns=[target_column])

            # Remove rows with missing target
            mask = ~y.isna()
            X = X.loc[mask].reset_index(drop=True)
            y = y.loc[mask].reset_index(drop=True)

            # Progress: 20%
            await send_progress(20, "preprocessing", "Splitting data...")

            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=42, stratify=y
            )

            # Identify feature types
            numeric_features = X.select_dtypes(include=[np.number]).columns.tolist()
            categorical_features = [
                c for c in X.columns if c not in numeric_features
            ]

            # Progress: 30%
            await send_progress(30, "preprocessing", "Creating preprocessing pipeline...")

            # Create preprocessor
            preprocessor = ColumnTransformer(
                [
                    (
                        "num",
                        Pipeline(
                            [
                                ("imputer", SimpleImputer(strategy="median")),
                                ("scaler", StandardScaler(with_mean=False)),
                            ]
                        ),
                        numeric_features,
                    ),
                    (
                        "cat",
                        Pipeline(
                            [
                                ("imputer", SimpleImputer(strategy="most_frequent")),
                                (
                                    "onehot",
                                    OneHotEncoder(
                                        handle_unknown="ignore", sparse_output=True
                                    ),
                                ),
                            ]
                        ),
                        categorical_features,
                    ),
                ]
            )

            # Progress: 40%
            await send_progress(40, "training", f"Creating {model_name} model...")

            # Create model
            model = self.create_model(model_name, hyperparameters)

            # Progress: 50%
            await send_progress(50, "training", "Training model... This may take a few minutes.")

            # Train model
            pipeline = Pipeline([("pre", preprocessor), ("model", model)])
            await send_progress(60, "training", "Fitting model to training data...")
            pipeline.fit(X_train, y_train)
            await send_progress(70, "training", "Model training complete!")

            # Progress: 80%
            await send_progress(80, "evaluation", "Evaluating model performance...")

            # Evaluate
            y_pred = pipeline.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            f1 = f1_score(y_test, y_pred, average="macro")
            precision = precision_score(y_test, y_pred, average="macro", zero_division=0)
            recall = recall_score(y_test, y_pred, average="macro", zero_division=0)

            # Get classification report
            report = classification_report(y_test, y_pred, output_dict=True)

            # Progress: 90%
            metrics = {
                "accuracy": round(float(accuracy), 4),
                "f1_score": round(float(f1), 4),
                "precision": round(float(precision), 4),
                "recall": round(float(recall), 4),
            }
            await send_progress(90, "saving", f"Saving model (Accuracy: {metrics['accuracy']:.2%})...", metrics)

            # Save model
            model_filename = f"{model_name}_classification_{training_id}.joblib"
            model_path = MODELS_DIR / model_filename
            dump(pipeline, model_path)

            # Save metadata
            metadata = {
                "training_id": training_id,
                "timestamp": timestamp,
                "model_name": model_name,
                "model_path": str(model_path),
                "hyperparameters": hyperparameters,
                "metrics": {
                    "accuracy": float(accuracy),
                    "f1_macro": float(f1),
                    "precision_macro": float(precision),
                    "recall_macro": float(recall),
                },
                "classification_report": report,
                "data_info": {
                    "n_samples": len(X),
                    "n_train": len(X_train),
                    "n_test": len(X_test),
                    "n_features": len(X.columns),
                    "numeric_features": len(numeric_features),
                    "categorical_features": len(categorical_features),
                    "target_column": target_column,
                    "classes": list(y.unique()),
                },
            }

            # Save metadata file
            metadata_path = OUTPUT_DIR / f"training_metadata_{training_id}.json"
            with open(metadata_path, "w") as f:
                json.dump(metadata, f, indent=2)

            # Progress: 100%
            await send_progress(100, "complete", "Training complete!", metrics)

            # Add to history
            self.training_history.append(metadata)

            return {
                "status": "success",
                "training_id": training_id,
                "model_path": str(model_path),
                "metrics": metadata["metrics"],
                "metadata": metadata,
            }

        except Exception as e:
            logger.error(f"Training error: {e}", exc_info=True)
            await send_progress(0, "error", f"Training failed: {str(e)}")
            raise

    def get_training_history(self) -> List[Dict[str, Any]]:
        """Get history of training sessions."""
        return self.training_history

    def validate_data(self, data: pd.DataFrame, target_column: str) -> Dict[str, Any]:
        """Validate uploaded training data."""
        issues = []
        warnings = []

        # Check if target column exists
        if target_column not in data.columns:
            issues.append(f"Target column '{target_column}' not found in data")

        # Check for missing values
        missing_pct = data.isnull().sum() / len(data) * 100
        high_missing = missing_pct[missing_pct > 50].to_dict()
        if high_missing:
            warnings.append(
                f"Columns with >50% missing values: {list(high_missing.keys())}"
            )

        # Check data size
        if len(data) < 100:
            warnings.append(f"Small dataset ({len(data)} rows). More data recommended.")

        # Check class balance (if classification)
        if target_column in data.columns:
            target = data[target_column]
            if target.dtype == "object" or target.nunique() < 20:
                value_counts = target.value_counts()
                min_class_pct = (value_counts.min() / len(data)) * 100
                if min_class_pct < 5:
                    warnings.append(
                        f"Imbalanced classes. Smallest class: {min_class_pct:.1f}%"
                    )

        return {
            "valid": len(issues) == 0,
            "issues": issues,
            "warnings": warnings,
            "n_samples": len(data),
            "n_features": len(data.columns) - 1,
            "target_column": target_column,
        }
