#!/usr/bin/env python3
"""
DevPulse Daily — 数据采集脚本
从 HN / GitHub / HuggingFace / Reddit 采集每日信号，输出 JSON。

用法:
  python scripts/collect_signals.py [--date 2026-04-17] [--output data/signals/YYYY-MM-DD.json]
"""

import argparse
import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone, timedelta
from pathlib import Path

import requests

# ── 代理设置 ──────────────────────────────────────────────
PROXY = os.environ.get("HTTPS_PROXY", os.environ.get("https_proxy", ""))
PROXIES = {"https": PROXY, "http": PROXY} if PROXY else {}

# ── 常量 ──────────────────────────────────────────────────
HN_API = "https://hacker-news.firebaseio.com/v0"
GH_API = "https://api.github.com"
HF_API = "https://huggingface.co/api"
REDDIT_SUBREDDITS = ["SaaS", "SideProject", "indiehackers"]
CST = timezone(timedelta(hours=8))

# ── HN 采集 ──────────────────────────────────────────────
def _fetch_hn_item(sid):
    """单个 HN item 并发获取"""
    try:
        item = requests.get(f"{HN_API}/item/{sid}.json", proxies=PROXIES, timeout=8).json()
        if not item:
            return None
        score = item.get("score", 0)
        entry = {
            "id": item["id"],
            "title": item.get("title", ""),
            "score": score,
            "descendants": item.get("descendants", 0),
            "by": item.get("by", ""),
            "url": item.get("url", ""),
            "hn_link": f"https://news.ycombinator.com/item?id={item['id']}",
            "time": datetime.fromtimestamp(item.get("time", 0), tz=CST).isoformat(),
        }
        return entry
    except Exception:
        return None


def collect_hn(max_stories=20, min_score=80):
    """采集 HN Top Stories + Show HN（并发加速）"""
    print(f"[HN] 采集 Top {max_stories} stories (score >= {min_score})...")
    
    results = {"top_stories": [], "show_hn": [], "ask_hn": []}
    
    try:
        ids = requests.get(f"{HN_API}/topstories.json", proxies=PROXIES, timeout=10).json()[:max_stories]
        
        # 并发获取所有 item
        entries = []
        with ThreadPoolExecutor(max_workers=10) as pool:
            futures = {pool.submit(_fetch_hn_item, sid): sid for sid in ids}
            for f in as_completed(futures, timeout=30):
                entry = f.result()
                if entry and entry["score"] >= min_score:
                    entries.append(entry)
        
        for entry in entries:
            if entry["title"].startswith("Show HN:"):
                results["show_hn"].append(entry)
            elif entry["title"].startswith("Ask HN:"):
                results["ask_hn"].append(entry)
            else:
                results["top_stories"].append(entry)
        
        # 按 score 排序
        for k in results:
            results[k].sort(key=lambda x: x["score"], reverse=True)
        
        print(f"[HN] Top: {len(results['top_stories'])}, Show HN: {len(results['show_hn'])}, Ask HN: {len(results['ask_hn'])}")
    except Exception as e:
        print(f"[HN] ❌ 错误: {e}")
    return results


# ── GitHub Trending 采集 ──────────────────────────────────
def collect_github_trending(since="daily", language=""):
    """采集 GitHub Trending Repos（通过 GitHub Search API）"""
    print(f"[GitHub] 采集 Trending repos (since={since})...")
    results = []
    
    try:
        # 用 GitHub Search API 模拟 trending
        # 按 stars 数排序，筛选最近创建或最近有更新的项目
        date_str = datetime.now(CST).strftime("%Y-%m-%d")
        
        headers = {"Accept": "application/vnd.github.v3+json"}
        # 查最近一周 stars 增长快的项目
        week_ago = (datetime.now(CST) - timedelta(days=7)).strftime("%Y-%m-%d")
        
        # 方法1: 最近创建的热门项目
        query1 = f"created:>{week_ago} stars:>100"
        r1 = requests.get(
            f"{GH_API}/search/repositories?q={query1}&sort=stars&order=desc&per_page=20",
            headers=headers, proxies=PROXIES, timeout=15
        )
        if r1.status_code == 200:
            for repo in r1.json().get("items", []):
                results.append({
                    "name": repo["full_name"],
                    "description": repo.get("description", ""),
                    "stars": repo["stargazers_count"],
                    "language": repo.get("language", ""),
                    "url": repo["html_url"],
                    "created_at": repo["created_at"],
                    "pushed_at": repo.get("pushed_at", ""),
                    "topics": repo.get("topics", []),
                    "fork": repo.get("fork", False),
                    "type": "new_hot",
                })
        
        # 方法2: 最近一周有大量 push 的热门项目（代表活跃度高）
        query2 = f"pushed:>{week_ago} stars:>5000"
        r2 = requests.get(
            f"{GH_API}/search/repositories?q={query2}&sort=stars&order=desc&per_page=15",
            headers=headers, proxies=PROXIES, timeout=15
        )
        if r2.status_code == 200:
            for repo in r2.json().get("items", []):
                results.append({
                    "name": repo["full_name"],
                    "description": repo.get("description", ""),
                    "stars": repo["stargazers_count"],
                    "language": repo.get("language", ""),
                    "url": repo["html_url"],
                    "created_at": repo["created_at"],
                    "pushed_at": repo.get("pushed_at", ""),
                    "topics": repo.get("topics", []),
                    "fork": repo.get("fork", False),
                    "type": "active_popular",
                })
        
        print(f"[GitHub] 采集到 {len(results)} 个项目")
    except Exception as e:
        print(f"[GitHub] ❌ 错误: {e}")
    return results


