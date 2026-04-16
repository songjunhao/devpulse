import { notFound } from "next/navigation";
import { getAllDailySlugs, getDailyPost } from "@/lib/markdown";
import DailyContent from "./DailyContent";
import Link from "next/link";

export function generateStaticParams() {
  return getAllDailySlugs().map((slug) => ({ date: slug }));
}

export function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  // Next.js 15: params is a Promise
  return params.then(({ date }) => {
    const post = getDailyPost(date);
    if (!post) return { title: "DevPulse Daily" };
    return {
      title: `${post.title} — DevPulse Daily`,
      description: post.summary,
    };
  });
}

export default async function DailyPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const post = getDailyPost(date);
  if (!post) notFound();

  const allSlugs = getAllDailySlugs();
  const idx = allSlugs.indexOf(date);
  const prevSlug = idx < allSlugs.length - 1 ? allSlugs[idx + 1] : null;
  const nextSlug = idx > 0 ? allSlugs[idx - 1] : null;

  // Calculate reading time (Chinese ~400 chars/min)
  const charCount = post.content.length;
  const readingMin = Math.max(1, Math.ceil(charCount / 400));

  return (
    <article className="animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link href="/" className="transition-colors hover:text-[var(--accent-amber)]">
          首页
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
        <span className="text-[var(--text-secondary)]">{date}</span>
      </nav>

      {/* Meta info bar */}
      <div className="mb-8 flex flex-wrap items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {date}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[var(--text-muted)]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {readingMin} 分钟阅读
        </span>
        <span className="text-[var(--text-muted)]">
          {charCount.toLocaleString()} 字
        </span>
      </div>

      {/* Article Content */}
      <div className="glass-card p-6 sm:p-10">
        <DailyContent content={post.content} />
      </div>

      {/* Navigation */}
      <nav className="mt-10 grid grid-cols-2 gap-4">
        {prevSlug ? (
          <Link
            href={`/daily/${prevSlug}`}
            className="group flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 transition-all hover:border-[var(--border-accent)]"
          >
            <span className="mb-1 text-xs text-[var(--text-muted)]">上一篇</span>
            <span className="text-sm font-medium text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-amber)]">
              {prevSlug}
            </span>
          </Link>
        ) : (
          <div />
        )}
        {nextSlug ? (
          <Link
            href={`/daily/${nextSlug}`}
            className="group flex flex-col items-end rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 text-right transition-all hover:border-[var(--border-accent)]"
          >
            <span className="mb-1 text-xs text-[var(--text-muted)]">下一篇</span>
            <span className="text-sm font-medium text-[var(--text-secondary)] transition-colors group-hover:text-[var(--accent-amber)]">
              {nextSlug}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </article>
  );
}
