import Link from "next/link";

interface Post {
    slug: string;
    title: string;
    date: string;
}

interface PostListProps {
    postList: Post[];
}

export function PostList({ postList }: PostListProps) {

    if (!postList || postList.length === 0) {
        return <div className="text-center text-zinc-500 py-12">暂无文章</div>;
    }

    return (
        <div className="space-y-8">
            {postList.map((post) => (
                <article key={post.slug}>
                    <Link href={`${post.slug}`} className="block">
                        <h2 className="text-2xl">{post.title}</h2>
                        <time className="block mt-1 text-lg text-zinc-500">{post.date}</time>
                    </Link>
                </article>
            ))}
        </div>
    )
}
