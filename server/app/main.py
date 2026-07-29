import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.database import engine, Base, SessionLocal
from app.seed import seed_db
from app.models import User
from app.routers import auth, products, categories, orders, reviews, coupons, admin, telemetry

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database Tables
    Base.metadata.create_all(bind=engine)
    
    # Auto-seed database
    db: Session = SessionLocal()
    try:
        if db.query(User).count() == 0:
            seed_db()
    except Exception as e:
        print(f"Seed warning: {e}")
    finally:
        db.close()
        
    yield

app = FastAPI(
    title="VEXO Luxury E-Commerce FastAPI Engine",
    description="Production Python FastAPI backend engine for VEXO planar hardware, acoustics, and order telemetry.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request counter middleware
@app.middleware("http")
async def count_requests(request: Request, call_next):
    telemetry.increment_request_counter()
    response = await call_next(request)
    return response

# Serve static upload files
uploads_dir = os.path.join(os.path.dirname(__file__), "../uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include Routers
app.include_router(telemetry.router)
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(orders.router)
app.include_router(reviews.router)
app.include_router(coupons.router)
app.include_router(admin.router)

# Standardized Error Response Formatter for Express compatibility
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": exc.detail}
    )

# 404 Handler for Unknown Routes
@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"success": False, "message": "API route not found"}
    )

