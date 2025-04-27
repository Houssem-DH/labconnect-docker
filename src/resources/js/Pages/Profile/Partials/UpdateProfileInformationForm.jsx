import InputError from "@/Components/InputError";
import React, { useContext } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

import { Transition } from "@headlessui/react";

import { usePage } from "@inertiajs/react";

const UpdateProfileInformation = ({ isOpen, onClose, status, labm }) => {
    
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone_number: user.phone_number || "", // Default value for phone number
            domain: labm?.research_domain || "", // Default value for domain
            speciality: labm?.research_specialty || "", // Default value for specialty
        });

    const submit = (e) => {
        e.preventDefault();
        post(route("profile.update", { id: user.id }), {
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Update Profile Information
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <Label
                            htmlFor="first_name"
                            className="block text-gray-700"
                        >
                            First Name
                        </Label>
                        <Input
                            id="first_name"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            required
                            className="mt-1"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.first_name}
                        />
                    </div>

                    <div>
                        <Label
                            htmlFor="last_name"
                            className="block text-gray-700"
                        >
                            Last Name
                        </Label>
                        <Input
                            id="last_name"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            required
                            className="mt-1"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.last_name}
                        />
                    </div>

                    <div>
                        <Label htmlFor="email" className="block text-gray-700">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            required
                            className="mt-1"
                        />
                        <InputError className="mt-2" message={errors.email} />
                    </div>

                    <div>
                        <Label
                            htmlFor="phone_number"
                            className="block text-gray-700"
                        >
                            Phone Number
                        </Label>
                        <Input
                            id="phone_number"
                            value={data.phone_number}
                            onChange={(e) =>
                                setData("phone_number", e.target.value)
                            }
                            className="mt-1"
                        />
                        <InputError
                            className="mt-2"
                            message={errors.phone_number}
                        />
                    </div>
                    {labm && (
                        <>
                            <div>
                                <Label
                                    htmlFor="domain"
                                    className="block text-gray-700"
                                >
                                    Domain
                                </Label>
                                <Input
                                    id="domain"
                                    value={data.domain}
                                    onChange={(e) =>
                                        setData("domain", e.target.value)
                                    }
                                    className="mt-1"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.domain}
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="speciality"
                                    className="block text-gray-700"
                                >
                                    Specialty
                                </Label>
                                <Input
                                    id="speciality"
                                    value={data.speciality}
                                    onChange={(e) =>
                                        setData("speciality", e.target.value)
                                    }
                                    className="mt-1"
                                />
                                <InputError
                                    className="mt-2"
                                    message={errors.speciality}
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-4">
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                    </div>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileInformation;
