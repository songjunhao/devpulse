"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Link from "next/link";

export default function DailyContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // Custom link rendering (open external in new tab)
          a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith("http");
            return (
              <Link
                href={href || "#"}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                {...props}
              >
                {children}
              </Link>
            );
          },
          // Better table rendering with wrapper for overflow
          table: ({ children, ...props }) => (
            <div className="my-4 -mx-2 overflow-x-auto sm:mx-0">
              <table {...props}>{children}</table>
            </div>
          ),
          // Blockquote with better styling (already handled by CSS)
          blockquote: ({ children, ...props }) => (
            <blockquote {...props}>{children}</blockquote>
          ),
          // Code blocks
          pre: ({ children, ...props }) => (
            <pre {...props}>{children}</pre>
          ),
          // Inline headings with anchor
          h2: ({ children, ...props }) => (
            <h2 {...props}>{children}</h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 {...props}>{children}</h3>
          ),
          // Horizontal rule with glow
          hr: ({ ...props }) => (
            <hr {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
