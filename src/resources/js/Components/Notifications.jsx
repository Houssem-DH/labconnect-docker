import React, { useState } from "react";
import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Link, usePage } from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns"; // Importing date-fns for time formatting

const NotificationDropdown = ({ notifications, notifications_count }) => {
    console.log(notifications);
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="relative bg-muted/40 hover:bg-gray-200"
                    size="icon"
                >
                    <Bell className="h-6 w-6 text-gray-800" />
                    {notifications_count > 0 && (
                        <Badge className="absolute top-0 right-0 h-4 w-4 flex items-center justify-center rounded-full bg-red-500 text-black text-xs">
                            {notifications_count}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-96 max-w-lg bg-white shadow-lg rounded-lg border border-gray-200 transition-transform transform scale-100 origin-top-right animate-slide-in">
                <DropdownMenuLabel className="font-bold text-xl text-gray-800 border-b border-gray-200 p-4">
                    Notifications
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!notifications ? (
                    <DropdownMenuItem className="p-4 text-gray-500 text-center">
                        No new notifications
                    </DropdownMenuItem>
                ) : (
                    notifications.map((notification) => (
                        <div>
                            {notification.type ===
                                "invite_project_collaboration" && (
                                <Link href="/services">
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="p-4 flex flex-col border-b border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                                    >
                                        <span className="font-semibold text-gray-900">
                                            {notification.type ===
                                                "invite_project_collaboration" &&
                                                "Invite project collaboration"}
                                        </span>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-gray-500 mt-2">
                                            {formatDistanceToNow(
                                                new Date(
                                                    notification.created_at
                                                ),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                </Link>
                            )}
                           
                            {notification.type ===
                                "exist_service_request_to_user" && (
                                <Link href="/services">
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="p-4 flex flex-col border-b border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                                    >
                                        <span className="font-semibold text-gray-900">
                                            {notification.type ===
                                                "exist_service_request_to_user" &&
                                                "Service Request"}
                                        </span>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-gray-500 mt-2">
                                            {formatDistanceToNow(
                                                new Date(
                                                    notification.created_at
                                                ),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                </Link>
                            )}
                            {(notification.type === "service_request" ||
                                notification.type ===
                                    "exist_service_request") && (
                                <Link href="/services/requests">
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="p-4 flex flex-col border-b border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                                    >
                                        <span className="font-semibold text-gray-900">
                                            {notification.type ===
                                                "service_request" &&
                                                "Service Request"}
                                            {notification.type ===
                                                "exist_service_request" &&
                                                "Service Request"}
                                        </span>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-gray-500 mt-2">
                                            {formatDistanceToNow(
                                                new Date(
                                                    notification.created_at
                                                ),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                </Link>
                            )}
                            {(notification.type ===
                                "exist_service_request_accept" ||
                                notification.type ===
                                    "service_request_accept") && (
                                <Link href="/services">
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="p-4 flex flex-col border-b border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                                    >
                                        <span className="font-semibold text-gray-900">
                                            {notification.type ===
                                                "exist_service_request_accept" &&
                                                "Service Request Accepted"}
                                            {notification.type ===
                                                "service_request_accept" &&
                                                "Service Request Accepted"}
                                        </span>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-gray-500 mt-2">
                                            {formatDistanceToNow(
                                                new Date(
                                                    notification.created_at
                                                ),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                </Link>
                            )}
                            {(notification.type ===
                                "exist_service_request_reject" ||
                                notification.type ===
                                    "service_request_reject") && (
                                <Link href="/services">
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="p-4 flex flex-col border-b border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                                    >
                                        <span className="font-semibold text-gray-900">
                                            {notification.type ===
                                                "exist_service_request_reject" &&
                                                "Service Request rejected"}
                                            {notification.type ===
                                                "service_request_reject" &&
                                                "Service Request rejected"}
                                        </span>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-gray-500 mt-2">
                                            {formatDistanceToNow(
                                                new Date(
                                                    notification.created_at
                                                ),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                </Link>
                            )}

                            {notification.type ===
                                "invite_thesis_collaboration" && (
                                <Link href="/collaboration-space/invitations">
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="p-4 flex flex-col border-b border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                                    >
                                        <span className="font-semibold text-gray-900">
                                            {notification.type ===
                                                "invite_thesis_collaboration" &&
                                                "Invite thesis collaboration"}
                                        </span>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-gray-500 mt-2">
                                            {formatDistanceToNow(
                                                new Date(
                                                    notification.created_at
                                                ),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                </Link>
                            )}

                            {notification.type ===
                                "invite_phd_thesis_collaboration" && (
                                <Link href="/collaboration-space/invitations">
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="p-4 flex flex-col border-b border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                                    >
                                        <span className="font-semibold text-gray-900">
                                            {notification.type ===
                                                "invite_phd_thesis_collaboration" &&
                                                "Invite thesis collaboration"}
                                        </span>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-gray-500 mt-2">
                                            {formatDistanceToNow(
                                                new Date(
                                                    notification.created_at
                                                ),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                </Link>
                            )}
                            {notification.type === "exist_service_request" && (
                                <Link href="/services/requests">
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="p-4 flex flex-col border-b border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                                    >
                                        <span className="font-semibold text-gray-900">
                                            {notification.type ===
                                                "exist_service_request" &&
                                                "Service Request"}
                                        </span>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-gray-500 mt-2">
                                            {formatDistanceToNow(
                                                new Date(
                                                    notification.created_at
                                                ),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                </Link>
                            )}
                            
                            {notification.type ===
                                "invite_project_collaboration" && (
                                <Link href="/collaboration-space/invitations">
                                    <DropdownMenuItem
                                        key={notification.id}
                                        className="p-4 flex flex-col border-b border-gray-100 hover:bg-gray-100 transition-colors duration-150"
                                    >
                                        <span className="font-semibold text-gray-900">
                                            {notification.type ===
                                                "invite_project_collaboration" &&
                                                "Invite project collaboration"}
                                        </span>
                                        <p className="text-sm text-gray-700 mt-1">
                                            {notification.message}
                                        </p>
                                        <span className="text-xs text-gray-500 mt-2">
                                            {formatDistanceToNow(
                                                new Date(
                                                    notification.created_at
                                                ),
                                                {
                                                    addSuffix: true,
                                                }
                                            )}
                                        </span>
                                    </DropdownMenuItem>
                                </Link>
                            )}
                        </div>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default NotificationDropdown;
