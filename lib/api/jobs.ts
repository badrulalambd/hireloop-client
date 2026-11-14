import { JobPosting } from "@/app/dashboard/recruiter/jobs/page";


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const getJobs = async () => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "GET",
        cache: "no-store",
    });
    const resData = await res.json();
    console.log("Server Res after GET job", resData);
    return resData;
}

export const getBrowseJobs = async (query = '') : Promise<JobPosting[]> => {
    const res = await fetch(`${BASE_URL}/browse-jobs?${query}`, {
        method: "GET",
        cache: "no-store",
    });
    const resData = await res.json();
    console.log("Server Res after GET job", resData);
    return resData;
}