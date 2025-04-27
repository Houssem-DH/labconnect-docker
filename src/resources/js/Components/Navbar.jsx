import React, { useContext, useEffect, useState } from "react";
import { Link, usePage, useForm } from "@inertiajs/react";

import ButtonOutline from "@/Components/ButtonOutline";
import ButtonPrimary from "@/Components/ButtonPrimary";
import ApplicationLogo from "./ApplicationLogo";
import Avatar from "@/Components/Avatar";
import {
    LogOut,
    Settings,
    User,
    Menu,
    Handshake,
    Gauge,
    Search,
    Globe,
    BadgeCheck,
    UserIcon,
    BriefcaseIcon,
    StarIcon,
    GitPullRequest,
    CalendarX,
    Clock,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { ChevronDown } from "react-feather";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { LanguageContext } from "@/lib/LanguageContext";
import NotificationDropdown from "@/Components/Notifications";

const Header = ({
    user,
    labMember,
    userRole,
    notifications,
    notifications_count,
}) => {
    const [activeLink, setActiveLink] = useState(null);
    const [scrollActive, setScrollActive] = useState(false);
    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScrollActive(window.scrollY > 20);
        });
    }, []);

    const { url } = usePage();
    const { language, setLanguage } = useContext(LanguageContext);

    const handleLanguageChange = (language) => {
        setLanguage(language);
    };

    const roleIcons = {
        admin: <StarIcon className="w-4 h-4 mr-2" />,
        user: <UserIcon className="w-4 h-4 mr-2" />,
        manager: <BriefcaseIcon className="w-4 h-4 mr-2" />,
        // Add more roles and corresponding icons as needed
    };

    useEffect(() => {
        // Event listener for beforeunload to reset local storage
        const beforeUnloadListener = () => {
            setTimeout(() => {
                localStorage.setItem(
                    "selectedRole",
                    userRole && userRole.length > 0 ? userRole[0] : null
                );
            }, 3000); // Delay in milliseconds (e.g., 3000 milliseconds = 3 seconds)
        };

        window.addEventListener("beforeunload", beforeUnloadListener);

        return () => {
            // Clean up event listener
            window.removeEventListener("beforeunload", beforeUnloadListener);
        };
    }, []);

    const [selectedRole, setSelectedRole] = useState(() => {
        // Retrieve selected role from local storage, default to the first role in the list if not found
        return (
            localStorage.getItem("selectedRole") ||
            (userRole && userRole[0]) ||
            null
        );
    });
    console.log(selectedRole);

    useEffect(() => {
        // Save selected role to local storage whenever it changes
        localStorage.setItem("selectedRole", selectedRole);
    }, [selectedRole]);

    const handleRoleChange = (role) => {
        setSelectedRole(role);
    };

    const { get } = useForm();

    const [query, setQuery] = useState("");

    // Handle search query change
    const handleSearchChange = (event) => {
        setQuery(event.target.value);
    };

    // Handle search form submission
    const handleSearchSubmit = (event) => {
        event.preventDefault();

        // Navigate to the search results page with the query as a URL parameter
        if (query.trim() !== "") {
            get(`/search-results?query=${query}`); // Using Inertia to navigate
        }
    };

    return (
        <>
            <header
                className={
                    "fixed top-0 w-full  z-30 bg-white transition-all " +
                    (scrollActive ? " shadow-md pt-0" : " pt-4")
                }
            >
                <nav className="max-w-screen-xl px-6 sm:px-8 lg:px-16 mx-auto grid grid-flow-col py-3 sm:py-4">
                    <div className="col-start-1 col-end-2 flex items-center">
                        <ApplicationLogo className="h-8 w-auto" />
                    </div>
                    <ul className="hidden lg:flex col-start-4 col-end-8 text-black  items-center">
                        <Link
                            href="/"
                            className={
                                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative " +
                                (url === "/"
                                    ? " text-main animation-active "
                                    : " text-black hover:text-main")
                            }
                        >
                            {language === "en"
                                ? "Home"
                                : language === "ar"
                                ? "الصفحة الرئيسية"
                                : "Page Principale"}
                        </Link>
                        <Link
                            href="/labs"
                            className={
                                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                                (url === "/labs"
                                    ? " text-main animation-active "
                                    : " text-black hover:text-main")
                            }
                        >
                            {language === "en"
                                ? "Labs"
                                : language === "ar"
                                ? "المخابر"
                                : "laboratoires"}
                        </Link>
                        <Link
                            href="/about"
                            className={
                                "px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative" +
                                (url === "/about"
                                    ? " text-main animation-active "
                                    : " text-black hover:text-main")
                            }
                        >
                            {language === "en"
                                ? "About"
                                : language === "ar"
                                ? "عنا"
                                : "à propos"}
                        </Link>
                    </ul>
                    <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
                        {user && (
                            <div className="px-4">
                                <NotificationDropdown
                                    notifications={notifications}
                                    notifications_count={notifications_count}
                                />
                            </div>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <span className="flex items-center gap-1  cursor-pointer">
                                    <Globe className="h-5 w-5" />
                                    {language === "en" && "EN"}
                                    {language === "ar" && "AR"}
                                    {language === "fr" && "FR"}
                                    <ChevronDown className="h-5 w-5" />
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 absolute">
                                <DropdownMenuLabel>
                                    {" "}
                                    {language === "en" && "Language"}
                                    {language === "ar" && "اللغة"}
                                    {language === "fr" && "Langue"}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => handleLanguageChange("en")}
                                >
                                    <span className="flex items-center gap-2">
                                        {language === "en" && (
                                            <BadgeCheck className=" text-main h-4 w-4" />
                                        )}
                                        <span>
                                            {" "}
                                            {language === "en" && "English"}
                                            {language === "ar" && "الانجليزية"}
                                            {language === "fr" && "Anglais"}
                                        </span>
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleLanguageChange("ar")}
                                >
                                    <span className="flex items-center gap-2">
                                        {language === "ar" && (
                                            <BadgeCheck className=" text-main h-4 w-4" />
                                        )}
                                        <span>
                                            {" "}
                                            {language === "en" && "Arabic"}
                                            {language === "ar" && "العربية"}
                                            {language === "fr" && "Arabe"}
                                        </span>
                                    </span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleLanguageChange("fr")}
                                >
                                    <span className="flex items-center gap-2">
                                        {language === "fr" && (
                                            <BadgeCheck className="text-main h-4 w-4" />
                                        )}
                                        <span>
                                            {language === "en" && "French"}
                                            {language === "ar" && "الفرنسية"}
                                            {language === "fr" && "Français"}
                                        </span>
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Search className="h-5 w-5" />
                                    <span className="sr-only">Search</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {" "}
                                        {language === "en" && "Search"}
                                        {language === "ar" && "بحث"}
                                        {language === "fr" && "Recherche"}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <form
                                        onSubmit={handleSearchSubmit}
                                        className="relative"
                                    >
                                        <Input
                                            type="search"
                                            onChange={handleSearchChange}
                                            placeholder={
                                                language === "en"
                                                    ? "Search ..."
                                                    : language === "ar"
                                                    ? "... بحث"
                                                    : "Recherche ..."
                                            }
                                            className="pl-8 w-full"
                                        />
                                    </form>
                                </div>
                            </DialogContent>
                        </Dialog>

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

                                    {/* Add My Reservations here */}
                                    <DropdownMenuItem>
                                        <Link
                                            href={route("reservations.index")}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                <span>
                                                    {language === "en" &&
                                                        "My Reservations"}
                                                    {language === "ar" &&
                                                        "حجوزاتي"}
                                                    {language === "fr" &&
                                                        "Mes Réservations"}
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
                    </div>
                </nav>
            </header>
            {/* Mobile Navigation */}

            <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-20 px-4 sm:px-8 shadow-t ">
                <div className="bg-white sm:px-3">
                    <ul className="flex w-full justify-between items-center text-black">
                        <Link
                            href="/"
                            className={
                                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all " +
                                (url === "/"
                                    ? "  border-main text-main"
                                    : " border-transparent")
                            }
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {language === "en"
                                ? "Home"
                                : language === "ar"
                                ? "الصفحة الرئيسية"
                                : "Page Principale"}
                        </Link>
                        <Link
                            href="/labs"
                            className={
                                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all " +
                                (url === "/labs"
                                    ? "  border-main text-main"
                                    : " border-transparent ")
                            }
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                />
                            </svg>
                            {language === "en"
                                ? "Labs"
                                : language === "ar"
                                ? "المخابر"
                                : "laboratoires"}
                        </Link>
                        <Link
                            href="/about"
                            className={
                                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all " +
                                (url === "/labs"
                                    ? "  border-main text-main"
                                    : " border-transparent ")
                            }
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {language === "en"
                                ? "About"
                                : language === "ar"
                                ? "عنا"
                                : "à propos"}
                        </Link>
                        <Link
                            href="/collaboration-space/home"
                            className={
                                "mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all " +
                                (url === "/collaboration-space/home"
                                    ? "  border-main text-main"
                                    : " border-transparent ")
                            }
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            {language === "en"
                                ? "Collaboration Space"
                                : language === "ar"
                                ? "عنا"
                                : "à propos"}
                        </Link>
                    </ul>
                </div>
            </nav>
            {/* End Mobile Navigation */}
        </>
    );
};

export default Header;
