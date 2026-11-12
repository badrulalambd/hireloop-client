
export type JobType =
    | "full-time"
    | "part-time"
    | "contract"
    | "internship";

export type JobCategory =
    | "Engineering & Tech"
    | "Design & Creative"
    | "Marketing"
    | "Sales"
    | "Finance"
    | "Operations"
    | "Customer Support";

export type SalaryFrequency =
    | "per hour"
    | "per day"
    | "per week"
    | "per month"
    | "per year";

export interface IJobFormDataType {
    jobTitle: string;
    companyName: string;
    jobCategory: JobCategory;
    jobType: JobType;
    isRemote: boolean;
    location: string;
    deadline?: string;
    minSalary?: number;
    maxSalary?: number;
    salaryFrequency?: SalaryFrequency;
    responsibilities: string;
    qualifications: string;
}