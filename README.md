# ClassGuru Ad Service

**Google Ads integration microservice for ClassGuru**

Production-ready ad service with Google AdSense/AdMob integration, comprehensive tracking, and modern tooling.

### Option 1: Mock Mode (No Google Ads Setup Required) ⚡

Perfect for development and testing **without** Google Ads credentials:

```powershell
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set: MOCK_ADS_MODE=true

# 3. Validate configuration
npm run validate

# 4. Start server (in background)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

# Wait for server to start
Start-Sleep -Seconds 5

# 5. Test the server
powershell -ExecutionPolicy Bypass -File .\scripts\test-api.ps1

# 6. Open demo page in browser
Start-Process "http://localhost:8791/demo/demo.html"
```

**Quick Test (One-liner)**:
```powershell
# Start server and test in one command
npm run dev & Start-Sleep 5; powershell .\scripts\test-api.ps1
```

**Mock mode features:**
- ✅ No Google Ads credentials needed
- ✅ Multiple test scenarios (success, empty, errors)
- ✅ Identical to production flow
- ✅ **Seamlessly switch to real Google Ads with ONE env var**

### Option 2: Real Google Ads Setup

For production or testing with actual Google AdSense:

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your Google AdSense credentials

# 3. Validate configuration
npm run validate

# 4. Start server
npm start
```

### Test Ad Display
```bash
# Open demo page
open http://localhost:8791/demo

# Or test API directly
curl -X POST http://localhost:8791/api/ads/request \
  -H "Content-Type: application/json" \
  -d '{"page":"/test","format":"banner","sessionId":"test-123"}'
```

## 📋 What's Included

- **TypeScript codebase** with full type safety
- **Google AdSense/AdMob integration** for web and mobile
- **🧪 Mock Ads system** for development without API keys
- **SQLite database** for impression and click tracking
- **Professional tooling** (Makefile, validation scripts, health checks)
- **Modern frontend** demo page with live statistics
- **JWT authentication** for protected endpoints
- **Comprehensive API** for ad requests, tracking, and analytics

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│         Ad Service (Port 8791)              │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend Pages                             │
│  ├─ / (service info)                        │
│  └─ /demo (ad display demo)                 │
│                                             │
│  API Routes                                 │
│  ├─ GET  /api/ads/health                    │
│  ├─ GET  /api/ads/config                    │
│  ├─ POST /api/ads/request                   │
│  ├─ POST /api/ads/click                     │
│  └─ GET  /api/ads/metrics (JWT auth)        │
│                                             │
│  Internal Handlers                          │
│  ├─ request-ad                              │
│  ├─ track-click                             │
│  └─ get-metrics                             │
│                                             │
│  Data Layer (SQLite)                        │
│  └─ ad_impressions, ad_clicks, ad_units     │
│                                             │
│  Google Ads Integration                     │
│  ├─ AdSense (web)                           │
│  ├─ AdMob (mobile)                          │
│  └─ Mock system (development)               │
│                                             │
└─────────────────────────────────────────────┘
```

## 🛠️ Available Commands

### Make Commands
```bash
make help         # Show all commands
make install      # Install dependencies
make dev          # Start development server
make start        # Start production server
make stop         # Stop server
make restart      # Restart server
make status       # Check if running
make health       # Health check
make validate     # Validate environment
make clean        # Clean database
```

### NPM Scripts
```bash
npm run validate      # Validate .env configuration
npm run generate-jwt  # Generate test JWT token
npm run kill-server   # Kill existing server
npm run dev           # Development with hot reload
npm start             # Production server
```

## 🎯 Ad Formats & Sizes

### Supported Formats
- **Banner**: 728×90 (desktop), 320×50 (mobile), 468×60 (tablet)
- **Rectangle**: 300×250 (all devices)
- **Leaderboard**: 970×90 (desktop), 320×100 (mobile)
- **Skyscraper**: 160×600 (desktop), 120×240 (mobile)
- **Native**: Custom sizes for native ads

## 🔧 Configuration

### Required Environment Variables
```env
# Server
PORT=8791

# JWT (MUST match mainline config)
JWT_SECRET=your_shared_secret_at_least_32_characters

# Database
DB_PATH=./data/ad_service.db

# Google Ads (for production)
GOOGLE_ADS_ENABLED=true
ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxxx
ADSENSE_SLOT_ID=xxxxxxxxxx

# Mock Mode (for development)
MOCK_ADS_MODE=false
```

