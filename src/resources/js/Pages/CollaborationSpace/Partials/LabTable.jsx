import React from "react";
import { Button } from "@/Components/ui/button";
import { FiTrash2 } from "react-icons/fi";
import { useForm, Head } from "@inertiajs/react";

const LabTable = ({ labs, labIds, project,user }) => {
    const labData = labs.filter((lab) => labIds.includes(lab.id.toString()));

    const { delete: deleteRequest } = useForm({});

    const handleDelete = (labId) => {
        // Handle the refuse action, e.g., send a request to the server
        deleteRequest(
            `/collaboration-space/projects/delete-labs/${project.id}/${labId}`
        );
    };

    return (
        <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-x-auto">
            {/* Table Header */}
            <div className="flex bg-gray-100 text-gray-700 border-b border-gray-300 font-medium text-sm">
                <div className="flex-1 py-3 px-4">Lab ID</div>
                <div className="flex-1 py-3 px-4">Lab Title</div>
                <div className="flex-1 py-3 px-4 text-right">Actions</div>
            </div>

            {/* Table Body */}
            {labData.length === 0 ? (
                <div className="flex py-3 px-4 text-center text-gray-500">
                    No labs assigned
                </div>
            ) : (
                labData.map((lab) => (
                    <div
                        key={lab.id}
                        className="flex items-center hover:bg-gray-50 border-b border-gray-200"
                    >
                        <div className="flex-1 py-3 px-4 text-gray-800 text-sm">
                            {lab.id}
                        </div>
                        <div className="flex-1 py-3 px-4 text-gray-800 text-sm">
                            {lab.title}
                        </div>
                        <div className="flex-1 py-3 px-4 text-right">
                            {user.director == 1 && (
                                <Button
                                    onClick={() => handleDelete(lab.id)}
                                    variant="outline"
                                    className="text-red-600 hover:bg-red-100 p-1"
                                >
                                    <FiTrash2 className="h-5 w-5" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default LabTable;
