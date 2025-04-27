import { Link, useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";

const AddExperienceModal = ({ isOpen, onClose }) => {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors } = useForm({
        establishment: "",
        start_date: "",
        end_date: "",
        grade: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("establishment", data.establishment);
        formData.append("start_date", data.start_date);
        formData.append("end_date", data.end_date);
        formData.append("grade", data.grade);
        // Sending data to Laravel backend
        post(route("Profile.Professional.Experience.Add", { id: user.id }), data, {
            onSuccess: () => {
                onClose();
            }
           
            
        });
        onClose();
    };

    return (
        <div className={` fixed z-50 inset-0 overflow-y-auto ${isOpen ? "block" : "hidden"}`}>
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
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">Add Professional Experience</h1>
                    <form onSubmit={handleSubmit}>
                        

                        {/* Establishment */}
                        <div className="mb-6">
                            <label htmlFor="establishmenta" className="block text-gray-700 font-semibold mb-2">Establishment</label>
                            <input
                                type="text"
                                id="establishmenta"
                                name="establishment"
                                
                                onChange={(e) => setData("establishment", e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-500"
                            />
                            <InputError className="mt-2" message={errors.establishment} />
                        </div>

                        {/* Start Date */}
                        <div className="mb-6">
                            <label htmlFor="start_date" className="block text-gray-700 font-semibold mb-2">Start Date</label>
                            <input
                                type="date"
                                id="start_date"
                                name="start_date"
                                
                                onChange={(e) => setData("start_date", e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-500"
                            />
                            <InputError className="mt-2" message={errors.start_date} />
                        </div>

                        {/* End Date */}
                        <div className="mb-6">
                            <label htmlFor="end_date" className="block text-gray-700 font-semibold mb-2">End Date</label>
                            <input
                                type="date"
                                id="end_date"
                                name="end_date"
                                
                                onChange={(e) => setData("end_date", e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-500"
                            />
                            <InputError className="mt-2" message={errors.end_date} />
                        </div>

                        {/* Grade */}
                        <div className="mb-6">
                            <label htmlFor="grade" className="block text-gray-700 font-semibold mb-2">Grade</label>
                            <input
                                type="text"
                                id="grade"
                                name="grade"
                               
                                onChange={(e) => setData("grade", e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-500"
                            />
                            <InputError className="mt-2" message={errors.grade} />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button type="submit" className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700">Add Professional Experience</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddExperienceModal;
