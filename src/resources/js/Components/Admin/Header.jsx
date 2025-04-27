import React, { useContext } from "react";
import Avatar from "@/Components/Avatar";

import {
    Home,
    LineChart,
    Package,
    Package2,
    PanelLeft,
    ShoppingCart,
    Users2,
    LogOut,
    Settings,
    User,
    Gauge,
    Search,
} from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import { Button } from "@/Components/ui/button";

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

import { Link } from "@inertiajs/react";
import { LanguageContext } from "@/lib/LanguageContext";
import ApplicationIcon from "../ApplicationIcon";
import Breadcrumbs from "@/utils/Breadcrumb";

function Header({ user }) {
    const { language, setLanguage } = useContext(LanguageContext);
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link href="#">
                            <ApplicationIcon className="h-8 w-8 transition-all group-hover:scale-110" />
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <Home className="h-5 w-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center gap-4 px-2.5 text-foreground"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Orders
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <Package className="h-5 w-5" />
                            Products
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <Users2 className="h-5 w-5" />
                            Customers
                        </Link>
                        <Link
                            href="#"
                            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <LineChart className="h-5 w-5" />
                            Settings
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <Breadcrumbs />
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                />
            </div>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button>
                            <Avatar user={user} />
                        </button>
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
                            <Link href={route("profile.edit", {
                                                id: user.id,
                                            })}>
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
                            <Link href="/settings">
                                <span className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    <span>
                                        {" "}
                                        {language === "en"
                                            ? "Settings"
                                            : language === "ar"
                                            ? "إعدادات"
                                            : "Paramètres"}
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
            ) : null}
        </header>
    );
}

export default Header;
