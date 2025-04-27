import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";

const EditMaterialModal = ({ isOpen, onClose, material }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: material?.name || "",
        use_case: material?.use_case || "",
        reference: material?.reference || "",
        description: material?.description || "",
        picture: "",
        reservation_price: material?.reservation_price || "",
        reservation_type: material?.reservation_type || "",
        availability: material?.availability || false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("lab.material.edit", { id: material.id }), {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Material</DialogTitle>
                    <DialogDescription>
                        Update the material details below
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} encType="multipart/form-data" className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className="mt-1"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="use_case">Use Case</Label>
                        <Input
                            id="use_case"
                            type="text"
                            name="use_case"
                            value={data.use_case}
                            className="mt-1"
                            onChange={(e) => setData("use_case", e.target.value)}
                        />
                        <InputError message={errors.use_case} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="reference">Reference</Label>
                        <Input
                            id="reference"
                            type="text"
                            name="reference"
                            value={data.reference}
                            className="mt-1"
                            onChange={(e) => setData("reference", e.target.value)}
                        />
                        <InputError message={errors.reference} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={data.description}
                            className="mt-1"
                            onChange={(e) => setData("description", e.target.value)}
                            rows="4"
                        />
                        <InputError message={errors.description} className="mt-1" />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="availability"
                            checked={data.availability}
                            onCheckedChange={(checked) => setData("availability", checked)}
                        />
                        <Label htmlFor="availability">Available for reservation</Label>
                    </div>
                    <InputError message={errors.availability} className="mt-1" />

                    <div>
                        <Label htmlFor="reservation_price">Reservation Price (DA)</Label>
                        <div className="relative mt-1">
                            <Input
                                type="number"
                                id="reservation_price"
                                name="reservation_price"
                                value={data.reservation_price}
                                onChange={(e) => setData("reservation_price", e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="pr-10"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                DA
                            </span>
                        </div>
                        <InputError message={errors.reservation_price} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="reservation_type">Reservation Type</Label>
                        <Select
                            value={data.reservation_type}
                            onValueChange={(value) => setData("reservation_type", value)}
                        >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select reservation type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hourly">Hourly</SelectItem>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="project">Project Basis</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.reservation_type} className="mt-1" />
                    </div>

                    <div>
                        <Label htmlFor="picture">Material Image</Label>
                        <div className="mt-1 flex items-center gap-4">
                            {material.picture && (
                                <div className="w-16 h-16 rounded-md overflow-hidden border">
                                    <img 
                                        src={`/storage/${material.picture}`} 
                                        alt="Current material"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <Input
                                type="file"
                                id="picture"
                                name="picture"
                                onChange={(e) => setData("picture", e.target.files[0])}
                            />
                        </div>
                        <InputError message={errors.picture} className="mt-1" />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditMaterialModal;