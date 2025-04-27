import React from "react";
import { useForm } from "@inertiajs/react";

const DeleteExperienceModal = ({ experience, onClose, auth }) => {
    const { delete: deleteRequest } = useForm();

    // Function to handle delete action
    const handleDelete = () => {
        

        deleteRequest(route("Profile.Professional.Experience.Remove", { id: experience.id }));

        onClose();
    };

    return (
        <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full  bg-opacity-50 z-50">
            <div className="bg-white-300 p-8 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                <p className="text-gray-700 mb-6">
                    Are you sure you want to delete this Experience?
                </p>
                <div className="flex justify-between">
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 mr-2"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteExperienceModal;
