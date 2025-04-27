import React from "react";
import { useForm } from "@inertiajs/react";

const AddResearchThemeModal = ({ onClose,team }) => {
    const { data, setData, post, errors } = useForm({
        title: "",
        description: "",
    });

 
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("lab.research.themes.insert", { id: team.id }), {
            onSuccess: onClose,
        });
    };

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto flex justify-center items-center bg-black-500 bg-opacity-50">
            <div className="bg-white-500 rounded-lg p-8 max-w-md w-full overflow-y-auto">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">
                        Add Research Theme
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        Close
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label
                            htmlFor="title"
                            className="block font-medium text-gray-700"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={(e) =>
                                setData("title", e.target.value)
                            }
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>

                    <div className="mt-4">
                        <label
                            htmlFor="description"
                            className="block font-medium text-gray-700"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full h-32 resize-none"
                        />
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddResearchThemeModal;
