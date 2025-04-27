import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { FiTrash2, FiPlus, FiEdit } from "react-icons/fi";
import { Button } from "@/Components/ui/button";
import AddGlobalReportModal from "./Modals/AddGlobalReportModal";
import EditGlobalReportModal from "./Modals/EditGlobalReportModal";
import Avatar from "@/Components/Avatar";
import { Badge } from "@/Components/ui/badge";

const GlobalReportCard = ({ globalReport, project, isProjectMember,isProjectLeader }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);

    return (
        <Card className="border border-gray-300 shadow-lg rounded-lg bg-white overflow-hidden">
            <CardHeader className="bg-gray-100 border-b border-gray-200 p-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex justify-between items-center">
                    Global Report
                    {globalReport && (
                        <>
                            {(isProjectMember.length!= 0 && isProjectLeader)  && (
                                <FiEdit
                                    className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition"
                                    onClick={openEditModal}
                                />
                            )}
                        </>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex justify-end mb-6">
                    {!globalReport && (
                        <>
                            {(isProjectMember.length!= 0 && isProjectLeader) && (
                                <Button
                                    onClick={openAddModal}
                                    className=" text-white transition flex items-center"
                                >
                                    <FiPlus className="w-5 h-5 mr-2" /> Add A
                                    Global Report
                                </Button>
                            )}
                        </>
                    )}
                </div>

                {globalReport ? (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Avatar
                                user={globalReport.user}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <div className="font-medium text-gray-900 text-lg">
                                    {globalReport.user.first_name}{" "}
                                    {globalReport.user.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {globalReport.user.email}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Advancement State
                            </h3>
                            <p className="text-gray-700 mt-2">
                                {globalReport.advancement_state}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500">
                        {isProjectMember
                            ? "No report available. Please add a report."
                            : "No report available"}
                    </p>
                )}
            </CardContent>

            {/* Add modal component */}
            {isAddModalOpen && (
                <AddGlobalReportModal
                    onClose={closeAddModal}
                    project={project}
                />
            )}

            {/* Edit modal component */}
            {isEditModalOpen && (
                <EditGlobalReportModal
                    onClose={closeEditModal}
                    project={project}
                    gr={globalReport}
                    
                />
            )}
        </Card>
    );
};

export default GlobalReportCard;
