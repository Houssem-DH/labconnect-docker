import { Link, usePage } from "@inertiajs/react";
import ApplicationIcon from "@/Components/ApplicationIcon";
import React, { useState, useEffect, useContext } from "react";
import {
    Bell,
    Home,
    Mail,
    FileText,
    BriefcaseIcon,
    ShoppingCart,
    Package,
    LineChart,
    Package2,
    Menu,
    Search,
    Users,
    LogOut,
    Settings,
    User,
    Handshake,
    Gauge,
    Globe,
    BadgeCheck,
    UserIcon,
    StarIcon,
    GitPullRequest,
    CalendarX,
} from "lucide-react";
import Avatar from "@/Components/Avatar";

import { LanguageContext } from "@/lib/LanguageContext";

import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/input";

import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";

import NotificationDropdown from "@/Components/Notifications";

export default function Dashboard({
    children,
    user,
    projects_count,
    phd_thesis_count,
    userRole,
    notifications,
    notifications_count,
    labMember,
}) {
    const { language } = useContext(LanguageContext);
    const { url } = usePage(); // Get the current URL

    // Function to determine if a link is active
    const isActive = (path) => url.startsWith(path);

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-semibold"
                        >
                           <ApplicationIcon className="h-6 w-6 transition-all group-hover:scale-110" />
                            <span>Collaboration Space</span>
                        </Link>
                       
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                                href={`/collaboration-space/home`}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                                    isActive(`/collaboration-space/home`)
                                        ? "bg-primary text-white"
                                        : "text-muted-foreground hover:bg-primary hover:text-white"
                                }`}
                            >
                                <Home className="h-4 w-4" />
                                Home
                            </Link>
                            <Link
                                href={`/collaboration-space/projects`}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                                    isActive(`/collaboration-space/projects`)
                                        ? "bg-primary text-white"
                                        : "text-muted-foreground hover:bg-primary hover:text-white"
                                }`}
                            >
                                <BriefcaseIcon className="h-4 w-4" />
                                Projects
                            </Link>
                            
                            <Link
                                href={`/collaboration-space/phd-thesis`}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                                    isActive(`/collaboration-space/phd-thesis`)
                                        ? "bg-primary text-white"
                                        : "text-muted-foreground hover:bg-primary hover:text-white"
                                }`}
                            >
                                <FileText className="h-4 w-4" />
                                PhD Thesis
                            </Link>

                            <Link
                                href="/collaboration-space/invitations"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                                    isActive("/collaboration-space/invitations")
                                        ? "bg-primary text-white"
                                        : "text-muted-foreground hover:bg-primary hover:text-white"
                                }`}
                            >
                                <Mail className="h-4 w-4" />
                                Invitations
                                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-800">
                                    {Number(projects_count || 0) +
                                        Number(phd_thesis_count || 0)}
                                </Badge>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    
                    <div className="w-full flex-1">
                        
                    </div>

                    <Link
                        href="/"
                        className={`px-3 py-2 cursor-pointer animation-hover inline-block relative font-medium ${
                            url === "/"
                                ? "text-main animation-active"
                                : "text-black-500 hover:text-main"
                        }`}
                    >
                        {language === "en"
                            ? "Home"
                            : language === "ar"
                            ? "الصفحة الرئيسية"
                            : "Page Principale"}
                    </Link>

                    <NotificationDropdown
                        notifications={notifications}
                        notifications_count={notifications_count}
                    />

