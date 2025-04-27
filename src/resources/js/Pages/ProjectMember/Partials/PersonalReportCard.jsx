import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { FiPlus, FiEdit } from "react-icons/fi";
import { Button } from "@/Components/ui/button";
import AddPersonalReportModal from "./Modals/AddPersonalReportModal";
import EditPersonalReportModal from "./Modals/EditPersonalReportModal";
import Avatar from "@/Components/Avatar";
import { Badge } from "@/Components/ui/badge";

const PersonalReportCard = ({
    personalReports,
    personalReport,
    project,
    user,
    isProjectMember,

    isExternalMember,
}) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    console.log(personalReports.length);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = (report) => {
        setSelectedReport(report);
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);

    return (
        <Card className="border border-gray-300 shadow-lg rounded-lg bg-white overflow-hidden">
            <CardHeader className="bg-gray-100 border-b border-gray-200 p-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex justify-between items-center">
                    Personal Reports
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex justify-end mb-6">
                    {!personalReport && (
                        <>
                            {(isProjectMember.length != 0 ||
                                isExternalMember.length != 0) && (
                                <Button
                                    onClick={openAddModal}
                                    className=" text-white transition flex items-center"
                                >
                                    <FiPlus className="w-5 h-5 mr-2" /> 
                                    Add A Personal Report
                                </Button>
                            )}
                        </>
                    )}
                </div>

                {personalReports.length != 0 ? (
                    personalReports.map((report) => (
                        <div
                            key={report.id}
                            className="p-4 mb-4 bg-gray-50 rounded-lg shadow-sm"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <Avatar
                                        user={report.user}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            {report.user.first_name}{" "}
                                            {report.user.last_name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {report.user.email}
                                        </div>
                                    </div>
                                </div>
                                {report.user.id == user.id && (
                                    <FiEdit
                                        className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition"
                                        onClick={() => openEditModal(report)}
                                    />
                                )}
                            </div>

                            <div className="mt-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Report Details
                                </h3>
                                <p className="text-gray-700 mt-2">
                                    {report.advancement_state}
                                </p>
                            </div>
                        </div>
                    ))
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
                <AddPersonalReportModal
                    onClose={closeAddModal}
                    project={project}
                />
            )}

            {/* Edit modal component */}
            {isEditModalOpen && (
                <EditPersonalReportModal
                    onClose={closeEditModal}
                    project={project}
                    pr={selectedReport} // Pass the existing report for editing
                />
            )}
        </Card>
    );
};

export default PersonalReportCard;
