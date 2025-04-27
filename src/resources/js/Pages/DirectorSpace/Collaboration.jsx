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
import CreateProjectCollabModal from "./Partials/Modals/CreateProjectCollabModal";
import CreateCollaborationSpaceModal from "./Partials/Modals/CreateCollaborationSpaceModal";
import { Link, Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SpaceLayout";
import { usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";

const CollaborationSection = ({
    cols,
    colsProjects,
    lab,
    labs,
    domains,
    auth,
    userRole,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const openModal2 = () => setShowModal2(true);
    const closeModal2 = () => setShowModal2(false);

    const { props } = usePage();

    return (
        <Layout user={auth.user} userRole={userRole}>
            <Head title="Collaborations" />
            <SpaceLayout>
                <Toaster position="bottom-right" reverseOrder={false} />

                {/* Project Collaborations Section */}
                <div className="p-6 bg-gray-100 rounded-lg shadow-md mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">
                            Project Collaborations
                        </h3>
                        <Button
                            variant="outline"
                            onClick={openModal}
                            className="flex items-center text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                            <FiPlus className="mr-2" size={18} />
                            Create Project Collab Request
                        </Button>
                    </div>
                    {colsProjects ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {colsProjects.map((col) => (
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
                                            {col.objective ||
                                                "No title objective"}
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

                {/* Collaboration Spaces Section */}
                <div className="p-6 bg-gray-100 rounded-lg shadow-md ">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">
                            Collaboration Spaces
                        </h3>
                        <Button
                            variant="outline"
                            onClick={openModal2}
                            className="flex items-center text-green-600 border-green-600 hover:bg-green-50"
                        >
                            <FiPlus className="mr-2" size={18} />
                            Create Collaboration Space
                        </Button>
                    </div>
                    {cols ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cols.map((col) => (
                                <Card
                                    key={col.id}
                                    className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    <CardHeader className="border-b border-gray-300 p-4">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg font-semibold text-gray-700">
                                                {col.name}
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
                                            {col.abstract ||
                                                "No abstract available"}
                                        </p>
                                        <Link
                                            href={route(
                                                "collaboration.space.home",
                                                {
                                                    id: lab.id,
                                                    collaborationSpaceId:
                                                        col.id,
                                                }
                                            )}
                                            className="text-green-600 hover:underline mt-2 inline-flex items-center"
                                        >
                                            Enter the Space
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
                            No Spaces found.
                        </div>
                    )}
                </div>
            </SpaceLayout>

            {/* Modals */}
            <CreateProjectCollabModal
                isOpen={showModal}
                onClose={closeModal}
                lab={lab}
                domains={domains}
            />
            <CreateCollaborationSpaceModal
                isOpen={showModal2}
                onClose={closeModal2}
                lab={lab}
                labs={labs}
                domains={domains}
            />
        </Layout>
    );
};

export default CollaborationSection;
