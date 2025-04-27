import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox"; // Import Shadcn Checkbox
import { useForm } from "@inertiajs/react";

const EditServiceModal = ({ onClose, isOpen, service }) => {
    const { data, setData, post, processing, errors } = useForm({
        title: service.title,
        description: service.description,
        price: service.price,
        category: service.category,
        Keywords: service.Keywords,
        duration: service.duration,
        requirements: service.requirements,
        availability: service.availability ? 1 : 0, // Default to 1 or 0 based on service
        picture: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("lab.service.edit", { id: service.id }), {
            onSuccess: () => {
                onClose();
            },
            onError: (errorResponse) => {
                // Extract errors from the response and set them to the form
                if (errorResponse) {
                    // Assuming your backend returns errors in a standard format
                    const backendErrors = errorResponse.errors || {};
                    Object.keys(backendErrors).forEach((field) => {
                        setData(field, backendErrors[field]);
                    });
                }
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl overflow-y-scroll max-h-screen p-6">
                <DialogHeader>
                    <DialogTitle>Edit Service</DialogTitle>
                    <DialogDescription>
                        {/* Add additional description if needed */}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="mt-4">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows="4"
                        />
                        <InputError
                            message={errors.description}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="price">Price (DA)</Label>
                        <Input
                            id="price"
                            type="number"
                            value={data.price}
                            onChange={(e) => setData("price", e.target.value)}
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            type="text"
                            value={data.category}
                            onChange={(e) =>
                                setData("category", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.category}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="Keywords">Keywords</Label>
                        <Input
                            id="Keywords"
                            type="text"
                            value={data.Keywords}
                            onChange={(e) =>
                                setData("Keywords", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.Keywords}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="duration">Duration (in days)</Label>
                        <Input
                            id="duration"
                            type="number"
                            value={data.duration}
                            onChange={(e) =>
                                setData("duration", e.target.value)
                            }
                        />
                        <InputError
                            message={errors.duration}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="requirements">Requirements</Label>
                        <Textarea
                            id="requirements"
                            value={data.requirements}
                            onChange={(e) =>
                                setData("requirements", e.target.value)
                            }
                            className="w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows="4"
                        />
                        <InputError
                            message={errors.requirements}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-4 flex items-center">
                        <Checkbox
                            id="availability"
                            checked={data.availability === 1} // Checkbox is checked if availability is 1
                            onCheckedChange={
                                (value) =>
                                    setData("availability", value ? 1 : 0) // Set availability to 1 or 0
                            }
                        />
                        <Label htmlFor="availability" className="ml-2">
                            Available
                        </Label>
                    </div>
                    <InputError
                        message={errors.availability}
                        className="mt-2"
                    />

                    <div className="mt-4">
                        <Label htmlFor="picture">Picture</Label>
                        <div className="flex items-center space-x-4">
                            <Input
                                id="picture"
                                type="file"
                                onChange={(e) =>
                                    setData("picture", e.target.files[0])
                                }
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm cursor-pointer focus:outline-none focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </div>
                        <small className="text-gray-500">
                            Accepted formats: .jpg, .png, .gif
                        </small>
                        <InputError message={errors.picture} className="mt-2" />
                    </div>

                    <div className="flex justify-between mt-4">
                        <Button type="submit" disabled={processing}>
                            Edit
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Close
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditServiceModal;
