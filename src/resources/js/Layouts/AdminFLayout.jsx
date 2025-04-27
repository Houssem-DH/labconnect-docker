import React from "react";
import { useState } from "react";
import Sidebar from "@/Components/AdminF/Sidebar";
import Navbar from "@/Components/AdminF/Navbar";
import Footer from "@/Components/AdminF/Footer";

const AdminFLayout = ({ children, user }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="w-full flex bg-gray-100">
            {isSidebarOpen && <Sidebar />}
            <div
                className={`flex flex-col flex-1 ${
                    isSidebarOpen ? "ml-64" : ""
                }`}
            >
                <Navbar
                    isOpen={isSidebarOpen}
                    toggleSidebar={toggleSidebar}
                    user={user}
                />
                <div className="p-4 mt-20">{children}</div>
                <Footer />
            </div>
        </div>
    );
};

export default AdminFLayout;
