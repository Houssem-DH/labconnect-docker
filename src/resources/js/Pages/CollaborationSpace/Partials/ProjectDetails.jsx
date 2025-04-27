import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import InviteLabs from "./Modals/InviteLabsModal";
import EditProject from "./Modals/EditProjectModal";
import { useForm } from "@inertiajs/react";
import LabTable from "./LabTable";
import { FiTrash2, FiEdit } from "react-icons/fi";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/Components/ui/alert-dialog";
import {
    HiOutlineDocumentText,
    HiOutlineCode,
    HiOutlineViewGrid,
    HiOutlineUserCircle,
    HiOutlineLightBulb,
    HiOutlineTag,
    HiOutlineChartBar,
    HiOutlineAdjustments,
} from "react-icons/hi";

const icons = {
    Type: <HiOutlineDocumentText className="w-6 h-6 text-gray-700" />,
    Code: <HiOutlineCode className="w-6 h-6 text-gray-700" />,
    Title: <HiOutlineViewGrid className="w-6 h-6 text-gray-700" />,
    Problematic: <HiOutlineUserCircle className="w-6 h-6 text-gray-700" />,
    Reference: <HiOutlineDocumentText className="w-6 h-6 text-gray-700" />,
    Objective: <HiOutlineLightBulb className="w-6 h-6 text-gray-700" />,
    Expected_Results: <HiOutlineChartBar className="w-6 h-6 text-gray-700" />,
    Keywords: <HiOutlineTag className="w-6 h-6 text-gray-700" />,
    Methodology: <HiOutlineAdjustments className="w-6 h-6 text-gray-700" />,
    Material: <HiOutlineDocumentText className="w-6 h-6 text-gray-700" />,
    Project_Display: <HiOutlineViewGrid className="w-6 h-6 text-gray-700" />,
};

const formatList = (items) => {
    if (!items || !Array.isArray(items))
        return <p className="text-gray-600">No items</p>;
    return (
        <ul className="list-disc list-inside text-gray-700">
            {items.map((item, index) => (
                <li key={index} className="text-sm">
                    {item}
                </li>
            ))}
        </ul>
    );
};

const ProjectDetails = ({
    project,
    lab_members,
    labs,
    lab,
    establishments,
    domains,
    user,
}) => {
    const details = {
        Type: project.type,
        Code: project.code,
        Title: project.title,
        Problematic: project.problematic,
        Reference: project.reference,
        Objective: project.objective,
        Expected_Results: project.expected_results
            ? JSON.parse(project.expected_results)
            : [],
        Keywords: project.keywords,
        Methodology: project.methodology,
        Material: project.material ? JSON.parse(project.material) : [],
    };

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);

    const { delete: deleteRequest } = useForm();

    const handleDelete = () => {
        // Wrap the deleteRequest call inside a callback function
        deleteRequest(
            `/collaboration-space/manage-lab/delete-project/${project.id}`
        );
        onClose();
    };

    return (
        <Card className="border border-gray-300 shadow-md rounded-lg bg-white overflow-hidden">
            <CardHeader className="bg-gray-200 border-b border-gray-300 p-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        Project Details
                    </CardTitle>
                    {user.director === 1 && (
                        <div className="flex items-center space-x-2">
                            <Button
                                onClick={openAddModal}
                                className=" text-white transition"
                            >
                                Invite Labs
                            </Button>
                            <FiEdit
                                onClick={openEditModal}
                                className=" w-6 h-6 text-blue-600 cursor-pointer hover:text-blue-800 transition"
                            />

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button className="bg-red-200 p-2 rounded hover:bg-red-300">
                                        <FiTrash2 className="w-5 h-5 text-red-600" />
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This
                                            will permanently delete the project
                                            and remove the data from our
                                            servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(details).map(([label, value]) => (
                        <div key={label} className="flex items-start space-x-4">
                            <div className="flex-shrink-0">{icons[label]}</div>
                            <div className="flex flex-col">
                                <Label className="text-gray-800 font-semibold">
                                    {label}
                                </Label>
                                {Array.isArray(value) ? (
                                    formatList(value)
                                ) : (
                                    <p className="text-gray-700 text-sm">
                                        {value}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            <InviteLabs
                isOpen={isAddModalOpen}
                onClose={closeAddModal}
                lab={lab}
                lab_members={lab_members}
                doms={domains}
                labs={labs}
                establishments={establishments}
                project={project}
            />
            {isEditModalOpen && (
                <EditProject
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    project={project}
                    lab={lab}
                    labs={labs}
                    doms={domains}
                    establishments={establishments}
                    lab_members={lab_members}
                />
            )}
        </Card>
    );
};

export default ProjectDetails;
