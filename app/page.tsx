import { getAllPosts } from "@/lib/markdown";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();
  const latest = posts[0];
  const recent = posts.slice(0, 7);

  return (
    <div className="space-y-12">
      {/* ── Hero Section ────────────────────────── */}
      <section className="relative pb-4 pt-8 text-center sm:pt-16">
        {/* Decorative line */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--accent-amber)]" />
          <span className="text-xs font-medium uppercase tracking-widest text-[var(--accent-amber)]">
            Daily Intelligence
          </span>
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--accent-amber)]" />
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          <span className="text-[var(--text-primary)]">今天该做</span>
          <br className="sm:hidden" />
          <span className="gradient-text">什么赚钱？</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
          面向中国独立开发者和出海创业者的每日 AI 商机情报。
          <br />
          交叉分析 Hacker News、GitHub、Reddit，每天告诉你最值得做什么。
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          {latest && (
            <Link
              href={`/daily/${latest.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-amber)] px-6 py-3 text-sm font-semibold text-[var(--bg-deep)] transition-all hover:shadow-[var(--glow-amber)] hover:scale-105"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              今日报告
            </Link>
          )}
          <span className="text-xs text-[var(--text-muted)]">
            每日 10:00 更新 · 完全免费
          </span>
        </div>
      </section>

      {/* ── Latest Report Card ──────────────────── */}
      {latest && (
        <section className="animate-fade-in">
          <Link href={`/daily/${latest.slug}`} className="block">
            <div className="glass-card relative overflow-hidden p-6 sm:p-8">
              {/* Accent glow */}
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--accent-amber)] opacity-[0.04] blur-3xl" />

              <div className="relative">
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-amber-dim)] px-3 py-1 text-xs font-semibold text-[var(--accent-amber)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-amber)] animate-pulse-glow" />
                    最新
                  </span>
                  <span className="text-sm text-[var(--text-muted)]">
                    {latest.slug}
                  </span>
                </div>

                <h2 className="text-xl font-bold leading-snug text-[var(--text-primary)] sm:text-2xl">
                  {latest.title}
                </h2>

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                  {latest.summary}
                </p>

                {latest.signals && latest.signals.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {latest.signals.slice(0, 3).map((s: string, i: number) => (
                      <span key={i} className="signal-tag">
                        {s.length > 40 ? s.slice(0, 40) + "…" : s}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[var(--accent-amber)]">
                  阅读完整报告
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── Recent Reports ──────────────────────── */}
      {recent.length > 1 && (
        <section>
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              近期报告
            </h2>
            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>

          <div className="space-y-3">
            {recent.slice(1).map((post, i) => (
              <Link
                key={post.slug}
                href={`/daily/${post.slug}`}
                className="group block animate-fade-in"
                style={{ animationDelay: `${(i + 1) * 100}ms` }}
              >
                <div className="flex items-start gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 transition-all hover:border-[var(--border-accent)] hover:bg-[var(--bg-card)] sm:p-5">
                  {/* Date badge */}
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-[var(--bg-card)] text-center">
                    <span className="text-lg font-bold leading-none text-[var(--accent-amber)]">
                      {post.slug.split("-").pop()}
                    </span>
                    <span className="mt-0.5 text-[10px] text-[var(--text-muted)]">
                      {post.slug.slice(5, 7)}月
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-amber)] sm:text-base">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-[var(--text-muted)] sm:text-sm">
                      {post.summary}
                    </p>
                  </div>

                  <svg
                    className="mt-1 h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--accent-amber)]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Empty State ─────────────────────────── */}
      {posts.length === 0 && (
        <section className="py-20 text-center">
          <p className="text-[var(--text-muted)]">暂无报告，请明天再来。</p>
        </section>
      )}
    </div>
  );
}
