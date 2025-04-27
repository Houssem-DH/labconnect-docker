import Layout from "@/Layouts/CollaborationSpaceLayout";
import { Button } from "@/Components/ui/button";
import { 
    AlertDialog, 
    AlertDialogTrigger, 
    AlertDialogContent, 
    AlertDialogHeader, 
    AlertDialogFooter, 
    AlertDialogTitle, 
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from "@/Components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import React, { useState } from "react";
import { useForm, Head } from "@inertiajs/react";

const Invitations = ({
    auth,
    userRole,
    projects,
    lab,
    phd_thesis_count,
    phd_thesiss,
    projects_count,
    notifications,
}) => {
    const { put, delete: deleteRequest } = useForm({});
    const [dialogState, setDialogState] = useState({
        open: false,
        onConfirm: null,
    });

    const handleAccept = (projectId) => {
        put(
            route("collaboration.space.invitations.accept", {
                id: lab.id,
                id1: projectId,
            })
        );
    };

    const handleRefuse = (projectId) => {
        deleteRequest(
            `/collaboration-space/invitations/refuse/${lab.id}/${projectId}`
        );
    };

    const handleAccept2 = (phdId) => {
        put(
            route("collaboration.space.invitations.phd.accept", {
                id: auth.user.id,
                id1: phdId,
            })
        );
    };

    const handleRefuse2 = (phdId) => {
        deleteRequest(
            `/collaboration-space/invitations/phd/refuse/${auth.user.id}/${phdId}`
        );
    };

    const showConfirmation = (onConfirm) => {
        setDialogState({ open: true, onConfirm });
    };

    const closeDialog = () => {
        setDialogState({ open: false, onConfirm: null });
    };

    return (
        <Layout
            user={auth.user}
            userRole={userRole}
            projects_count={projects_count}
            phd_thesis_count={phd_thesis_count}
            notifications={notifications.list}
            notifications_count={notifications.count}
        >
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Invitations</h1>

                {/* Project Invitations */}
                <div className="bg-white shadow-md rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="text-left">Title</TableHead>
                                <TableHead className="text-left">Type</TableHead>
                                <TableHead className="text-left">Details</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects && projects.length > 0 ? (
                                projects.map((project) => (
                                    <TableRow key={project.id} className="hover:bg-gray-100">
                                        <TableCell className="font-medium text-gray-900">
                                            {project.title}
                                        </TableCell>
                                        <TableCell>{project.type}</TableCell>
                                        <TableCell>
                                            {project.invitations_abstract || "No abstract available"}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                onClick={() =>
                                                    showConfirmation(() =>
                                                        handleAccept(project.id)
                                                    )
                                                }
                                                className="bg-blue-600 text-white hover:bg-blue-700"
                                                size="sm"
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    showConfirmation(() =>
                                                        handleRefuse(project.id)
                                                    )
                                                }
                                                className="bg-red-500 text-white hover:bg-red-600"
                                                size="sm"
                                            >
                                                Refuse
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-600">
                                        No project invitations found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* PhD Thesis Invitations */}
                <div className="bg-white shadow-md rounded-lg mt-8">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="text-left">Title</TableHead>
                                <TableHead className="text-left">Details</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {phd_thesiss && phd_thesiss.length > 0 ? (
                                phd_thesiss.map((phd) => (
                                    <TableRow key={phd.id} className="hover:bg-gray-100">
                                        <TableCell className="font-medium text-gray-900">
                                            {phd.thesis_title}
                                        </TableCell>
                                        <TableCell>
                                            {phd.invitations_abstract || "No abstract available"}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                onClick={() =>
                                                    showConfirmation(() =>
                                                        handleAccept2(phd.id)
                                                    )
                                                }
                                                className="bg-blue-600 text-white hover:bg-blue-700"
                                                size="sm"
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    showConfirmation(() =>
                                                        handleRefuse2(phd.id)
                                                    )
                                                }
                                                className="bg-red-500 text-white hover:bg-red-600"
                                                size="sm"
                                            >
                                                Refuse
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center text-gray-600">
                                        No PhD thesis invitations found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Alert Dialog */}
                <AlertDialog open={dialogState.open} onOpenChange={closeDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to proceed with this action?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => {
                                dialogState.onConfirm();
                                closeDialog();
                            }}>
                                Confirm
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Layout>
    );
};

export default Invitations;
