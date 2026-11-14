import { getBrowseJobs } from '@/lib/api/jobs';
import React from 'react';
import { JobPosting } from '../dashboard/recruiter/jobs/page';

const BrowseJobsPage = async ({ searchParams, }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
    const search = (await searchParams)
    console.log("SearchParams: ", search);
    const urlSearch = new URLSearchParams(search as Record<string, string>);
    const query = urlSearch.toString();
    console.log("SearchParams Query: ", query);
    const jobs = await getBrowseJobs(query);
    console.log("Jobs after filter: ", jobs);

    return (
        <div>
            <h2>Browse Jobs Page</h2>
            <ul>
                {
                    jobs.map((job : JobPosting) => (
                        <li key={job._id}><span >{job.jobTitle}</span></li>
                    ))
                }
            </ul>
        </div>
    );
};

export default BrowseJobsPage;