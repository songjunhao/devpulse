import { getAllPosts } from "@/lib/markdown";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();
  const latest = posts[0];
  const rest = posts.slice(1, 7);

  return (
    <div>
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          DevPulse <span className="text-amber-400">Daily</span>
        </h1>
        <p className="mt-3 text-xl text-zinc-400">今天该做什么赚钱？</p>
        <p className="mt-2 text-sm text-zinc-500">
          每日 AI 商机情报 · 交叉分析 6 大平台 300+ 信号 · 告诉你最值得做什么
        </p>
      </section>

      {/* Latest Report */}
      {latest && (
        <section className="mb-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-400">
            📰 今日报告
          </h2>
          <Link href={`/daily/${latest.slug}`}>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-amber-500/50 hover:bg-zinc-900/80">
              <p className="text-sm text-zinc-500">{latest.date}</p>
              <h3 className="mt-1 text-xl font-bold text-white">
                {latest.title}
              </h3>
              {latest.summary && (
                <p className="mt-2 text-zinc-400">{latest.summary}</p>
              )}
              {latest.signals.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {latest.signals.map((s, i) => (
                    <li key={i} className="text-sm text-zinc-300">
                      <span className="text-amber-400">{i + 1}.</span> {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Link>
        </section>
      )}

      {/* Recent Reports */}
      {rest.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
            📅 最近 7 天
          </h2>
          <div className="space-y-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/daily/${post.slug}`}>
                <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-5 py-4 transition-colors hover:border-zinc-700 hover:bg-zinc-900">
                  <div>
                    <h3 className="font-medium text-white">{post.title}</h3>
                    {post.summary && (
                      <p className="mt-1 text-sm text-zinc-500 line-clamp-1">
                        {post.summary}
                      </p>
                    )}
                  </div>
                  <span className="ml-4 shrink-0 text-sm text-zinc-500">
                    {post.date}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="py-20 text-center text-zinc-500">
          <p className="text-4xl">🚀</p>
          <p className="mt-4 text-lg">第一篇日报即将上线...</p>
        </div>
      )}
    </div>
  );
}
