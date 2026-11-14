"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

/** Static placeholder pages — replaced by real pagination once it is wired up. */
const PAGE_NUMBERS = [1, 2, 3];

export function Pagination() {
    const [page, setPage] = useState(1);

    const goToPage = (next: number) => {
        setPage(next);
        console.log("Page clicked:", next);
    };

    return (
        <nav aria-label="Job list pages" className="mt-8 flex items-center justify-center gap-2">
            <button
                type="button"
                onClick={() => goToPage(Math.max(1, page - 1))}
                aria-label="Previous page"
                className="grid size-11 place-items-center rounded-lg border border-white/[0.08] bg-[#181820] text-[#9c9cb0] transition-colors hover:bg-[#24242e] hover:text-white"
            >
                <ChevronLeft className="size-4" />
            </button>

            {PAGE_NUMBERS.map((number) => (
                <button
                    key={number}
                    type="button"
                    onClick={() => goToPage(number)}
                    aria-current={page === number ? "page" : undefined}
                    className={cn(
                        "grid size-11 place-items-center rounded-lg border text-sm font-medium transition-colors",
                        page === number
                            ? "border-white bg-white text-[#0e0e10]"
                            : "border-white/[0.08] bg-[#181820] text-[#9c9cb0] hover:bg-[#24242e] hover:text-white",
                    )}
                >
                    {number}
                </button>
            ))}

            <button
                type="button"
                onClick={() => goToPage(page + 1)}
                aria-label="Next page"
                className="grid size-11 place-items-center rounded-lg border border-white/[0.08] bg-[#181820] text-[#9c9cb0] transition-colors hover:bg-[#24242e] hover:text-white"
            >
                <ChevronRight className="size-4" />
            </button>
        </nav>
    );
}
