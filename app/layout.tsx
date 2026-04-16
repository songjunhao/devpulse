import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevPulse Daily — 今天该做什么赚钱？",
  description:
    "面向独立开发者和出海创业者的每日 AI 商机情报。交叉分析 Hacker News、GitHub、Product Hunt、HuggingFace、Google Trends、Reddit，每天告诉你最值得做什么。",
  openGraph: {
    title: "DevPulse Daily",
    description: "每天告诉你最值得做什么",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "DevPulse Daily",
    description: "每天告诉你最值得做什么",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {/* Background Glow Blobs */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div
            className="glow-blob"
            style={{
              width: 600,
              height: 600,
              top: "-10%",
              right: "-10%",
              background: "var(--accent-amber)",
            }}
          />
          <div
            className="glow-blob"
            style={{
              width: 500,
              height: 500,
              bottom: "10%",
              left: "-5%",
              background: "var(--accent-purple)",
              animationDelay: "4s",
            }}
          />
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
            <a
              href="/"
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent-amber-dim)] text-[var(--accent-amber)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </span>
              <span>
                <span className="gradient-text">Dev</span>
                <span className="text-[var(--text-primary)]">Pulse</span>
              </span>
            </a>
            <div className="flex items-center gap-5 text-sm">
              <a
                href="/"
                className="text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                首页
              </a>
              <a
                href="/feed.xml"
                className="flex items-center gap-1.5 text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-amber)]"
                title="RSS 订阅"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="6.18" cy="17.82" r="2.18" />
                  <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
                </svg>
                <span className="hidden sm:inline">RSS</span>
              </a>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>

        {/* Footer */}
        <footer className="border-t border-[var(--border-subtle)] py-12">
          <div className="mx-auto max-w-5xl px-5">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <span className="font-medium text-[var(--text-secondary)]">DevPulse Daily</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                数据源：Hacker News · GitHub · Product Hunt · HuggingFace · Reddit
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                每日 AI 商机情报，让独立开发者不再盲目摸索
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