{user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="pl-2">
                                    <Avatar user={user} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>
                                        {language === "en"
                                            ? "My Account"
                                            : language === "ar"
                                            ? "حسابي"
                                            : "Mon compte"}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link
                                            href={route("profile.edit", {
                                                id: user.id,
                                            })}
                                        >
                                            <span className="flex items-center gap-2">
                                                <User className=" h-4 w-4" />
                                                <span>
                                                    {" "}
                                                    {language === "en"
                                                        ? "Profile"
                                                        : language === "ar"
                                                        ? "حسابي"
                                                        : "Profil"}
                                                </span>
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem>
                                        <Link href={route("service.index")}>
                                            <span className="flex items-center gap-2">
                                                <GitPullRequest className=" h-4 w-4" />
                                                <span>
                                                    {" "}
                                                    {language === "en"
                                                        ? "My Requests"
                                                        : language === "ar"
                                                        ? "حسابي"
                                                        : "Services"}
                                                </span>
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>

                                    {user.is_super_admin === 1 && (
                                        <DropdownMenuItem>
                                            <Link href="/dashboard">
                                                <span className="flex items-center gap-2">
                                                    <Gauge className="h-4 w-4" />
                                                    <span>
                                                        {language === "en"
                                                            ? "Dashboard"
                                                            : language === "ar"
                                                            ? "لوحة القيادة"
                                                            : "Tableau de bord"}
                                                    </span>
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    {user.is_admin === 1 && (
                                        <DropdownMenuItem>
                                            <Link href="/dashboard/admin">
                                                <span className="flex items-center gap-2">
                                                    <Gauge className="h-4 w-4" />
                                                    <span>
                                                        {language === "en"
                                                            ? "Dashboard"
                                                            : language === "ar"
                                                            ? "لوحة القيادة"
                                                            : "Tableau de bord"}
                                                    </span>
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    {user.director === 1 ? (
                                        <>
                                            <DropdownMenuItem>
                                                <Link href="/director-space/home">
                                                    <span className="flex items-center gap-2">
                                                        <Gauge className="h-4 w-4" />
                                                        <span>
                                                            {language === "en"
                                                                ? "Director Space"
                                                                : language ===
                                                                  "ar"
                                                                ? "لوحة القيادة"
                                                                : "Tableau de bord"}
                                                        </span>
                                                    </span>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Link href="/services/requests">
                                                    <span className="flex items-center gap-2">
                                                        <CalendarX className="h-4 w-4" />
                                                        <span>
                                                            {language === "en"
                                                                ? "Services Requests"
                                                                : language ===
                                                                  "ar"
                                                                ? "لوحة القيادة"
                                                                : "Tableau de bord"}
                                                        </span>
                                                    </span>
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    ) : labMember?.team_leader === 1 ? (
                                        <DropdownMenuItem>
                                            <Link href="/team-leader-space/home">
                                                <span className="flex items-center gap-2">
                                                    <Gauge className="h-4 w-4" />
                                                    <span>
                                                        {language === "en"
                                                            ? "Team Leader Space"
                                                            : language === "ar"
                                                            ? "لوحة القيادة"
                                                            : "Tableau de bord"}
                                                    </span>
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                    ) : labMember?.project_leader === 1 ? (
                                        <DropdownMenuItem>
                                            <Link href="/project-leader-space/home">
                                                <span className="flex items-center gap-2">
                                                    <Gauge className="h-4 w-4" />
                                                    <span>
                                                        {language === "en"
                                                            ? "Project Leader Space"
                                                            : language === "ar"
                                                            ? "لوحة القيادة"
                                                            : "Tableau de bord"}
                                                    </span>
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                    ) : labMember?.phd_student === 1 ? (
                                        <DropdownMenuItem>
                                            <Link href="/phd-student-space/home">
                                                <span className="flex items-center gap-2">
                                                    <Gauge className="h-4 w-4" />
                                                    <span>
                                                        {language === "en"
                                                            ? "PhD Student Space"
                                                            : language === "ar"
                                                            ? "لوحة القيادة"
                                                            : "Tableau de bord"}
                                                    </span>
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                    ) : labMember?.member === 1 ? (
                                        <DropdownMenuItem>
                                            <Link href="/member-space/home">
                                                <span className="flex items-center gap-2">
                                                    <Gauge className="h-4 w-4" />
                                                    <span>
                                                        {language === "en"
                                                            ? "Member Space"
                                                            : language === "ar"
                                                            ? "لوحة القيادة"
                                                            : "Tableau de bord"}
                                                    </span>
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                    ) : null}

                                    {labMember?.member === 1 && (
                                        <DropdownMenuItem>
                                            <Link href="/collaboration-space/home">
                                                <span className="flex items-center gap-2">
                                                    <Handshake className="h-4 w-4" />
                                                    <span>
                                                        {language === "en"
                                                            ? "Collaboration Space"
                                                            : language === "ar"
                                                            ? "لوحة القيادة"
                                                            : "Tableau de bord"}
                                                    </span>
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}

                                    {userRole && (
                                        <>
                                            <DropdownMenuGroup>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger>
                                                        <span className="flex items-center gap-2">
                                                            <User className=" h-4 w-4" />
                                                            <span>
                                                                Change Role
                                                            </span>
                                                        </span>
                                                    </DropdownMenuSubTrigger>
                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            {userRole.map(
                                                                (role) =>
                                                                    role !==
                                                                        selectedRole && (
                                                                        <DropdownMenuItem
                                                                            key={
                                                                                role
                                                                            }
                                                                        >
                                                                            <Link
                                                                                href={`/${role}-space/home`}
                                                                                onClick={() =>
                                                                                    handleRoleChange(
                                                                                        role
                                                                                    )
                                                                                }
                                                                                className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition duration-300 flex items-center"
                                                                                role="menuitem"
                                                                            >
                                                                                {roleIcons[
                                                                                    role
                                                                                ] || (
                                                                                    <UserIcon className="w-4 h-4 mr-2" />
                                                                                )}{" "}
                                                                                {/* Default icon */}
                                                                                {role
                                                                                    .charAt(
                                                                                        0
                                                                                    )
                                                                                    .toUpperCase() +
                                                                                    role.slice(
                                                                                        1
                                                                                    )}
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                    )
                                                            )}
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>
                                                </DropdownMenuSub>
                                            </DropdownMenuGroup>
                                        </>
                                    )}
                                    <DropdownMenuSeparator />

                                    <Link href={route("logout")} method="post">
                                        <DropdownMenuItem>
                                            <span className="flex items-center gap-2">
                                                <LogOut className="h-4 w-4" />
                                                <span>
                                                    {language === "en"
                                                        ? "Log out"
                                                        : language === "ar"
                                                        ? "تسجيل خروج"
                                                        : "Se déconnecter"}
                                                </span>
                                            </span>
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <>
                            <Link href={route("login")} className="pl-4">
                                <ButtonOutline>
                                    {language === "en"
                                        ? "Sign In"
                                        : language === "ar"
                                        ? "تسجيل الدخول"
                                        : "Connexion"}
                                </ButtonOutline>
                            </Link>
                            <Link href={route("register")} className="pl-4">
                                <ButtonPrimary>
                                    {language === "en"
                                        ? "Sign Up"
                                        : language === "ar"
                                        ? "انشاء حساب"
                                        : "cree un compte"}
                                </ButtonPrimary>
                            </Link>
                            </>
                        )}
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
