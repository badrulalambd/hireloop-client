import React from "react";

import { getBrowseJobs } from "@/lib/api/jobs";
import { JobPosting } from "../dashboard/recruiter/jobs/page";
import { SearchBar } from "./components/SearchBar";
import { FilterSidebar } from "./components/FilterSidebar";
import { SortSelect } from "./components/SortSelect";
import { JobCard } from "./components/JobCard";
import { Pagination } from "./components/Pagination";
import { buildFilterCounts } from "./lib";

const BrowseJobsPage = async ({ searchParams }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const search = await searchParams;
    console.log("SearchParams: ", search);
    const urlSearch = new URLSearchParams(search as Record<string, string>);
    const query = urlSearch.toString();
    console.log("SearchParams Query: ", query);
    const jobs = await getBrowseJobs(query);
    console.log("Jobs after filter: ", jobs);

    const counts = buildFilterCounts(jobs);

    return (
        <div className="min-h-screen bg-[#0c0c0c]">
            <div className="mx-auto w-full max-w-[1856px] px-4 py-8 sm:px-8">
                <SearchBar />

                <div className="mt-6 grid gap-8 lg:grid-cols-[336px_minmax(0,1fr)] lg:gap-16">
                    <FilterSidebar counts={counts} />

                    <section aria-label="Job results" className="min-w-0">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h2 className="text-2xl font-semibold text-white">
                                Found {jobs.length} Professional Jobs
                            </h2>
                            <div className="flex items-center gap-3">
                                <label
                                    htmlFor="job-sort"
                                    className="text-sm font-medium text-[#9c9cb0]"
                                >
                                    Sort by:
                                </label>
                                <SortSelect />
                            </div>
                        </div>

                        {jobs.length > 0 ? (
                            <div className="mt-6 flex flex-col gap-6">
                                {jobs.map((job: JobPosting) => (
                                    <JobCard key={job._id} job={job} />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#181820] p-12 text-center">
                                <p className="text-base font-medium text-white">No jobs found</p>
                                <p className="mt-2 text-sm text-[#9c9cb0]">
                                    Try adjusting your search or filters.
                                </p>
                            </div>
                        )}

                        <Pagination />
                    </section>
                </div>
            </div>
        </div>
    );
};

export default BrowseJobsPage;
