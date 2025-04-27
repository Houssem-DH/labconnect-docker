import { useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import { Transition } from "@headlessui/react";
import InputError from "@/Components/InputError";
import { FiCamera } from "react-icons/fi"; // Import FiCamera icon from react-icons/fi

const UploadBackgroundModal = ({ isOpen, onClose, lab }) => {
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            picture: null,
        });

        const submit = (e) => {
            e.preventDefault();
            console.log("Form data:", data);
            const formData = new FormData();
            formData.append("picture", data.picture);
            console.log("Form data after appending:", formData);
            post(route("manage-lab-picture", { id: lab.id }), formData);
            onClose();
        };
        

    return (
        <div
            className={`fixed z-50 inset-0 overflow-y-auto ${
                isOpen ? "block" : "hidden"
            }`}
        >
            <div className="flex items-center justify-center min-h-screen">
                <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                >
                    <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
                </div>

                <div className="relative bg-gray-100 rounded-lg p-12 overflow-hidden max-w-xl">
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

                    <div className="flex items-center justify-center mb-10">
                        <FiCamera className="h-12 w-12" />
                    </div>
                    <form onSubmit={submit} encType="multipart/form-data">
                        <h1 className="text-3xl font-bold mb-6 text-center">
                            Upload Background Image
                        </h1>

                        <input
                            type="file"
                            accept="image/*"
                            name="picture"
                            onChange={(e) =>
                                setData("picture", e.target.files[0])
                            } // Update avatar state on file change
                            className="mb-6 w-full border-gray-300 rounded-md p-4"
                        />
                        <InputError className="mt-2" message={errors.picture} />

                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing}>
                                Upload
                            </PrimaryButton>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-gray-600">
                                    Uploaded.
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadBackgroundModal;
