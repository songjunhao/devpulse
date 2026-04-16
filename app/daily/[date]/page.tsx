import { notFound } from "next/navigation";
import { getAllDailySlugs, getDailyPost } from "@/lib/markdown";
import DailyContent from "./DailyContent";

export function generateStaticParams() {
  return getAllDailySlugs().map((slug) => ({ date: slug }));
}

export function generateMetadata({ params }: { params: Promise<{ date: string }> }) {
  // Next.js 15 requires awaiting params
  return params.then(({ date }) => {
    const post = getDailyPost(date);
    if (!post) return { title: "未找到" };
    return {
      title: `${post.title} — DevPulse Daily`,
      description: post.summary || `DevPulse ${date} 日报`,
    };
  });
}

export default async function DailyPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const post = getDailyPost(date);
  if (!post) notFound();

  const slugs = getAllDailySlugs();
  const idx = slugs.indexOf(date);
  const prev = idx < slugs.length - 1 ? slugs[idx + 1] : null;
  const next = idx > 0 ? slugs[idx - 1] : null;

  return <DailyContent post={post} prev={prev} next={next} />;
}
