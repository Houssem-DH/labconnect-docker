// Pagination.jsx

import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination";

const CustomPagination = ({ data, routeName }) => {
    const { current_page, last_page } = data;

    const renderPaginationItems = () => {
        const paginationItems = [];

        // Add first page
        paginationItems.push(
            <PaginationItem key={1}>
                <PaginationLink
                    href={route(routeName, { page: 1 })}
                    className={current_page === 1 ? "active bg-gray-500 text-white" : ""}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        // Add ellipsis before current page if current page > 3
        if (current_page > 3) {
            paginationItems.push(<PaginationEllipsis key="ellipsis1" />);
        }

        // Determine start and end of page range
        let startPage = current_page - 1;
        let endPage = current_page + 1;

        // Adjust startPage and endPage based on boundaries
        if (startPage < 2) {
            startPage = 2;
        }
        if (endPage > last_page - 1) {
            endPage = last_page - 1;
        }

        // Add page numbers within the determined range
        for (let page = startPage; page <= endPage; page++) {
            paginationItems.push(
                <PaginationItem key={page}>
                    <PaginationLink
                        href={route(routeName, { page })}
                        className={current_page === page ? "active bg-gray-500 text-white" : ""}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Add ellipsis after current page if current page < last_page - 2
        if (current_page < last_page - 2) {
            paginationItems.push(<PaginationEllipsis key="ellipsis2" />);
        }

        // Add last page
        if (last_page !== 1) {
            paginationItems.push(
                <PaginationItem key={last_page}>
                    <PaginationLink
                        href={route(routeName, { page: last_page })}
                        className={current_page === last_page ? "active bg-gray-500 text-white" : ""}
                    >
                        {last_page}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return paginationItems;
    };

    return (
        <Pagination className="flex justify-center mt-4">
            <PaginationContent>
                {current_page > 1 && (
                    <PaginationItem>
                        <PaginationPrevious
                            href={route(routeName, {
                                page: current_page - 1,
                            })}
                        />
                    </PaginationItem>
                )}
                {renderPaginationItems()}
                {current_page < last_page && (
                    <PaginationItem>
                        <PaginationNext
                            href={route(routeName, {
                                page: current_page + 1,
                            })}
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
};

export default CustomPagination;
