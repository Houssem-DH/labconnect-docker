import { useState, useEffect } from "react";
import { Link, useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";

const AddExperienceModal = ({ isOpen, onClose,experience }) => {
    const [formData, setFormData] = useState({
        establishmente: experience.establishment,
        start_datee: experience.start_date,
        end_datee: experience.end_date,
        gradee: experience.grade,
    });

    useEffect(() => {
        setFormData({
            establishmente: experience.establishment,
            start_datee: experience.start_date,
            end_datee: experience.end_date,
            gradee: experience.grade,
        });
    }, [experience]);

    const { data, errors, setData, put } = useForm(formData);

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("Profile.Professional.Experience.Edit", { id: experience.id }), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) {
        return null; // Render nothing when modal is closed
    }

    return (
        <div className={`fixed z-50 inset-0 overflow-y-auto ${isOpen ? "block" : "hidden"}`}>
            <div className="flex items-center justify-center min-h-screen">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                </div>

                <div className="bg-white-300 relative bg-white rounded-lg p-8 overflow-hidden max-w-3xl w-full">
                    <button className="absolute top-2 right-2 text-gray-300 hover:text-gray-400" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Professional Experience</h1>
                    <form onSubmit={handleSubmit}>
                        

                        {/* Establishment */}
                        <div className="mb-6">
                            <label htmlFor="establishmente" className="block text-gray-700 font-semibold mb-2">Establishment</label>
                            <input
                                type="text"
                                id="establishmente"
                                name="establishmente"
                                value={data.establishmente}
                                onChange={(e) => setData("establishmente", e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-500"
                            />
                            <InputError className="mt-2" message={errors.establishment} />
                        </div>

                        {/* Start Date */}
                        <div className="mb-6">
                            <label htmlFor="start_datee" className="block text-gray-700 font-semibold mb-2">Start Date</label>
                            <input
                                type="date"
                                id="start_datee"
                                name="start_datee"
                                value={data.start_datee}
                                onChange={(e) => setData("start_datee", e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-500"
                            />
                            <InputError className="mt-2" message={errors.start_date} />
                        </div>

                        {/* End Date */}
                        <div className="mb-6">
                            <label htmlFor="end_datee" className="block text-gray-700 font-semibold mb-2">End Date</label>
                            <input
                                type="date"
                                id="end_datee"
                                name="end_datee"
                                value={data.end_datee}
                                onChange={(e) => setData("end_datee", e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-500"
                            />
                            <InputError className="mt-2" message={errors.end_date} />
                        </div>

                        {/* Grade */}
                        <div className="mb-6">
                            <label htmlFor="gradee" className="block text-gray-700 font-semibold mb-2">Grade</label>
                            <input
                                type="text"
                                id="gradee"
                                name="gradee"
                                value={data.gradee}
                                onChange={(e) => setData("gradee", e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-500"
                            />
                            <InputError className="mt-2" message={errors.grade} />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button type="submit" className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Edit Experience</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddExperienceModal;
