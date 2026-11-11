"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Briefcase,
    ChartColumn,
    MapPin,
    Search,
    Star,
    Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const trendingPositions = [
    "Product Designer",
    "AI Engineering",
    "Dev-ops Engineer",
];

const stats = [
    { icon: Briefcase, value: "50K", label: "Active Jobs" },
    { icon: ChartColumn, value: "12K", label: "Companies" },
    { icon: Users, value: "2M", label: "Job Seekers" },
    { icon: Star, value: "97%", label: "Satisfaction Rate" },
];

const Banner = () => {
    const [query, setQuery] = useState("");
    const [location, setLocation] = useState("");

    return (
        <section className="relative isolate w-full overflow-hidden bg-[#0a0a0b] text-white">
            {/* Soft spotlight glow at the very top */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[45vw] bg-[radial-gradient(65%_100%_at_50%_0%,rgba(148,163,184,0.13),transparent_75%)]"
            />

            {/* Planet backdrop: the wrapper crops the pink nebula away so only
                the star field, violet halo and dark globe remain */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-[45%] bottom-0 overflow-hidden md:top-[36%] lg:top-[28vw]"
            >
                <Image
                    src="/images/globe.png"
                    alt=""
                    width={1440}
                    height={1882}
                    priority
                    sizes="80vw"
                    className="absolute left-1/2 top-[-30vw] h-auto w-[80vw] max-w-none -translate-x-1/2"
                />
            </div>

            {/* Vignette that melts the planet edges into the page background */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_55%_at_50%_72%,transparent_55%,#0a0a0b_100%)]"
            />
            {/* Bottom fade so the planet dissolves into the page background */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%] bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/70 to-transparent"
            />

            <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-24 pt-24 sm:px-6 sm:pt-32 md:pt-40 md:pb-32 lg:px-14">
                <div className="flex flex-col items-center text-center">
                    {/* Badge */}
                    <div className="flex items-center gap-0">
                        <span
                            aria-hidden
                            className="hidden h-px w-24 bg-gradient-to-r from-transparent to-white/25 sm:block md:w-32"
                        />
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 font-mono text-[0.7rem] uppercase tracking-wider text-zinc-400 shadow-sm sm:px-4">
                            <Briefcase className="size-3.5 shrink-0 text-orange-400" />
                            <span className="font-bold text-white">
                                50,000+
                            </span>
                            <span>New jobs this month</span>
                        </span>
                        <span
                            aria-hidden
                            className="hidden h-px w-24 bg-gradient-to-l from-transparent to-white/25 sm:block md:w-32"
                        />
                    </div>

                    {/* Heading */}
                    <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-[52px]">
                        Find Your Dream Job Today
                    </h1>
                    <p className="mt-6 max-w-[640px] text-base leading-relaxed text-zinc-400">
                        HireLoop connects top talent with world-class
                        companies. Browse thousands of curated opportunities and
                        land your next role &mdash; faster.
                    </p>

                    {/* Search form */}
                    <form
                        onSubmit={(event) => event.preventDefault()}
                        role="search"
                        className="mt-14 flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-white/10 bg-[#17171a]/90 p-3 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur sm:flex-row sm:items-center"
                    >
                        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 transition-colors focus-within:bg-white/5">
                            <Search
                                aria-hidden
                                className="size-4 shrink-0 text-zinc-500"
                            />
                            <Input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Job title, skill or company"
                                aria-label="Job title, skill or company"
                                className="h-10 min-w-0 flex-1 border-0 bg-transparent px-0 text-sm text-white shadow-none outline-none placeholder:text-zinc-500 focus-visible:border-0 focus-visible:ring-0 dark:bg-input/0"
                            />
                        </div>

                        <span
                            aria-hidden
                            className="hidden h-7 w-px bg-white/10 sm:block"
                        />

                        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 transition-colors focus-within:bg-white/5">
                            <MapPin
                                aria-hidden
                                className="size-4 shrink-0 text-zinc-500"
                            />
                            <Input
                                value={location}
                                onChange={(event) =>
                                    setLocation(event.target.value)
                                }
                                placeholder="Location or Remote"
                                aria-label="Location or Remote"
                                className="h-10 min-w-0 flex-1 border-0 bg-transparent px-0 text-sm text-white shadow-none outline-none placeholder:text-zinc-500 focus-visible:border-0 focus-visible:ring-0 dark:bg-input/0"
                            />
                        </div>

                        <Button
                            type="submit"
                            aria-label="Search jobs"
                            className="h-10 w-full shrink-0 rounded-xl bg-indigo-500 text-white hover:bg-indigo-400 sm:size-10 sm:px-0"
                        >
                            <Search className="size-4" />
                        </Button>
                    </form>

                    {/* Trending positions */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                        <span className="text-sm text-zinc-500">
                            Trending Position
                        </span>
                        {trendingPositions.map((position) => (
                            <button
                                key={position}
                                type="button"
                                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                            >
                                {position}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Overlay copy + stats on top of the planet */}
                <div className="relative mt-16 sm:mt-24 md:mt-40">
                    <p className="relative z-10 mx-auto max-w-xl px-2 pt-36 text-center text-2xl font-medium leading-snug text-white/85 sm:pt-44 sm:text-3xl md:pt-60 md:text-[2.2rem]">
                        Assisting over{" "}
                        <span className="font-semibold text-white">
                            15,000
                        </span>{" "}
                        job seekers find their dream positions.
                    </p>

                    <div className="relative z-10 mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        {stats.map(({ icon: Icon, value, label }) => (
                            <div
                                key={label}
                                className="flex flex-col rounded-2xl border border-white/10 bg-[#141416]/95 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur sm:p-8 md:min-h-64"
                            >
                                <Icon
                                    aria-hidden
                                    className="size-6 shrink-0 text-zinc-300"
                                />
                                <p className="mt-14 text-4xl font-semibold tracking-tight text-white sm:mt-16 sm:text-5xl md:leading-none">
                                    {value}
                                </p>
                                <p className="mt-2.5 text-sm text-zinc-400">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
