# DevPulse Daily — UI/UX 美化任务

## 目标
美化 DevPulse Daily 网站（中文 AI 商机情报站），使用 **UI-UX-Pro-Max Skill** 的设计建议，将当前的简单深色主题升级为专业、现代、有视觉冲击力的界面。

## 当前状态
- 技术栈：Next.js 15 (App Router) + Tailwind CSS 4 + TypeScript
- 当前主题：简单的 `bg-zinc-950` + `text-zinc-200` + `text-amber-400` 强调色
- 当前页面很朴素，缺少视觉层次感、动画、卡片效果

## 设计方向
使用 UI-UX-Pro-Max Skill 查询设计建议：
```bash
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "dark mode news blog SaaS" --domain style -n 3
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "news blog" --domain product -n 3
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "dark mode tech" --domain color -n 3
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "tech blog chinese" --domain typography -n 3
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "SaaS landing page" --domain landing -n 3
python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "nextjs" --stack nextjs
```

## 需要美化的文件

### 1. `app/globals.css` — 全局样式
当前只有 3 行。需要：
- 自定义 CSS 变量（设计 token）
- 更好的 typography 样式（中文优化）
- 滚动条样式
- 平滑过渡动画
- Prose/typography 插件的自定义样式

### 2. `app/layout.tsx` — 全局布局
- 升级导航栏：毛玻璃效果（backdrop-blur）、更好的导航项样式
- 添加渐变分割线
- Footer 升级

### 3. `app/page.tsx` — 首页
当前是简单的卡片列表。需要：
- Hero 区域：大标题 + 动态渐变文字效果 + 副标题 + 订阅提示
- 今日报告卡片：玻璃态（glassmorphism）效果，突出显示
- 历史报告列表：时间线样式或带日期标签的卡片
- 添加信号标签（signals tags）展示
- 微交互动画（hover 效果）

### 4. `app/daily/[date]/page.tsx` + `DailyContent.tsx` — 日报详情页
- 添加面包屑导航
- 更好的文章排版：行距、段落间距、引用块样式
- 代码块样式优化
- 表格样式优化
- 前后篇导航优化
- 添加文章元信息（日期、字数、阅读时间）

## 设计约束
- **必须保持**：静态导出（`output: "export"`）、Next.js 15 App Router
- **配色**：深色主题为主，可用渐变和发光效果增强
- **不用**：emoji 作为图标（用 SVG 或 Lucide Icons）
- **必须兼容**：移动端响应式
- **中文排版**：注意中文字符的行距和字体渲染
- **性能**：纯 CSS 动画，不引入重型 JS 动画库

## 新增依赖（可选）
如果需要图标：
```bash
npm install lucide-react
```

## 验证
完成后执行：
```bash
npm run build
```
确保构建成功，所有页面正常生成。

## 不要修改
- `lib/markdown.ts` — 内容读取逻辑
- `content/daily/*.md` — 日报内容文件
- `next.config.ts` — 配置文件
- `scripts/` — 自动化脚本
