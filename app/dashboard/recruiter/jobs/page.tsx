import Link from "next/link"
import {
    Briefcase,
    ChevronRight,
    Eye,
    MapPin,
    Pencil,
    Plus,
    Trash2,
    Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { getJobs } from "@/lib/api/jobs"
import { IJobFormDataType } from "@/type/types"
import { DeleteJobAlertDialog } from "@/app/components/DeleteJobAlertDialog"

/* ------------------------------------------------------------------ */
/*  Job post shape — mirrors the add-job form fields exactly, plus     */
/*  a few backend-managed fields, so this can be fed by the API later. */
/* ------------------------------------------------------------------ */

type JobType = "full-time" | "part-time" | "contract" | "internship"
type SalaryFrequency = "per hour" | "per day" | "per week" | "per month" | "per year"
type JobStatus = "active" | "expired" | "closed" | "draft"

export type JobPosting = {
    _id: string
    /* --- submitted by the Post a New Job form --- */
    jobTitle: string
    companyName: string
    jobCategory: string
    jobType: JobType
    location: string
    isRemote: boolean
    deadline: string // yyyy-mm-dd (native date input value)
    minSalary: number
    maxSalary?: number
    salaryFrequency: SalaryFrequency
    responsibilities: string
    qualifications: string
    /* --- managed by the backend later --- */
    applicants: number
    status: JobStatus
    postedAt: string // yyyy-mm-dd
    postedLabel: string // demo value; compute from postedAt once the API is wired
}

/* ------------------------------------------------------------------ */
/*  Demo data (values follow the Figma "Manage Job Posts" table)       */
/* ------------------------------------------------------------------ */

const demoJobs: JobPosting[] = [
    {
        _id: "job_frontend_developer",
        jobTitle: "Frontend Developer",
        companyName: "HirePulse Network",
        jobCategory: "Engineering & Tech",
        jobType: "full-time",
        location: "New York, USA",
        isRemote: true,
        deadline: "2025-05-30",
        minSalary: 25,
        maxSalary: 40,
        salaryFrequency: "per hour",
        responsibilities:
            "Showcase your commitment to delivering exceptional user interfaces and digital experiences.",
        qualifications: "3+ years of experience with React, TypeScript, and modern state architectures.",
        applicants: 34,
        status: "active",
        postedAt: "2025-05-26",
        postedLabel: "4d ago",
    },
    {
        _id: "job_senior_product_designer",
        jobTitle: "Senior Product Designer",
        companyName: "HirePulse Labs",
        jobCategory: "Design & Creative",
        jobType: "full-time",
        location: "London, UK (Hybrid)",
        isRemote: false,
        deadline: "2025-06-14",
        minSalary: 90_000,
        maxSalary: 115_000,
        salaryFrequency: "per year",
        responsibilities: "Own end-to-end product design across web and mobile surfaces.",
        qualifications: "5+ years of product design experience with a strong portfolio.",
        applicants: 19,
        status: "active",
        postedAt: "2025-06-07",
        postedLabel: "1w ago",
    },
    {
        _id: "job_devops_specialist",
        jobTitle: "DevOps Specialist",
        companyName: "HirePulse Platform",
        jobCategory: "Infrastructure",
        jobType: "full-time",
        location: "Berlin, Germany",
        isRemote: false,
        deadline: "2025-06-30",
        minSalary: 95_000,
        maxSalary: 120_000,
        salaryFrequency: "per year",
        responsibilities: "Operate our CI/CD pipelines and keep deployment infrastructure healthy.",
        qualifications: "Strong experience with AWS, Kubernetes, and infrastructure as code.",
        applicants: 12,
        status: "active",
        postedAt: "2025-06-16",
        postedLabel: "2w ago",
    },
    {
        _id: "job_product_marketing_lead",
        jobTitle: "Product Marketing Lead",
        companyName: "HirePulse Network",
        jobCategory: "Marketing",
        jobType: "full-time",
        location: "EU/US",
        isRemote: true,
        deadline: "2025-07-15",
        minSalary: 105_000,
        salaryFrequency: "per year",
        responsibilities: "Shape go-to-market strategy and product messaging across regions.",
        qualifications: "6+ years in B2B SaaS product marketing.",
        applicants: 27,
        status: "active",
        postedAt: "2025-07-10",
        postedLabel: "5d ago",
    },
    {
        _id: "job_qa_automation_engineer",
        jobTitle: "QA Automation Engineer",
        companyName: "HirePulse Platform",
        jobCategory: "Quality",
        jobType: "part-time",
        location: "Dublin, Ireland (Hybrid)",
        isRemote: false,
        deadline: "2025-05-01",
        minSalary: 35,
        maxSalary: 50,
        salaryFrequency: "per hour",
        responsibilities: "Build and maintain automated test suites for our hiring platform.",
        qualifications: "Experience with Playwright or Cypress and CI-integrated testing.",
        applicants: 8,
        status: "expired",
        postedAt: "2025-04-20",
        postedLabel: "1w ago",
    },
]

/* ------------------------------------------------------------------ */
/*  Display helpers                                                    */
/* ------------------------------------------------------------------ */

const TYPE_LABELS: Record<JobType, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    internship: "Internship",
}

