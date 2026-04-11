import { HugeiconsIcon } from "@hugeicons/react";
import { Github, Rss } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Profile } from "@/components/profile";
import { PostList } from "@/components/post-list";
import Pagination from "@/components/pagination";
import { getAllPosts } from "@/lib/posts-data";

const currentPage = parseInt("1", 10);

export default async function Page() {

    const allPosts = await getAllPosts();
    const totalPosts = allPosts.length;

    return (
        <div className="flex flex-col w-2xl max-w-4xl min-h-screen mx-auto bg-transparent text-zinc-200">
            <header className="relative z-10 flex justify-between items-center w-full p-6">
                <Link href="/" className="text-2xl font-semibold">
                    Future Skyline
                </Link>
                <nav className="flex items-center gap-6 text-zinc-200">
                    <Link href="/about">
                        About
                    </Link>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                    >
                        <HugeiconsIcon icon={Github} />
                    </a>
                    <a
                        href="/rss"
                        aria-label="RSS Feed"
                    >
                        <HugeiconsIcon icon={Rss} />
                    </a>
                </nav>
            </header>
            <main className="relative flex-1 flex flex-col w-full mx-auto p-4" >
                <Profile name="Ven XMetsa" description="A trading journal" avatarUrl="https://avatars.githubusercontent.com/u/217209011?v=4&size=128" />

                <section className="flex-1 flex flex-col w-full p-6">
                    <PostList postList={allPosts} />
                    <Pagination currPage={currentPage} totalPosts={totalPosts} />
                </section>
            </main>
            <footer className="flex justify-between items-center w-full gap-8 py-6 px-8 text-sm text-zinc-600 flex-wrap">
                <div>
                    © 2026 FUTURE SKYLINE
                </div>
                <div>
                    POWERED BY <a href="/">ZenKex</a>
                </div>
            </footer>
        </div>
    );
}
