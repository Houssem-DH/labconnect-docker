import { createContext, useState } from "react";

import Navbar from "@/Components/ProjectMember/Navbar";


// Create a context for dark mode
export const DarkModeContext = createContext();

export default function Layout({ children }) {
    return (
        <>
       <div className="container mx-auto py-32 ">
            <Navbar  />
            {children}

            </div>
            
        </>
    );
}
