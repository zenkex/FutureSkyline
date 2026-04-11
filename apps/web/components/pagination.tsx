import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChevronLeft, ChevronRight } from "@hugeicons/core-free-icons";

interface PaginationProps {
    currPage: number;
    totalPosts: number;
    postsPerPage?: number;
}

export default function Pagination({
    currPage,
    totalPosts,
    postsPerPage = 5
}: PaginationProps) {

    // 如果文章数量小于等于5，不显示分页器
    const totalPages: number = Math.ceil(totalPosts / postsPerPage);
    if (totalPages <= 1) {
        return null;
    }

    const pageNumberList = Array.from({ length: totalPages }, (_, idx) => idx + 1);
    return (
        <div className="flex-1 flex justify-between items-end pt-8">
            <Button variant="ghost" size="sm" className="hover:cursor-pointer">
                <HugeiconsIcon icon={ChevronLeft} />
                上一页
            </Button>

            <span className="text-sm">
                {currPage} / {totalPages}
            </span>

            <Button variant="ghost" size="sm" className="hover:cursor-pointer">
                <HugeiconsIcon icon={ChevronRight} />
                下一页
            </Button>
        </div>
    )
}