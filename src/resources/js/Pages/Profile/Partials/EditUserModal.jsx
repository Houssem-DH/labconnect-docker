// EditUserModal.js

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/Components/ui/dialog";
import UpdateProfileInformationForm from "@/Pages/Profile/Partials/UpdateProfileInformationForm";

const EditUserModal = ({ isOpen, onClose, status, mustVerifyEmail,labm }) => {
    return (
        <div>
            <UpdateProfileInformationForm
                mustVerifyEmail={mustVerifyEmail}
                labm={labm}
                isOpen={isOpen}
                status={status}
                onClose={onClose}
            />
        </div>
    );
};

export default EditUserModal;
