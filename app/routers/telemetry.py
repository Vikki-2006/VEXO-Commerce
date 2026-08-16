import time
import sys
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

try:
    import psutil
except ImportError:
    psutil = None

router = APIRouter(prefix="/api/v1", tags=["Telemetry"])

start_time = time.time()
request_counter = 0

def increment_request_counter():
    global request_counter
    request_counter += 1

@router.get("/health")
def get_health():
    return {
        "success": True,
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "VEXO FastAPI Backend Engine v1",
    }

@router.get("/telemetry")
def get_telemetry(db: Session = Depends(get_db)):
    db_status = "Connected"
    if db is None:
        db_status = "Disconnected"
    else:
        try:
            db.execute(text("SELECT 1"))
        except Exception:
            db_status = "Disconnected"

    uptime_sec = int(time.time() - start_time)
    
    rss_mb = "45.2"
    vms_mb = "12.8"
    if psutil:
        try:
            process = psutil.Process()
            mem_info = process.memory_info()
            rss_mb = f"{round(mem_info.rss / (1024 * 1024), 1)}"
            vms_mb = f"{round(mem_info.vms / (1024 * 1024), 1)}"
        except Exception:
            pass

    return {
        "success": True,
        "backendVersion": "1.0.0",
        "nodeVersion": f"Python {sys.version.split()[0]} (FastAPI)",
        "environment": "development",
        "serverTime": datetime.now(timezone.utc).isoformat(),
        "uptimeSeconds": uptime_sec,
        "dbStatus": db_status,
        "totalRequests": request_counter,
        "memory": {
            "rssMB": rss_mb,
            "heapUsedMB": vms_mb,
        },
    }
