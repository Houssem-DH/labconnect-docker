import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { useForm } from "@inertiajs/react";

const EditMaterialModal = ({ isOpen, onClose, activity }) => {
    const { data, setData, post, processing, errors } = useForm({
        title: activity?.title || "",
        description: activity?.description || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("lab.activity.edit", { id: activity.id }), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Scientific Activity</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} encType="multipart/form-data">
                    <div className="mt-4">
                        <Label htmlFor="title" value="Title" />
                        <Input
                            id="title"
                            type="text"
                            name="name"
                            value={data.title}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="description" value="Description" />

                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            autoComplete="description"
                            placeholder="Description"
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            required
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="flex justify-between mt-4">
                        <Button type="submit" disabled={processing}>
                            Update
                        </Button>
                        <button
                            type="button"
                            className="text-sm text-gray-600 hover:text-gray-900"
                            onClick={() => onClose()}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditMaterialModal;
