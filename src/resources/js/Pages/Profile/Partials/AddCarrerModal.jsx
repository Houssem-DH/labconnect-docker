
import { Link, useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";
const AddCarrerModal = ({ isOpen, onClose }) => {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors } =
        useForm({
            year: "",
            univ: "",
            speciality: "",
        });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("year", data.year);
        formData.append("univ", data.univ);
        formData.append("speciality", data.speciality);
        post(route("Profile.Carrer.Add", { id: user.id }),  {
            onSuccess: () => {
                onClose();
            }
        });
        
        
    };

    return (
        <div
            className={`fixed z-50 inset-0 overflow-y-auto ${
                isOpen ? "block" : "hidden"
            }`}
        >
            <div className=" flex items-center justify-center min-h-screen">
                <div
                    className=" fixed inset-0 transition-opacity"
                    aria-hidden="true"
                >
                    <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                </div>

                <div className=" bg-white-300 relative bg-white rounded-lg p-8 overflow-hidden max-w-3xl w-full">
                    <button
                        className="absolute top-2 right-2 text-gray-300 hover:text-gray-400"
                        onClick={onClose}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-bold mb-6 text-gray-800">
                        Add Career
                    </h1>
                    <form onSubmit={handleSubmit}>
                        {/* Year */}
                        <div className="mb-6">
                            <label
                                htmlFor="year"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Year
                            </label>
                            <input
                                type="date"
                                id="year"
                                name="year"
                               
                                onChange={(e) => setData("year", e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-500"
                            />
                            <InputError className="mt-2" message={errors.year} />
                        </div>

                        {/* University */}
                        <div className="mb-6">
                            <label
                                htmlFor="univ"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                University
                            </label>
                            <input
                                type="text"
                                id="univ"
                                name="univ"
                                
                                onChange={(e) => setData("univ", e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-500"
                            />
                            <InputError className="mt-2" message={errors.univ} />
                        </div>

                        {/* Speciality */}
                        <div className="mb-6">
                            <label
                                htmlFor="speciality"
                                className="block text-gray-700 font-semibold mb-2"
                            >
                                Speciality
                            </label>
                            <input
                                type="text"
                                id="speciality"
                                name="speciality"
                                
                                onChange={(e) => setData("speciality", e.target.value)}
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-gray-500"
                            />
                            <InputError className="mt-2" message={errors.speciality} />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-gray-800 text-white-500 px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                            >
                                Add Career
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCarrerModal;
