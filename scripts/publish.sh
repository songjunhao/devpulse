#!/usr/bin/env bash
# DevPulse Daily — 发布脚本
# 构建 → 部署 → Git 推送
#
# 用法:
#   bash scripts/publish.sh [--date 2026-04-17] [--skip-deploy] [--skip-push]

set -euo pipefail

# 解析参数
DATE=""
SKIP_DEPLOY=false
SKIP_PUSH=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --date) DATE="$2"; shift 2 ;;
    --skip-deploy) SKIP_DEPLOY=true; shift ;;
    --skip-push) SKIP_PUSH=true; shift ;;
    *) echo "未知参数: $1"; exit 1 ;;
  esac
done

DATE="${DATE:-$(TZ=Asia/Shanghai date +%Y-%m-%d)}"
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$PROJECT_ROOT"

echo "=========================================="
echo "DevPulse 发布 — $DATE"
echo "项目目录: $PROJECT_ROOT"
echo "=========================================="

# 1. 检查日报文件是否存在
REPORT="content/daily/${DATE}.md"
if [[ ! -f "$REPORT" ]]; then
  echo "❌ 日报文件不存在: $REPORT"
  exit 1
fi

WORD_COUNT=$(wc -c < "$REPORT")
echo "📄 日报文件: $REPORT ($WORD_COUNT bytes)"

# 2. 构建静态站
echo ""
echo "🔨 构建 Next.js 静态站..."
npm run build 2>&1 | tail -20

if [[ $? -ne 0 ]]; then
  echo "❌ 构建失败"
  exit 1
fi
echo "✅ 构建成功"

# 3. 部署到 Vercel
if [[ "$SKIP_DEPLOY" == "false" ]]; then
  echo ""
  echo "🚀 部署到 Vercel..."
  npx vercel deploy --prod --yes 2>&1 | tail -10
  if [[ $? -ne 0 ]]; then
    echo "⚠️ Vercel 部署可能失败（可能触发限流）"
    echo "可稍后手动部署: cd $PROJECT_ROOT && npx vercel deploy --prod"
  fi
  echo "✅ 部署完成"
else
  echo "⏭️ 跳过 Vercel 部署"
fi

# 4. Git 提交 & 推送
if [[ "$SKIP_PUSH" == "false" ]]; then
  echo ""
  echo "📦 Git 提交 & 推送..."
  git add -A
  CHANGED=$(git diff --cached --name-only | head -20)
  if [[ -z "$CHANGED" ]]; then
    echo "ℹ️ 没有文件变更，跳过提交"
  else
    echo "变更文件:"
    echo "$CHANGED"
    git commit -m "📰 Daily: ${DATE}" --allow-empty
    git push origin main 2>&1 | tail -5
    echo "✅ 推送完成"
  fi
else
  echo "⏭️ 跳过 Git 推送"
fi

echo ""
echo "=========================================="
echo "🎉 DevPulse $DATE 发布完成!"
echo "=========================================="
