"""API route handlers for the backend application."""

from __future__ import annotations

import io
from datetime import datetime
from typing import Any, Dict, List

import pandas as pd
from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from fastapi.responses import JSONResponse

from app.services.analytics_service import AnalyticsService
from app.services.model_service import ModelService

router = APIRouter()


def get_model_service(request: Request) -> ModelService:
    service: ModelService | None = getattr(request.app.state, "model_service", None)
    if service is None or not service.is_loaded():
        raise HTTPException(status_code=503, detail="Model service unavailable")
    return service


def get_analytics_service(request: Request) -> AnalyticsService:
    service: AnalyticsService | None = getattr(request.app.state, "analytics_service", None)
    if service is None:
        raise HTTPException(status_code=503, detail="Analytics service unavailable")
    return service


@router.get("/")
async def root(model_service: ModelService = Depends(get_model_service)) -> Dict[str, Any]:
    return {
        "message": "Exoplanet Classification API",
        "version": "1.0.0",
        "status": "active",
        "model": model_service.model_name,
        "endpoints": {
            "health": "/health",
            "model_info": "/model/info",
            "predict": "/predict",
            "predict_batch": "/predict/batch",
            "analytics": "/analytics",
            "analytics_stats": "/analytics/statistics",
            "plot_types": "/analytics/plots/types",
            "docs": "/docs",
        },
    }


@router.get("/health")
async def health_check(model_service: ModelService = Depends(get_model_service)) -> Dict[str, Any]:
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": model_service.is_loaded(),
    }


@router.get("/model/info")
async def get_model_info(model_service: ModelService = Depends(get_model_service)) -> JSONResponse:
    try:
        info = model_service.get_model_info()
        return JSONResponse(content=info)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error retrieving model info: {exc}") from exc


@router.post("/predict")
async def predict_single(
    file: UploadFile = File(...), model_service: ModelService = Depends(get_model_service)
) -> JSONResponse:
    try:
        if file.filename is None or not (file.filename.endswith(".csv") if file.filename else False):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        contents: bytes = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        results = model_service.predict(df)
        return JSONResponse(
            content={
                "status": "success",
                "filename": file.filename,
                "total_rows": len(df),
                "predictions": results["predictions"],
                "probabilities": results["probabilities"],
                "metrics": results["metrics"],
                "timestamp": datetime.now().isoformat(),
            }
        )
    except HTTPException:
        raise
    except pd.errors.EmptyDataError as exc:
        raise HTTPException(status_code=400, detail="CSV file is empty") from exc
    except pd.errors.ParserError as exc:
        raise HTTPException(status_code=400, detail="Invalid CSV format") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction error: {exc}") from exc


@router.post("/predict/batch")
async def predict_batch(
    file: UploadFile = File(...), model_service: ModelService = Depends(get_model_service)
) -> JSONResponse:
    try:
        if file.filename is None or not file.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        results = model_service.predict_batch(df)
        return JSONResponse(
            content={
                "status": "success",
                "filename": file.filename,
                "total_rows": len(df),
                "predictions_detail": results["predictions_detail"],
                "summary": results["summary"],
                "metrics": results["metrics"],
                "timestamp": datetime.now().isoformat(),
            }
        )
    except HTTPException:
        raise
    except pd.errors.EmptyDataError as exc:
        raise HTTPException(status_code=400, detail="CSV file is empty") from exc
    except pd.errors.ParserError as exc:
        raise HTTPException(status_code=400, detail="Invalid CSV format") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction error: {exc}") from exc