const STATUS_STYLES: Record<JobStatus, string> = {
    active: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    expired: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
    closed: "bg-zinc-500/10 text-zinc-600 dark:bg-zinc-500/15 dark:text-zinc-400",
    draft: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
}

const FREQUENCY_SUFFIX: Record<SalaryFrequency, string> = {
    "per hour": "hr",
    "per day": "day",
    "per week": "wk",
    "per month": "mo",
    "per year": "yr",
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** "2025-05-30" -> "May 30, 2025" (matches the Figma date format) */
function formatDate(iso: string): string {
    const [year, month, day] = iso.split("-")
    return `${MONTHS[Number(month) - 1]} ${day}, ${year}`
}

/** 90000 -> "90k", 25 -> "25" */
function compactSalary(value: number): string {
    return value >= 1000 ? `${Math.round(value / 1000)}k` : `${value}`
}

/** "25 – 40 / hr", "90k – 115k / yr", "105k / yr" (Figma compensation format) */
function formatSalary(job: JobPosting): string {
    const suffix = FREQUENCY_SUFFIX[job.salaryFrequency]
    const min = compactSalary(job.minSalary)
    const max = job.maxSalary != null ? compactSalary(job.maxSalary) : null
    return max ? `${min} – ${max} / ${suffix}` : `${min} / ${suffix}`
}

/** "Remote (New York, USA)" when the remote toggle was on, otherwise plain location */
function formatLocation(job: JobPosting): string {
    return job.isRemote ? `Remote (${job.location})` : job.location
}

/** Deadline cell sub-line: "Posted 4d ago" while live, "Closed" once expired */
function deadlineNote(job: JobPosting): string {
    return job.status === "active" ? `Posted ${job.postedLabel}` : "Closed"
}

const STATUS_LABELS: Record<JobStatus, string> = {
    active: "Active",
    expired: "Expired",
    closed: "Closed",
    draft: "Draft",
}

const COLUMNS = [
    "Job Title & Dept",
    "Company & Location",
    "Type",
    "Compensation",
    "Applicants",
    "Status",
    "Deadline",
    "Actions",
] as const

function JobIcon() {
    return (
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-400">
            <Briefcase className="size-4" aria-hidden />
        </span>
    )
}

function TypePill({ jobType }: { jobType: JobType }) {
    return (
        <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
            {TYPE_LABELS[jobType]}
        </span>
    )
}

function StatusBadge({ status }: { status: JobStatus }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
        >
            {STATUS_LABELS[status]}
        </span>
    )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const ManageJobsPage = async () => {
    const jobsData: JobPosting[] = await getJobs();
    console.log("JobsData in Jobs page: ", jobsData);

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* ---------- Page header ---------- */}
            <div className="space-y-4">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
                    <Link
                        href="/dashboard/recruiter/jobs"
                        className="font-medium text-indigo-500 transition-colors hover:text-indigo-400"
                    >
                        Manage Jobs
                    </Link>
                    <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
                    <span className="font-medium text-muted-foreground">
                        Job Listings &amp; Postings
                    </span>
                </nav>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                            Manage Job Posts
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Review live listings, monitor applicants, and update job details across
                            your organization.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/recruiter/jobs/add-job"
                        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-500 px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-400"
                    >
                        <Plus className="size-4" aria-hidden />
                        New Job Post
                    </Link>
                </div>
            </div>

            {/* ---------- Postings table ---------- */}
            <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                {/* Desktop / tablet: real table with horizontal scroll when needed */}
                <div className="hidden overflow-x-auto lg:block" data-desktop-table>
                    <table className="w-full min-w-[1040px] text-sm">
                        <thead>
                            <tr className="border-b border-border bg-muted/50 text-left">
                                {COLUMNS.map((column) => (
                                    <th
                                        key={column}
                                        scope="col"
                                        className="px-4 py-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {jobsData.map((job) => (
                                <tr
                                    key={job._id}
                                    className="transition-colors hover:bg-muted/40"
                                >
                                    {/* Job title & dept */}
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <JobIcon />
                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-foreground">
                                                    {job.jobTitle}
                                                </p>
                                                <p className="truncate text-xs font-medium text-muted-foreground">
                                                    {job.jobCategory}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Company & location */}
                                    <td className="px-4 py-3.5">
                                        <p className="font-medium text-foreground">
                                            {job.companyName}
                                        </p>
                                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <MapPin className="size-3.5 shrink-0" aria-hidden />
                                            <span className="truncate">{formatLocation(job)}</span>
                                        </p>
                                    </td>

                                    {/* Type */}
                                    <td className="px-4 py-3.5">
                                        <TypePill jobType={job.jobType} />
                                    </td>

                                    {/* Compensation */}
                                    <td className="px-4 py-3.5 font-medium whitespace-nowrap text-foreground">
                                        {formatSalary(job)}
                                    </td>

                                    {/* Applicants */}
                                    <td className="px-4 py-3.5">
                                        <span className="flex items-center gap-1.5 font-semibold whitespace-nowrap text-foreground">
                                            <Users className="size-4 text-muted-foreground" aria-hidden />
                                            {job.applicants} Candidates
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-4 py-3.5">
                                        <StatusBadge status={job.status} />
                                    </td>

                                    {/* Deadline */}
                                    <td className="px-4 py-3.5 whitespace-nowrap">
                                        <p className="font-medium text-foreground">
                                            {formatDate(job.deadline)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {deadlineNote(job)}
                                        </p>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-1.5">
                                            <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
                                                <Pencil className="size-3.5" aria-hidden />
                                                Update
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon-sm"
                                                className="text-muted-foreground"
                                                aria-label={`View applicants for ${job.jobTitle}`}
                                            >
                                                <Eye className="size-4" aria-hidden />
                                            </Button>
                                            <DeleteJobAlertDialog 
                                            job={job}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Phone / small tablet: stacked cards with the same data */}
                <ul className="divide-y divide-border lg:hidden" data-mobile-cards>
                    {jobsData.map((job) => (
                        <li key={job._id} className="space-y-3 p-4">
                            <div className="flex items-start gap-3">
                                <JobIcon />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-semibold text-foreground">
                                        {job.jobTitle}
                                    </p>
                                    <p className="truncate text-xs font-medium text-muted-foreground">
                                        {job.jobCategory}
                                    </p>
                                </div>
                                <StatusBadge status={job.status} />
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-sm font-medium text-foreground">
                                    {job.companyName}
                                </p>
                                <TypePill jobType={job.jobType} />
                            </div>

                            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MapPin className="size-3.5 shrink-0" aria-hidden />
                                {formatLocation(job)}
                            </p>

                            <dl className="grid grid-cols-2 gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                                <div>
                                    <dt className="text-xs text-muted-foreground">Compensation</dt>
                                    <dd className="text-sm font-medium text-foreground">
                                        {formatSalary(job)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-muted-foreground">Deadline</dt>
                                    <dd className="text-sm font-medium text-foreground">
                                        {formatDate(job.deadline)}
                                        <span className="block text-xs font-normal text-muted-foreground">
                                            {deadlineNote(job)}
                                        </span>
                                    </dd>
                                </div>
                            </dl>

                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                                    <Users className="size-4 text-muted-foreground" aria-hidden />
                                    {job.applicants} Candidates
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
                                        <Pencil className="size-3.5" aria-hidden />
                                        Update
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon-sm"
                                        className="text-muted-foreground"
                                        aria-label={`View applicants for ${job.jobTitle}`}
                                    >
                                        <Eye className="size-4" aria-hidden />
                                    </Button>
                                    <DeleteJobAlertDialog 
                                    job={job}
                                    />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default ManageJobsPage
