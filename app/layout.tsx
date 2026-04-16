import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevPulse Daily — 今天该做什么赚钱？",
  description:
    "面向独立开发者和出海创业者的每日 AI 商机情报。交叉分析 Hacker News、GitHub、Product Hunt、HuggingFace、Google Trends、Reddit，每天告诉你最值得做什么。",
  metadataBase: new URL("https://devpulse.cc"),
  openGraph: {
    title: "DevPulse Daily",
    description: "每天告诉你最值得做什么",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-zinc-950 text-zinc-200 antialiased">
        <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
            <a href="/" className="text-lg font-bold tracking-tight text-white">
              <span className="text-amber-400">⚡</span> DevPulse
            </a>
            <div className="flex items-center gap-6 text-sm text-zinc-400">
              <a href="/" className="hover:text-white transition-colors">
                首页
              </a>
              <a href="/feed.xml" className="hover:text-white transition-colors" title="RSS">
                <svg className="inline h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="6.18" cy="17.82" r="2.18" />
                  <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
                </svg>
              </a>
            </div>
          </div>
        </nav>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
          <p>
            DevPulse Daily · 数据源：Hacker News · GitHub · Product Hunt ·
            HuggingFace · Google Trends · Reddit
          </p>
          <p className="mt-1">每日 AI 商机情报，让独立开发者不再盲目摸索</p>
        </footer>
      </body>
    </html>
  );
}