# ── HuggingFace Trending 采集 ──────────────────────────────
def collect_huggingface():
    """采集 HuggingFace Trending Models & Spaces"""
    print("[HuggingFace] 采集 Trending models & spaces...")
    results = {"models": [], "spaces": []}
    
    try:
        # Trending models
        r = requests.get(f"{HF_API}/models?sort=trending&limit=15", proxies=PROXIES, timeout=15)
        if r.status_code == 200:
            for m in r.json():
                results["models"].append({
                    "id": m.get("id", ""),
                    "author": m.get("author", ""),
                    "downloads": m.get("downloads", 0),
                    "likes": m.get("likes", 0),
                    "pipeline_tag": m.get("pipeline_tag", ""),
                    "tags": m.get("tags", [])[:10],
                    "url": f"https://huggingface.co/{m.get('id', '')}",
                })
    except Exception as e:
        print(f"[HF Models] ❌ 错误: {e}")
    
    try:
        # Trending spaces
        r = requests.get(f"{HF_API}/spaces?sort=trending&limit=10", proxies=PROXIES, timeout=15)
        if r.status_code == 200:
            for s in r.json():
                results["spaces"].append({
                    "id": s.get("id", ""),
                    "author": s.get("author", ""),
                    "likes": s.get("likes", 0),
                    "sdk": s.get("sdk", ""),
                    "url": f"https://huggingface.co/spaces/{s.get('id', '')}",
                })
    except Exception as e:
        print(f"[HF Spaces] ❌ 错误: {e}")
    
    print(f"[HF] Models: {len(results['models'])}, Spaces: {len(results['spaces'])}")
    return results


# ── Reddit 采集 ──────────────────────────────────────────
def collect_reddit(subreddits=None, limit=10):
    """采集 Reddit 热帖（通过 .json 后缀，无需 OAuth）"""
    subreddits = subreddits or REDDIT_SUBREDDITS
    print(f"[Reddit] 采集 {subreddits}...")
    results = {}
    
    headers = {"User-Agent": "DevPulse-Daily/1.0 (research bot)"}
    
    for sub in subreddits:
        results[sub] = []
        try:
            r = requests.get(
                f"https://www.reddit.com/r/{sub}/hot.json?limit={limit}",
                headers=headers, proxies=PROXIES, timeout=15
            )
            if r.status_code == 200:
                for post in r.json().get("data", {}).get("children", []):
                    d = post["data"]
                    results[sub].append({
                        "title": d["title"],
                        "score": d["score"],
                        "num_comments": d["num_comments"],
                        "author": d.get("author", ""),
                        "url": f"https://reddit.com{d['permalink']}",
                        "external_url": d.get("url", "") if d.get("url", "").startswith("http") else "",
                        "selftext": d.get("selftext", "")[:500],
                        "created_utc": datetime.fromtimestamp(d["created_utc"], tz=timezone.utc).isoformat(),
                        "link_flair_text": d.get("link_flair_text", ""),
                    })
            time.sleep(1)  # Reddit rate limit
        except Exception as e:
            print(f"[Reddit r/{sub}] ❌ 错误: {e}")
        
        print(f"[Reddit r/{sub}] {len(results[sub])} posts")
    
    return results


# ── 主流程 ──────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="DevPulse 数据采集")
    parser.add_argument("--date", default=None, help="日期 YYYY-MM-DD，默认今天")
    parser.add_argument("--output", default=None, help="输出文件路径")
    parser.add_argument("--sources", default="hn,github,hf,reddit", help="数据源，逗号分隔")
    args = parser.parse_args()
    
    # 日期
    date_str = args.date or datetime.now(CST).strftime("%Y-%m-%d")
    
    # 输出路径
    project_root = Path(__file__).parent.parent
    output_path = Path(args.output) if args.output else project_root / "data" / "signals" / f"{date_str}.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    sources = args.sources.split(",")
    
    print(f"=" * 60)
    print(f"DevPulse 数据采集 — {date_str}")
    print(f"数据源: {sources}")
    print(f"代理: {'✅ ' + PROXY if PROXY else '❌ 无'}")
    print(f"=" * 60)
    
    data = {
        "date": date_str,
        "collected_at": datetime.now(CST).isoformat(),
        "proxy_used": bool(PROXY),
        "signals": {},
    }
    
    if "hn" in sources:
        data["signals"]["hackernews"] = collect_hn()
    if "github" in sources:
        data["signals"]["github"] = collect_github_trending()
    if "hf" in sources:
        data["signals"]["huggingface"] = collect_huggingface()
    if "reddit" in sources:
        data["signals"]["reddit"] = collect_reddit()
    
    # 统计
    total_items = 0
    for source, items in data["signals"].items():
        if isinstance(items, list):
            total_items += len(items)
        elif isinstance(items, dict):
            for sub_items in items.values():
                if isinstance(sub_items, list):
                    total_items += len(sub_items)
    
    data["stats"] = {"total_items": total_items}
    
    # 保存
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    size_kb = output_path.stat().st_size / 1024
    print(f"\n✅ 采集完成! 共 {total_items} 条信号")
    print(f"📄 输出: {output_path} ({size_kb:.1f} KB)")


if __name__ == "__main__":
    main()
