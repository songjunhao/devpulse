# TASK: DevPulse Daily — MVP 开发

## 项目背景

DevPulse Daily 是一个面向中国独立开发者/出海创业者的每日 AI 商机情报站。
类似 BuilderPulse（https://github.com/BuilderPulse/BuilderPulse）但做了差异化。

## 当前状态

- Next.js 15 项目已初始化在 ~/workspace/devpulse（App Router + Tailwind + TypeScript）
- 已有 PRD 文档在 ~/workspace/devpulse-prd/PRD.md（请阅读参考）

## 需要完成的任务

### 1. 首页 (`src/app/page.tsx`)

设计一个简洁专业的首页，包含：
- 顶部 Hero 区域：项目名 "DevPulse Daily"、Slogan "今天该做什么赚钱？"、副标题说明
- 今日报告卡片（高亮最新一篇）
- 最近 7 天报告列表（日期 + 标题 + 一句话摘要）
- 底部：数据源说明（Hacker News · GitHub · Product Hunt · HuggingFace · Google Trends · Reddit）

设计风格：
- 深色主题（暗灰/黑色背景）
- 科技感但不花哨
- 参考 TechCrunch / The Verge 的内容站风格
- 移动端友好

### 2. 日报详情页 (`src/app/daily/[date]/page.tsx`)

- 从 `content/daily/` 目录读取 Markdown 文件
- 用 markdown 渲染（推荐 next-mdx-remote 或 react-markdown + remark-gfm）
- 支持代码块、表格、引用块、链接
- 顶部有返回首页导航
- 底部有"上一篇/下一篇"导航
- 生成静态页面（SSG，generateStaticParams）
- 好看的排版，中文友好

### 3. 日报内容 (`content/daily/2026-04-16.md`)

手动创建第一篇日报。内容来源参考 ~/workspace/BuilderPulse-workspace/zh/2026/2026-04-16.md，
但需要：
- 用自己的语言重新组织，不要直接复制
- 增加"中国出海者专区"部分（可以编几个有价值的出海相关洞察）
- 语气：专业但不无聊，像朋友聊天
- 每篇 3000-5000 字中文

日报 Markdown 结构模板：

```
# DevPulse 日报 — YYYY-MM-DD

> **今日三大信号：**
> 1. ...
> 2. ...
> 3. ...

数据源说明。更新于 XX:XX（北京时间）。

---

## 🔍 发现机会

### 1. 今日有哪些独立开发者发布新产品？
（产品名 + 创始人 + 数据 + 可借鉴点）

### 2. 哪些搜索词异常飙升？
（关键词 + 涨幅 + SEO 机会）

### 3. GitHub 上哪些高增长项目没有商业化？
（项目 + star + 变现路径）

### 4. 开发者在抱怨什么？
（被吐槽产品 + 替代机会）

---

## 📡 技术雷达

### 5. 大厂产品变动
### 6. 增长最快的开发者工具
### 7. HuggingFace 热门模型
### 8. Show HN 技术栈

---

## 📈 趋势判断

### 9. 关键词热度变化
### 10. VC / YC 关注方向
### 11. 新词雷达

---

## ⚡ 今日行动

### 🏆 最佳 2 小时 Build
### 💰 商业模式参考
### 🤔 最反直觉发现

---

## 🇨🇳 出海者专区

### 15. 出海圈热门讨论
### 16. 可复制的海外模式

---

*— DevPulse Daily · 每日 AI 商机情报*
```

### 4. 布局和全局样式

- `src/app/layout.tsx`: 全局布局，包含导航栏（Logo + 首页 + 归档 + RSS 图标）
- 导航栏固定顶部，半透明背景
- 字体：系统字体栈，中文用系统默认即可
- 全局深色主题配色（Tailwind dark mode）

### 5. 工具函数

- `src/lib/markdown.ts`: 读取和解析 content/daily/ 下的 Markdown 文件
  - `getAllDailySlugs()`: 返回所有日期 slug 列表
  - `getDailyContent(date)`: 读取指定日期的 Markdown 内容和 frontmatter
- `src/lib/types.ts`: TypeScript 类型定义

### 6. 其他

- `public/robots.txt`: 允许所有爬虫
- 不需要搜索、标签、趋势页（这些是后续 Phase）
- 确保 `npm run build` 能成功
- 响应式设计，移动端优先

## 技术要求

- Next.js 15 App Router (已初始化)
- Tailwind CSS v4 (已配置)
- TypeScript
- react-markdown + remark-gfm + rehype-raw 用于 Markdown 渲染
- SSG (generateStaticParams) 用于日报页
- 不要用 MDX，用纯 Markdown
- 不要引入任何 UI 组件库（自己写 Tailwind 样式）
- 内容放在 `content/daily/` 目录（项目根目录下，不在 src 里）

## 重要约束

- 中文内容，中文 UI
- 深色主题
- 移动端优先
- 快速加载（SSG 静态页面）
- npm run build 必须通过
