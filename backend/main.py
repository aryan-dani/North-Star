"""
FastAPI Backend for ML Model Prediction Service
Serves RandomForest model for exoplanet classification
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
from typing import List, Dict, Any
import io
import json
from datetime import datetime

from model_utils import ModelService
from analytics import AnalyticsService

app = FastAPI(
    title="Exoplanet Classification API",
    description="ML-powered API for exoplanet classification using RandomForest model",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_service = ModelService()
analytics_service = None

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    global analytics_service
    try:
        model_service.load_model()
        analytics_service = AnalyticsService(model_service)
        print("✓ Model loaded successfully")
        print("✓ Analytics service initialized")
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        raise

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Exoplanet Classification API",
        "version": "1.0.0",
        "status": "active",
        "model": "RandomForest Classifier",
        "endpoints": {
            "health": "/health",
            "model_info": "/model/info",
            "predict": "/predict",
            "predict_batch": "/predict/batch",
            "analytics": "/analytics",
            "analytics_stats": "/analytics/statistics",
            "plot_types": "/analytics/plots/types",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": model_service.is_loaded()
    }

@app.get("/model/info")
async def get_model_info():
    """Get model information and metadata"""
    try:
        info = model_service.get_model_info()
        return JSONResponse(content=info)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving model info: {str(e)}")

@app.post("/predict")
async def predict_single(file: UploadFile = File(...)):
    """
    Predict on a single CSV file upload
    Returns predictions with probabilities and metrics
    """
    try:
        
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        
        results = model_service.predict(df)
        
        return JSONResponse(content={
            "status": "success",
            "filename": file.filename,
            "total_rows": len(df),
            "predictions": results["predictions"],
            "probabilities": results["probabilities"],
            "metrics": results["metrics"],
            "timestamp": datetime.now().isoformat()
        })
        
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="CSV file is empty")
    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Invalid CSV format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/batch")
async def predict_batch(file: UploadFile = File(...)):
    """
    Batch prediction endpoint with detailed row-by-row results
    Returns individual predictions for each row with confidence scores
    """
    try:
        
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        
        results = model_service.predict_batch(df)
        
        return JSONResponse(content={
            "status": "success",
            "filename": file.filename,
            "total_rows": len(df),
            "predictions_detail": results["predictions_detail"],
            "summary": results["summary"],
            "metrics": results["metrics"],
            "timestamp": datetime.now().isoformat()
        })
        
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="CSV file is empty")
    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Invalid CSV format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/json")
async def predict_json(data: Dict[str, Any]):
    """
    Predict from JSON input
    Accepts a JSON object with feature values
    """
    try:
        
        if "data" not in data:
            raise HTTPException(status_code=400, detail="JSON must contain 'data' key")
        
        df = pd.DataFrame([data["data"]])
        
        
        results = model_service.predict(df)
        
        return JSONResponse(content={
            "status": "success",
            "prediction": results["predictions"][0],
            "probabilities": results["probabilities"][0] if results["probabilities"] else None,
            "confidence": results["confidence"][0] if "confidence" in results else None,
            "timestamp": datetime.now().isoformat()
        })
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/model/features")
async def get_features():
    """Get expected features for the model"""
    try:
        features = model_service.get_expected_features()
        return JSONResponse(content={
            "status": "success",
            "features": features,
            "total_features": len(features["numeric"]) + len(features["categorical"])
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving features: {str(e)}")

@app.get("/model/metrics")
async def get_metrics():
    """Get model performance metrics"""
    try:
        metrics = model_service.get_metrics()
        return JSONResponse(content={
            "status": "success",
            "metrics": metrics
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving metrics: {str(e)}")

@app.post("/analytics")
async def generate_analytics(file: UploadFile = File(...)):
    """
    Generate comprehensive analytics for uploaded CSV data
    Returns statistics and base64-encoded plots for visualization
    """
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        
        target_col = None
        y_true = None
        
        
        possible_targets = ['koi_disposition', 'target', 'label', 'class']
        for col in possible_targets:
            if col in df.columns:
                target_col = col
                y_true = df[col]
                df = df.drop(columns=[col])
                break
        
        
        analytics_result = analytics_service.generate_complete_analytics(df, y_true)
        
        return JSONResponse(content={
            "status": "success",
            "filename": file.filename,
            "analytics": analytics_result,
            "timestamp": datetime.now().isoformat()
        })
        
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="CSV file is empty")
    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Invalid CSV format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics generation error: {str(e)}")

@app.post("/analytics/statistics")
async def generate_statistics_only(file: UploadFile = File(...)):
    """
    Generate statistics only (no plots) for faster response
    Useful for quick data overview
    """
    try:
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        
        target_col = None
        y_true = None
        possible_targets = ['koi_disposition', 'target', 'label', 'class']
        for col in possible_targets:
            if col in df.columns:
                target_col = col
                y_true = df[col]
                df = df.drop(columns=[col])
                break
        
        
        predictions = model_service.model.predict(df)
        probabilities = None
        
        if hasattr(model_service.model, 'predict_proba'):
            try:
                probabilities = model_service.model.predict_proba(df)
            except:
                pass
        
        
        statistics = analytics_service.calculate_statistics(
            predictions,
            probabilities,
            y_true.values if y_true is not None else None
        )
        
        return JSONResponse(content={
            "status": "success",
            "filename": file.filename,
            "statistics": statistics,
            "total_samples": len(df),
            "timestamp": datetime.now().isoformat()
        })
        
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="CSV file is empty")
    except pd.errors.ParserError:
        raise HTTPException(status_code=400, detail="Invalid CSV format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Statistics generation error: {str(e)}")

@app.get("/analytics/plots/types")
async def get_available_plots():
    """Get list of available plot types"""
    return JSONResponse(content={
        "status": "success",
        "available_plots": [
            {
                "name": "class_distribution",
                "description": "Bar chart showing distribution of predicted classes",
                "requires_ground_truth": False
            },
            {
                "name": "confusion_matrix",
                "description": "Confusion matrix heatmap",
                "requires_ground_truth": True
            },
            {
                "name": "confidence_distribution",
                "description": "Histogram and box plot of prediction confidence scores",
                "requires_ground_truth": False
            },
            {
                "name": "probability_heatmap",
                "description": "Heatmap showing probability distributions",
                "requires_ground_truth": False
            },
            {
                "name": "roc_curves",
                "description": "ROC curves for multi-class classification",
                "requires_ground_truth": True
            },
            {
                "name": "feature_importance",
                "description": "Feature importance rankings (if supported by model)",
                "requires_ground_truth": False
            },
            {
                "name": "class_probability_comparison",
                "description": "Violin plot comparing probability distributions",
                "requires_ground_truth": False
            }
        ]
    })

@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"error": "Endpoint not found", "path": str(request.url)}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
