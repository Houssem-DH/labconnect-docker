import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/TeamLeaderSpaceLayout";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import AddThesisModal from "./Partials/Modals/AddThesisModal";

const SupCoSupSection = ({
    phd_thesis,
    phdStudents,
    labMembers,
    labMembersC,
    team,
    auth,
    userRole,
}) => {
    const [showModal, setShowModal] = useState(false);
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    return (
        <Layout user={auth.user} userRole={userRole}>
            <SpaceLayout>
                <div className="p-6 relative">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-900">
                            PhD Theses
                        </h3>
                        {team.length !== 0 && (
                            <Button
                              
                               
                                onClick={openModal}
                            >
                                <FiPlus className="h-6 w-6" />
                                <span>Add Thesis</span>
                            </Button>
                        )}
                    </div>

                    {/* Thesis Cards */}
                    {phd_thesis ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {phd_thesis.map((thesis) => (
                                <Card
                                    key={thesis.id}
                                    className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200"
                                >
                                    <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
                                        <CardTitle className="text-xl font-bold text-gray-900">
                                            {thesis.thesis_title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="text-gray-700 space-y-3">
                                            <p>
                                                <strong className="font-medium text-gray-900">Team:</strong> {thesis.team.title}
                                            </p>
                                            <p>
                                                <strong className="font-medium text-gray-900">PhD Student:</strong> {thesis.student.first_name} {thesis.student.last_name}
                                            </p>
                                            <p>
                                                <strong className="font-medium text-gray-900">Supervisor:</strong> {thesis.supervisor.first_name} {thesis.supervisor.last_name}
                                            </p>
                                            {thesis.co_supervisor && (
                                                <p>
                                                    <strong className="font-medium text-gray-900">Co-Supervisor:</strong> {thesis.co_supervisor.first_name} {thesis.co_supervisor.last_name}
                                                </p>
                                            )}
                                            <p>
                                                <strong className="font-medium text-gray-900">Keywords:</strong> {thesis.keywords}
                                            </p>
                                            <p>
                                                <strong className="font-medium text-gray-900">References:</strong> {thesis.references}
                                            </p>
                                            <p className="line-clamp-3">
                                                <strong className="font-medium text-gray-900">Abstract:</strong> {thesis.abstract}
                                            </p>
                                            <p>
                                                <strong className="font-medium text-gray-900">Advancement State:</strong> {thesis.advancement_state_percentage}%
                                            </p>
                                            <p>
                                                <strong className="font-medium text-gray-900">Description:</strong> {thesis.advancement_state_description}
                                            </p>
                                            <p>
                                                <strong className="font-medium text-gray-900">Supervisor Remarks:</strong> {thesis.supervisor_remarks}
                                            </p>
                                            {thesis.co_supervisor_remarks && (
                                                <p>
                                                    <strong className="font-medium text-gray-900">Co-Supervisor Remarks:</strong> {thesis.co_supervisor_remarks}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No theses available at the moment.</p>
                    )}
                </div>
            </SpaceLayout>

            {/* Add Thesis Modal */}
            <AddThesisModal
                isOpen={showModal}
                onClose={closeModal}
                phdStudents={phdStudents}
                labMembers={labMembers}
                labMembersC={labMembersC}
                team={team}
            />
        </Layout>
    );
};

export default SupCoSupSection;
