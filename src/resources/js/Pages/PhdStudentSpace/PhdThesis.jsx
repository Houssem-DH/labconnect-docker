import React, { useState } from "react";
import { FiEdit } from "react-icons/fi"; // Import the Edit Icon
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/PhdStudentLayout";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import EditThesisModal from "./Partials/Modals/EditThesisModal";
import { Badge } from "@/Components/ui/badge"; // Assuming you have a Badge component

const SupCoSupSection = ({
    phd_thesis,
    phdStudents,
    labMembers,
    labMembersC,
    team,
    auth,
    userRole,
}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedThesis, setSelectedThesis] = useState(null);

    // Open modal and set the selected thesis
    const openEditModal = (thesis) => {
        setSelectedThesis(thesis);
        setIsEditModalOpen(true);
    };

    // Close modal
    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedThesis(null); // Clear the selected thesis after closing
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
        <Layout user={auth.user} userRole={userRole}>
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
                                                    } // Pass thesis when opening modal
                                                    className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition"
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

                {/* Edit Modal Component */}
                {isEditModalOpen && selectedThesis && (
                    <EditThesisModal
                        onClose={closeEditModal}
                        thesis={selectedThesis}
                    />
                )}
            </SpaceLayout>
        </Layout>
    );
};

export default SupCoSupSection;
