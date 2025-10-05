"""WebSocket manager for real-time updates."""

from __future__ import annotations

import json
import logging
from typing import Any, Dict, List, Set

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manage WebSocket connections for real-time updates."""

    def __init__(self):
        """Initialize the connection manager."""
        self.active_connections: List[WebSocket] = []
        self.training_sessions: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, session_id: str | None = None):
        """Accept a new WebSocket connection."""
        await websocket.accept()
        self.active_connections.append(websocket)
        
        if session_id:
            if session_id not in self.training_sessions:
                self.training_sessions[session_id] = set()
            self.training_sessions[session_id].add(websocket)
        
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection."""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        # Remove from training sessions
        for session_id, connections in list(self.training_sessions.items()):
            if websocket in connections:
                connections.remove(websocket)
                if not connections:
                    del self.training_sessions[session_id]
        
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str | Dict[str, Any], websocket: WebSocket):
        """Send a message to a specific client."""
        try:
            if isinstance(message, dict):
                message = json.dumps(message)
            await websocket.send_text(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")

    async def broadcast(self, message: str | Dict[str, Any]):
        """Broadcast a message to all connected clients."""
        if isinstance(message, dict):
            message = json.dumps(message)
        
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Error broadcasting to connection: {e}")
                disconnected.append(connection)
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn)

    async def send_to_session(self, session_id: str, message: Dict[str, Any]):
        """Send a message to all clients in a specific training session."""
        if session_id not in self.training_sessions:
            return
        
        message_str = json.dumps(message)
        disconnected = []
        
        for websocket in self.training_sessions[session_id]:
            try:
                await websocket.send_text(message_str)
            except Exception as e:
                logger.error(f"Error sending to session {session_id}: {e}")
                disconnected.append(websocket)
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn)

    async def send_training_progress(
        self,
        session_id: str,
        progress: int,
        stage: str,
        message: str,
        metrics: Dict[str, Any] | None = None,
    ):
        """Send training progress update to session clients."""
        update = {
            "type": "training_progress",
            "session_id": session_id,
            "progress": progress,
            "stage": stage,
            "message": message,
            "metrics": metrics or {},
        }
        await self.send_to_session(session_id, update)


# Global connection manager instance
manager = ConnectionManager()
