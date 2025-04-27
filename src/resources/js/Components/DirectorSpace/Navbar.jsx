import React from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    Home,
    Users,
    GitBranch,
    ClipboardList,
    FlaskConical,
    Microscope,
    BookText,
    Settings,
    CalendarCheck,
    Library
} from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const { url } = usePage();

    return (
        <div className="flex justify-center mb-8 space-x-4 sm:space-x-6 lg:space-x-8 flex-wrap gap-4">
            {/* Home */}
            <Link
                href="/director-space/home"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/director-space/home"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <Home className="h-6 w-6 mr-2" />
                <span className="nav-label">Home</span>
            </Link>

            {/* Members */}
            <Link
                href="/director-space/members"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/director-space/members"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <Users className="h-6 w-6 mr-2" />
                <span className="nav-label">Members</span>
            </Link>

            {/* Teams */}
            <Link
                href="/director-space/teams"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/director-space/teams"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <GitBranch className="h-6 w-6 mr-2" />
                <span className="nav-label">Teams</span>
            </Link>

            {/* Projects */}
            <Link
                href="/director-space/projects"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url.includes("/director-space/projects")
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <ClipboardList className="h-6 w-6 mr-2" />
                <span className="nav-label">Projects</span>
            </Link>

            {/* Materials */}
            <Link
                href="/director-space/materials"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/director-space/materials"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <FlaskConical className="h-6 w-6 mr-2" />
                <span className="nav-label">Materials</span>
            </Link>

            {/* Scientific Activities */}
            <Link
                href="/director-space/scientific-activities"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/director-space/scientific-activities"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <Microscope className="h-6 w-6 mr-2" />
                <span className="nav-label">Scientific Activities</span>
            </Link>

            {/* Scientific Productions */}
            <Link
                href="/director-space/scientific-productions"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/director-space/scientific-productions"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <BookText className="h-6 w-6 mr-2" />
                <span className="nav-label">Scientific Productions</span>
            </Link>

            {/* Services */}
            <Link
                href="/director-space/services"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/director-space/services"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <Settings className="h-6 w-6 mr-2" />
                <span className="nav-label">Services</span>
            </Link>

            {/* RESERVATIONS */}
            <Link
                href="/director-space/reservations"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/director-space/reservations"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <CalendarCheck className="h-6 w-6 mr-2" />
                <span className="nav-label">Reservations</span>
            </Link>
        </div>
    );
};

export default Navbar;