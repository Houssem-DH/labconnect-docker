import Layout from "@/Layouts/CollaborationSpaceLayout";
import React, { useState } from "react";
import {
    FiChevronDown,
    FiChevronUp,
    FiPlus,
    FiTrash2,
    FiEdit,
    FiArrowRight,
    FiCheckCircle,
} from "react-icons/fi";

import { Link, Head } from "@inertiajs/react";

import { usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
const Labs = ({ auth, userRole, collabInvites ,notifications}) => {
    console.log(collabInvites);

    return (
        <Layout
            user={auth.user}
            userRole={userRole}
            notifications={notifications.list}
            notifications_count={notifications.count}
        >
            <Head title="Collaborations Invites" />

            <Toaster position="bottom-right" reverseOrder={false} />

            {/* Project Collaborations Section */}
            <div className="p-6 bg-gray-100 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                        Collaborations invites
                    </h3>
                    <Button
                        variant="outline"
                        className="flex items-center text-blue-600 border-blue-600 hover:bg-blue-50"
                    >
                        <FiPlus className="mr-2" size={18} />
                        Invite New Labs
                    </Button>
                </div>
                {collabInvites ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collabInvites.map((col) => (
                            <Card
                                key={col.id}
                                className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                                <CardHeader className="border-b border-gray-300 p-4">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-lg font-semibold text-gray-700">
                                            {col.title}
                                        </CardTitle>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="ghost"
                                                className="text-gray-600 hover:bg-gray-200"
                                            >
                                                <FiEdit size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                className="text-red-600 hover:bg-red-100"
                                            >
                                                <FiTrash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 text-gray-600">
                                    <p>
                                        {col.problematic ||
                                            "No title problematic"}
                                    </p>
                                    <p>
                                        {col.objective || "No title objective"}
                                    </p>
                                    <p>
                                        <div className="flex flex-wrap mt-2">
                                            {JSON.parse(col.domain).map(
                                                (result, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full mr-2 mb-2"
                                                    >
                                                        <FiCheckCircle className="inline-block mr-1 text-green-500" />
                                                        {result}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </p>
                                    <Link
                                        href={`/projects/${col.id}`}
                                        className="text-blue-600 hover:underline mt-2 inline-flex items-center"
                                    >
                                        View Project
                                        <FiArrowRight
                                            className="ml-1"
                                            size={16}
                                        />
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-600 text-center py-4">
                        No Collaborations found.
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Labs;
