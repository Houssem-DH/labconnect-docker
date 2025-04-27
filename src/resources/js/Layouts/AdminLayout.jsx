import React from "react";
import Sidebar from "@/Components/Admin/SideBar";
import Header from "@/Components/Admin/Header";

const AdminLayout = ({ children, user }) => {

    
    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/50">
            <Sidebar user={user} />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <Header user={user} />
                <div className="pb-16">{children}</div>
            </div>
        </div>
    );
};

export default AdminLayout;
