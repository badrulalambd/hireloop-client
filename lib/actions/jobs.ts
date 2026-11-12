import { IJobFormDataType } from "@/type/types"


const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const createJobs = async (jobData : IJobFormDataType) => {
    const res = await fetch(`${BASE_URL}/jobs`, {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(jobData),
    });
    const resData = await res.json();
    console.log("Server Res after POST job", resData);
    return resData;
}