"""Analytics utilities for model-driven insights and plots."""

from __future__ import annotations

import base64
import io
from typing import Any, Dict, List, Optional, Sequence, Union, cast

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.metrics import auc, classification_report, confusion_matrix, roc_curve
from sklearn.preprocessing import label_binarize

sns.set_style("whitegrid")
matplotlib.use("Agg")
plt.rcParams["figure.facecolor"] = "white"


class AnalyticsService:
    """Service for generating analytics and visualisations."""

    def __init__(self, model_service: Any) -> None:
        self.model_service = model_service

    def generate_confusion_matrix_plot(
        self,
        y_true: np.ndarray,
        y_pred: np.ndarray,
        labels: Optional[Sequence[Union[str, int]]] = None,
    ) -> str:
        effective_labels: List[Union[str, int]]
        if labels is None:
            effective_labels = list(np.unique(y_true))
        else:
            effective_labels = list(labels)

        tick_labels = [str(label) for label in effective_labels]
        cm = confusion_matrix(y_true, y_pred, labels=effective_labels)
        fig, ax = plt.subplots(figsize=(10, 8))
        sns.heatmap(
            cm,
            annot=True,
            fmt="d",
            cmap="Blues",
            xticklabels=tick_labels,
            yticklabels=tick_labels,
            ax=ax,
        )
        ax.set_xlabel("Predicted Label", fontsize=12, fontweight="bold")
        ax.set_ylabel("True Label", fontsize=12, fontweight="bold")
        ax.set_title("Confusion Matrix", fontsize=14, fontweight="bold")
        plt.tight_layout()
        return self._fig_to_base64(fig)

    def generate_class_distribution_plot(
        self, predictions: np.ndarray, labels: Optional[Sequence[Union[str, int]]] = None
    ) -> str:
        unique, counts = np.unique(predictions, return_counts=True)
        tick_labels = [str(label) for label in (labels or unique)]
        fig, ax = plt.subplots(figsize=(10, 6))
        colors = sns.color_palette("husl", len(unique))
        bars = ax.bar(range(len(unique)), counts, color=colors, edgecolor="black", linewidth=1.5)
        ax.set_xlabel("Class", fontsize=12, fontweight="bold")
        ax.set_ylabel("Count", fontsize=12, fontweight="bold")
        ax.set_title("Prediction Class Distribution", fontsize=14, fontweight="bold")
        ax.set_xticks(range(len(unique)))
        ax.set_xticklabels(tick_labels, rotation=45, ha="right")
        ax.grid(axis="y", alpha=0.3)
        for bar, count in zip(bars, counts):
            height = bar.get_height()
            ax.text(
                bar.get_x() + bar.get_width() / 2.0,
                height,
                f"{int(count)}",
                ha="center",
                va="bottom",
                fontweight="bold",
            )
        plt.tight_layout()
        return self._fig_to_base64(fig)

    def generate_confidence_distribution_plot(self, probabilities: np.ndarray) -> str:
        prob_array = cast(np.ndarray, self._ensure_array(probabilities))
        confidences = np.max(prob_array, axis=1)
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
        ax1.hist(confidences, bins=30, color="steelblue", edgecolor="black", alpha=0.7)
        ax1.axvline(
            np.mean(confidences),
            color="red",
            linestyle="--",
            linewidth=2,
            label=f"Mean: {np.mean(confidences):.3f}",
        )
        ax1.axvline(
            np.median(confidences),
            color="green",
            linestyle="--",
            linewidth=2,
            label=f"Median: {np.median(confidences):.3f}",
        )
        ax1.set_xlabel("Confidence Score", fontsize=12, fontweight="bold")
        ax1.set_ylabel("Frequency", fontsize=12, fontweight="bold")
        ax1.set_title("Confidence Score Distribution", fontsize=14, fontweight="bold")
        ax1.legend()
        ax1.grid(axis="y", alpha=0.3)

        ax2.boxplot(
            confidences,
            vert=True,
            patch_artist=True,
            boxprops=dict(facecolor="lightblue", color="black"),
            whiskerprops=dict(color="black"),
            capprops=dict(color="black"),
            medianprops=dict(color="red", linewidth=2),
        )
        ax2.set_ylabel("Confidence Score", fontsize=12, fontweight="bold")
        ax2.set_title("Confidence Score Box Plot", fontsize=14, fontweight="bold")
        ax2.set_xticklabels(["All Predictions"])
        ax2.grid(axis="y", alpha=0.3)
        plt.tight_layout()
        return self._fig_to_base64(fig)

    def generate_probability_heatmap(
        self, probabilities: np.ndarray, labels: Sequence[str], sample_size: int = 50
    ) -> str:
        prob_array = cast(np.ndarray, self._ensure_array(probabilities))
        if len(prob_array) > sample_size:
            indices = np.random.choice(len(prob_array), sample_size, replace=False)
            prob_sample = prob_array[indices]
        else:
            prob_sample = prob_array

        fig, ax = plt.subplots(figsize=(12, 8))
        sns.heatmap(
            prob_sample,
            annot=False,
            cmap="YlOrRd",
            xticklabels=labels,
            ax=ax,
            cbar_kws={"label": "Probability"},
        )
        ax.set_xlabel("Class", fontsize=12, fontweight="bold")
        ax.set_ylabel("Sample Index", fontsize=12, fontweight="bold")
        ax.set_title(
            f"Prediction Probabilities Heatmap (Sample Size: {len(prob_sample)})",
            fontsize=14,
            fontweight="bold",
        )
        plt.tight_layout()
        return self._fig_to_base64(fig)

    def generate_roc_curves(
        self, y_true: np.ndarray, probabilities: np.ndarray, labels: Sequence[str]
    ) -> str:
        prob_array = cast(np.ndarray, self._ensure_array(probabilities))
        y_true_bin = self._ensure_array(label_binarize(y_true, classes=list(labels)))
        fig, ax = plt.subplots(figsize=(10, 8))
        colors = sns.color_palette("husl", len(labels))
        for i, (color, label) in enumerate(zip(colors, labels)):
            fpr, tpr, _ = roc_curve(y_true_bin[:, i], prob_array[:, i])
            roc_auc = auc(fpr, tpr)
            ax.plot(fpr, tpr, color=color, lw=2, label=f"{label} (AUC = {roc_auc:.3f})")
        ax.plot([0, 1], [0, 1], "k--", lw=2, label="Random Classifier")
        ax.set_xlabel("False Positive Rate", fontsize=12, fontweight="bold")
        ax.set_ylabel("True Positive Rate", fontsize=12, fontweight="bold")
        ax.set_title("ROC Curves - Multi-Class Classification", fontsize=14, fontweight="bold")
        ax.legend(loc="lower right")
        ax.grid(alpha=0.3)
        plt.tight_layout()
        return self._fig_to_base64(fig)

    def generate_feature_importance_plot(self, top_n: int = 20) -> Optional[str]:
        try:
            model = getattr(self.model_service, "model", None)
            if model is None or not hasattr(model, "named_steps"):
                return None
            estimator = model.named_steps.get("model")
            if estimator is None or not hasattr(estimator, "feature_importances_"):
                return None

            importances = estimator.feature_importances_
            feature_names = getattr(self.model_service, "feature_names", None)
            if not feature_names or len(feature_names) != len(importances):
                return None

            indices = np.argsort(importances)[::-1][:top_n]
            top_importances = importances[indices]
            top_features = [feature_names[i] for i in indices]

            fig, ax = plt.subplots(figsize=(10, 8))
            colors = sns.color_palette("viridis", len(top_features))
            bars = ax.barh(range(len(top_features)), top_importances, color=colors)
            ax.set_yticks(range(len(top_features)))
            ax.set_yticklabels(top_features)
            ax.set_xlabel("Importance", fontsize=12, fontweight="bold")
            ax.set_title(f"Top {top_n} Feature Importances", fontsize=14, fontweight="bold")
            ax.invert_yaxis()
            ax.grid(axis="x", alpha=0.3)
            for i, (bar, imp) in enumerate(zip(bars, top_importances)):
                width = bar.get_width()
                ax.text(width, i, f" {imp:.4f}", va="center", fontweight="bold")
            plt.tight_layout()
            return self._fig_to_base64(fig)
        except Exception as exc:  # pragma: no cover - defensive
            print(f"Error generating feature importance: {exc}")
        return None

    def generate_class_probability_comparison(
        self, probabilities: np.ndarray, labels: Sequence[str]
    ) -> str:
        prob_array = self._ensure_array(probabilities)
        fig, ax = plt.subplots(figsize=(12, 6))
        data_for_plot: List[float] = []
        class_labels: List[str] = []
        for i, label in enumerate(labels):
            probs = prob_array[:, i]
            data_for_plot.extend(probs)
            class_labels.extend([label] * len(probs))

        df_plot = pd.DataFrame({"Probability": data_for_plot, "Class": class_labels})
        sns.violinplot(data=df_plot, x="Class", y="Probability", ax=ax, palette="Set2")
        ax.set_xlabel("Class", fontsize=12, fontweight="bold")
        ax.set_ylabel("Probability", fontsize=12, fontweight="bold")
        ax.set_title("Probability Distribution by Class", fontsize=14, fontweight="bold")
        ax.grid(axis="y", alpha=0.3)
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        return self._fig_to_base64(fig)

    def calculate_statistics(
        self,
        predictions: np.ndarray,
        probabilities: Optional[np.ndarray] = None,
        y_true: Optional[Union[pd.Series, np.ndarray]] = None,
    ) -> Dict[str, Any]:
        prob_array: Optional[np.ndarray] = None
        if probabilities is not None:
            prob_array = self._ensure_array(probabilities)

        stats: Dict[str, Any] = {
            "total_predictions": len(predictions),
            "unique_classes": len(np.unique(predictions)),
        }
        unique, counts = np.unique(predictions, return_counts=True)
        stats["class_distribution"] = {
            str(cls): {
                "count": int(count),
                "percentage": round(float(count / len(predictions) * 100), 2),
            }
            for cls, count in zip(unique, counts)
        }

        if prob_array is not None:
            confidences = np.max(prob_array, axis=1)
            stats["confidence_statistics"] = {
                "mean": round(float(np.mean(confidences)), 4),
                "std": round(float(np.std(confidences)), 4),
                "min": round(float(np.min(confidences)), 4),
                "max": round(float(np.max(confidences)), 4),
                "median": round(float(np.median(confidences)), 4),
                "q1": round(float(np.percentile(confidences, 25)), 4),
                "q3": round(float(np.percentile(confidences, 75)), 4),
            }
            high_conf = np.sum(confidences >= 0.8)
            medium_conf = np.sum((confidences >= 0.6) & (confidences < 0.8))
            low_conf = np.sum(confidences < 0.6)
            stats["confidence_ranges"] = {
                "high (>= 0.8)": {
                    "count": int(high_conf),
                    "percentage": round(float(high_conf / len(confidences) * 100), 2),
                },
                "medium (0.6-0.8)": {
                    "count": int(medium_conf),
                    "percentage": round(float(medium_conf / len(confidences) * 100), 2),
                },
                "low (< 0.6)": {
                    "count": int(low_conf),
                    "percentage": round(float(low_conf / len(confidences) * 100), 2),
                },
            }

        if y_true is not None:
            y_true_array = np.asarray(y_true)
            from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score

            stats["performance_metrics"] = {
                "accuracy": round(float(accuracy_score(y_true_array, predictions)), 4),
                "precision_macro": round(
                    float(
                        precision_score(
                            y_true_array, predictions, average="macro", zero_division=0
                        )
                    ),
                    4,
                ),
                "recall_macro": round(
                    float(
                        recall_score(
                            y_true_array, predictions, average="macro", zero_division=0
                        )
                    ),
                    4,
                ),
                "f1_macro": round(
                    float(f1_score(y_true_array, predictions, average="macro", zero_division=0)),
                    4,
                ),
            }

            report_dict = cast(
                Dict[str, Any],
                classification_report(
                    y_true_array, predictions, output_dict=True, zero_division=0
                ),
            )
            stats["per_class_metrics"] = {
                cls: {
                    "precision": round(metrics["precision"], 4),
                    "recall": round(metrics["recall"], 4),
                    "f1-score": round(metrics["f1-score"], 4),
                    "support": int(metrics["support"]),
                }
                for cls, metrics in report_dict.items()
                if cls not in {"accuracy", "macro avg", "weighted avg"}
            }

        return stats

    def generate_complete_analytics(
        self, data: pd.DataFrame, y_true: Optional[pd.Series] = None
    ) -> Dict[str, Any]:
        model = getattr(self.model_service, "model", None)
        if model is None:
            raise ValueError("Model not loaded. Call load_model() first.")

        predictions = model.predict(data)
        probabilities: Optional[np.ndarray] = None
        if hasattr(model, "predict_proba"):
            try:
                probabilities = model.predict_proba(data)
            except Exception:  # pragma: no cover - best effort
                probabilities = None

        labels: List[str]
        target_classes = getattr(self.model_service, "target_classes", None)
        if target_classes:
            labels = [str(label) for label in target_classes]
        else:
            labels = [str(label) for label in np.unique(predictions)]

        statistics = self.calculate_statistics(predictions, probabilities, y_true)

        plots: Dict[str, str] = {}
        plots["class_distribution"] = self.generate_class_distribution_plot(
            predictions, labels
        )
        if y_true is not None:
            true_values = y_true.to_numpy()
            plots["confusion_matrix"] = self.generate_confusion_matrix_plot(
                true_values, predictions, labels
            )
            if probabilities is not None:
                plots["roc_curves"] = self.generate_roc_curves(
                    true_values, probabilities, labels
                )
        if probabilities is not None:
            plots["confidence_distribution"] = self.generate_confidence_distribution_plot(
                probabilities
            )
            plots["probability_heatmap"] = self.generate_probability_heatmap(
                probabilities, labels
            )
            plots["class_probability_comparison"] = self.generate_class_probability_comparison(
                probabilities, labels
            )

        feature_importance = self.generate_feature_importance_plot()
        if feature_importance:
            plots["feature_importance"] = feature_importance

        return {
            "statistics": statistics,
            "plots": plots,
            "summary": {
                "total_samples": len(data),
                "predictions_generated": len(predictions),
                "plots_generated": len(plots),
                "has_ground_truth": y_true is not None,
                "model_name": getattr(self.model_service, "model_name", "unknown"),
            },
        }

    def _ensure_array(self, data: Any) -> np.ndarray:
        if isinstance(data, np.ndarray):
            return data
        if hasattr(data, "toarray"):
            return np.asarray(data.toarray())
        return np.asarray(data)

    def _fig_to_base64(self, fig) -> str:
        buf = io.BytesIO()
        fig.savefig(buf, format="png", dpi=100, bbox_inches="tight")
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode("utf-8")
        plt.close(fig)
        buf.close()
        return img_base64
