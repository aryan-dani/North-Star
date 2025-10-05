"""
Model Service Module
Handles model loading, preprocessing, and predictions
"""
import os
import pandas as pd
import numpy as np
from joblib import load
from typing import Dict, List, Any, Optional
from pathlib import Path

class ModelService:
    """Service class for managing ML model operations"""
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize ModelService
        
        Args:
            model_path: Path to the model file. If None, will look for RandomForest model
        """
        self.model = None
        self.model_path = model_path
        self.model_name = "RandomForest"
        self.is_classification = True
        
        
        self.feature_names = None
        self.numeric_features = None
        self.categorical_features = None
        self.target_classes = None
        
    def load_model(self, model_path: Optional[str] = None):
        """
        Load the trained model
        
        Args:
            model_path: Optional path to model file
        """
        if model_path:
            self.model_path = model_path
        
        if not self.model_path:
            
            models_dir = Path(__file__).parent.parent / "models"
            
            
            model_files = list(models_dir.glob("RandomForest_*.joblib"))
            
            if not model_files:
                
                model_files = list(models_dir.glob("best_model_*.joblib"))
            
            if not model_files:
                raise FileNotFoundError("No model file found in models directory")
            
            
            self.model_path = str(sorted(model_files)[-1])
        
        print(f"Loading model from: {self.model_path}")
        self.model = load(self.model_path)
        
        
        self._extract_model_info()
        
        return self.model
    
    def _extract_model_info(self):
        """Extract information from the loaded pipeline"""
        if self.model is None:
            raise ValueError("Model not loaded")
        
        
        if hasattr(self.model, 'named_steps'):
            preprocessor = self.model.named_steps.get('pre')
            if preprocessor:
                
                self.numeric_features = []
                self.categorical_features = []
                
                for name, transformer, features in preprocessor.transformers_:
                    if name == 'num':
                        self.numeric_features = list(features)
                    elif name == 'cat':
                        self.categorical_features = list(features)
                
                self.feature_names = self.numeric_features + self.categorical_features
        
        
        if hasattr(self.model, 'named_steps'):
            estimator = self.model.named_steps.get('model')
            if hasattr(estimator, 'classes_'):
                self.target_classes = list(estimator.classes_)
    
    def is_loaded(self) -> bool:
        """Check if model is loaded"""
        return self.model is not None
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get model information"""
        if not self.is_loaded():
            raise ValueError("Model not loaded")
        
        return {
            "model_name": self.model_name,
            "model_type": "classification" if self.is_classification else "regression",
            "model_path": str(self.model_path),
            "n_features": len(self.feature_names) if self.feature_names else "unknown",
            "target_classes": self.target_classes,
            "numeric_features": len(self.numeric_features) if self.numeric_features else 0,
            "categorical_features": len(self.categorical_features) if self.categorical_features else 0
        }
    
    def get_expected_features(self) -> Dict[str, List[str]]:
        """Get list of expected features"""
        if not self.is_loaded():
            raise ValueError("Model not loaded")
        
        return {
            "numeric": self.numeric_features or [],
            "categorical": self.categorical_features or [],
            "all": self.feature_names or []
        }
    
    def predict(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Make predictions on input data
        
        Args:
            data: Input DataFrame
            
        Returns:
            Dictionary with predictions, probabilities, and metrics
        """
        if not self.is_loaded():
            raise ValueError("Model not loaded. Call load_model() first.")
        
        
        predictions = self.model.predict(data)
        
        
        probabilities = None
        confidence = None
        if hasattr(self.model, 'predict_proba'):
            try:
                proba = self.model.predict_proba(data)
                probabilities = proba.tolist()
                confidence = np.max(proba, axis=1).tolist()
            except:
                pass
        
        
        metrics = self._calculate_metrics(predictions, probabilities)
        
        return {
            "predictions": predictions.tolist(),
            "probabilities": probabilities,
            "confidence": confidence,
            "metrics": metrics
        }
    
    def predict_batch(self, data: pd.DataFrame) -> Dict[str, Any]:
        """
        Make batch predictions with detailed row-by-row output
        
        Args:
            data: Input DataFrame
            
        Returns:
            Dictionary with detailed predictions for each row
        """
        if not self.is_loaded():
            raise ValueError("Model not loaded. Call load_model() first.")
        
        
        predictions = self.model.predict(data)
        
        
        probabilities = None
        if hasattr(self.model, 'predict_proba'):
            try:
                probabilities = self.model.predict_proba(data)
            except:
                pass
        
        
        predictions_detail = []
        for idx, pred in enumerate(predictions):
            row_result = {
                "row_id": idx,
                "prediction": str(pred),
            }
            
            if probabilities is not None:
                probs = probabilities[idx]
                row_result["confidence"] = float(np.max(probs))
                row_result["probabilities"] = {
                    str(cls): float(prob) 
                    for cls, prob in zip(self.target_classes, probs)
                }
            
            predictions_detail.append(row_result)
        
        
        summary = self._calculate_summary(predictions, probabilities)
        
        
        metrics = self._calculate_metrics(predictions, probabilities)
        
        return {
            "predictions_detail": predictions_detail,
            "summary": summary,
            "metrics": metrics
        }
    
    def _calculate_metrics(self, predictions: np.ndarray, probabilities: Optional[np.ndarray]) -> Dict[str, Any]:
        """Calculate prediction metrics"""
        metrics = {
            "total_predictions": len(predictions),
        }
        
        if self.is_classification:
            
            unique, counts = np.unique(predictions, return_counts=True)
            metrics["class_distribution"] = {
                str(cls): int(count) for cls, count in zip(unique, counts)
            }
            
            
            if probabilities is not None:
                avg_confidence = float(np.mean(np.max(probabilities, axis=1)))
                metrics["average_confidence"] = round(avg_confidence, 4)
        
        return metrics
    
    def _calculate_summary(self, predictions: np.ndarray, probabilities: Optional[np.ndarray]) -> Dict[str, Any]:
        """Calculate summary statistics"""
        summary = {
            "total_samples": len(predictions),
        }
        
        if self.is_classification:
            
            unique, counts = np.unique(predictions, return_counts=True)
            summary["predictions_by_class"] = {
                str(cls): {
                    "count": int(count),
                    "percentage": round(float(count / len(predictions) * 100), 2)
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
                    "median": round(float(np.median(confidences)), 4)
                }
        
        return summary
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get model performance metrics (if available)"""
        
        
        return {
            "model_name": self.model_name,
            "note": "Training metrics not available. Upload test data to calculate metrics."
        }
