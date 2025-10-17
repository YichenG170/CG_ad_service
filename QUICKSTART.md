# ClassGuru Ad Service - 快速启动指南

## 📦 安装步骤

### 1. 安装依赖

在 PowerShell 中运行：

```powershell
cd "C:\Users\31339\Desktop\Nanyang Technological University\Entrepreneurship\CG_ad_service"
npm install
```

### 2. 配置环境

```powershell
# 复制环境变量模板
cp .env.example .env

# 使用记事本或 VS Code 编辑 .env
notepad .env
```

**最小配置（Mock 模式）**：
```env
PORT=8791
JWT_SECRET=your_jwt_secret_at_least_32_characters_long_here
DB_PATH=./data/ad_service.db
MOCK_ADS_MODE=true
MOCK_ADS_SCENARIO=success
```

### 3. 验证配置

```powershell
npm run validate
```

### 4. 启动服务

**开发模式（推荐）**：
```powershell
npm run dev
```

**生产模式**：
```powershell
npm start
```

### 5. 测试服务

在浏览器中打开：
- 主页: http://localhost:8791
- Demo 页面: http://localhost:8791/demo
- 健康检查: http://localhost:8791/api/ads/health

## 🎯 常用命令

```powershell
# 查看所有可用命令
make help

# 验证环境配置
npm run validate

# 生成测试 JWT token
npm run generate-jwt

# 停止服务器
npm run kill-server

# 清理数据库
make clean
```

## 🧪 测试服务器

### 快速测试（推荐）

**步骤 1: 启动服务器**
```powershell
# 在当前 PowerShell 窗口
cd "C:\Users\31339\Desktop\Nanyang Technological University\Entrepreneurship\CG_ad_service"
npm run dev
```

看到以下输出表示启动成功：
```
[INFO] 🚀 Ad Service started successfully
[INFO] 📍 Server running at: http://localhost:8791
[INFO] 🎭 Mock mode: Enabled
```

**步骤 2: 运行自动化测试**
```powershell
# 打开新的 PowerShell 窗口
cd "C:\Users\31339\Desktop\Nanyang Technological University\Entrepreneurship\CG_ad_service"
powershell -ExecutionPolicy Bypass -File .\scripts\test-api.ps1
```

测试脚本会自动检查所有 API 端点并显示结果。

**步骤 3: 在浏览器中测试**
```powershell
# 打开演示页面
Start-Process "http://localhost:8791/demo/demo.html"

# 或者在浏览器中手动打开：
# http://localhost:8791/demo/demo.html
```

### 手动测试 API

如果你想手动测试每个 API：

```powershell
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
```

### 停止服务器

```powershell
# 方法 1: 在运行 npm run dev 的窗口按 Ctrl+C

# 方法 2: 使用脚本
npm run kill-server
```

## 🔄 开发工作流

1. **启动开发服务器**
   ```powershell
   npm run dev
   ```

2. **在浏览器中测试**
   - 打开 http://localhost:8791/demo
   - 点击 "Load Ad" 查看广告展示
   - 查看统计数据和活动日志

3. **修改代码**
   - 服务器会自动重启（热重载）
   - 刷新浏览器查看更改

4. **停止服务器**
   - 按 `Ctrl+C` 或运行 `npm run kill-server`

## 📝 下一步

### 集成 Google AdSense（生产环境）

1. **注册 Google AdSense**
   - 访问 https://www.google.com/adsense
   - 创建账户并提交网站审核

2. **获取凭证**
   - 在 AdSense 控制台创建广告单元
   - 复制 Client ID (ca-pub-xxxxxxxxx)
   - 复制 Slot ID

3. **更新 .env**
   ```env
   MOCK_ADS_MODE=false
   GOOGLE_ADS_ENABLED=true
   ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxxx
   ADSENSE_SLOT_ID=xxxxxxxxxx
   ```

4. **重启服务器**
   ```powershell
   npm run kill-server
   npm run dev
   ```

### 与 Payment Service 集成

1. **确保 JWT_SECRET 一致**
   - Ad Service 和 Payment Service 必须使用相同的 `JWT_SECRET`
   - 这样才能验证用户身份

2. **后续功能开发**
   - 验证用户订阅状态
   - 为付费用户隐藏广告
   - 广告收入统计
   - 用户行为分析

## 🐛 常见问题

### 端口被占用
```powershell
npm run kill-server
```

### TypeScript 错误
```powershell
# 重新安装依赖
Remove-Item -Recurse -Force node_modules
npm install
```

### 数据库错误
```powershell
# 清理并重新创建数据库
make clean
npm run dev
```

## 📚 更多资源

- 完整文档: [README.md](README.md)
- API 文档: 查看 `/api/ads/` 端点
- Google AdSense 文档: https://support.google.com/adsense

---

**需要帮助？** 检查服务器日志或浏览器控制台获取详细错误信息。
