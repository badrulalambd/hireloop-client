"use client"

import { type FormEvent, type ReactNode } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, Send } from "lucide-react"
import { createJobs } from "@/lib/actions/jobs"
import { IJobFormDataType, JobCategory, JobType, SalaryFrequency } from "@/type/types"
import { toast } from "@/components/ui/toast"
import { useRouter } from "next/navigation"
import { randomInt } from "crypto"

/* ------------------------------------------------------------------ */
/*  Sample content lifted from the Figma design                        */
/* ------------------------------------------------------------------ */

const JOB_TYPES = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
] as const

const JOB_CATEGORIES = [
    "Engineering & Tech",
    "Design & Creative",
    "Infrastructure",
    "Marketing",
    "Quality",
    "Sales",
    "Finance",
    "Operations",
    "Customer Support",
] as const

const SALARY_FREQUENCIES = ["per hour", "per day", "per week", "per month", "per year"] as const

const RESPONSIBILITIES_PLACEHOLDER =
    "Showcase your commitment to delivering exceptional user interfaces and digital experiences. You will collaborate directly with systems designers and backend engineers to craft responsive, micro-interaction rich products."

const QUALIFICATIONS_PLACEHOLDER = [
    "• 3+ years of experience with React, TypeScript, and modern state architectures",
    "• Solid understanding of DOM performance and component-driven designs",
    "• Experience partnering closely with product teams and UI/UX designers",
].join("\n")

/* ------------------------------------------------------------------ */
/*  Small local helpers                                                */
/* ------------------------------------------------------------------ */

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Card className="rounded-xl border border-border bg-card shadow-sm">
            <CardHeader className="border-b border-border px-6 py-4">
                <CardTitle className="text-base font-semibold tracking-tight">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 px-6 py-6">{children}</CardContent>
        </Card>
    )
}

function Field({
    label,
    htmlFor,
    required,
    badge,
    children,
}: {
    label: string
    htmlFor: string
    required?: boolean
    badge?: string
    children: ReactNode
}) {
    return (
        <div className="space-y-2">
            <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
                {label}
                {required ? <span className="text-destructive">*</span> : null}
                {badge ? (
                    <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-medium text-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-400">
                        {badge}
                    </span>
                ) : null}
            </Label>
            {children}
        </div>
    )
}

