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
                href="/co_supervisor-space/home"
                className={cn(
                    "nav-btn border border-gray-600 px-6 py-3 rounded-lg flex items-center transition-colors duration-300 font-medium",
                    url === "/co_supervisor-space/home"
                        ? "bg-main text-white"
                        : "hover:bg-main hover:text-white"
                )}
            >
                <Home className="h-6 w-6 mr-2 font-medium" />
                <span className="nav-label">Home</span>
            </Link>
            

           
        </div>
    );
};

export default Navbar;
