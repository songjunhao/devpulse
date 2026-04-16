import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content/daily");

export interface DailyPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  signals: string[];
  content: string;
}

export function getAllDailySlugs(): string[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
    .sort()
    .reverse();
}

export function getDailyPost(slug: string): DailyPost | null {
  const filePath = path.join(contentDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);

  return {
    slug,
    title: data.title || `DevPulse 日报 — ${slug}`,
    date: slug,
    summary: data.summary || "",
    signals: data.signals || [],
    content,
  };
}

export function getAllPosts(): DailyPost[] {
  return getAllDailySlugs()
    .map((slug) => getDailyPost(slug))
    .filter((p): p is DailyPost => p !== null);
}
