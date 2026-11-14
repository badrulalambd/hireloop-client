"use client";

import { Search } from "lucide-react";

/**
 * Full-width search panel: keyword input + "Search Jobs" submit button.
 * The submit handler only logs for now — wiring the query is left for later.
 */
export function SearchBar() {
    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const query = Object.fromEntries(new FormData(event.currentTarget));
        console.log("Search submitted:", query);
    };

    return (
        <section className="rounded-2xl border border-white/[0.08] bg-[#181820] px-6 py-9 md:px-8">
            <form
                onSubmit={handleSearch}
                className="flex flex-col items-stretch justify-center gap-6 md:flex-row md:gap-12"
            >
                <div className="relative w-full max-w-[1100px]">
                    <Search
                        aria-hidden="true"
                        className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-[#9da3a5]"
                    />
                    <input
                        type="search"
                        name="q"
                        aria-label="Search jobs"
                        placeholder="Search by job title, keywords..."
                        className="h-16 w-full appearance-none rounded-xl border border-white/[0.08] bg-[#24242e] pl-14 pr-5 text-base text-white outline-none transition-colors placeholder:text-[#c0c0d7] focus:border-white/25 md:h-[84px]"
                    />
                </div>
                <button
                    type="submit"
                    className="h-16 shrink-0 whitespace-nowrap rounded-xl bg-white px-6 text-base font-semibold text-[#3e4242] transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-[84px] md:w-40"
                >
                    Search Jobs
                </button>
            </form>
        </section>
    );
}