@router.post("/predict/json")
async def predict_json(
    data: Dict[str, Any], model_service: ModelService = Depends(get_model_service)
) -> JSONResponse:
    try:
        if "data" not in data:
            raise HTTPException(status_code=400, detail="JSON must contain 'data' key")
        df = pd.DataFrame([data["data"]])
        results = model_service.predict(df)
        return JSONResponse(
            content={
                "status": "success",
                "prediction": results["predictions"][0],
                "probabilities": results["probabilities"][0]
                if results["probabilities"]
                else None,
                "confidence": results["confidence"][0] if results["confidence"] else None,
                "timestamp": datetime.now().isoformat(),
            }
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction error: {exc}") from exc


@router.get("/model/features")
async def get_features(model_service: ModelService = Depends(get_model_service)) -> JSONResponse:
    try:
        features = model_service.get_expected_features()
        return JSONResponse(
            content={
                "status": "success",
                "features": features,
                "total_features": len(features["numeric"]) + len(features["categorical"]),
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error retrieving features: {exc}") from exc


@router.get("/model/metrics")
async def get_metrics(model_service: ModelService = Depends(get_model_service)) -> JSONResponse:
    try:
        metrics = model_service.get_metrics()
        return JSONResponse(content={"status": "success", "metrics": metrics})
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error retrieving metrics: {exc}") from exc


@router.post("/analytics")
async def generate_analytics(
    file: UploadFile = File(...),
    model_service: ModelService = Depends(get_model_service),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
) -> JSONResponse:
    try:
        if file.filename is None or not file.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        target_col = None
        y_true = None
        possible_targets = ["koi_disposition", "target", "label", "class"]
        for col in possible_targets:
            if col in df.columns:
                target_col = col
                y_true = df[col]
                df = df.drop(columns=[col])
                break
        analytics_result = analytics_service.generate_complete_analytics(df, y_true)
        return JSONResponse(
            content={
                "status": "success",
                "filename": file.filename,
                "analytics": analytics_result,
                "timestamp": datetime.now().isoformat(),
            }
        )
    except HTTPException:
        raise
    except pd.errors.EmptyDataError as exc:
        raise HTTPException(status_code=400, detail="CSV file is empty") from exc
    except pd.errors.ParserError as exc:
        raise HTTPException(status_code=400, detail="Invalid CSV format") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Analytics generation error: {exc}") from exc


@router.post("/analytics/statistics")
async def generate_statistics_only(
    file: UploadFile = File(...),
    model_service: ModelService = Depends(get_model_service),
    analytics_service: AnalyticsService = Depends(get_analytics_service),
) -> JSONResponse:
    try:
        if file.filename is None or not file.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        target_col = None
        y_true = None
        possible_targets = ["koi_disposition", "target", "label", "class"]
        for col in possible_targets:
            if col in df.columns:
                target_col = col
                y_true = df[col]
                df = df.drop(columns=[col])
                break
        model = model_service.model
        if model is None:
            raise HTTPException(status_code=503, detail="Model not loaded")
        predictions = model.predict(df)
        probabilities = None
        if hasattr(model, "predict_proba"):
            try:
                probabilities = model.predict_proba(df)
            except Exception:  # pragma: no cover - best effort
                pass
        statistics = analytics_service.calculate_statistics(
            predictions,
            probabilities,
            y_true,
        )
        return JSONResponse(
            content={
                "status": "success",
                "filename": file.filename,
                "statistics": statistics,
                "total_samples": len(df),
                "timestamp": datetime.now().isoformat(),
            }
        )
    except HTTPException:
        raise
    except pd.errors.EmptyDataError as exc:
        raise HTTPException(status_code=400, detail="CSV file is empty") from exc
    except pd.errors.ParserError as exc:
        raise HTTPException(status_code=400, detail="Invalid CSV format") from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Statistics generation error: {exc}") from exc


@router.get("/analytics/plots/types")
async def get_available_plots() -> JSONResponse:
    return JSONResponse(
        content={
            "status": "success",
            "available_plots": [
                {
                    "name": "class_distribution",
                    "description": "Bar chart showing distribution of predicted classes",
                    "requires_ground_truth": False,
                },
                {
                    "name": "confusion_matrix",
                    "description": "Confusion matrix heatmap",
                    "requires_ground_truth": True,
                },
                {
                    "name": "confidence_distribution",
                    "description": "Histogram and box plot of prediction confidence scores",
                    "requires_ground_truth": False,
                },
                {
                    "name": "probability_heatmap",
                    "description": "Heatmap showing probability distributions",
                    "requires_ground_truth": False,
                },
                {
                    "name": "roc_curves",
                    "description": "ROC curves for multi-class classification",
                    "requires_ground_truth": True,
                },
                {
                    "name": "feature_importance",
                    "description": "Feature importance rankings (if supported by model)",
                    "requires_ground_truth": False,
                },
                {
                    "name": "class_probability_comparison",
                    "description": "Violin plot comparing probability distributions",
                    "requires_ground_truth": False,
                },
            ],
        }
    )
