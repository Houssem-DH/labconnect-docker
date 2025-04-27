import React, { useEffect, useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm } from "@inertiajs/react";

const AddLabMemberModal = ({ onClose, lab, lab_members }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        team_leader_id: null,
        title: "",
        localisation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("lab.team.insert", { id: lab.id }), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto flex justify-center items-center bg-black-500 bg-opacity-50">
            <div className="bg-white-500 rounded-lg p-8 max-w-md w-full">
                <Head title="Register" />

                <form onSubmit={submit}>
                    <div className="mt-4">
                        <InputLabel htmlFor="title" value="Title" />
                        <TextInput
                            id="title"
                            type="text"
                            name="title"
                            value={data.title}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("title", e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="localisation" value="Localisation" />
                        <TextInput
                            id="localisation"
                            type="text"
                            name="localisation"
                            value={data.localisation}
                            className="mt-1 block w-full"
                            onChange={(e) => setData("localisation", e.target.value)}
                        />
                        <InputError message={errors.localisation} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="team_leader_id" value="Team Leader" />
                        <select
                            id="team_leader_id"
                            name="team_leader_id"
                            value={data.team_leader_id}
                            onChange={(e) => setData("team_leader_id", e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        >
                            <option value="">Select Team Leader</option>
                            {lab_members.map((member) => (
                                <option key={member.id} value={member.user.id}>
                                    {member.user.first_name} {member.user.last_name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.team_leader_id} className="mt-2" />
                    </div>

                    <PrimaryButton disabled={processing} className="mt-4">
                        Add
                    </PrimaryButton>
                </form>

                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        className="text-sm text-gray-600 hover:text-gray-900 mr-4"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddLabMemberModal;
