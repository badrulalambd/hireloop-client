"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import {
    JOB_CATEGORY_OPTIONS,
    JOB_TYPE_OPTIONS,
    SALARY_RANGES,
    type FilterCounts,
} from "../lib";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type FilterOption = { id: string; label: string; count?: number };

type FilterGroupSpec = {
    id: string;
    title: string;
    options: FilterOption[];
};

type SelectedFilters = Record<string, string[]>;

/* ------------------------------------------------------------------ */
/*  Building blocks                                                    */
/* ------------------------------------------------------------------ */

function FilterCheckbox({
    option,
    checked,
    onToggle,
}: {
    option: FilterOption;
    checked: boolean;
    onToggle: () => void;
}) {
    return (
        <label className="flex cursor-pointer items-center gap-3 py-2">
            <input
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={onToggle}
            />
            <span
                aria-hidden="true"
                className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-lg border transition-colors",
                    "border-white/[0.08] bg-[#24242e] text-transparent",
                    "peer-checked:border-white peer-checked:bg-white peer-checked:text-[#0e0e10]",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-white/40",
                )}
            >
                <Check className="size-4" strokeWidth={3} />
            </span>
            <span className="flex-1 text-sm font-medium text-[#c0c0d7]">{option.label}</span>
            {option.count !== undefined && (
                <span className="text-sm tabular-nums text-[#9c9cb0]">{option.count}</span>
            )}
        </label>
    );
}

function FilterGroup({
    group,
    selected,
    onToggle,
}: {
    group: FilterGroupSpec;
    selected: string[];
    onToggle: (groupId: string, optionId: string) => void;
}) {
    return (
        <div>
            <h4 className="text-base font-semibold text-white">{group.title}</h4>
            <div className="mt-2 flex flex-col">
                {group.options.map((option) => (
                    <FilterCheckbox
                        key={option.id}
                        option={option}
                        checked={selected.includes(option.id)}
                        onToggle={() => onToggle(group.id, option.id)}
                    />
                ))}
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

/**
 * Filter panel for the browse-jobs page. Checkbox state is local and only
 * for visuals — changing a filter just logs, it never sets a search query.
 */
export function FilterSidebar({ counts }: { counts: FilterCounts }) {
    /* "full-time" starts checked, matching the Figma design. */
    const [selected, setSelected] = useState<SelectedFilters>({
        type: ["full-time"],
    });

    const toggleFilter = (groupId: string, optionId: string) => {
        setSelected((prev) => {
            const current = prev[groupId] ?? [];
            const next = current.includes(optionId)
                ? current.filter((id) => id !== optionId)
                : [...current, optionId];
            return { ...prev, [groupId]: next };
        });
        console.log("Filter toggled:", { group: groupId, option: optionId });
    };

    const groups: FilterGroupSpec[] = [
        {
            id: "type",
            title: "Job Type",
            options: JOB_TYPE_OPTIONS.map((option) => ({
                ...option,
                count: counts.types[option.id] ?? 0,
            })),
        },
        {
            id: "category",
            title: "Job Category",
            options: JOB_CATEGORY_OPTIONS.map((option) => ({
                ...option,
                count: counts.categories[option.id] ?? 0,
            })),
        },
        {
            id: "location",
            title: "Location",
            options: Object.entries(counts.locations).map(([location, count]) => ({
                id: location,
                label: location,
                count,
            })),
        },
        {
            id: "remote",
            title: "Remote",
            options: [{ id: "remote-only", label: "Remote only", count: counts.remote }],
        },
        {
            id: "salary",
            title: "Salary Range",
            options: SALARY_RANGES.map((range) => ({
                id: range.id,
                label: range.label,
                count: counts.salaries[range.id] ?? 0,
            })),
        },
    ];

    return (
        <aside className="self-start rounded-2xl border border-white/[0.08] bg-[#181820] p-6 lg:sticky lg:top-24">
            <h3 className="text-lg font-semibold text-white">Filters</h3>
            <div className="mt-6 flex flex-col gap-8">
                {groups.map((group) => (
                    <FilterGroup
                        key={group.id}
                        group={group}
                        selected={selected[group.id] ?? []}
                        onToggle={toggleFilter}
                    />
                ))}
            </div>
        </aside>
    );
}