### Google AdSense Setup
1. Sign up at [google.com/adsense](https://www.google.com/adsense)
2. Create ad units in AdSense dashboard
3. Copy Client ID (ca-pub-xxxxx) and Slot IDs
4. Update `.env` with your credentials
5. Set `GOOGLE_ADS_ENABLED=true`
6. Disable mock mode: `MOCK_ADS_MODE=false`

### Google AdMob Setup (Mobile)
1. Sign up at [admob.google.com](https://admob.google.com)
2. Create app and ad units
3. Copy App ID and Banner Unit ID
4. Update `.env` with AdMob credentials

## 📊 API Reference

### Endpoints

#### GET /api/ads/health
Health check endpoint
- **Auth**: None
- **Response**: Service health status

#### GET /api/ads/config
Get AdSense configuration for client-side rendering
- **Auth**: None (optional)
- **Response**: AdSense client ID and script URL

#### POST /api/ads/request
Request an ad
- **Auth**: None (optional JWT for user tracking)
- **Body**:
  ```json
  {
    "page": "/home",
    "format": "banner",
    "size": { "width": 728, "height": 90 },
    "sessionId": "session-123",
    "deviceType": "desktop"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "ad": {
      "id": "ad-xyz",
      "type": "banner",
      "content": "<div>...</div>",
      "impressionId": "imp-abc"
    }
  }
  ```

#### POST /api/ads/click
Track ad click
- **Auth**: None (optional JWT for user tracking)
- **Body**:
  ```json
  {
    "impressionId": "imp-abc",
    "clickUrl": "https://example.com"
  }
  ```

#### GET /api/ads/metrics
Get ad metrics (requires authentication)
- **Auth**: JWT required
- **Query**: `?adUnitId=xxx&startDate=2025-01-01&endDate=2025-01-31`
- **Response**:
  ```json
  {
    "success": true,
    "metrics": {
      "impressions": 1000,
      "clicks": 50,
      "ctr": 5.0,
      "revenue": 12.50,
      "rpm": 12.50
    }
  }
  ```

### JWT Authentication

For protected endpoints, include JWT token:
```bash
Authorization: Bearer <token>
```

Generate test token:
```bash
npm run generate-jwt
```

## 🧪 测试服务器

### 方法 1: 自动化测试脚本（推荐）✨

```powershell
# 1. 启动服务器
npm run dev

# 2. 打开新的 PowerShell 窗口，运行测试
powershell -ExecutionPolicy Bypass -File .\scripts\test-api.ps1
```

测试脚本会自动检查：
- ✅ 健康检查 API
- ✅ AdSense 配置获取
- ✅ 广告请求（Banner 和 Rectangle）
- ✅ 点击追踪
- ✅ 显示测试结果统计

### 方法 2: 手动测试

#### A. 启动服务器
```powershell
# 在当前 PowerShell 窗口启动
cd "C:\Users\31339\Desktop\Nanyang Technological University\Entrepreneurship\CG_ad_service"
npm run dev

# 服务器启动后，你会看到：
# [INFO] 🚀 Ad Service started successfully
# [INFO] 📍 Server running at: http://localhost:8791
# [INFO] 🎭 Mock mode: Enabled
```

#### B. 在浏览器中测试
打开以下链接：
- **主页**: http://localhost:8791
- **演示页面**: http://localhost:8791/demo/demo.html
- **健康检查**: http://localhost:8791/api/ads/health

#### C. 使用 PowerShell 测试 API

```powershell
# 打开新的 PowerShell 窗口，测试 API

# 1. 健康检查
Invoke-RestMethod -Uri "http://localhost:8791/api/ads/health"

# 2. 获取 AdSense 配置
Invoke-RestMethod -Uri "http://localhost:8791/api/ads/config"

# 3. 请求广告
$body = @{
    page = "/test"
    format = "banner"
    sessionId = "test-session-123"
    deviceType = "desktop"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8791/api/ads/request" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

# 4. 追踪点击
$clickBody = @{
    impressionId = "mock_imp_123456_test"
    clickUrl = "https://example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8791/api/ads/click" `
    -Method POST `
    -ContentType "application/json" `
    -Body $clickBody

# 5. 获取统计（需要 JWT）
# 先生成 JWT token
npm run generate-jwt
# 复制输出的 token，然后：
$token = "你的JWT_TOKEN"
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:8791/api/ads/metrics?adUnitId=test&startDate=2025-01-01&endDate=2025-12-31" -Headers $headers
```

### 方法 3: 完整测试流程（一步到位）

```powershell
# 创建测试脚本并运行
cd "C:\Users\31339\Desktop\Nanyang Technological University\Entrepreneurship\CG_ad_service"

# 确保配置正确
npm run validate

# 启动服务器（后台运行）
Start-Job -ScriptBlock { 
    cd "C:\Users\31339\Desktop\Nanyang Technological University\Entrepreneurship\CG_ad_service"
    npm run dev 
}

# 等待服务器启动
Start-Sleep -Seconds 5

# 运行测试
powershell -ExecutionPolicy Bypass -File .\scripts\test-api.ps1

# 打开演示页面
Start-Process "http://localhost:8791/demo/demo.html"
```

### 停止服务器

```powershell
# 方法 1: 在运行 npm run dev 的窗口按 Ctrl+C

# 方法 2: 使用脚本停止
npm run kill-server

# 方法 3: 手动查找并停止进程
Get-Process -Name node | Where-Object { $_.Path -like "*CG_ad_service*" } | Stop-Process -Force
```

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
make stop
# or
npm run kill-server
```

**Environment Validation Fails**
```bash
npm run validate
# Fix .env file based on error messages
```

**Mock Ads Not Showing**
- Ensure `MOCK_ADS_MODE=true` in `.env`
- Check `MOCK_ADS_SCENARIO` setting
- View browser console for errors

**Google Ads Not Loading**
- Verify AdSense Client ID is correct
- Check ad blocker is disabled
- Ensure domain is approved in AdSense
- Review AdSense policy compliance

### Debug Commands
```bash
# Check server status
make status

# View database
sqlite3 data/ad_service.db "SELECT * FROM ad_impressions LIMIT 10;"

# Test health endpoint
curl http://localhost:8791/api/ads/health | json_pp
```

## 📁 Project Structure

```
CG_ad_service/
├── src/
│   ├── server.ts                 # Main entry point
│   ├── lib/                      # Infrastructure
│   │   ├── database.ts           # SQLite manager
│   │   ├── google-ads.ts         # Google Ads integration
│   │   ├── mock-google-ads.ts    # Mock ads for testing
│   │   ├── jwt.ts                # JWT verification
│   │   └── logger.ts             # Logging
│   ├── handlers/                 # Business logic
│   │   ├── request-ad.ts
│   │   ├── track-click.ts
│   │   └── get-metrics.ts
│   ├── routes/                   # API endpoints
│   │   └── ads.ts
│   ├── config/
│   │   └── ads.ts                # Ad configuration
│   └── types/
│       └── index.ts              # TypeScript types
├── frontend/                     # Frontend pages
│   ├── demo.html                 # Demo page
│   └── demo.js                   # Demo logic
├── scripts/                      # Automation
│   ├── validate-env.js
│   ├── generate-test-jwt.js
│   └── kill-server.js
├── .env.example                  # Environment template
├── package.json
├── tsconfig.json
├── Makefile                      # Professional commands
└── README.md                     # This file
```

## 🚀 Production Deployment

### Pre-Deployment Checklist
- [ ] **Disable mock mode**: Set `MOCK_ADS_MODE=false`
- [ ] Configure Google AdSense credentials
- [ ] Update `JWT_SECRET` to production value (64+ chars)
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS origins for production domain
- [ ] Enable HTTPS/TLS
- [ ] Set up monitoring and alerts
- [ ] Review AdSense policies

### Production Environment
```env
# CRITICAL: Disable mock mode!
MOCK_ADS_MODE=false
NODE_ENV=production
PORT=8791

# Google Ads
GOOGLE_ADS_ENABLED=true
ADSENSE_CLIENT_ID=ca-pub-your_production_id
ADSENSE_SLOT_ID=your_production_slot

# Security
JWT_SECRET=64_character_random_string_here

# CORS
CORS_ORIGIN=https://classguru.com,https://app.classguru.com
```

## 🔗 Integration with Payment Service

This ad service is designed to integrate with the ClassGuru Payment Service:

- **Shared JWT authentication** - Use same `JWT_SECRET`
- **User verification** - Verify subscription status before showing premium content
- **Revenue tracking** - Track ad revenue alongside subscription revenue
- **Future integration** - Ad-free experience for premium subscribers

## 📞 Support

- **Google AdSense**: [support.google.com/adsense](https://support.google.com/adsense)
- **Google AdMob**: [support.google.com/admob](https://support.google.com/admob)
- **Ad Policies**: [support.google.com/adsense/answer/48182](https://support.google.com/adsense/answer/48182)

---

**Built with**: TypeScript, Fastify, Google Ads, SQLite, JWT  
**Status**: Production Ready  
**Port**: 8791  
**Last Updated**: October 2025
