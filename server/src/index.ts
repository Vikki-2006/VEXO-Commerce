import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

// Request Tracker
let totalRequests = 0;
app.use((req, res, next) => {
  totalRequests++;
  next();
});

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Telemetry API Endpoint for live updates
app.get('/api/v1/telemetry', async (req, res) => {
  let dbStatus = 'Connected';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    dbStatus = 'Disconnected';
  }
  const mem = process.memoryUsage();
  res.json({
    success: true,
    backendVersion: '1.0.0',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    dbStatus,
    totalRequests,
    memory: {
      rssMB: (mem.rss / (1024 * 1024)).toFixed(1),
      heapUsedMB: (mem.heapUsed / (1024 * 1024)).toFixed(1),
    },
  });
});

// OpenAPI Spec Endpoint
app.get('/api/v1/openapi.json', (req, res) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'VEXO Systems Luxury E-Commerce API',
      version: '1.0.0',
      description: 'Production Express backend for VEXO hardware, planar acoustics, and order telemetry.',
    },
    paths: {
      '/api/v1/health': { get: { summary: 'Server Health Check', responses: { '200': { description: 'Healthy' } } } },
      '/api/v1/products': { get: { summary: 'Get Product Catalog Index', responses: { '200': { description: 'Product list' } } } },
      '/api/v1/categories': { get: { summary: 'Get Categories Index', responses: { '200': { description: 'Categories list' } } } },
      '/api/v1/auth/login': { post: { summary: 'User / Admin Authentication', responses: { '200': { description: 'JWT Token and user profile' } } } },
      '/api/v1/orders': { post: { summary: 'Create New Hardware Order', responses: { '201': { description: 'Order created' } } } },
      '/api/v1/coupons/validate': { post: { summary: 'Validate Promotional Coupon', responses: { '200': { description: 'Discount payload' } } } },
      '/api/v1/admin/metrics': { get: { summary: 'Admin Dashboard Analytics', responses: { '200': { description: 'Revenue & order metrics' } } } },
    },
  });
});

// Root Route - Developer Landing Dashboard
app.get('/', async (req, res) => {
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    let dbStatus = 'Connected';
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'Disconnected';
    }
    const mem = process.memoryUsage();
    const rss = (mem.rss / (1024 * 1024)).toFixed(1);
    const heap = (mem.heapUsed / (1024 * 1024)).toFixed(1);
    const uptimeSec = Math.floor(process.uptime());

    res.setHeader('Content-Type', 'text/html');
    return res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VEXO API Engine v1.0.0</title>
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
      --rose: #F43F5E;
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
    
    /* Telemetry Grid */
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
    .db-live {
      color: var(--emerald);
    }

    /* API Documentation Cards */
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
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <header>
      <div class="brand">VEXO</div>
      <div class="tagline">SYSTEMS BACKEND TELEMETRY • EST. 2026</div>
    </header>

    <div class="status-bar">
      <div class="status-badge">
        <div class="status-dot"></div>
        <span id="liveStatusText">Server Online • 200 OK</span>
      </div>

      <div class="actions">
        <a href="http://localhost:5173" class="btn btn-primary">Launch Frontend (5173)</a>
        <a href="/api/v1/openapi.json" target="_blank" class="btn btn-secondary">OpenAPI 3.0 Specs</a>
      </div>
    </div>

    <!-- Live Telemetry Grid -->
    <div class="section-title">System Metrics & Telemetry</div>
    <div class="telemetry-grid">
      <div class="telemetry-card">
        <div class="telemetry-label">Backend Version</div>
        <div class="telemetry-value">v1.0.0</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">Node.js Engine</div>
        <div class="telemetry-value">${process.version}</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">Environment</div>
        <div class="telemetry-value">${process.env.NODE_ENV || 'development'}</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">Database Status</div>
        <div class="telemetry-value db-live" id="dbStatusValue">● ${dbStatus}</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">Server Uptime</div>
        <div class="telemetry-value" id="uptimeValue">${uptimeSec}s</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">Total Requests</div>
        <div class="telemetry-value" id="requestsValue">${totalRequests}</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">RAM (RSS / Heap)</div>
        <div class="telemetry-value" id="memoryValue">${rss}MB / ${heap}MB</div>
      </div>
      <div class="telemetry-card">
        <div class="telemetry-label">Current Server Time</div>
        <div class="telemetry-value" id="serverTimeValue" style="font-size:11px;">${new Date().toLocaleTimeString()}</div>
      </div>
    </div>

    <!-- API Endpoint Documentation -->
    <div class="section-title">API Endpoint Documentation</div>
    <div class="cards-grid">
      <!-- Endpoint 1 -->
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

      <!-- Endpoint 2 -->
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

      <!-- Endpoint 3 -->
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

      <!-- Endpoint 4 -->
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

      <!-- Endpoint 5 -->
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

      <!-- Endpoint 6 -->
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

      <!-- Endpoint 7 -->
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
      <div>VEXO Backend API • Version 1.0.0</div>
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

    // Live Server Telemetry Polling
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
    setInterval(() => {
      document.getElementById('serverTimeValue').innerText = new Date().toLocaleTimeString();
    }, 1000);
  </script>
</body>
</html>
    `);
  }

  res.json({
    success: true,
    message: 'VEXO E-Commerce Backend is running 🚀',
    version: '1.0.0',
    status: 'OK',
    api: '/api/v1',
  });
});

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'VEXO API v1',
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 Handler for Unknown Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

// Global Error Middleware
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`🚀 VEXO Luxury E-Commerce Server running on http://localhost:${config.port}`);
});
