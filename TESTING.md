# 🧪 测试指南 - ClassGuru Ad Service

## 快速开始

### 1️⃣ 启动服务器

在 PowerShell 中运行：

```powershell
cd "C:\Users\31339\Desktop\Nanyang Technological University\Entrepreneurship\CG_ad_service"
npm run dev
```

**成功启动的标志：**
```
[INFO] 🚀 Ad Service started successfully
[INFO] 📍 Server running at: http://localhost:8791
[INFO] 🎭 Mock mode: Enabled
[INFO] 📊 Health check: http://localhost:8791/api/ads/health
```

### 2️⃣ 运行自动化测试

**打开新的 PowerShell 窗口**，运行：

```powershell
cd "C:\Users\31339\Desktop\Nanyang Technological University\Entrepreneurship\CG_ad_service"
powershell -ExecutionPolicy Bypass -File .\scripts\test-api.ps1
```

**预期输出：**
```
========================================
ClassGuru Ad Service - API Tests
========================================

--- Test 1: Health Check ---
Testing: Health Check... ✓ PASSED

--- Test 2: AdSense Config ---
Testing: Get AdSense Config... ✓ PASSED

--- Test 3: Request Banner Ad ---
Testing: Request Banner Ad... ✓ PASSED

--- Test 4: Request Rectangle Ad ---
Testing: Request Rectangle Ad... ✓ PASSED

--- Test 5: Track Ad Click ---
Testing: Track Ad Click... ✓ PASSED

========================================
Test Summary
========================================
Tests Passed: 5
Tests Failed: 0
Total Tests:  5

✓ All tests passed! Server is working correctly.
```

### 3️⃣ 在浏览器中测试

```powershell
# 打开演示页面
Start-Process "http://localhost:8791/demo/demo.html"
```

**在演示页面中：**
1. 点击 "Load Ad" 按钮查看广告
2. 尝试不同的广告格式（Banner, Rectangle, Native）
3. 切换设备类型（Desktop, Mobile, Tablet）
4. 点击广告查看点击追踪
5. 查看右侧的统计数据（展示次数、点击次数、CTR）

---

## 详细测试步骤

### 测试 1: 健康检查

```powershell
Invoke-RestMethod -Uri "http://localhost:8791/api/ads/health"
```

**预期响应：**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-17T...",
  "uptime": 123.456,
  "version": "1.0.0",
  "services": {
    "database": true,
    "googleAds": true
  }
}
```

### 测试 2: 获取 AdSense 配置

```powershell
Invoke-RestMethod -Uri "http://localhost:8791/api/ads/config"
```

**预期响应：**
```json
{
  "success": true,
  "config": {
    "clientId": "ca-pub-0000000000000000",
    "slotId": "0000000000",
    "scriptUrl": "mock://google-ads-script"
  }
}
```

### 测试 3: 请求广告（Banner）

```powershell
$body = @{
    page = "/homepage"
    format = "banner"
    sessionId = "test-session-001"
    deviceType = "desktop"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8791/api/ads/request" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

# 查看响应
$response | ConvertTo-Json -Depth 5
```

**预期响应：**
```json
{
  "success": true,
  "ad": {
    "id": "mock_ad_...",
    "type": "banner",
    "content": "<div class=\"mock-ad\">...</div>",
    "clickUrl": "https://example.com/...",
    "impressionId": "mock_imp_..."
  }
}
```

### 测试 4: 追踪点击

```powershell
$clickBody = @{
    impressionId = "mock_imp_1234567890_test"
    clickUrl = "https://example.com/destination"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8791/api/ads/click" `
    -Method POST `
    -ContentType "application/json" `
    -Body $clickBody
```

**预期响应：**
```json
{
  "success": true
}
```

### 测试 5: 获取广告统计（需要 JWT）

**步骤 1: 生成 JWT Token**
```powershell
npm run generate-jwt
```

复制输出的 token。

**步骤 2: 查询统计**
```powershell
$token = "你的JWT_TOKEN_这里"
$headers = @{ Authorization = "Bearer $token" }

Invoke-RestMethod -Uri "http://localhost:8791/api/ads/metrics?adUnitId=test&startDate=2025-01-01&endDate=2025-12-31" `
    -Headers $headers
```

**预期响应：**
```json
{
  "success": true,
  "metrics": {
    "adUnitId": "test",
    "impressions": 10,
    "clicks": 2,
    "ctr": 20.0,
    "revenue": 5.50,
    "rpm": 550.0,
    "period": {
      "start": "2025-01-01T...",
      "end": "2025-12-31T..."
    }
  }
}
```

---

## 常见问题

### ❌ 无法连接到服务器

**问题：** `Invoke-RestMethod : 无法连接到远程服务器`

**解决方法：**
```powershell
# 1. 检查服务器是否运行
Get-Process -Name node -ErrorAction SilentlyContinue

# 2. 如果没有运行，启动服务器
npm run dev

# 3. 等待 5 秒后再测试
Start-Sleep -Seconds 5
```

### ❌ 端口已被占用

**问题：** `Error: listen EADDRINUSE: address already in use :::8791`

**解决方法：**
```powershell
# 停止占用端口的进程
npm run kill-server

# 或手动停止
Get-Process -Name node | Stop-Process -Force

# 重新启动
npm run dev
```

### ❌ 数据库错误

**问题：** `Failed to initialize database`

**解决方法：**
```powershell
# 清理并重新创建数据库
Remove-Item -Path .\data\*.db -Force -ErrorAction SilentlyContinue
npm run dev
```

### ❌ Mock 广告不显示

**检查配置：**
```powershell
# 确保 .env 中设置了 Mock 模式
Get-Content .env | Select-String "MOCK_ADS_MODE"

# 应该显示：MOCK_ADS_MODE=true
```

---

## 性能测试

### 压力测试（可选）

```powershell
# 连续请求 100 次广告
1..100 | ForEach-Object {
    $body = @{
        page = "/test"
        format = "banner"
        sessionId = "stress-test-$_"
        deviceType = "desktop"
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "http://localhost:8791/api/ads/request" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body
    
    Write-Host "Request $_ completed"
}
```

### 查看数据库统计

```powershell
# 需要安装 sqlite3（可选）
# 查看展示次数
sqlite3 .\data\ad_service.db "SELECT COUNT(*) as impressions FROM ad_impressions;"

# 查看点击次数
sqlite3 .\data\ad_service.db "SELECT COUNT(*) as clicks FROM ad_clicks;"
```

---

## 停止服务器

### 方法 1: 键盘快捷键
在运行 `npm run dev` 的 PowerShell 窗口按 `Ctrl+C`

### 方法 2: 使用脚本
```powershell
npm run kill-server
```

### 方法 3: 手动停止
```powershell
Get-Process -Name node | Stop-Process -Force
```

---

## 测试检查清单

使用此清单确保所有功能正常：

- [ ] ✅ 服务器成功启动
- [ ] ✅ 健康检查返回 "healthy"
- [ ] ✅ 可以获取 AdSense 配置
- [ ] ✅ 可以请求 Banner 广告
- [ ] ✅ 可以请求 Rectangle 广告
- [ ] ✅ 可以请求 Native 广告
- [ ] ✅ 点击追踪正常工作
- [ ] ✅ 演示页面正常显示
- [ ] ✅ 演示页面可以加载广告
- [ ] ✅ 演示页面统计数据更新
- [ ] ✅ JWT 认证正常工作（metrics API）

---

**需要帮助？** 查看完整文档：[README.md](README.md)
