#!/usr/bin/env python3
"""DevPulse 报告生成 — 读取采集数据，调用 LLM API 生成中文日报"""
import json
import sys
from pathlib import Path
from openai import OpenAI

DATE = sys.argv[1] if len(sys.argv) > 1 else "2026-04-17"
PROJECT = Path.home() / "workspace" / "devpulse"
SIGNALS_FILE = PROJECT / "data" / "signals" / f"{DATE}.json"
OUTPUT_FILE = PROJECT / "content" / "daily" / f"{DATE}.json"
REPORT_FILE = PROJECT / "content" / "daily" / f"{DATE}.md"

# API 配置（讯飞 MaaS）
CLIENT = OpenAI(
    api_key="3b2481d42a657554cebf7a1f37a35e98:MGI3N2E2ZmMxMDZiNjhlM2Y2NzI4YjMx",
    base_url="https://maas-coding-api.cn-huabei-1.xf-yun.com/v2"
)

def load_signals():
    with open(SIGNALS_FILE) as f:
        return json.load(f)

def load_reference():
    ref_file = PROJECT / "content" / "daily" / "2026-04-16.md"
    if ref_file.exists():
        with open(ref_file) as f:
            return f.read()[:3000]
    return ""

def build_signals_text(data):
    parts = []
    
    # HN
    hn = data["signals"]["hackernews"]
    parts.append("## Hacker News Top Stories")
    for s in hn["top_stories"]:
        parts.append(f"- [{s['score']}↑ {s['descendants']}💬] {s['title']}")
        if s.get("url"):
            parts.append(f"  Link: {s['url']}")
    if hn.get("show_hn"):
        parts.append("\n### Show HN")
        for s in hn["show_hn"]:
            parts.append(f"- [{s['score']}↑] {s['title']}")
    
    # GitHub
    gh = data["signals"]["github"]
    parts.append("\n## GitHub Trending Repos")
    for r in sorted(gh, key=lambda x: x["stars"], reverse=True)[:25]:
        desc = (r.get("description") or "")[:80]
        topics = ", ".join(r.get("topics", [])[:5])
        parts.append(f"- ⭐{r['stars']:,} {r['name']} — {desc}")
        parts.append(f"  Lang: {r.get('language', 'N/A')} | Topics: {topics}")
    
    # Reddit
    reddit = data["signals"]["reddit"]
    parts.append("\n## Reddit Hot Posts")
    for sub, posts in reddit.items():
        parts.append(f"\n### r/{sub}")
        for p in posts[:5]:
            parts.append(f"- [{p['score']}↑ {p['num_comments']}💬] {p['title']}")
            if p.get("selftext"):
                parts.append(f"  Preview: {p['selftext'][:200]}")
    
    return "\n".join(parts)

def build_prompt(signals_text, reference_style, date):
    return f"""你是 DevPulse Daily 的资深 AI 分析师，专注为中国独立开发者和出海创业者提供每日商机情报。

基于以下今日采集的真实数据，生成一篇高质量的中文日报。

## 参考风格（上一期日报开头）：
{reference_style}

---

## 今日采集数据（{date}）：

{signals_text}

---

## 生成要求：

1. **只使用上述真实数据**，不要编造任何数据。如果数据中有具体的点赞数、star数，必须如实引用。
2. 从数据中识别最有价值的 3 个信号，作为今日主题。
3. 每个小节必须从数据中提取具体案例，附上数据。
4. "最佳2小时Build"建议必须基于当日数据中的具体信号，给出具体的项目名称、技术栈、变现路径。
5. 目标长度 3000-5000 字中文。

## 输出格式（严格遵循 YAML frontmatter + Markdown）：

```
---
title: "用一句话概括今日三大核心主题"
summary: "最值得关注的信号 + 最值得做的行动建议"
signals:
  - "信号1一句话"
  - "信号2一句话"
  - "信号3一句话"
---

# DevPulse 日报 — {date}

> **今日三大信号：**
> 1. [信号1含具体数据]
> 2. [信号2含具体数据]
> 3. [信号3含具体数据]

交叉参考 Hacker News、GitHub、Reddit。更新于 10:00（北京时间）。

---

## 🔍 发现机会

### 1. 今日有哪些独立开发者发布新产品？
### 2. GitHub 上哪些高增长项目还没人做商业化？
### 3. 开发者在抱怨什么？（痛点即需求）

---

## 📡 技术雷达

### 4. 大厂产品有什么变动？
### 5. 值得关注的新开源项目

---

## 🏆 竞争情报

### 6. 独立开发者在聊什么收入/定价话题？

---

## ⚡ 今日行动

### 🏆 最佳 2 小时 Build：[具体项目建议]
### 💰 商业模式参考
### 🤔 今日最反直觉发现

---

*— DevPulse Daily · 每日 AI 商机情报*
```

请直接输出完整的 Markdown 报告内容（包含 YAML frontmatter），不要加任何解释。"""

def generate_report(prompt):
    response = CLIENT.chat.completions.create(
        model="astron-code-latest",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=8000,
        temperature=0.7,
    )
    return response.choices[0].message.content

def main():
    print(f"=== DevPulse 报告生成 — {DATE} ===")
    
    # Load data
    print("1. 加载采集数据...")
    data = load_signals()
    reference = load_reference()
    print(f"   数据源: {list(data['signals'].keys())}")
    
    # Build signals text
    print("2. 构建信号摘要...")
    signals_text = build_signals_text(data)
    print(f"   信号文本: {len(signals_text)} chars")
    
    # Build prompt
    print("3. 构建 LLM Prompt...")
    prompt = build_prompt(signals_text, reference, DATE)
    print(f"   Prompt: {len(prompt)} chars")
    
    # Generate
    print("4. 调用 LLM API 生成报告...")
    report = generate_report(prompt)
    print(f"   生成报告: {len(report)} chars")
    
    # Clean up potential markdown code blocks wrapper
    if report.startswith("```"):
        lines = report.split("\n")
        report = "\n".join(lines[1:])  # Remove opening ```
        if report.endswith("```"):
            report = report[:-3].rstrip()
    
    # Ensure frontmatter
    if not report.startswith("---"):
        print("   ⚠️ 报告缺少 YAML frontmatter，尝试修复...")
        report = "---\ntitle: \"DevPulse 日报\"\n---\n\n" + report
    
    # Write
    REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        f.write(report)
    
    print(f"\n✅ 报告已写入: {REPORT_FILE}")
    print(f"   文件大小: {REPORT_FILE.stat().st_size / 1024:.1f} KB")
    print(f"\n=== 预览 (前 500 字) ===")
    print(report[:500])

if __name__ == "__main__":
    main()
