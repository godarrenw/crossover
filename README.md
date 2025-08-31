# 📈 财务自由挂图

基于《Your Money or Your Life》理念的财务自由追踪系统，使用 Cloudflare Pages + Functions + D1 数据库构建。

## ✨ 功能特点

### 🎯 核心功能
- **三条关键曲线可视化**
  - 🔴 月度总支出线 - 反映生活成本趋势
  - 🔵 月度总收入线 - 显示工作收入变化  
  - 🟢 月度投资收入线 - 基于累计资本×长期利率÷12自动计算

### 🔍 智能分析
- **交叉点检测** - 当投资收入超过支出时自动提醒财务自由达成
- **关键指标** - 累计储蓄、储蓄率、预计达到自由月数
- **实时计算** - 投资收入无需手动输入，系统自动计算

### 💼 数据管理
- **管理面板** - 完整的数据增删改查功能
- **云端存储** - 基于 Cloudflare D1 数据库，全球同步
- **安全认证** - 密码保护的管理界面

## 🏗️ 技术架构

- **前端**: 原生 HTML/CSS/JavaScript + Chart.js
- **后端**: Cloudflare Functions (无服务器)
- **数据库**: Cloudflare D1 (SQLite)
- **部署**: Cloudflare Pages (全球 CDN)

## 🚀 快速开始

### 1. 部署到 Cloudflare
详细部署步骤请参考 [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

### 2. 本地开发
```bash
# 克隆项目
git clone https://github.com/你的用户名/financial-freedom-chart.git
cd financial-freedom-chart

# 安装依赖
npm install

# 启动本地开发服务器
npm run dev

# 访问应用
# 主页: http://localhost:8788
# 管理面板: http://localhost:8788/admin.html
```

## 📊 使用说明

### 主界面功能
- **财务自由进度图** - 显示三条关键曲线的历史趋势
- **统计卡片** - 展示累计储蓄、储蓄率等关键指标
- **交叉点提醒** - 达到财务自由时显示祝贺动画

### 管理面板功能
1. **登录验证** - 使用管理密码登录
2. **数据管理** - 添加、编辑、删除财务记录
3. **统计预览** - 查看数据概况和趋势
4. **数据库初始化** - 一键创建表结构和示例数据

### 数据字段说明
- **年月** - 财务数据所属月份（YYYY-MM格式）
- **总收入** - 当月所有收入来源的总和
- **总支出** - 当月所有支出的总和
- **累计资本** - 到该月底的储蓄总额
- **长期利率** - 用于计算投资收入的年化利率（默认4%）

## 🎨 界面预览

### 主页面
- 渐变背景设计，现代化界面
- 响应式布局，支持移动端
- 交互式图表，支持数据点悬停查看

### 管理面板
- 清晰的表单设计
- 实时数据表格
- 统计数据卡片展示

## 💡 理论基础

本系统基于《Your Money or Your Life》一书的核心理念：

### 三条线的意义
1. **支出线** - 通过节俭降低生活成本，这条线会逐渐下降并稳定
2. **收入线** - 通过工作获得的主动收入，与支出线的差距是储蓄
3. **投资收入线** - 最关键的被动收入，当它超过支出线时就实现了财务自由

### 财务自由的定义
当月度投资收入 ≥ 月度支出时，您就达到了财务自由状态，可以选择不再为了金钱而工作。

## 🔒 安全性

- **密码保护** - 管理面板需要密码验证
- **HTTPS加密** - 所有数据传输加密
- **云端备份** - D1数据库自动多地备份
- **权限控制** - 读写权限分离

## 📱 浏览器支持

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ 移动端浏览器

## 🛠️ API 接口

### 数据接口
- `GET /api/financial-data` - 获取所有财务数据
- `POST /api/financial-data` - 创建新的财务记录
- `PUT /api/financial-data` - 更新财务记录
- `DELETE /api/financial-data` - 删除财务记录

### 管理接口
- `POST /api/admin` - 管理员登录验证
- `GET /api/admin` - 验证管理员token
- `POST /api/init` - 初始化数据库

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南
1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 《Your Money or Your Life》作者 Vicki Robin 和 Joe Dominguez
- [Chart.js](https://www.chartjs.org/) 图表库
- [Cloudflare](https://cloudflare.com/) 提供的优秀平台服务

## 📞 支持

如果您在使用过程中遇到问题，请：

1. 查看 [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) 部署指南
2. 搜索现有的 [Issues](https://github.com/你的用户名/financial-freedom-chart/issues)
3. 创建新的 Issue 描述问题

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
