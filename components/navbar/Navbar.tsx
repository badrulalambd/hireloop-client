"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

function isLinkActive(pathname: string, href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
}

function Logo() {
    return (
        <Link
            href="/"
            aria-label="HireLoop home"
            className="flex shrink-0 items-center"
        >
            <Image
                src="/images/logo.png"
                alt="HireLoop"
                width={128}
                height={37}
                priority
                className="h-9 w-auto"
            />
        </Link>
    );
}

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname() ?? "/";

    const navbarRef = useRef<HTMLElement>(null);
    const router = useRouter();

    const { data: session } = authClient.useSession();
    const user = session?.user;
    console.log("User Session Data from Navbar: ", user);

    const navLinks = [
        { label: "Browse Jobs", href: "/jobs" },
        { label: "Company", href: "/company" },
        { label: "Pricing", href: "/pricing" },
        { label: "Dashboard", href: `/dashboard/${user?.role || 'seeker'}` },
    ];


    useEffect(() => {
        if (!mobileOpen) return;

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setMobileOpen(false);
            }
        }

        function handleOutsideClick(event: MouseEvent) {
            if (
                navbarRef.current &&
                !navbarRef.current.contains(event.target as Node)
            ) {
                setMobileOpen(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [mobileOpen]);

    const handleSignout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in"); // redirect to login page
                },
            },
        });
    }

    return (
        <header
            ref={navbarRef}
            className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#111113]/95 backdrop-blur-md"
        >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
                <Logo />

                {/* Desktop navigation */}
                <nav
                    aria-label="Main"
                    className="hidden items-center gap-2 md:flex"
                >
                    {navLinks.map((link) => {
                        const active = isLinkActive(pathname, link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                                    active
                                        ? "bg-white/10 font-medium text-white"
                                        : "text-zinc-300 hover:bg-white/5 hover:text-white",
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop actions */}
                <div className="hidden items-center gap-4 md:flex">
                    {
                        user ?
                            <>
                                <span>Welcome {user?.name}</span>
                                <Button
                                    onClick={handleSignout}
                                    className="h-9 rounded-lg bg-indigo-500 px-4 text-white shadow-sm hover:bg-indigo-400">
                                    Logout
                                </Button>
                            </>
                            :
                            <>
                                <Link
                                    href="/sign-in"
                                    className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
                                >
                                    Sign In
                                </Link>
                                <Button
                                    nativeButton={false}
                                    render={<Link href='/sign-up' />}
                                    className="h-9 rounded-lg bg-indigo-500 px-4 text-white shadow-sm hover:bg-indigo-400">
                                    Get Started
                                </Button>
                            </>
                    }
                </div>

                {/* Mobile menu trigger */}
                <button
                    type="button"
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-menu"
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    onClick={() => setMobileOpen((open) => !open)}
                    className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-200 transition-colors hover:bg-white/10 md:hidden"
                >
                    {mobileOpen ? (
                        <X className="size-5" />
                    ) : (
                        <Menu className="size-5" />
                    )}
                </button>
            </div>

            {/* Mobile navigation */}
            <div
                id="mobile-menu"
                className={cn(
                    "overflow-hidden border-t border-white/5 bg-[#111113] transition-[max-height,opacity,visibility] duration-200 ease-out md:hidden",
                    mobileOpen
                        ? "visible max-h-96 opacity-100"
                        : "invisible max-h-0 opacity-0",
                )}
            >
                <nav
                    aria-label="Mobile"
                    className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6"
                >
                    {navLinks.map((link) => {
                        const active = isLinkActive(pathname, link.href);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "rounded-lg px-3 py-2.5 text-sm transition-colors",
                                    active
                                        ? "bg-white/10 font-medium text-white"
                                        : "text-zinc-200 hover:bg-white/5 hover:text-white",
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-4">
                        <Link
                            href="/sign-in"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-lg px-3 py-2.5 text-center text-sm font-medium text-indigo-400 transition-colors hover:bg-white/5 hover:text-indigo-300"
                        >
                            Sign In
                        </Link>
                        <Button className="h-10 w-full rounded-lg bg-indigo-500 text-white shadow-sm hover:bg-indigo-400">
                            Get Started
                        </Button>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
