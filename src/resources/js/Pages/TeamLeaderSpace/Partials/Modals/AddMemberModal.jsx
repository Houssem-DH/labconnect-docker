import React from "react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";

import { Head, useForm } from "@inertiajs/react";

const AddLabMemberModal = ({ onClose, team, lab_members }) => {
    const { data, setData, post, processing, errors } = useForm({
        user_id: "",

    });

    

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission based on the selected option

        

        post(route("team.leader.team.member.insert.in", { id: team.id }), {
            onSuccess: () => {
                onClose();
            },
        });

        onClose();
    };

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto flex justify-center items-center bg-black-500 bg-opacity-50 pt-48">
            <div className="bg-white-500 rounded-lg p-8 max-w-md w-full">
                <Head title="Register" />

                {/* Render inputs based on the selected option */}

                <div className="mt-4">
                    <InputLabel htmlFor="user_id" value="Member" />
                    <select
                        id="user_id"
                        name="user_id"
                        value={data.user_id}
                        onChange={(e) => setData("user_id", e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value="Select Member">Select Member</option>
                        {lab_members.map((member) => (
                            <option key={member.id} value={member.user.id}>
                                {member.user.first_name} {member.user.last_name}
                            </option>



                        ))}
                    </select>
                    <InputError
                        message={errors.user_id}
                        className="mt-2"
                    />
                </div>

                <PrimaryButton disabled={processing} onClick={handleSubmit}>
                    Submit
                </PrimaryButton>

                <div className="flex justify-end mt-6">
                    <button
                        type="button"
                        className="text-sm text-gray-600 hover:text-gray-900 mr-4"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddLabMemberModal;
