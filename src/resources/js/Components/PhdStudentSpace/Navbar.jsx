import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Home, Users, Component, LineChart, Wrench,Microscope } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for class names

const Navbar = () => {
    const { url } = usePage(); // Using usePage hook to access current page

    return (
        <div className="flex justify-center mb-8 space-x-4">
            {/* Home */}
            <Link
                href="/phd-student-space/home"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/phd-student-space/home"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <Home className="h-6 w-6 mr-2 font-medium" />
                <span className="nav-label">Home</span>
            </Link>
            {/* Members */}
            <Link
                href="/phd-student-space/members"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/phd-student-space/members"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <Users className="h-6 w-6 mr-2 font-medium" />
                <span className="nav-label">Members</span>
            </Link>

            {/* Teams */}
            <Link
                href="/phd-student-space/teams"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/phd-student-space/teams"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <Component className="h-6 w-6 mr-2 font-medium" />
                <span className="nav-label">Teams</span>
            </Link>

          
            {/* Materials */}
            <Link
                href="/phd-student-space/materials"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/phd-student-space/materials"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <Wrench className="h-6 w-6 mr-2 font-medium" />
                <span className="nav-label">Materials</span>
            </Link>

             {/* Phd  Thesis */}
             <Link
                href="/phd-student-space/phd-thesis"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/phd-student-space/phd-thesis"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <Microscope className="h-6 w-6 mr-2 font-medium" />
                <span className="nav-label"> Phd  Thesis</span>
            </Link>

           
        </div>
    );
};

export default Navbar;
