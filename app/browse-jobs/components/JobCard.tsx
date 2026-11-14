"use client";

import { Banknote, Bookmark, Briefcase, MapPin } from "lucide-react";

import type { JobPosting } from "@/app/dashboard/recruiter/jobs/page";
import { formatLocation, formatSalary, jobTypeLabel } from "../lib";

type JobCardBadge = {
    label: string;
    className: string;
};

/**
 * "Hot Job" badge for listings with a lot of applicants — mirrors the
 * amber badge from the Figma design. Easy Apply is intentionally omitted
 * until the API exposes a matching field.
 */
function hotJobBadge(job: JobPosting): JobCardBadge | null {
    if (typeof job.applicants !== "number" || job.applicants < 100) return null;
    return {
        label: "Hot Job",
        className: "border-[#ffbd0e]/35 bg-[#ffbd0e]/15 text-[#ffbd0e]",
    };
}

function Pill({ icon: Icon, children }: { icon: typeof Banknote; children: React.ReactNode }) {
    return (
        <span className="inline-flex h-11 items-center gap-2 rounded-full border border-white/[0.14] bg-[#24242e] px-4 text-sm font-medium text-white">
            <Icon aria-hidden="true" className="size-4" />
            {children}
        </span>
    );
}

export function JobCard({ job }: { job: JobPosting }) {
    const badge = hotJobBadge(job);
    const initial = job.companyName.trim().charAt(0).toUpperCase();

    const handleSave = () => {
        console.log("Bookmark clicked:", job._id);
    };

    return (
        <article className="rounded-2xl border border-white/[0.08] bg-[#181820] p-6 transition-colors hover:border-white/20">
            <div className="flex items-start gap-4">
                <div
                    aria-hidden="true"
                    className="grid size-14 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-[#242430] text-lg font-semibold text-white"
                >
                    {initial}
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-semibold leading-snug text-white">{job.jobTitle}</h3>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-[#9c9cb0]">
                        <span>{job.companyName}</span>
                        <span className="inline-flex items-center gap-1 font-normal">
                            <MapPin aria-hidden="true" className="size-3.5" />
                            {formatLocation(job)}
                        </span>
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    aria-label={`Save ${job.jobTitle}`}
                    className="grid size-12 shrink-0 place-items-center rounded-lg text-[#9da3a5] transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                >
                    <Bookmark className="size-5" />
                </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
                <Pill icon={Banknote}>{formatSalary(job)}</Pill>
                <Pill icon={Briefcase}>{jobTypeLabel(job.jobType)}</Pill>
                {badge && (
                    <span
                        className={`inline-flex h-11 items-center rounded-full border px-4 text-sm font-medium ${badge.className}`}
                    >
                        {badge.label}
                    </span>
                )}
            </div>
        </article>
    );
}
