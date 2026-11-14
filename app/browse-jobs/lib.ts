import type { JobPosting } from "@/app/dashboard/recruiter/jobs/page";
import type { SalaryFrequency } from "@/type/types";

/* ------------------------------------------------------------------ */
/*  Filter option lists — important common fields of JobPosting        */
/* ------------------------------------------------------------------ */

export const JOB_TYPE_OPTIONS = [
    { id: "full-time", label: "Full-time" },
    { id: "part-time", label: "Part-time" },
    { id: "contract", label: "Contract" },
    { id: "internship", label: "Internship" },
] as const;

/* Same list the add-job form posts, so every stored category is filterable. */
export const JOB_CATEGORY_OPTIONS = [
    "Engineering & Tech",
    "Design & Creative",
    "Infrastructure",
    "Marketing",
    "Quality",
    "Sales",
    "Finance",
    "Operations",
    "Customer Support",
].map((label) => ({ id: label, label }));

export const SALARY_RANGES = [
    { id: "under-50", label: "Under $50k", min: 0, max: 50_000 },
    { id: "50-100", label: "$50k – $100k", min: 50_000, max: 100_000 },
    { id: "100-150", label: "$100k – $150k", min: 100_000, max: 150_000 },
    { id: "150-plus", label: "$150k+", min: 150_000, max: Infinity },
] as const;

export const SORT_OPTIONS = [
    { id: "recent", label: "Most Recent" },
    { id: "salary", label: "Highest Salary" },
    { id: "relevant", label: "Most Relevant" },
    { id: "oldest", label: "Oldest" },
] as const;

/** Number of location rows shown before the list is cut off. */
const MAX_LOCATION_OPTIONS = 6;

/* ------------------------------------------------------------------ */
/*  Display helpers                                                    */
/* ------------------------------------------------------------------ */

const TYPE_LABELS: Record<string, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
};

const FREQUENCY_SUFFIX: Record<SalaryFrequency, string> = {
    "per hour": "hr",
    "per day": "day",
    "per week": "wk",
    "per month": "mo",
    "per year": "yr",
};

export function jobTypeLabel(jobType: string): string {
    return TYPE_LABELS[jobType] ?? jobType;
}

/** 90000 -> "90k", 25 -> "25" */
function compactSalary(value: number): string {
    return value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`;
}

/** "25 – 40 / hr", "90k – 115k / yr" (same format as the manage-jobs table) */
export function formatSalary(job: JobPosting): string {
    const suffix = FREQUENCY_SUFFIX[job.salaryFrequency] ?? "";
    const min = compactSalary(job.minSalary);
    const max = job.maxSalary != null ? compactSalary(job.maxSalary) : null;
    return max ? `${min} – ${max} / ${suffix}` : `${min} / ${suffix}`;
}

/** "San Francisco, CA (Remote)" when the job is remote, otherwise plain location */
export function formatLocation(job: JobPosting): string {
    return job.isRemote ? `${job.location} (Remote)` : job.location;
}

/* ------------------------------------------------------------------ */
/*  Counts for the sidebar (display only — no filtering is applied)    */
/* ------------------------------------------------------------------ */

export type FilterCounts = {
    types: Record<string, number>;
    categories: Record<string, number>;
    locations: Record<string, number>;
    salaries: Record<string, number>;
    remote: number;
};

/** Multiplier that turns a salary into an approximate yearly figure. */
const PER_YEAR: Record<SalaryFrequency, number> = {
    "per hour": 2080,
    "per day": 260,
    "per week": 52,
    "per month": 12,
    "per year": 1,
};

function annualMinSalary(job: JobPosting): number {
    const factor = PER_YEAR[job.salaryFrequency] ?? 1;
    return job.minSalary * factor;
}

function countBy(jobs: JobPosting[], key: (job: JobPosting) => string): Record<string, number> {
    return jobs.reduce<Record<string, number>>((acc, job) => {
        const k = key(job);
        acc[k] = (acc[k] ?? 0) + 1;
        return acc;
    }, {});
}

export function buildFilterCounts(jobs: JobPosting[]): FilterCounts {
    const locationCounts = countBy(jobs, (job) => job.location);
    const locations = Object.entries(locationCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, MAX_LOCATION_OPTIONS);

    return {
        types: countBy(jobs, (job) => job.jobType),
        categories: countBy(jobs, (job) => job.jobCategory),
        locations: Object.fromEntries(locations),
        salaries: countBy(jobs, (job) => {
            const yearly = annualMinSalary(job);
            return (
                SALARY_RANGES.find((range) => yearly >= range.min && yearly < range.max)?.id ??
                SALARY_RANGES[0].id
            );
        }),
        remote: jobs.filter((job) => job.isRemote).length,
    };
}
