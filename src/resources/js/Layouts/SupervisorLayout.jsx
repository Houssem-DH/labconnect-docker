import { createContext, useState } from "react";

import Navbar from "@/Components/Supervisor/Navbar";


// Create a context for dark mode
export const DarkModeContext = createContext();

export default function Layout({ children }) {
    return (
        <>
        <div className="container mx-auto pt-48">
            <Navbar  />
            {children}

            </div>
            
        </>
    );
}
