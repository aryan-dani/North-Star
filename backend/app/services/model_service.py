"""Service layer for loading models and serving predictions."""

from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd
from joblib import load


ROOT_DIR = Path(__file__).resolve().parents[3]
MODELS_DIR = ROOT_DIR / "models"


class ModelService:
    """Service class for managing ML model operations."""

    def __init__(self, model_path: Optional[str] = None) -> None:
        """Initialise the model service."""
        self.model: Optional[Any] = None
        self.model_path = model_path
        self.model_name = "RandomForest"
        self.is_classification = True
        self.feature_names: Optional[List[str]] = None
        self.numeric_features: Optional[List[str]] = None
        self.categorical_features: Optional[List[str]] = None
        self.target_classes: Optional[List[str]] = None

    def load_model(self, model_path: Optional[str] = None):
        """Load a serialised pipeline from disk."""
        if model_path:
            self.model_path = model_path

        if not self.model_path:
            model_files = list(MODELS_DIR.glob("RandomForest_*.joblib"))
            if not model_files:
                model_files = list(MODELS_DIR.glob("best_model_*.joblib"))

            if not model_files:
                raise FileNotFoundError(
                    "No model file found in models directory. Train a model first."
                )

            self.model_path = str(sorted(model_files)[-1])

        self.model = load(self.model_path)
        self._extract_model_info()
        return self.model

    def _extract_model_info(self) -> None:
        """Capture metadata from the loaded pipeline."""
        if self.model is None:
            raise ValueError("Model not loaded")

        if hasattr(self.model, "named_steps"):
            preprocessor = self.model.named_steps.get("pre")
            if preprocessor:
                self.numeric_features = []
                self.categorical_features = []
                for name, _transformer, features in preprocessor.transformers_:
                    if name == "num":
                        self.numeric_features = list(features)
                    elif name == "cat":
                        self.categorical_features = list(features)
                self.feature_names = (self.numeric_features or []) + (
                    self.categorical_features or []
                )

            estimator = self.model.named_steps.get("model")
            if estimator and hasattr(estimator, "classes_"):
                self.target_classes = list(estimator.classes_)

    def is_loaded(self) -> bool:
        """Return True if a model is loaded."""
        return self.model is not None

    def get_model_info(self) -> Dict[str, Any]:
        """Expose model metadata for the API."""
        if not self.is_loaded():
            raise ValueError("Model not loaded")

        return {
            "model_name": self.model_name,
            "model_type": "classification" if self.is_classification else "regression",
            "model_path": str(self.model_path),
            "n_features": len(self.feature_names) if self.feature_names else "unknown",
            "target_classes": self.target_classes,
            "numeric_features": len(self.numeric_features) if self.numeric_features else 0,
            "categorical_features": len(self.categorical_features)
            if self.categorical_features
            else 0,
        }

    def get_expected_features(self) -> Dict[str, List[str]]:
        """Return the expected feature list."""
        if not self.is_loaded():
            raise ValueError("Model not loaded")

        return {
            "numeric": self.numeric_features or [],
            "categorical": self.categorical_features or [],
            "all": self.feature_names or [],
        }

    def predict(self, data: pd.DataFrame) -> Dict[str, Any]:
        """Perform predictions for the supplied dataframe."""
        if not self.is_loaded():
            raise ValueError("Model not loaded. Call load_model() first.")

        model = self.model
        if model is None:
            raise ValueError("Model not loaded. Call load_model() first.")

        predictions = model.predict(data)
        probabilities = None
        confidence = None
        if hasattr(model, "predict_proba"):
            try:
                proba = model.predict_proba(data)
                probabilities = proba.tolist()
                confidence = np.max(proba, axis=1).tolist()
            except Exception:  # pragma: no cover - best effort
                pass

        metrics = self._calculate_metrics(predictions, probabilities)

        return {
            "predictions": predictions.tolist(),
            "probabilities": probabilities,
            "confidence": confidence,
            "metrics": metrics,
        }

    def predict_batch(self, data: pd.DataFrame) -> Dict[str, Any]:
        """Run batch predictions and return detailed metadata."""
        if not self.is_loaded():
            raise ValueError("Model not loaded. Call load_model() first.")

        model = self.model
        if model is None:
            raise ValueError("Model not loaded. Call load_model() first.")

        predictions = model.predict(data)
        probabilities = None
        if hasattr(model, "predict_proba"):
            try:
                probabilities = model.predict_proba(data)
            except Exception:  # pragma: no cover - best effort
                pass

        predictions_detail = []
        for idx, pred in enumerate(predictions):
            row_result: Dict[str, Any] = {"row_id": idx, "prediction": str(pred)}
            if probabilities is not None:
                probs = probabilities[idx]
                row_result["confidence"] = float(np.max(probs))
                row_result["probabilities"] = {
                    str(cls): float(prob)
                    for cls, prob in zip(self.target_classes or [], probs)
                }
            predictions_detail.append(row_result)

        summary = self._calculate_summary(predictions, probabilities)
        metrics = self._calculate_metrics(predictions, probabilities)

        return {
            "predictions_detail": predictions_detail,
            "summary": summary,
            "metrics": metrics,
        }

    def _calculate_metrics(
        self, predictions: np.ndarray, probabilities: Optional[np.ndarray]
    ) -> Dict[str, Any]:
        metrics: Dict[str, Any] = {"total_predictions": len(predictions)}

        if self.is_classification:
            unique, counts = np.unique(predictions, return_counts=True)
            metrics["class_distribution"] = {
                str(cls): int(count) for cls, count in zip(unique, counts)
            }
            if probabilities is not None:
                avg_confidence = float(np.mean(np.max(probabilities, axis=1)))
                metrics["average_confidence"] = round(avg_confidence, 4)

        return metrics

    def _calculate_summary(
        self, predictions: np.ndarray, probabilities: Optional[np.ndarray]
    ) -> Dict[str, Any]:
        summary: Dict[str, Any] = {"total_samples": len(predictions)}

        if self.is_classification:
            unique, counts = np.unique(predictions, return_counts=True)
            summary["predictions_by_class"] = {
                str(cls): {
                    "count": int(count),
                    "percentage": round(float(count / len(predictions) * 100), 2),
                }
                for cls, count in zip(unique, counts)
            }
            if probabilities is not None:
                confidences = np.max(probabilities, axis=1)
                summary["confidence_stats"] = {
                    "mean": round(float(np.mean(confidences)), 4),
                    "std": round(float(np.std(confidences)), 4),
                    "min": round(float(np.min(confidences)), 4),
                    "max": round(float(np.max(confidences)), 4),
                    "median": round(float(np.median(confidences)), 4),
                }

        return summary

    def get_metrics(self) -> Dict[str, Any]:
        """Return placeholder metrics until a validation set is provided."""
        return {
            "model_name": self.model_name,
            "note": "Training metrics not available. Upload test data to calculate metrics.",
        }
