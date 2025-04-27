import React from "react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/Components/ui/menubar";
import { Link } from "@inertiajs/react";

const SpaceMenu = () => {
    return (
        <Menubar className="bg-white ">
            <MenubarMenu>
                <Link href="/">
                    <MenubarTrigger className="text-lg font-semibold text-gray-700 transition duration-200   flex items-center hover:bg-main hover:text-white">
                        Home
                    </MenubarTrigger>
                </Link>
            </MenubarMenu>
            <MenubarMenu>
                <Link href="/teams">
                    <MenubarTrigger className="text-lg font-semibold text-gray-700 transition duration-200   flex items-center hover:bg-main hover:text-white">
                        Teams
                    </MenubarTrigger>
                </Link>
            </MenubarMenu>
            <MenubarMenu>
                <Link href="/materials">
                    <MenubarTrigger className="text-lg font-semibold text-gray-700 transition duration-200   flex items-center hover:bg-main hover:text-white">
                        Materials
                    </MenubarTrigger>
                </Link>
            </MenubarMenu>
            <MenubarMenu>
                <Link href="/projects">
                    <MenubarTrigger className="text-lg font-semibold text-gray-700 transition duration-200  flex items-center hover:bg-main hover:text-white">
                        Projects
                    </MenubarTrigger>
                </Link>
            </MenubarMenu>
        </Menubar>
    );
};

export default SpaceMenu;
