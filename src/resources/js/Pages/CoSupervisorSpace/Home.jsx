import React, { useState } from "react";
import { FiEdit } from "react-icons/fi"; // Import the Edit Icon
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/CoSupervisorLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import EditThesisModal from "./Partials/Modals/EditThesisModal";
import EditRemarksModal from "./Partials/Modals/EditRemarksModal"; // New modal for editing remarks
import { Badge } from "@/Components/ui/badge"; // Assuming you have a Badge component

const SupCoSupSection = ({ phd_thesis, auth, userRole, notifications }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditRemarksModalOpen, setIsEditRemarksModalOpen] = useState(false); // New state for remarks modal
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [remarkType, setRemarkType] = useState(""); // New state to determine which remark to edit

    // Open thesis edit modal
    const openEditModal = (thesis) => {
        setSelectedThesis(thesis);
        setIsEditModalOpen(true);
    };

    // Open remarks edit modal
    const openEditRemarksModal = (thesis, type) => {
        setSelectedThesis(thesis);
        setRemarkType(type); // Supervisor or co-supervisor
        setIsEditRemarksModalOpen(true);
    };

    // Close modals
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedThesis(null);
    };

    const closeEditRemarksModal = () => {
        setIsEditRemarksModalOpen(false);
        setSelectedThesis(null);
    };

    // Function to render remarks as badges
    const renderRemarks = (remarks) => {
        return (
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto mt-1">
                {remarks &&
                    JSON.parse(remarks).map((remark, index) => (
                        <Badge
                            key={index}
                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded"
                        >
                            {remark}
                        </Badge>
                    ))}
            </div>
        );
    };

    return (
        <Layout
            notifications={notifications.list}
            notifications_count={notifications.count}
            user={auth.user}
            userRole={userRole}
        >
            <SpaceLayout>
                <div className="py-12 relative">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-900">
                            PhD Theses
                        </h3>
                    </div>

                    {/* Thesis Cards */}
                    {phd_thesis ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {phd_thesis.map((thesis) => (
                                <Card
                                    key={thesis.id}
                                    className="border border-gray-300 shadow-lg rounded-lg bg-white overflow-hidden"
                                >
                                    <CardHeader className="bg-gray-100 border-b border-gray-200 p-4">
                                        <CardTitle className="text-xl font-semibold text-gray-800 flex justify-between items-center">
                                            {thesis.thesis_title}
                                            <div className="flex items-center space-x-2">
                                                {/* Edit Icon */}
                                                <FiEdit
                                                    onClick={() =>
                                                        openEditModal(thesis)
                                                    }
                                                    className="w-5 h-5 text-main cursor-pointer hover:text-red-800 transition"
                                                />
                                            </div>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="text-gray-700 space-y-3">
                                            <p>
                                                <strong className="font-medium text-gray-900">
                                                    Team:
                                                </strong>{" "}
                                                {thesis.team.title}
                                            </p>
                                            <p>
                                                <strong className="font-medium text-gray-900">
                                                    PhD Student:
                                                </strong>{" "}
                                                {thesis.student.first_name}{" "}
                                                {thesis.student.last_name}
                                            </p>
                                            <p>
                                                <strong className="font-medium text-gray-900">
                                                    Supervisor:
                                                </strong>{" "}
                                                {thesis.supervisor.first_name}{" "}
                                                {thesis.supervisor.last_name}
                                            </p>
                                            {thesis.co_supervisor && (
                                                <p>
                                                    <strong className="font-medium text-gray-900">
                                                        Co-Supervisor:
                                                    </strong>{" "}
                                                    {
                                                        thesis.co_supervisor
                                                            .first_name
                                                    }{" "}
                                                    {
                                                        thesis.co_supervisor
                                                            .last_name
                                                    }
                                                </p>
                                            )}
                                            <p>
                                                <strong className="font-medium text-gray-900">
                                                    Keywords:
                                                </strong>{" "}
                                                {thesis.keywords}
                                            </p>
                                            <p>
                                                <strong className="font-medium text-gray-900">
                                                    References:
                                                </strong>{" "}
                                                {thesis.references}
                                            </p>
                                            <p className="line-clamp-3">
                                                <strong className="font-medium text-gray-900">
                                                    Abstract:
                                                </strong>{" "}
                                                {thesis.abstract}
                                            </p>
                                            <p>
                                                <strong className="font-medium text-gray-900">
                                                    Advancement State:
                                                </strong>{" "}
                                                {
                                                    thesis.advancement_state_percentage
                                                }
                                                %
                                            </p>
                                            <p>
                                                <strong className="font-medium text-gray-900">
                                                    Description:
                                                </strong>{" "}
                                                {
                                                    thesis.advancement_state_description
                                                }
                                            </p>

                                            {/* Supervisor Remarks with Edit Icon */}
                                            <div className="flex items-start space-x-2">
                                                <div className="flex flex-grow">
                                                    <strong className="font-medium text-gray-900">
                                                        Supervisor Remarks:
                                                    </strong>
                                                </div>
                                            </div>
                                            <div className="mt-1">
                                                {renderRemarks(
                                                    thesis.supervisor_remarks
                                                )}
                                            </div>

                                            {/*co Supervisor Remarks with Edit Icon */}
                                            <div className="flex items-start space-x-2">
                                                <div className="flex flex-grow">
                                                    <strong className="font-medium text-gray-900">
                                                        Co Supervisor Remarks:
                                                    </strong>
                                                </div>
                                                <div className="flex flex-col">
                                                    <FiEdit
                                                        onClick={() =>
                                                            openEditRemarksModal(
                                                                thesis,
                                                                "supervisor"
                                                            )
                                                        }
                                                        className="w-5 h-5 text-main cursor-pointer hover:text-red-800 transition"
                                                    />
                                                </div>
                                            </div>
                                            <div className="mt-1">
                                                {renderRemarks(
                                                    thesis.co_supervisor_remarks
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">
                            No theses available at the moment.
                        </p>
                    )}
                </div>

                {/* Edit Thesis Modal */}
                {isEditModalOpen && selectedThesis && (
                    <EditThesisModal
                        onClose={closeEditModal}
                        thesis={selectedThesis}
                    />
                )}

                {/* Edit Remarks Modal */}
                {isEditRemarksModalOpen && selectedThesis && (
                    <EditRemarksModal
                        onClose={closeEditRemarksModal}
                        thesis={selectedThesis}
                        remarkType={remarkType} // Pass the type of remark being edited
                    />
                )}
            </SpaceLayout>
        </Layout>
    );
};

export default SupCoSupSection;
