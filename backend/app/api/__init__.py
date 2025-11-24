"""API Routes"""
from .transcribe import router as transcribe_router
from .troubleshoot import router as troubleshoot_router

__all__ = [
    "transcribe_router",
    "troubleshoot_router",
]