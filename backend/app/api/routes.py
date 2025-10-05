"""API route handlers for the backend application."""

from __future__ import annotations

import io
import logging
import traceback
from datetime import datetime
from typing import Any, Dict, List

import pandas as pd
from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.responses import JSONResponse

from app.services.analytics_service import AnalyticsService
from app.services.model_service import ModelService
from app.services.training_service import TrainingService
from app.services.websocket_manager import manager as ws_manager

logger = logging.getLogger(__name__)

router = APIRouter()


def get_model_service(request: Request) -> ModelService:
    service: ModelService | None = getattr(request.app.state, "model_service", None)
    if service is None or not service.is_loaded():
        raise HTTPException(status_code=503, detail="Model service unavailable")
    return service


def get_model_service_optional(request: Request) -> ModelService:
    """Get model service without requiring a loaded model (for management operations)."""
    service: ModelService | None = getattr(request.app.state, "model_service", None)
    if service is None:
        raise HTTPException(status_code=503, detail="Model service unavailable")
    return service


def get_analytics_service(request: Request) -> AnalyticsService:
    service: AnalyticsService | None = getattr(request.app.state, "analytics_service", None)
    if service is None:
        raise HTTPException(status_code=503, detail="Analytics service unavailable")
    return service


def get_training_service(request: Request) -> TrainingService:
    service: TrainingService | None = getattr(request.app.state, "training_service", None)
    if service is None:
        raise HTTPException(status_code=503, detail="Training service unavailable")
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
        import traceback
        error_detail = f"Analytics generation error: {str(exc)}\n{traceback.format_exc()}"
        print(error_detail)  # Log to console
        raise HTTPException(status_code=500, detail=f"Analytics generation error: {str(exc)}") from exc


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


@router.get("/models/available")
async def get_available_models(model_service: ModelService = Depends(get_model_service_optional)) -> JSONResponse:
    """Get list of all trained models available in the models directory."""
    try:
        models = model_service.get_available_models()
        return JSONResponse(
            content={
                "status": "success",
                "models": models,
                "total": len(models),
                "current_model": model_service.current_model_name,
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error retrieving models: {exc}") from exc


@router.post("/models/switch")
async def switch_model(
    request: Request,
    data: Dict[str, Any],
    model_service: ModelService = Depends(get_model_service_optional)
) -> JSONResponse:
    """Switch to a different trained model."""
    try:
        model_name = data.get("model_name")
        if not model_name:
            raise HTTPException(status_code=400, detail="model_name is required")
        
        # Load the new model
        model_service.load_model(model_name=model_name)
        
        # Update the app state
        request.app.state.model_service = model_service
        
        info = model_service.get_model_info()
        return JSONResponse(
            content={
                "status": "success",
                "message": f"Switched to {model_name} model",
                "model_info": info,
            }
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error switching model: {exc}") from exc


@router.get("/training/hyperparameters/{model_name}")
async def get_hyperparameters(
    model_name: str,
    training_service: TrainingService = Depends(get_training_service)
) -> JSONResponse:
    """Get available hyperparameters for a specific model."""
    try:
        params = training_service.get_model_hyperparameters(model_name)
        return JSONResponse(
            content={
                "status": "success",
                "model_name": model_name,
                "hyperparameters": params,
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error retrieving hyperparameters: {exc}") from exc


@router.post("/training/validate")
async def validate_training_data(
    file: UploadFile = File(...),
    target_column: str = "koi_disposition",
    training_service: TrainingService = Depends(get_training_service)
) -> JSONResponse:
    """Validate uploaded training data."""
    try:
        if file.filename is None or not file.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        
        validation_result = training_service.validate_data(df, target_column)
        
        return JSONResponse(
            content={
                "status": "success",
                "validation": validation_result,
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
        raise HTTPException(status_code=500, detail=f"Validation error: {exc}") from exc


@router.post("/training/train")
async def train_new_model(
    request: Request,
    file: UploadFile = File(...),
    model_name: str = Form("RandomForest"),
    target_column: str = Form("koi_disposition"),
    test_size: float = Form(0.2),
    session_id: str | None = Form(None),
    training_service: TrainingService = Depends(get_training_service)
) -> JSONResponse:
    """Train a new model with uploaded data."""
    try:
        logger.info(f"Training request received - Model: {model_name}, Target: {target_column}, Test Size: {test_size}")
        
        if file.filename is None or not file.filename.endswith(".csv"):
            raise HTTPException(status_code=400, detail="File must be a CSV")
        
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        
        # Get hyperparameters from request form if provided
        # For now, use defaults
        default_params = training_service.get_model_hyperparameters(model_name)
        hyperparameters = {}
        for param_name, param_info in default_params.items():
            hyperparameters[param_name] = param_info.get("default")
        
        # Generate session_id if not provided
        if not session_id:
            session_id = f"training_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Train model
        result = await training_service.train_model(
            data=df,
            target_column=target_column,
            model_name=model_name,
            hyperparameters=hyperparameters,
            test_size=test_size,
            session_id=session_id,
        )
        
        return JSONResponse(
            content={
                "status": "success",
                "result": result,
                "session_id": session_id,
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
        raise HTTPException(status_code=500, detail=f"Training error: {exc}") from exc


@router.get("/training/history")
async def get_training_history(
    training_service: TrainingService = Depends(get_training_service)
) -> JSONResponse:
    """Get history of training sessions."""
    try:
        history = training_service.get_training_history()
        return JSONResponse(
            content={
                "status": "success",
                "history": history,
                "total": len(history),
            }
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error retrieving history: {exc}") from exc


@router.websocket("/ws/training/{session_id}")
async def websocket_training(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time training updates."""
    await ws_manager.connect(websocket, session_id)
    try:
        while True:
            # Keep connection alive and receive any client messages
            data = await websocket.receive_text()
            # Echo back if needed (for debugging)
            if data == "ping":
                await ws_manager.send_personal_message({"type": "pong"}, websocket)
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        ws_manager.disconnect(websocket)

