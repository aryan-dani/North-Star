"""Application factory for the FastAPI backend."""

from __future__ import annotations

from typing import Any

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api import api_router
from .services.analytics_service import AnalyticsService
from .services.model_service import ModelService
from .services.training_service import TrainingService


def create_app() -> FastAPI:
    app = FastAPI(
        title="Exoplanet Classification API",
        description="ML-powered API for exoplanet classification using trained models",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    model_service = ModelService()
    analytics_service: AnalyticsService | None = None
    training_service: TrainingService | None = None

    @app.on_event("startup")
    async def startup_event() -> None:
        nonlocal analytics_service, training_service
        model_service.load_model()
        analytics_service = AnalyticsService(model_service)
        training_service = TrainingService()
        app.state.model_service = model_service
        app.state.analytics_service = analytics_service
        app.state.training_service = training_service
        print("✓ Model loaded successfully")
        print("✓ Analytics service initialised")
        print("✓ Training service initialised")

    @app.exception_handler(404)
    async def not_found_handler(request: Request, exc: Any) -> JSONResponse:
        return JSONResponse(
            status_code=404,
            content={"error": "Endpoint not found", "path": str(request.url)},
        )

    @app.exception_handler(500)
    async def internal_error_handler(request: Request, exc: Any) -> JSONResponse:
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error", "detail": str(exc)},
        )

    app.include_router(api_router)
    return app


app = create_app()
