"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";
import type { DailyPost } from "@/lib/markdown";

export default function DailyContent({
  post,
  prev,
  next,
}: {
  post: DailyPost;
  prev: string | null;
  next: string | null;
}) {
  return (
    <article>
      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:text-amber-400 transition-colors">
          首页
        </Link>
        <span className="mx-2">/</span>
        <span>{post.date}</span>
      </div>

      {/* Markdown Content */}
      <div className="prose prose-invert prose-zinc max-w-none prose-headings:text-white prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-blockquote:border-l-amber-400 prose-blockquote:text-zinc-300 prose-code:text-amber-300 prose-code:bg-zinc-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800 prose-table:border-zinc-700 prose-th:border-zinc-700 prose-td:border-zinc-700 prose-th:bg-zinc-900 prose-hr:border-zinc-800">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Prev / Next Navigation */}
      <nav className="mt-12 flex items-center justify-between border-t border-zinc-800 pt-6">
        {prev ? (
          <Link
            href={`/daily/${prev}`}
            className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
          >
            ← {prev}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/daily/${next}`}
            className="text-sm text-zinc-400 hover:text-amber-400 transition-colors"
          >
            {next} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
