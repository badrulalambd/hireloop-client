"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { SORT_OPTIONS } from "../lib";

/**
 * Sort dropdown for the job listing. The change handler only logs for now —
 * it does not apply any ordering to the query.
 */
export function SortSelect() {
    const [value, setValue] = useState<string>(SORT_OPTIONS[0].id);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const next = event.target.value;
        setValue(next);
        console.log("Sort changed:", next);
    };

    return (
        <div className="relative">
            <select
                aria-label="Sort jobs"
                value={value}
                onChange={handleChange}
                className="h-11 appearance-none rounded-lg border border-white/[0.14] bg-[#101016] pl-4 pr-10 text-sm font-medium text-white outline-none transition-colors focus:border-white/30"
            >
                {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.label}
                    </option>
                ))}
            </select>
            <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#c3c9d5]"
            />
        </div>
    );
}
