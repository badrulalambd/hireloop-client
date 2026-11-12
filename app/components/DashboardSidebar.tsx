'use client'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { usePathname } from "next/navigation"
import {
    Bookmark,
    Briefcase,
    Building2,
    FileText,
    LayoutDashboard,
    Plus,
    Settings,
    Users,
    Wallet,
    type LucideIcon,
} from "lucide-react"
import Link from "next/link"

type MenuItem = {
    name: string
    url: string
    icon: LucideIcon
}

const menuItemsByRole: Record<"seeker" | "recruiter" | "admin", MenuItem[]> = {
    seeker: [
        { name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
        { name: "Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
        { name: "Saved Jobs", url: "/dashboard/seeker/saved", icon: Bookmark },
        { name: "Applications", url: "/dashboard/seeker/applications", icon: FileText },
        { name: "Billing", url: "/dashboard/seeker/billing", icon: Wallet },
        { name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
    ],
    recruiter: [
        { name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
        { name: "My Company", url: "/dashboard/recruiter/company", icon: Building2 },
        { name: "Add Job", url: "/dashboard/recruiter/jobs/add-job", icon: Plus },
        { name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },
        { name: "Applications", url: "/dashboard/recruiter/applications", icon: FileText },
        { name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
    ],
    admin: [
        { name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
        { name: "Users", url: "/dashboard/admin/users", icon: Users },
        { name: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
        { name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
        { name: "Payments", url: "/dashboard/admin/payments", icon: Wallet },
        { name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
    ],
}

export function DashboardSidebar() {
    const { data: session, isPending } = useSession();
    const pathname = usePathname();
    const role: keyof typeof menuItemsByRole =
        session?.user?.role === "recruiter" || session?.user?.role === "admin"
            ? session.user.role
            : "seeker";
    return (
        <Sidebar className="pt-15">
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroup />
                <SidebarGroup>
                    <SidebarMenu>
                        {
                            menuItemsByRole[role].map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton
                                        render={<Link href={item.url} />}
                                        isActive={pathname === item.url}
                                    >
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))
                        }
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
