import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import {
    BookOpen,
    Globe,
    FileText,
    Link,
    Edit3,
    File,
    Calendar,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/Components/ui/alert-dialog";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { motion } from "framer-motion";
import EditScModal from "./Modals/EditScModal";
import { Button } from "@/Components/ui/button";
import { useForm } from "@inertiajs/react";

const ScientificProductionDetails = ({ production }) => {
    const { delete: deleteRequest } = useForm();

    const handleDelete = () => {
        // Wrap the deleteRequest call inside a callback function
        deleteRequest(
            `/team-leader-space/scientific-productions/delete/${production.id}`
        );
        onClose();
    };

    // Helper function to render additional details based on production type
    const renderAdditionalDetails = () => {
        switch (production.type) {
            case "Journal":
                return (
                    <>
                        <p>
                            <Globe className="inline-block mr-2" />{" "}
                            <strong>Volume:</strong>{" "}
                            {production.journal?.[0]?.volume}
                        </p>
                        <p>
                            <Globe className="inline-block mr-2" />{" "}
                            <strong>Number:</strong>{" "}
                            {production.journal?.[0]?.number}
                        </p>
                        <p>
                            <FileText className="inline-block mr-2" />{" "}
                            <strong>Pages:</strong>{" "}
                            {production.journal?.[0]?.Pages}
                        </p>
                        <p>
                            <Link className="inline-block mr-2" />{" "}
                            <strong>DOI:</strong> {production.journal?.[0]?.doi}
                        </p>
                    </>
                );
            case "Proceeding":
                return (
                    <>
                        <p>
                            <Globe className="inline-block mr-2" />{" "}
                            <strong>Volume:</strong>{" "}
                            {production.proceeding?.[0]?.volume}
                        </p>
                        <p>
                            <Edit3 className="inline-block mr-2" />{" "}
                            <strong>Editors:</strong>{" "}
                            {production.proceeding?.[0]?.editors}
                        </p>
                        <p>
                            <BookOpen className="inline-block mr-2" />{" "}
                            <strong>Publishing House:</strong>{" "}
                            {production.proceeding?.[0]?.publishing_house}
                        </p>
                        <p>
                            <FileText className="inline-block mr-2" />{" "}
                            <strong>Pages:</strong>{" "}
                            {production.proceeding?.[0]?.Pages}
                        </p>
                        <p>
                            <Link className="inline-block mr-2" />{" "}
                            <strong>DOI:</strong>{" "}
                            {production.proceeding?.[0]?.doi}
                        </p>
                    </>
                );
            case "Conference":
                return (
                    <>
                        <p>
                            <Globe className="inline-block mr-2" />{" "}
                            <strong>Conference Location:</strong>{" "}
                            {production.conference?.[0]?.conference_location}
                        </p>
                        <p>
                            <FileText className="inline-block mr-2" />{" "}
                            <strong>Pages:</strong>{" "}
                            {production.conference?.[0]?.Pages}
                        </p>
                        <p>
                            <Link className="inline-block mr-2" />{" "}
                            <strong>DOI:</strong>{" "}
                            {production.conference?.[0]?.doi}
                        </p>
                    </>
                );
            case "Chapter":
                return (
                    <>
                        <p>
                            <Edit3 className="inline-block mr-2" />{" "}
                            <strong>Editors:</strong>{" "}
                            {production.chapter?.[0]?.editors}
                        </p>
                        <p>
                            <BookOpen className="inline-block mr-2" />{" "}
                            <strong>Edition:</strong>{" "}
                            {production.chapter?.[0]?.edition}
                        </p>
                        <p>
                            <BookOpen className="inline-block mr-2" />{" "}
                            <strong>Publishing House:</strong>{" "}
                            {production.chapter?.[0]?.publishing_house}
                        </p>
                        <p>
                            <Globe className="inline-block mr-2" />{" "}
                            <strong>Country:</strong>{" "}
                            {production.chapter?.[0]?.country}
                        </p>
                        <p>
                            <FileText className="inline-block mr-2" />{" "}
                            <strong>Pages:</strong>{" "}
                            {production.chapter?.[0]?.Pages}
                        </p>
                        <p>
                            <File className="inline-block mr-2" />{" "}
                            <strong>ISBN:</strong>{" "}
                            {production.chapter?.[0]?.isbn}
                        </p>
                    </>
                );
            case "Book":
                return (
                    <>
                        <p>
                            <BookOpen className="inline-block mr-2" />{" "}
                            <strong>Edition:</strong>{" "}
                            {production.book?.[0]?.edition}
                        </p>
                        <p>
                            <BookOpen className="inline-block mr-2" />{" "}
                            <strong>Publishing House:</strong>{" "}
                            {production.book?.[0]?.publishing_house}
                        </p>
                        <p>
                            <File className="inline-block mr-2" />{" "}
                            <strong>ISBN:</strong> {production.book?.[0]?.isbn}
                        </p>
                    </>
                );
            default:
                return <p>No additional details available.</p>;
        }
    };

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const openEditModal = () => setIsEditModalOpen(true);
    const closeEditModal = () => setIsEditModalOpen(false);

    return (
        <Card className="border border-gray-300 shadow-lg rounded-lg bg-white overflow-hidden">
            <CardHeader className="bg-gray-100 border-b border-gray-200 p-4">
                <CardTitle className="text-xl font-semibold text-gray-800 flex justify-between items-center">
                    Production Details
                    <div className="flex items-center space-x-2">
                        <FiEdit
                            onClick={() => openEditModal()}
                            className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800 transition"
                        />

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button className="bg-red-200 p-2 rounded hover:bg-red-300">
                                    <FiTrash2 className="w-5 h-5 text-red-600" />
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete the Sceintific Production and
                                        remove the data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <p>
                    <FileText className="inline-block mr-2" />{" "}
                    <strong>Title:</strong> {production.title}
                </p>
                <p>
                    <Globe className="inline-block mr-2" />{" "}
                    <strong>Type:</strong> {production.type}
                </p>
                <p>
                    <Calendar className="inline-block mr-2" />{" "}
                    <strong>Year of Publication:</strong>{" "}
                    {production.year_publication}
                </p>
                <p>
                    <FileText className="inline-block mr-2" />{" "}
                    <strong>Description:</strong> {production.description}
                </p>
                <p>
                    <Link className="inline-block mr-2" /> <strong>URL:</strong>{" "}
                    <a href={production.url} className="text-blue-600">
                        {production.url}
                    </a>
                </p>
                {/* Render additional details based on production type */}
                {renderAdditionalDetails()}
            </CardContent>
            {/* Edit modal component */}
            {isEditModalOpen && (
                <EditScModal
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    sc={production}
                />
            )}
        </Card>
    );
};

export default ScientificProductionDetails;
