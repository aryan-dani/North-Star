"""
Analytics Module
Generates graphs, statistics, and analytical insights for the ML model
"""
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report, roc_curve, auc
from sklearn.preprocessing import label_binarize
import io
import base64
import json
from typing import Dict, List, Any, Optional, Tuple
from pathlib import Path

# Set style
sns.set_style("whitegrid")
plt.rcParams['figure.facecolor'] = 'white'

class AnalyticsService:
    """Service for generating analytics and visualizations"""
    
    def __init__(self, model_service):
        """
        Initialize AnalyticsService
        
        Args:
            model_service: ModelService instance with loaded model
        """
        self.model_service = model_service
        
    def generate_confusion_matrix_plot(
        self, 
        y_true: np.ndarray, 
        y_pred: np.ndarray,
        labels: Optional[List[str]] = None
    ) -> str:
        """Generate confusion matrix plot as base64 string"""
        if labels is None:
            labels = np.unique(y_true)
        
        cm = confusion_matrix(y_true, y_pred, labels=labels)
        
        fig, ax = plt.subplots(figsize=(10, 8))
        sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                   xticklabels=labels, yticklabels=labels, ax=ax)
        ax.set_xlabel('Predicted Label', fontsize=12, fontweight='bold')
        ax.set_ylabel('True Label', fontsize=12, fontweight='bold')
        ax.set_title('Confusion Matrix', fontsize=14, fontweight='bold')
        plt.tight_layout()
        
        return self._fig_to_base64(fig)
    
    def generate_class_distribution_plot(
        self,
        predictions: np.ndarray,
        labels: Optional[List[str]] = None
    ) -> str:
        """Generate class distribution bar plot"""
        unique, counts = np.unique(predictions, return_counts=True)
        
        fig, ax = plt.subplots(figsize=(10, 6))
        colors = sns.color_palette("husl", len(unique))
        bars = ax.bar(range(len(unique)), counts, color=colors, edgecolor='black', linewidth=1.5)
        
        ax.set_xlabel('Class', fontsize=12, fontweight='bold')
        ax.set_ylabel('Count', fontsize=12, fontweight='bold')
        ax.set_title('Prediction Class Distribution', fontsize=14, fontweight='bold')
        ax.set_xticks(range(len(unique)))
        ax.set_xticklabels(unique, rotation=45, ha='right')
        ax.grid(axis='y', alpha=0.3)
        
        # Add count labels on bars
        for bar, count in zip(bars, counts):
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height,
                   f'{int(count)}',
                   ha='center', va='bottom', fontweight='bold')
        
        plt.tight_layout()
        return self._fig_to_base64(fig)
    
    def generate_confidence_distribution_plot(
        self,
        probabilities: np.ndarray
    ) -> str:
        """Generate confidence score distribution histogram"""
        confidences = np.max(probabilities, axis=1)
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
        
        # Histogram
        ax1.hist(confidences, bins=30, color='steelblue', edgecolor='black', alpha=0.7)
        ax1.axvline(np.mean(confidences), color='red', linestyle='--', 
                   linewidth=2, label=f'Mean: {np.mean(confidences):.3f}')
        ax1.axvline(np.median(confidences), color='green', linestyle='--', 
                   linewidth=2, label=f'Median: {np.median(confidences):.3f}')
        ax1.set_xlabel('Confidence Score', fontsize=12, fontweight='bold')
        ax1.set_ylabel('Frequency', fontsize=12, fontweight='bold')
        ax1.set_title('Confidence Score Distribution', fontsize=14, fontweight='bold')
        ax1.legend()
        ax1.grid(axis='y', alpha=0.3)
        
        # Box plot
        ax2.boxplot(confidences, vert=True, patch_artist=True,
                   boxprops=dict(facecolor='lightblue', color='black'),
                   whiskerprops=dict(color='black'),
                   capprops=dict(color='black'),
                   medianprops=dict(color='red', linewidth=2))
        ax2.set_ylabel('Confidence Score', fontsize=12, fontweight='bold')
        ax2.set_title('Confidence Score Box Plot', fontsize=14, fontweight='bold')
        ax2.set_xticklabels(['All Predictions'])
        ax2.grid(axis='y', alpha=0.3)
        
        plt.tight_layout()
        return self._fig_to_base64(fig)
    
    def generate_probability_heatmap(
        self,
        probabilities: np.ndarray,
        labels: List[str],
        sample_size: int = 50
    ) -> str:
        """Generate heatmap of prediction probabilities for sample"""
        # Sample data if too large
        if len(probabilities) > sample_size:
            indices = np.random.choice(len(probabilities), sample_size, replace=False)
            prob_sample = probabilities[indices]
        else:
            prob_sample = probabilities
        
        fig, ax = plt.subplots(figsize=(12, 8))
        sns.heatmap(prob_sample, annot=False, cmap='YlOrRd', 
                   xticklabels=labels, ax=ax, cbar_kws={'label': 'Probability'})
        ax.set_xlabel('Class', fontsize=12, fontweight='bold')
        ax.set_ylabel('Sample Index', fontsize=12, fontweight='bold')
        ax.set_title(f'Prediction Probabilities Heatmap (Sample Size: {len(prob_sample)})', 
                    fontsize=14, fontweight='bold')
        plt.tight_layout()
        
        return self._fig_to_base64(fig)
    
    def generate_roc_curves(
        self,
        y_true: np.ndarray,
        probabilities: np.ndarray,
        labels: List[str]
    ) -> str:
        """Generate ROC curves for multi-class classification"""
        # Binarize labels
        y_true_bin = label_binarize(y_true, classes=labels)
        n_classes = len(labels)
        
        fig, ax = plt.subplots(figsize=(10, 8))
        colors = sns.color_palette("husl", n_classes)
        
        # Plot ROC curve for each class
        for i, (color, label) in enumerate(zip(colors, labels)):
            fpr, tpr, _ = roc_curve(y_true_bin[:, i], probabilities[:, i])
            roc_auc = auc(fpr, tpr)
            ax.plot(fpr, tpr, color=color, lw=2,
                   label=f'{label} (AUC = {roc_auc:.3f})')
        
        # Plot diagonal
        ax.plot([0, 1], [0, 1], 'k--', lw=2, label='Random Classifier')
        
        ax.set_xlabel('False Positive Rate', fontsize=12, fontweight='bold')
        ax.set_ylabel('True Positive Rate', fontsize=12, fontweight='bold')
        ax.set_title('ROC Curves - Multi-Class Classification', fontsize=14, fontweight='bold')
        ax.legend(loc='lower right')
        ax.grid(alpha=0.3)
        
        plt.tight_layout()
        return self._fig_to_base64(fig)
    
    def generate_feature_importance_plot(
        self,
        top_n: int = 20
    ) -> Optional[str]:
        """Generate feature importance plot (if model supports it)"""
        try:
            model = self.model_service.model.named_steps['model']
            
            if hasattr(model, 'feature_importances_'):
                importances = model.feature_importances_
                feature_names = self.model_service.feature_names
                
                if feature_names and len(feature_names) == len(importances):
                    # Get top N features
                    indices = np.argsort(importances)[::-1][:top_n]
                    top_importances = importances[indices]
                    top_features = [feature_names[i] for i in indices]
                    
                    fig, ax = plt.subplots(figsize=(10, 8))
                    colors = sns.color_palette("viridis", len(top_features))
                    bars = ax.barh(range(len(top_features)), top_importances, color=colors)
                    ax.set_yticks(range(len(top_features)))
                    ax.set_yticklabels(top_features)
                    ax.set_xlabel('Importance', fontsize=12, fontweight='bold')
                    ax.set_title(f'Top {top_n} Feature Importances', fontsize=14, fontweight='bold')
                    ax.invert_yaxis()
                    ax.grid(axis='x', alpha=0.3)
                    
                    # Add value labels
                    for i, (bar, imp) in enumerate(zip(bars, top_importances)):
                        width = bar.get_width()
                        ax.text(width, i, f' {imp:.4f}', 
                               va='center', fontweight='bold')
                    
                    plt.tight_layout()
                    return self._fig_to_base64(fig)
            
            return None
        except Exception as e:
            print(f"Error generating feature importance: {e}")
            return None
    
    def generate_class_probability_comparison(
        self,
        probabilities: np.ndarray,
        labels: List[str]
    ) -> str:
        """Generate violin plot comparing probability distributions per class"""
        fig, ax = plt.subplots(figsize=(12, 6))
        
        # Prepare data for violin plot
        data_for_plot = []
        class_labels = []
        
        for i, label in enumerate(labels):
            probs = probabilities[:, i]
            data_for_plot.extend(probs)
            class_labels.extend([label] * len(probs))
        
        df_plot = pd.DataFrame({'Probability': data_for_plot, 'Class': class_labels})
        
        sns.violinplot(data=df_plot, x='Class', y='Probability', ax=ax, palette='Set2')
        ax.set_xlabel('Class', fontsize=12, fontweight='bold')
        ax.set_ylabel('Probability', fontsize=12, fontweight='bold')
        ax.set_title('Probability Distribution by Class', fontsize=14, fontweight='bold')
        ax.grid(axis='y', alpha=0.3)
        plt.xticks(rotation=45, ha='right')
        
        plt.tight_layout()
        return self._fig_to_base64(fig)
    
    def calculate_statistics(
        self,
        predictions: np.ndarray,
        probabilities: Optional[np.ndarray] = None,
        y_true: Optional[np.ndarray] = None
    ) -> Dict[str, Any]:
        """Calculate comprehensive statistics"""
        stats = {
            "total_predictions": len(predictions),
            "unique_classes": len(np.unique(predictions))
        }
        
        # Class distribution
        unique, counts = np.unique(predictions, return_counts=True)
        stats["class_distribution"] = {
            str(cls): {
                "count": int(count),
                "percentage": round(float(count / len(predictions) * 100), 2)
            }
            for cls, count in zip(unique, counts)
        }
        
        # Confidence statistics
        if probabilities is not None:
            confidences = np.max(probabilities, axis=1)
            stats["confidence_statistics"] = {
                "mean": round(float(np.mean(confidences)), 4),
                "std": round(float(np.std(confidences)), 4),
                "min": round(float(np.min(confidences)), 4),
                "max": round(float(np.max(confidences)), 4),
                "median": round(float(np.median(confidences)), 4),
                "q1": round(float(np.percentile(confidences, 25)), 4),
                "q3": round(float(np.percentile(confidences, 75)), 4)
            }
            
            # Confidence ranges
            high_conf = np.sum(confidences >= 0.8)
            medium_conf = np.sum((confidences >= 0.6) & (confidences < 0.8))
            low_conf = np.sum(confidences < 0.6)
            
            stats["confidence_ranges"] = {
                "high (>= 0.8)": {
                    "count": int(high_conf),
                    "percentage": round(float(high_conf / len(confidences) * 100), 2)
                },
                "medium (0.6-0.8)": {
                    "count": int(medium_conf),
                    "percentage": round(float(medium_conf / len(confidences) * 100), 2)
                },
                "low (< 0.6)": {
                    "count": int(low_conf),
                    "percentage": round(float(low_conf / len(confidences) * 100), 2)
                }
            }
        
        # Performance metrics (if ground truth is available)
        if y_true is not None:
            from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
            
            stats["performance_metrics"] = {
                "accuracy": round(float(accuracy_score(y_true, predictions)), 4),
                "precision_macro": round(float(precision_score(y_true, predictions, average='macro', zero_division=0)), 4),
                "recall_macro": round(float(recall_score(y_true, predictions, average='macro', zero_division=0)), 4),
                "f1_macro": round(float(f1_score(y_true, predictions, average='macro', zero_division=0)), 4)
            }
            
            # Per-class metrics
            report = classification_report(y_true, predictions, output_dict=True, zero_division=0)
            stats["per_class_metrics"] = {
                cls: {
                    "precision": round(metrics["precision"], 4),
                    "recall": round(metrics["recall"], 4),
                    "f1-score": round(metrics["f1-score"], 4),
                    "support": int(metrics["support"])
                }
                for cls, metrics in report.items()
                if cls not in ['accuracy', 'macro avg', 'weighted avg']
            }
        
        return stats
    
    def generate_complete_analytics(
        self,
        data: pd.DataFrame,
        y_true: Optional[pd.Series] = None
    ) -> Dict[str, Any]:
        """
        Generate complete analytics package
        
        Args:
            data: Input DataFrame for predictions
            y_true: Optional true labels for performance evaluation
            
        Returns:
            Dictionary with statistics and base64-encoded plots
        """
        # Make predictions
        predictions = self.model_service.model.predict(data)
        probabilities = None
        
        if hasattr(self.model_service.model, 'predict_proba'):
            try:
                probabilities = self.model_service.model.predict_proba(data)
            except:
                pass
        
        labels = self.model_service.target_classes or np.unique(predictions)
        
        # Generate statistics
        statistics = self.calculate_statistics(
            predictions, 
            probabilities, 
            y_true.values if y_true is not None else None
        )
        
        # Generate plots
        plots = {}
        
        # 1. Class Distribution
        plots["class_distribution"] = self.generate_class_distribution_plot(predictions, labels)
        
        # 2. Confusion Matrix (if ground truth available)
        if y_true is not None:
            plots["confusion_matrix"] = self.generate_confusion_matrix_plot(
                y_true.values, predictions, labels
            )
            
            # 3. ROC Curves (if probabilities available)
            if probabilities is not None:
                plots["roc_curves"] = self.generate_roc_curves(
                    y_true.values, probabilities, labels
                )
        
        # 4. Confidence Distribution
        if probabilities is not None:
            plots["confidence_distribution"] = self.generate_confidence_distribution_plot(probabilities)
            plots["probability_heatmap"] = self.generate_probability_heatmap(
                probabilities, labels
            )
            plots["class_probability_comparison"] = self.generate_class_probability_comparison(
                probabilities, labels
            )
        
        # 5. Feature Importance
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
                "model_name": self.model_service.model_name
            }
        }
    
    def _fig_to_base64(self, fig) -> str:
        """Convert matplotlib figure to base64 string"""
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=100, bbox_inches='tight')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        plt.close(fig)
        buf.close()
        return img_base64
