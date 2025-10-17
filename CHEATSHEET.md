# 🚀 ClassGuru Ad Service - 命令速查表

## 📌 基本命令

```powershell
# 进入项目目录
cd "C:\Users\31339\Desktop\Nanyang Technological University\Entrepreneurship\CG_ad_service"

# 安装依赖
npm install

# 验证配置
npm run validate

# 启动开发服务器
npm run dev

# 停止服务器
npm run kill-server  # 或在运行窗口按 Ctrl+C

# 生成测试 JWT
npm run generate-jwt
```

---

## 🧪 测试命令

```powershell
# 运行自动化测试（服务器需已启动）
powershell -ExecutionPolicy Bypass -File .\scripts\test-api.ps1

# 在浏览器中打开演示页面
Start-Process "http://localhost:8791/demo/demo.html"
```

---

## 🌐 常用 URLs

| 功能 | URL |
|------|-----|
| 主页 | http://localhost:8791 |
| 演示页面 | http://localhost:8791/demo/demo.html |
| 健康检查 | http://localhost:8791/api/ads/health |
| AdSense 配置 | http://localhost:8791/api/ads/config |

---

## 📡 API 测试（PowerShell）

### 健康检查
```powershell
Invoke-RestMethod -Uri "http://localhost:8791/api/ads/health"
```

### 请求广告
```powershell
$body = @{
    page = "/test"
    format = "banner"
    sessionId = "test-123"
    deviceType = "desktop"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8791/api/ads/request" `
    -Method POST -ContentType "application/json" -Body $body
```

### 追踪点击
```powershell
$click = @{
    impressionId = "mock_imp_123_test"
    clickUrl = "https://example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8791/api/ads/click" `
    -Method POST -ContentType "application/json" -Body $click
```

### 获取统计（需要 JWT）
```powershell
# 先生成 token
npm run generate-jwt
# 复制 token 后：
$token = "你的_JWT_TOKEN"
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:8791/api/ads/metrics?adUnitId=test&startDate=2025-01-01&endDate=2025-12-31" -Headers $headers
```

---

## ⚙️ 配置文件

### .env 最小配置（Mock 模式）
```env
PORT=8791
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
DB_PATH=./data/ad_service.db
MOCK_ADS_MODE=true
MOCK_ADS_SCENARIO=success
```

### .env 生产配置（真实 Google Ads）
```env
PORT=8791
JWT_SECRET=your_production_jwt_secret_64_characters_minimum
DB_PATH=./data/ad_service.db
MOCK_ADS_MODE=false
GOOGLE_ADS_ENABLED=true
ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxxx
ADSENSE_SLOT_ID=xxxxxxxxxx
```

---

## 🔧 故障排除

### 端口被占用
```powershell
npm run kill-server
# 或
Get-Process -Name node | Stop-Process -Force
```

### 数据库错误
```powershell
Remove-Item -Path .\data\*.db -Force
npm run dev
```

### 检查进程
```powershell
Get-Process -Name node
```

### 查看日志
服务器日志会直接显示在运行 `npm run dev` 的窗口中

---

## 📚 文档

- **完整文档**: [README.md](README.md)
- **快速开始**: [QUICKSTART.md](QUICKSTART.md)
- **测试指南**: [TESTING.md](TESTING.md)

---

## 💡 提示

1. **首次使用**：确保先运行 `npm install` 和 `npm run validate`
2. **测试前**：确保服务器已启动（`npm run dev`）
3. **Mock 模式**：开发时使用 Mock 模式，无需 Google Ads 凭证
4. **生产模式**：设置 `MOCK_ADS_MODE=false` 并配置真实的 AdSense ID
5. **热重载**：修改代码后服务器会自动重启

---

**快速帮助**: 运行 `npm run validate` 检查配置问题
