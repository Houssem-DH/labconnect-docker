import React from "react";
import {
    Home,
    GraduationCap,
    Users,
    University,
    BriefcaseBusiness,
    BookMarked,
} from "lucide-react";

import ApplicationIcon from "../ApplicationIcon";

import { Link, usePage } from "@inertiajs/react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/Components/ui/tooltip";

function SideBar(user) {

    console.log(user);
    const { url } = usePage();
    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
                <Link href="/">
                    <ApplicationIcon className="h-7 w-7 transition-all group-hover:scale-110" />
                </Link>
                <TooltipProvider>
                    {user.user.is_super_admin === 1 ? (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/dashboard"
                                        className={
                                            "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                                            (url === "/dashboard"
                                                ? " bg-accent text-accent-foreground "
                                                : " text-muted-foreground")
                                        }
                                    >
                                        <Home className="h-5 w-5" />
                                        <span className="sr-only">
                                            Dashboard
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Dashboard
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/dashboard/users"
                                        className={
                                            "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                                            (url === "/dashboard/users"
                                                ? " bg-accent text-accent-foreground "
                                                : " text-muted-foreground")
                                        }
                                    >
                                        <Users className="h-5 w-5" />
                                        <span className="sr-only">Users</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Users
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/dashboard/establishments"
                                        className={
                                            "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                                            (url === "/dashboard/establishments"
                                                ? " bg-accent text-accent-foreground "
                                                : " text-muted-foreground")
                                        }
                                    >
                                        <University className="h-5 w-5" />
                                        <span className="sr-only">
                                            Establishments
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Establishments
                                </TooltipContent>
                            </Tooltip>

                            {/* Repeat the same structure for other tooltips */}

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/dashboard/faculty"
                                        className={
                                            "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                                            (url === "/dashboard/faculty"
                                                ? " bg-accent text-accent-foreground "
                                                : " text-muted-foreground")
                                        }
                                    >
                                        <GraduationCap className="h-5 w-5" />
                                        <span className="sr-only">
                                            Faculties
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Faculties
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/dashboard/domains"
                                        className={
                                            "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                                            (url === "/dashboard/domains"
                                                ? " bg-accent text-accent-foreground "
                                                : " text-muted-foreground")
                                        }
                                    >
                                        <BriefcaseBusiness className="h-5 w-5" />
                                        <span className="sr-only">Domains</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Domains
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/dashboard/specialities"
                                        className={
                                            "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                                            (url === "/dashboard/specialities"
                                                ? " bg-accent text-accent-foreground "
                                                : " text-muted-foreground")
                                        }
                                    >
                                        <BookMarked className="h-5 w-5" />
                                        <span className="sr-only">
                                            Specialities
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Specialities
                                </TooltipContent>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/dashboard/admin"
                                        className={
                                            "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                                            (url === "/dashboard/admin"
                                                ? " bg-accent text-accent-foreground "
                                                : " text-muted-foreground")
                                        }
                                    >
                                        <Home className="h-5 w-5" />
                                        <span className="sr-only">
                                            Dashboard
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Dashboard
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link
                                        href="/dashboard/admin/directors"
                                        className={
                                            "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8" +
                                            (url ===
                                            "/dashboard/admin/directors"
                                                ? " bg-accent text-accent-foreground "
                                                : " text-muted-foreground")
                                        }
                                    >
                                        <Users className="h-5 w-5" />
                                        <span className="sr-only">
                                            Directors
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    Directors
                                </TooltipContent>
                            </Tooltip>
                        </>
                    )}
                </TooltipProvider>
            </nav>
        </aside>
    );
}

export default SideBar;
