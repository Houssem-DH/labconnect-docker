import React from "react";
import { usePage, Link } from "@inertiajs/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbList,
} from "@/Components/ui/breadcrumb"; // Adjust the import path based on your project structure and Shadcn UI setup

const Breadcrumbs = () => {
    const { url } = usePage();
    const segments = url.split("/").filter((segment) => segment !== "");

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <Link href="/">Home</Link>
                </BreadcrumbItem>

                {segments.map((segment, index) => (
                    <React.Fragment key={segment}>
                        <BreadcrumbSeparator>/</BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <Link
                                href={
                                    "/" + segments.slice(0, index + 1).join("/")
                                }
                            >
                                {segment}
                            </Link>
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default Breadcrumbs;