# Root Route - Developer Landing Response & Status Page
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    accept_header = request.headers.get("accept", "")
    if "text/html" in accept_header:
        html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VEXO FastAPI Engine v1.0.0</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Plus+Jakarta+Sans:wght@400;600;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0F0E0D;
      --card: #181715;
      --card-hover: #22201D;
      --border: #2A2825;
      --gold: #C5A059;
      --gold-bg: rgba(197, 160, 89, 0.12);
      --ink: #FAF9F6;
      --stone: #A19D94;
      --emerald: #10B981;
      --emerald-bg: rgba(16, 185, 129, 0.12);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--ink);
      font-family: 'Plus Jakarta Sans', sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .wrapper {
      max-width: 900px;
      width: 100%;
      margin: 0 auto;
    }
    header {
      margin-bottom: 32px;
      text-align: left;
    }
    .brand {
      font-family: 'Cinzel', serif;
      font-weight: 900;
      font-size: 32px;
      letter-spacing: 0.15em;
      color: var(--ink);
      text-transform: uppercase;
    }
    .tagline {
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.25em;
      color: var(--stone);
      text-transform: uppercase;
      margin-top: -2px;
    }
    .status-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 16px 24px;
      margin-bottom: 32px;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--emerald-bg);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--emerald);
      padding: 6px 14px;
      border-radius: 100px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      background: var(--emerald);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--emerald);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1); }
    }
    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }
    .btn-primary {
      background: var(--ink);
      color: var(--bg);
      border: 1px solid var(--ink);
    }
    .btn-primary:hover {
      background: #FFFFFF;
      box-shadow: 0 4px 15px rgba(250,249,246,0.2);
    }
    .btn-secondary {
      background: transparent;
      color: var(--ink);
      border: 1px solid var(--border);
    }
    .btn-secondary:hover {
      border-color: var(--gold);
      color: var(--gold);
    }
    
    .section-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--gold);
      margin-bottom: 16px;
    }
    
    .telemetry-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 14px;
      margin-bottom: 36px;
    }
    .telemetry-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 16px;
    }
    .telemetry-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--stone);
      margin-bottom: 4px;
    }
    .telemetry-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 700;
      color: var(--ink);
    }
    .db-live { color: var(--emerald); }

    .cards-grid {
      display: grid;
      gap: 12px;
      margin-bottom: 40px;
    }
    .api-card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .api-card:hover {
      transform: translateY(-2px);
      border-color: var(--gold);
      box-shadow: 0 8px 25px rgba(0,0,0,0.4);
      background: var(--card-hover);
    }
    .api-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .endpoint-path {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .method-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 800;
      padding: 4px 8px;
      border-radius: 6px;
      text-transform: uppercase;
    }
    .method-get { background: rgba(16, 185, 129, 0.15); color: var(--emerald); border: 1px solid rgba(16, 185, 129, 0.3); }
    .method-post { background: rgba(197, 160, 89, 0.15); color: var(--gold); border: 1px solid rgba(197, 160, 89, 0.3); }

    .endpoint-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;
      color: var(--ink);
    }
    .copy-btn {
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--border);
      color: var(--stone);
      padding: 5px 12px;
      border-radius: 8px;
      font-size: 10px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .copy-btn:hover {
      color: var(--ink);
      border-color: var(--gold);
    }
    .api-card-body {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: var(--stone);
      font-weight: 500;
    }
    .status-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 700;
      color: var(--emerald);
      background: rgba(16, 185, 129, 0.1);
      padding: 2px 6px;
      border-radius: 4px;
    }

    footer {
      border-top: 1px solid var(--border);
      padding-top: 24px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: var(--stone);
      font-weight: 600;
    }
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--card);
      border: 1px solid var(--gold);
      color: var(--ink);
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(0,0,0,0.8);
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
      pointer-events: none;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body>
  <div class="wrapper">
    <header>
      <div class="brand">VEXO</div>
      <div class="tagline">FASTAPI BACKEND TELEMETRY • EST. 2026</div>
    </header>

    <div class="status-bar">
      <div class="status-badge">
        <div class="status-dot"></div>
        <span id="liveStatusText">FastAPI Engine Online • 200 OK</span>
      </div>

      <div class="actions">
        <a href="http://localhost:5173" class="btn btn-primary">Launch Frontend (5173)</a>
        <a href="/docs" class="btn btn-secondary">Interactive Swagger Docs (/docs)</a>
      </div>
    </div>

    <!-- Live Telemetry Grid -->
    <div class="section-title">System Metrics & Telemetry</div>
    <div class="telemetry-grid">
      <div class="telemetry-card">
        <div class="telemetry-label">Backend Engine</div>
        <div class="telemetry-value">FastAPI v1.0.0</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">Python Runtime</div>
        <div class="telemetry-value">v3.13</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">Environment</div>
        <div class="telemetry-value">development</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">Database Status</div>
        <div class="telemetry-value db-live" id="dbStatusValue">● Connected</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">Server Uptime</div>
        <div class="telemetry-value" id="uptimeValue">0s</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">Total Requests</div>
        <div class="telemetry-value" id="requestsValue">0</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">RAM (RSS / VMS)</div>
        <div class="telemetry-value" id="memoryValue">0MB / 0MB</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">Current Server Time</div>
        <div class="telemetry-value" id="serverTimeValue" style="font-size:11px;">--:--:--</div>
      </div>
    </div>

    <!-- API Endpoint Documentation Cards -->
    <div class="section-title">API Endpoint Documentation</div>
    <div class="cards-grid">
      <div class="api-card">
        <div class="api-card-header">
          <div class="endpoint-path">
            <span class="method-badge method-get">GET</span>
            <span class="endpoint-title">/api/v1/health</span>
          </div>
          <button class="copy-btn" onclick="copyEndpoint('/api/v1/health')">📋 Copy</button>
        </div>
        <div class="api-card-body">
          <span>Returns system health status and ISO timestamp</span>
          <span class="status-code">200 OK</span>
        </div>
      </div>

      <div class="api-card">
        <div class="api-card-header">
          <div class="endpoint-path">
            <span class="method-badge method-get">GET</span>
            <span class="endpoint-title">/api/v1/products</span>
          </div>
          <button class="copy-btn" onclick="copyEndpoint('/api/v1/products')">📋 Copy</button>
        </div>
        <div class="api-card-body">
          <span>Fetch product index with search, category & price filters</span>
          <span class="status-code">200 OK</span>
        </div>
      </div>

      <div class="api-card">
        <div class="api-card-header">
          <div class="endpoint-path">
            <span class="method-badge method-get">GET</span>
            <span class="endpoint-title">/api/v1/categories</span>
          </div>
          <button class="copy-btn" onclick="copyEndpoint('/api/v1/categories')">📋 Copy</button>
        </div>
        <div class="api-card-body">
          <span>List all VEXO hardware product categories</span>
          <span class="status-code">200 OK</span>
        </div>
      </div>

      <div class="api-card">
        <div class="api-card-header">
          <div class="endpoint-path">
            <span class="method-badge method-post">POST</span>
            <span class="endpoint-title">/api/v1/auth/login</span>
          </div>
          <button class="copy-btn" onclick="copyEndpoint('/api/v1/auth/login')">📋 Copy</button>
        </div>
        <div class="api-card-body">
          <span>Authenticate user or admin credentials to return JWT token</span>
          <span class="status-code">200 OK</span>
        </div>
      </div>

      <div class="api-card">
        <div class="api-card-header">
          <div class="endpoint-path">
            <span class="method-badge method-post">POST</span>
            <span class="endpoint-title">/api/v1/orders</span>
          </div>
          <button class="copy-btn" onclick="copyEndpoint('/api/v1/orders')">📋 Copy</button>
        </div>
        <div class="api-card-body">
          <span>Create new hardware order and dispatch reference</span>
          <span class="status-code">201 CREATED</span>
        </div>
      </div>

      <div class="api-card">
        <div class="api-card-header">
          <div class="endpoint-path">
            <span class="method-badge method-post">POST</span>
            <span class="endpoint-title">/api/v1/coupons/validate</span>
          </div>
          <button class="copy-btn" onclick="copyEndpoint('/api/v1/coupons/validate')">📋 Copy</button>
        </div>
        <div class="api-card-body">
          <span>Validate promotional coupon code and calculate discount</span>
          <span class="status-code">200 OK</span>
        </div>
      </div>

      <div class="api-card">
        <div class="api-card-header">
          <div class="endpoint-path">
            <span class="method-badge method-get">GET</span>
            <span class="endpoint-title">/api/v1/admin/metrics</span>
          </div>
          <button class="copy-btn" onclick="copyEndpoint('/api/v1/admin/metrics')">📋 Copy</button>
        </div>
        <div class="api-card-body">
          <span>Fetch revenue telemetry and order stats for admin dashboard</span>
          <span class="status-code">200 OK</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer>
      <div>VEXO FastAPI Backend API • Version 1.0.0</div>
      <div>Build Date: 2026-07-29</div>
      <div>© 2026 VEXO Systems. All rights reserved.</div>
    </footer>
  </div>

  <div class="toast" id="copyToast">Endpoint copied to clipboard</div>

  <script>
    function copyEndpoint(path) {
      const fullUrl = window.location.origin + path;
      navigator.clipboard.writeText(fullUrl);
      const toast = document.getElementById('copyToast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }

    async function updateTelemetry() {
      try {
        const res = await fetch('/api/v1/telemetry');
        if (res.ok) {
          const data = await res.json();
          document.getElementById('dbStatusValue').innerText = '● ' + data.dbStatus;
          document.getElementById('requestsValue').innerText = data.totalRequests;
          document.getElementById('memoryValue').innerText = data.memory.rssMB + 'MB / ' + data.memory.heapUsedMB + 'MB';
          
          const s = data.uptimeSeconds;
          const h = Math.floor(s / 3600);
          const m = Math.floor((s % 3600) / 60);
          const sec = s % 60;
          document.getElementById('uptimeValue').innerText = (h ? h + 'h ' : '') + (m ? m + 'm ' : '') + sec + 's';
        }
      } catch (e) {
        document.getElementById('liveStatusText').innerText = 'Server Offline';
      }
    }

    setInterval(updateTelemetry, 3000);
    updateTelemetry();
    setInterval(() => {
      document.getElementById('serverTimeValue').innerText = new Date().toLocaleTimeString();
    }, 1000);
  </script>
</body>
</html>
        """
        return HTMLResponse(content=html_content)

    return JSONResponse(content={
        "success": True,
        "message": "VEXO E-Commerce Backend is running 🚀",
        "version": "1.0.0",
        "status": "OK",
        "api": "/api/v1"
    })