const selectClassName =
    "h-10 w-full appearance-none rounded-lg border border-input bg-transparent px-3 pr-9 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const AddJobPage = () => {

    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget);

        const jobData: IJobFormDataType = {
            jobTitle: formData.get("jobTitle") as string,
            companyName: formData.get("companyName") as string,
            jobCategory: formData.get("jobCategory") as JobCategory,
            jobType: formData.get("jobType") as JobType,
            isRemote: formData.get("isRemote") === "true",
            location: formData.get("location") as string,
            deadline: (formData.get("deadline") as string) || undefined,
            minSalary: Number(formData.get("minSalary")) || undefined,
            maxSalary: Number(formData.get("maxSalary")) || undefined,
            salaryFrequency: formData.get("salaryFrequency") as SalaryFrequency,
            responsibilities: formData.get("responsibilities") as string,
            qualifications: formData.get("qualifications") as string,
        };
        console.log("jobData: ", jobData);

        const applicants = 0;
        const status = "active";
        
        const jobDataWithStatus = {
            ...jobData,
            applicants,
            status,
        }
        const result = await createJobs(jobDataWithStatus);
        console.log("Result for jobData: ", result);
        if (result.insertedId) {
            toast.add({
                type: "success",
                title: "Job created Successfully",
                description: "Job Id: " + result.insertedId,
            })
            router.push("/dashboard/recruiter/jobs");
        }

    }

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            <form id="add-job-form" onSubmit={handleSubmit} className="space-y-6">
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
                        <span className="font-medium text-muted-foreground">Create New Listing</span>
                    </nav>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight lg:text-3xl">
                                Post a New Job
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Fill in the position specifications to attract qualified talent across
                                our network.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ---------- 60 / 40 layout ---------- */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_2fr]">
                    {/* ===== Left column: form panels (60%) ===== */}
                    <div className="space-y-6">
                        {/* --- Section 1 --- */}
                        <SectionCard title="1. Basic Information">
                            <Field label="Job Title" htmlFor="jobTitle" required>
                                <Input
                                    id="jobTitle"
                                    name="jobTitle"
                                    required
                                    placeholder="Frontend Developer"
                                    className="h-10"
                                />
                            </Field>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <Field label="Company Name" htmlFor="companyName" required>
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        required
                                        placeholder="HirePulse Network"
                                        className="h-10"
                                    />
                                </Field>

                                <Field label="Job Category" htmlFor="jobCategory" required>
                                    <div className="relative">
                                        <select
                                            id="jobCategory"
                                            name="jobCategory"
                                            required
                                            defaultValue={JOB_CATEGORIES[0]}
                                            className={selectClassName}
                                        >
                                            {JOB_CATEGORIES.map((category) => (
                                                <option key={category} value={category}>
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown
                                            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                            aria-hidden
                                        />
                                    </div>
                                </Field>
                            </div>

                            <fieldset className="space-y-2">
                                <legend className="text-sm font-medium text-foreground">
                                    Job Type <span className="text-destructive">*</span>
                                </legend>
                                <div className="flex flex-wrap gap-2">
                                    {JOB_TYPES.map((type, index) => (
                                        <span key={type.value}>
                                            <input
                                                type="radio"
                                                id={`job-type-${type.value}`}
                                                name="jobType"
                                                value={type.value}
                                                defaultChecked={index === 0}
                                                className="peer sr-only"
                                            />
                                            <label
                                                htmlFor={`job-type-${type.value}`}
                                                className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border bg-background px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-indigo-500 hover:text-indigo-500 peer-checked:border-indigo-500 peer-checked:bg-indigo-500 peer-checked:text-white peer-checked:hover:text-white"
                                            >
                                                {type.label}
                                            </label>
                                        </span>
                                    ))}
                                </div>
                            </fieldset>
                        </SectionCard>

                        {/* --- Section 2 --- */}
                        <SectionCard title="2. Location, Compensation & Timeline">
                            {/* Remote toggle */}
                            <div className="flex items-start justify-between gap-4 rounded-lg border border-border px-4 py-3">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-foreground">
                                        Remote Work Allowed
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Enable worldwide or distributed candidate applications
                                    </p>
                                </div>
                                <label className="inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        name="isRemote"
                                        value="true"
                                        className="peer sr-only"
                                    />
                                    <span className="relative h-6 w-11 rounded-full bg-muted transition-colors after:absolute after:top-0.5 after:left-0.5 after:size-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:bg-indigo-500 peer-checked:after:translate-x-5" />
                                </label>
                            </div>

                            {/* Location + deadline */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <Field label="Job Location" htmlFor="location" badge="Required">
                                    <Input
                                        id="location"
                                        name="location"
                                        required
                                        placeholder="New York, USA"
                                        className="h-10"
                                    />
                                </Field>

                                <Field label="Application Deadline" htmlFor="deadline">
                                    <Input
                                        id="deadline"
                                        name="deadline"
                                        type="date"
                                        className="h-10"
                                    />
                                </Field>
                            </div>

                            {/* Salary range */}
                            <fieldset className="space-y-2">
                                <legend className="text-sm font-medium text-foreground">
                                    Salary Range
                                </legend>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="minSalary" className="text-sm font-medium">
                                            Min Salary / Rate
                                        </Label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                $
                                            </span>
                                            <Input
                                                id="minSalary"
                                                name="minSalary"
                                                type="number"
                                                min={0}
                                                placeholder="0"
                                                className="h-10 pl-7"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="maxSalary" className="text-sm font-medium">
                                            Max Salary / Rate
                                        </Label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                $
                                            </span>
                                            <Input
                                                id="maxSalary"
                                                name="maxSalary"
                                                type="number"
                                                min={0}
                                                placeholder="0"
                                                className="h-10 pl-7"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="salaryFrequency" className="text-sm font-medium">
                                            Frequency
                                        </Label>
                                        <div className="relative">
                                            <select
                                                id="salaryFrequency"
                                                name="salaryFrequency"
                                                defaultValue={SALARY_FREQUENCIES[0]}
                                                className={cn(selectClassName, "pr-9")}
                                            >
                                                {SALARY_FREQUENCIES.map((frequency) => (
                                                    <option key={frequency} value={frequency}>
                                                        {frequency}
                                                    </option>
                                                ))}
                                            </select>
                                            <ChevronDown
                                                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                                                aria-hidden
                                            />
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </SectionCard>

                        {/* --- Section 3 --- */}
                        <SectionCard title="3. Responsibilities & Requirements">
                            <Field label="Key Responsibilities" htmlFor="responsibilities" required>
                                <textarea
                                    id="responsibilities"
                                    name="responsibilities"
                                    required
                                    rows={5}
                                    placeholder={RESPONSIBILITIES_PLACEHOLDER}
                                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                                />
                            </Field>

                            <Field
                                label="Qualifications & Requirements"
                                htmlFor="qualifications"
                                required
                            >
                                <textarea
                                    id="qualifications"
                                    name="qualifications"
                                    required
                                    rows={5}
                                    placeholder={QUALIFICATIONS_PLACEHOLDER}
                                    className="w-full rounded-lg border border-input bg-transparent px-3 py-2.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                                />
                            </Field>
                        </SectionCard>
                        <section>
                            <Button
                                type="submit"
                                form="add-job-form"
                                className="h-10 shrink-0 gap-2 bg-indigo-500 px-5 text-white shadow-sm hover:bg-indigo-400"
                            >
                                <Send className="size-4" aria-hidden />
                                Publish Job
                            </Button>
                        </section>
                    </div>

                    {/* ===== Right column: live preview (40%) ===== */}
                    <div className="lg:sticky lg:top-8 lg:self-start">
                        <Card className="rounded-xl border border-border bg-card shadow-sm">
                            <CardHeader className="border-b border-border px-6 py-4">
                                <CardTitle className="text-base font-semibold tracking-tight">
                                    Live Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 px-6 py-6">
                                <div className="rounded-xl border border-border p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-base font-semibold text-foreground">
                                                Frontend Developer
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                HirePulse Network
                                            </p>
                                        </div>
                                        <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-400">
                                            Full-time
                                        </span>
                                    </div>

                                    <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center justify-between">
                                            <dt>Location</dt>
                                            <dd className="font-medium text-foreground">
                                                New York, USA
                                            </dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt>Category</dt>
                                            <dd className="font-medium text-foreground">
                                                Engineering &amp; Tech
                                            </dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt>Salary</dt>
                                            <dd className="font-medium text-foreground">
                                                $0 – $0 / hour
                                            </dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt>Deadline</dt>
                                            <dd className="font-medium text-foreground">
                                                —
                                            </dd>
                                        </div>
                                    </dl>

                                    <p className="mt-4 line-clamp-4 text-xs leading-relaxed text-muted-foreground">
                                        Showcase your commitment to delivering exceptional user
                                        interfaces and digital experiences. You will collaborate
                                        directly with systems designers and backend engineers to
                                        craft responsive, micro-interaction rich products.
                                    </p>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    This preview reflects how your listing will appear to job
                                    seekers once published.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddJobPage
