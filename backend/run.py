# backend/run.py

import os
import uvicorn

if __name__ == "__main__":
    # Use 0.0.0.0 for production (Railway), environment variable for port
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("ENV", "production") == "development"
    
    # Debug logging for Railway
    print(f"[DEBUG] PORT env var: {os.getenv('PORT', 'NOT SET')}")
    print(f"[DEBUG] Starting uvicorn on {host}:{port}")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload
    )
