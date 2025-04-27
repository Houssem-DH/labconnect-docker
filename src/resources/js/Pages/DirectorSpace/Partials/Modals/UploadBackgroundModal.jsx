import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button"; // Correct import for Button
import { Input } from "@/Components/ui/input"; // Correct import for Input
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog"; // Correct import for Dialog components
import { FiCamera } from "react-icons/fi";
import { Transition } from "@headlessui/react";

const UploadBackgroundModal = ({ isOpen, onClose, lab }) => {
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            picture: null,
        });

    const submit = (e) => {
        e.preventDefault();

        post(route("manage-lab-picture", { id: lab.id }), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-center text-gray-900">
                        <FiCamera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        Upload Background Image
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} encType="multipart/form-data">
                    <Input
                        type="file"
                        accept="image/*"
                        name="picture"
                        onChange={(e) => setData("picture", e.target.files[0])}
                        className="mb-4"
                    />
                    {errors.picture && (
                        <p className="text-sm text-red-500">{errors.picture}</p>
                    )}
                    <DialogFooter className="mt-4 flex justify-center">
                        <Button type="submit" disabled={processing}>
                            Upload
                        </Button>
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition ease-in-out duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600 ml-4">
                                Uploaded.
                            </p>
                        </Transition>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UploadBackgroundModal;
