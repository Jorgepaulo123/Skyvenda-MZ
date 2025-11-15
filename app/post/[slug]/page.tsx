import { redirect } from "next/navigation";

export default function PostBySlug({ params }: { params: { slug: string } }) {
  const { slug } = params;
  redirect(`/post?id=${encodeURIComponent(slug)}`);
}
