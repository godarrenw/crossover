# 🚀 财务自由挂图 - 部署指南

这是一个基于《Your Money or Your Life》理念的财务自由追踪系统，使用 Cloudflare Pages + Functions + D1 数据库架构。

## 📋 部署准备

### 前置要求
- ✅ GitHub 账号
- ✅ Cloudflare 账号
- ✅ Node.js 18+ 和 npm
- ✅ Wrangler CLI

### 安装 Wrangler CLI
```bash
npm install -g wrangler
```

## 🔧 部署步骤

### 1. 创建 GitHub 仓库
1. 在 GitHub 上创建新仓库 `financial-freedom-chart`
2. 将项目代码推送到仓库

```bash
git init
git add .
git commit -m "Initial commit: Financial Freedom Chart"
git branch -M main
git remote add origin https://github.com/你的用户名/financial-freedom-chart.git
git push -u origin main
```

### 2. 登录 Cloudflare
```bash
wrangler login
```

### 3. 创建 D1 数据库
```bash
# 创建数据库
wrangler d1 create financial-freedom-db

# 记录返回的数据库 ID，类似：
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 4. 更新 wrangler.toml 配置
将步骤3中返回的数据库ID填入 `wrangler.toml` 文件：

```toml
[[env.production.d1_databases]]
binding = "DB"
database_name = "financial-freedom-db"
database_id = "你的数据库ID"

[[env.development.d1_databases]]
binding = "DB"  
database_name = "financial-freedom-db"
preview_database_id = "你的数据库ID"
```

### 5. 初始化数据库结构
```bash
# 创建数据表
wrangler d1 execute financial-freedom-db --file=./schema.sql

# 插入初始数据（可选）
wrangler d1 execute financial-freedom-db --file=./seed.sql
```

### 6. 创建 Cloudflare Pages 项目

#### 方法一：通过 Cloudflare Dashboard（推荐）
1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Pages** 页面
3. 点击 **Create a project** → **Connect to Git**
4. 选择你的 GitHub 仓库 `financial-freedom-chart`
5. 配置构建设置：
   - **Framework preset**: None
   - **Build command**: 留空
   - **Build output directory**: `/`

#### 方法二：通过 Wrangler CLI
```bash
wrangler pages project create financial-freedom-chart
```

### 7. 配置环境变量和数据库绑定

在 Cloudflare Pages 项目设置中：

#### Settings → Environment variables
添加生产环境变量：
- **Variable name**: `ADMIN_PASSWORD`
- **Value**: `你的管理密码`（请设置一个强密码）

#### Functions → D1 database bindings
添加数据库绑定：
- **Variable name**: `DB`
- **D1 database**: 选择刚创建的 `financial-freedom-db`

### 8. 部署项目
```bash
# 推送代码触发自动部署
git add .
git commit -m "Update database configuration"
git push

# 或手动部署
wrangler pages deploy .
```

## 🎯 首次使用设置

### 1. 访问管理后台
部署完成后，访问：`https://your-project.pages.dev/admin.html`

### 2. 登录管理面板
使用您在环境变量中设置的 `ADMIN_PASSWORD`

### 3. 初始化数据库
点击 **"🗄️ 初始化数据库"** 按钮，系统会：
- 创建数据表结构
- 插入示例财务数据

### 4. 数据库迁移（如果是从旧版本升级）
如果您之前部署过旧版本，需要点击 **"🔄 数据库迁移"** 按钮：
- 添加新的 `investment_income` 字段
- 更新现有数据包含真实投资收益

### 5. 开始使用
- **查看图表**: 访问 `https://your-project.pages.dev/`
- **管理数据**: 访问 `https://your-project.pages.dev/admin.html`

## 🔧 本地开发

### 1. 安装依赖
```bash
npm install
```

### 2. 启动本地开发服务器
```bash
npm run dev
# 或
wrangler pages dev . --d1 DB=financial-freedom-db
```

### 3. 访问本地应用
- **主页**: http://localhost:8788
- **管理面板**: http://localhost:8788/admin.html

## 📊 数据管理

### 数据库操作命令
```bash
# 查看数据库列表
wrangler d1 list

# 查看数据表内容
wrangler d1 execute financial-freedom-db --command "SELECT * FROM financial_data ORDER BY year_month"

# 备份数据
wrangler d1 export financial-freedom-db --output backup.sql

# 删除所有数据（谨慎使用）
wrangler d1 execute financial-freedom-db --command "DELETE FROM financial_data"
```

### CSV 导入/导出
目前系统支持通过管理面板进行数据的增删改查。如需批量导入数据，可以：

1. 准备 CSV 数据，格式：`年月,总收入,总支出,累计资本,利率`
2. 通过管理面板逐条添加，或
3. 扩展 API 支持批量导入功能

## 🔐 安全配置

### 1. 强密码设置
确保 `ADMIN_PASSWORD` 是一个强密码，包含：
- 至少 12 位字符
- 大小写字母、数字、特殊字符

### 2. 域名绑定（可选）
在 Cloudflare Pages 设置中绑定自定义域名：
- **Custom domains** → **Set up a custom domain**

### 3. 访问控制（可选）
可以通过 Cloudflare Zero Trust 添加额外的访问控制。

## 🚨 故障排除

### 常见问题

#### 1. 数据库连接失败
- 检查 `wrangler.toml` 中的数据库 ID 是否正确
- 确认数据库绑定配置是否正确

#### 2. 管理面板登录失败
- 检查环境变量 `ADMIN_PASSWORD` 是否设置
- 确认密码输入正确

#### 3. 部署失败
- 检查 GitHub 仓库权限
- 确认 Cloudflare Pages 项目配置

#### 4. 数据加载失败 (HTTP 500 错误)
- 检查 D1 数据库是否正常运行
- 确认数据表是否已创建
- **如果是从旧版本升级**：点击管理面板中的"🔄 数据库迁移"按钮
- 检查数据库表结构是否包含 `investment_income` 字段

### 调试命令
```bash
# 查看部署日志
wrangler pages deployment list

# 查看函数日志
wrangler tail

# 测试 D1 连接
wrangler d1 execute financial-freedom-db --command "SELECT COUNT(*) FROM financial_data"
```

## 📈 功能特点

### 核心功能
- **三条曲线可视化**: 支出线、收入线、投资收入线
- **交叉点检测**: 自动检测财务自由交叉点
- **实时计算**: 月度投资收入自动计算
- **数据管理**: 完整的增删改查功能

### 技术特点
- **无服务器架构**: 基于 Cloudflare 边缘计算
- **全球加速**: CDN 加速，全球访问快速
- **数据安全**: D1 数据库多地备份
- **成本极低**: 免费额度足够个人使用

## 📝 更新日志

### v1.0.0
- ✅ 基础三线图表功能
- ✅ D1 数据库集成
- ✅ 管理面板
- ✅ 响应式设计
- ✅ 财务自由计算

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发规范
1. 使用 ES6+ 语法
2. 保持代码简洁易读
3. 添加必要的注释
4. 测试新功能

## 📄 许可证

MIT License - 详见 LICENSE 文件
