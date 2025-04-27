import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/Components/ui/alert-dialog";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";

const DeleteMaterialModal = ({ isOpen, onClose, sc, author }) => {
    const { delete: deleteRequest } = useForm();

    const handleDelete = () => {
        // Wrap the deleteRequest call inside a callback function
        deleteRequest(
            `/director-space/manage-lab/manage-team/manage-scientific-production/delete-scientific-production-external-author/${sc.id}/${author}`
        );
        onClose();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Author</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this author? This action
                        cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteMaterialModal;
