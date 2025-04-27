import Layout from "@/Layouts/Layout";

import Avatar from "@/Components/Avatar";
import { useState, useRef, useEffect, useContext } from "react";
import { Head } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import UploadBackgroundModal from "./Partials/UploadBackgroundModal";
import UploadAvatarModal from "./Partials/UploadAvatarModal";
import EditUserModal from "./Partials/EditUserModal";
import AddTeachingExperienceModal from "./Partials/AddTeachingExperienceModal"; // New import
import EditTeachingExperienceModal from "./Partials/EditTeachingExperienceModal"; // New import
import AddMasterThesisModal from "./Partials/AddMasterThesisModal"; // New import
import EditMasterThesisModal from "./Partials/EditMasterThesisModal"; // New import
import AddEventModal from "./Partials/AddEventModal"; // New import
import EditEventModal from "./Partials/EditEventModal"; // New import
import { LanguageContext } from "@/lib/LanguageContext";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";
import {
    FiEdit as PencilIcon,
    FiTrash2 as TrashIcon,
    FiPlus as PlusIcon,
} from "react-icons/fi";

import AddExperienceModal from "./Partials/AddExperienceModal";
import EditExperienceModal from "./Partials/EditExperienceModal";
import DeleteExperienceModal from "./Partials/DeleteExperienceModal";

import Card from "@/Components/Card";
import HeaderCard from "@/Components/HeaderCard";
import RequestLabForm from "./Partials/RequestLabForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import background_image from "/public/assets/img/background_image.jpg";
import { FiCamera, FiEdit, FiTrash2 } from "react-icons/fi";
import { useForm } from "@inertiajs/react";

export default function Edit({
    auth,
    mustVerifyEmail,
    status,
    banned_user,
    labm,
    user,
    career,
    masterTheses,
    teachingExperiences,
    scientificEvents,
    professionalExperiences,
}) {
    const { language } = useContext(LanguageContext);
    const [isHovered, setIsHovered] = useState(false);
    const [isAvatarHovered, setIsAvatarHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isEditCarrerModalOpen, setIsEditCarrerModalOpen] = useState(false);
    const [isAddCarrerModalOpen, setIsAddCarrerModalOpen] = useState(false);
    const [cardHeight, setCardHeight] = useState("auto");
    const [selectedCareer, setSelectedCareer] = useState(null); // Added state to store selected career
    const [selecteddCareer, setSelecteddCareer] = useState(null); // Added state to store selected career

    // State variables for Master Thesis
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [isEditThesisModalOpen, setIsEditThesisModalOpen] = useState(false);
    const [isAddThesisModalOpen, setIsAddThesisModalOpen] = useState(false);

    // State variables for Teaching Experience
    const [selectedTeaching, setSelectedTeaching] = useState(null);
    const [isEditTeachingModalOpen, setIsEditTeachingModalOpen] =
        useState(false);
    const [isAddTeachingModalOpen, setIsAddTeachingModalOpen] = useState(false);

    // Functions to open and close modals for Master Thesis
    const openEditThesisModal = (thesis) => {
        setIsEditThesisModalOpen(true);
        setSelectedThesis(thesis);
    };

    const closeEditThesisModal = () => {
        setIsEditThesisModalOpen(false);
        setSelectedThesis(null);
    };

    const openAddThesisModal = () => {
        setIsAddThesisModalOpen(true);
    };

    const closeAddThesisModal = () => {
        setIsAddThesisModalOpen(false);
    };

    // Functions to open and close modals for Teaching Experience
    const openEditTeachingModal = (teaching) => {
        setIsEditTeachingModalOpen(true);
        setSelectedTeaching(teaching);
    };

    const closeEditTeachingModal = () => {
        setIsEditTeachingModalOpen(false);
        setSelectedTeaching(null);
    };

    const openAddTeachingModal = () => {
        setIsAddTeachingModalOpen(true);
    };

    const closeAddTeachingModal = () => {
        setIsAddTeachingModalOpen(false);
    };

    // State variables for Master Thesis
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

    // Functions to open and close modals for Teaching Experience
    const openEditEventModal = (teaching) => {
        setIsEditEventModalOpen(true);
        setSelectedEvent(teaching);
    };

    const closeEditEventModal = () => {
        setIsEditEventModalOpen(false);
        setSelectedEvent(null);
    };

    const openAddEventModal = () => {
        setIsAddEventModalOpen(true);
    };

    const closeAddEventModal = () => {
        setIsAddEventModalOpen(false);
    };

    const cardRef = useRef(null);
    const avatarRef = useRef(null);

    const handleHover = () => {
        setIsHovered(!isHovered);
    };

    const handleAvatarHover = () => {
        setIsAvatarHovered(!isAvatarHovered);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openAvatarModal = () => {
        setIsAvatarModalOpen(true);
    };

    const closeAvatarModal = () => {
        setIsAvatarModalOpen(false);
    };

    const openEditUserModal = () => {
        setIsEditUserModalOpen(true);
    };

    const closeEditUserModal = () => {
        setIsEditUserModalOpen(false);
    };

    const openAddCarrerModal = () => {
        setIsAddCarrerModalOpen(true);
    };

    const closeAddCarrerModal = () => {
        setIsAddCarrerModalOpen(false);
    };

    const openEditCarrerModal = (career) => {
        setIsEditCarrerModalOpen(true);
        setSelectedCareer(career); // Update career data when opening modal
    };

    const closeEditCarrerModal = () => {
        setIsEditCarrerModalOpen(false);
        setSelectedCareer(null); // Clear career data when closing modal
    };

    useEffect(() => {
        if (cardRef.current) {
            setCardHeight(`${cardRef.current.scrollHeight}px`);
        }
    }, [user]);

    const { delete: deleteRequest } = useForm({});
    const handleDeleteThesis = (thesis) => {
        // Wrap the deleteRequest call inside a callback function
        deleteRequest(`/profile-update/delete-master-thesis/${thesis.id}`);
    };

    const handleDeleteTeaching = (teaching) => {
        // Wrap the deleteRequest call inside a callback function
        deleteRequest(`/profile-update/delete-teaching/${teaching.id}`);
    };

    const handleDeleteEvent = (event) => {
        // Wrap the deleteRequest call inside a callback function
        deleteRequest(`/profile-update/delete-event/${event.id}`);
    };

    return (
        <Layout user={auth.user}>
            <Head title="Profile" />
            <div className="flex flex-col min-h-screen mt-24">
                <div className="flex-grow">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
                        <div className="space-y-6">
                            {user.is_banned === 1 ? (
                                <>
                                    <section
                                        className={`space-y-6 flex flex-col items-center justify-between min-h-screen`}
                                    >
                                        <header>
                                            <h2 className="text-lg font-medium text-red-700">
                                                You Are Banned
                                            </h2>
                                            <p className="mt-1 text-sm text-gray-600">
                                                Reason: {banned_user.reason}
                                            </p>
                                        </header>
                                    </section>
                                </>
                            ) : (
                                <>
                                    <div className="relative">
                                        <HeaderCard>
                                            <div
                                                onMouseEnter={handleHover}
                                                onMouseLeave={handleHover}
                                                ref={cardRef}
                                            >
                                                {user.background_photo ? (
                                                    <img
                                                        src={`storage/${user.background_photo}`}
                                                        alt="Background Photo"
                                                        className="w-full h-80 mb-4 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <img
                                                        src={background_image}
                                                        alt="Background Photo"
                                                        className="w-full h-80 mb-4 rounded-lg object-cover"
                                                    />
                                                )}

                                                {isHovered && (
                                                    <>
                                                        {user.id ===
                                                            auth.user?.id && (
                                                            <div className="absolute top-2 right-2">
                                                                <button
                                                                    className="bg-red-500 rounded-full p-2 text-white hover:bg-white-500"
                                                                    onClick={
                                                                        openModal
                                                                    }
                                                                >
                                                                    <FiCamera className="h-6 w-6" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            <div
                                                className="absolute bottom-0 left-20"
                                                onMouseEnter={handleAvatarHover}
                                                onMouseLeave={handleAvatarHover}
                                                ref={avatarRef}
                                            >
                                                <Avatar
                                                    user={user}
                                                    alt="Profile Picture"
                                                    className="w-32 h-32 rounded-full border-2 border-white relative"
                                                />
                                                {isAvatarHovered && (
                                                    <>
                                                        {user.id ===
                                                            auth.user?.id && (
                                                            <button
                                                                className="absolute bg-gray-900 rounded-full p-2 text-white hover:bg-gray-800"
                                                                style={{
                                                                    top: "50%",
                                                                    right: "8%",
                                                                    transform:
                                                                        "translate(-50%, -50%)",
                                                                }}
                                                                onClick={
                                                                    openAvatarModal
                                                                }
                                                            >
                                                                <FiCamera className="h-9 w-9" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </HeaderCard>
                                        <div className="pt-12">
                                            {/* User Information */}
                                            <div>
                                                <Card
                                                    collapsed={false}
                                                    header="Personal Information"
                                                    openEditModal={
                                                        openEditUserModal
                                                    }
                                                    editIconOpen={true}
                                                    user={user}
                                                    auth={auth.user}
                                                    className="bg-white shadow-md rounded-lg overflow-hidden"
                                                >
                                                    <div className="p-6">
                                                        <h1 className="text-3xl font-bold mb-4 text-gray-800">
                                                            {user.first_name}{" "}
                                                            {user.last_name}
                                                        </h1>

                                                        <div className="mb-4">
                                                            <p className="text-gray-700 mb-1">
                                                                Email:
                                                            </p>
                                                            <p className="text-lg font-semibold text-gray-800">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                        {user.phone_number && (
                                                            <div className="mb-4">
                                                                <p className="text-gray-700 mb-1">
                                                                    Phone
                                                                    Number:
                                                                </p>
                                                                <p className="text-lg font-semibold text-gray-800">
                                                                    {
                                                                        user.phone_number
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card>
                                            </div>

                                            {labm && (
                                                <div>
                                                    <div className="pt-12">
                                                        <Card
                                                            collapsed={false}
                                                            header="Teaching Experience"
                                                            addIconOpen={true}
                                                            user={user}
                                                            auth={auth.user}
                                                            openAddModal={
                                                                openAddTeachingModal
                                                            }
                                                            className="bg-white shadow-md rounded-lg overflow-hidden"
                                                        >
                                                            {teachingExperiences && (
                                                                <div className="p-6 space-y-4">
                                                                    {/* Loop through teaching experiences */}
                                                                    {teachingExperiences.map(
                                                                        (
                                                                            teaching
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    teaching.id
                                                                                }
                                                                                className="flex items-center justify-between p-4 border-b border-gray-200"
                                                                            >
                                                                                <div>
                                                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                                                        {
                                                                                            teaching.module
                                                                                        }
                                                                                    </h3>
                                                                                    <p className="text-gray-700">
                                                                                        {
                                                                                            teaching.speciality
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-gray-600">
                                                                                        {
                                                                                            teaching.level
                                                                                        }{" "}
                                                                                        -{" "}
                                                                                        {
                                                                                            teaching.year
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex items-center gap-4">
                                                                                    {user.id ===
                                                                                        auth
                                                                                            .user
                                                                                            ?.id && (
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                openEditTeachingModal(
                                                                                                    teaching
                                                                                                );
                                                                                            }}
                                                                                            className="text-blue-500 hover:underline"
                                                                                        >
                                                                                            <PencilIcon className="h-5 w-5" />
                                                                                        </button>
                                                                                    )}

                                                                                    {user.id ===
                                                                                        auth
                                                                                            .user
                                                                                            ?.id && (
                                                                                        <AlertDialog>
                                                                                            <AlertDialogTrigger
                                                                                                asChild
                                                                                            >
                                                                                                <button className="text-red-500 hover:underline">
                                                                                                    <TrashIcon className="h-5 w-5" />
                                                                                                </button>
                                                                                            </AlertDialogTrigger>
                                                                                            <AlertDialogContent>
                                                                                                <AlertDialogHeader>
                                                                                                    <AlertDialogTitle>
                                                                                                        {language ===
                                                                                                        "en"
                                                                                                            ? "Are you absolutely sure?"
                                                                                                            : language ===
                                                                                                              "ar"
                                                                                                            ? "هل أنت متأكد تمامًا؟"
                                                                                                            : "Êtes-vous absolument sûr?"}
                                                                                                    </AlertDialogTitle>

                                                                                                    <AlertDialogDescription>
                                                                                                        {language ===
                                                                                                        "en"
                                                                                                            ? "This action cannot be undone. This will permanently delete the Teaching and remove the data from our servers."
                                                                                                            : language ===
                                                                                                              "ar"
                                                                                                            ? "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف المنشأة بشكل دائم وإزالة البيانات من خوادمنا."
                                                                                                            : "Cette action ne peut pas être annulée. Cela supprimera définitivement l'établissement et supprimera les données de nos serveurs."}
                                                                                                    </AlertDialogDescription>
                                                                                                </AlertDialogHeader>
                                                                                                <AlertDialogFooter>
                                                                                                    <AlertDialogCancel>
                                                                                                        Cancel
                                                                                                    </AlertDialogCancel>
                                                                                                    <AlertDialogAction
                                                                                                        onClick={() =>
                                                                                                            handleDeleteTeaching(
                                                                                                                teaching
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        Continue
                                                                                                    </AlertDialogAction>
                                                                                                </AlertDialogFooter>
                                                                                            </AlertDialogContent>
                                                                                        </AlertDialog>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Card>
                                                    </div>

                                                    <div className="pt-12">
                                                        <Card
                                                            collapsed={false}
                                                            header="Master Thesis"
                                                            addIconOpen={true}
                                                            openAddModal={
                                                                openAddThesisModal
                                                            }
                                                            user={user}
                                                            auth={auth.user}
                                                            className="bg-white shadow-md rounded-lg overflow-hidden"
                                                        >
                                                            {masterTheses && (
                                                                <div className="p-6 space-y-4">
                                                                    {masterTheses.map(
                                                                        (
                                                                            thesis
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    thesis.id
                                                                                }
                                                                                className="flex items-center justify-between p-4 border-b border-gray-200"
                                                                            >
                                                                                <div>
                                                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                                                        {
                                                                                            thesis.title
                                                                                        }
                                                                                    </h3>
                                                                                    <p className="text-gray-700">
                                                                                        {
                                                                                            thesis.speciality
                                                                                        }
                                                                                    </p>
                                                                                    <p className="text-gray-600">
                                                                                        {
                                                                                            thesis.student
                                                                                        }{" "}
                                                                                        -{" "}
                                                                                        {
                                                                                            thesis.year
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex items-center gap-4">
                                                                                    {user.id ===
                                                                                        auth
                                                                                            .user
                                                                                            ?.id && (
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                openEditThesisModal(
                                                                                                    thesis
                                                                                                )
                                                                                            }
                                                                                            className="text-blue-500 hover:underline"
                                                                                        >
                                                                                            <PencilIcon className="h-5 w-5" />
                                                                                        </button>
                                                                                    )}

                                                                                    {user.id ===
                                                                                        auth
                                                                                            .user
                                                                                            ?.id && (
                                                                                        <AlertDialog>
                                                                                            <AlertDialogTrigger
                                                                                                asChild
                                                                                            >
                                                                                                <button className="text-red-500 hover:underline">
                                                                                                    <TrashIcon className="h-5 w-5" />
                                                                                                </button>
                                                                                            </AlertDialogTrigger>
                                                                                            <AlertDialogContent>
                                                                                                <AlertDialogHeader>
                                                                                                    <AlertDialogTitle>
                                                                                                        {language ===
                                                                                                        "en"
                                                                                                            ? "Are you absolutely sure?"
                                                                                                            : language ===
                                                                                                              "ar"
                                                                                                            ? "هل أنت متأكد تمامًا؟"
                                                                                                            : "Êtes-vous absolument sûr?"}
                                                                                                    </AlertDialogTitle>

                                                                                                    <AlertDialogDescription>
                                                                                                        {language ===
                                                                                                        "en"
                                                                                                            ? "This action cannot be undone. This will permanently delete the Master Thesis and remove the data from our servers."
                                                                                                            : language ===
                                                                                                              "ar"
                                                                                                            ? "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف المنشأة بشكل دائم وإزالة البيانات من خوادمنا."
                                                                                                            : "Cette action ne peut pas être annulée. Cela supprimera définitivement l'établissement et supprimera les données de nos serveurs."}
                                                                                                    </AlertDialogDescription>
                                                                                                </AlertDialogHeader>
                                                                                                <AlertDialogFooter>
                                                                                                    <AlertDialogCancel>
                                                                                                        Cancel
                                                                                                    </AlertDialogCancel>
                                                                                                    <AlertDialogAction
                                                                                                        onClick={() =>
                                                                                                            handleDeleteThesis(
                                                                                                                thesis
                                                                                                            )
                                                                                                        }
                                                                                                    >
                                                                                                        Continue
                                                                                                    </AlertDialogAction>
                                                                                                </AlertDialogFooter>
                                                                                            </AlertDialogContent>
                                                                                        </AlertDialog>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Card>
                                                    </div>

                                                    <div className="pt-12">
                                                        <Card
                                                            collapsed={false}
                                                            header="Scientific Events"
                                                            addIconOpen={true}
                                                            openAddModal={
                                                                openAddEventModal
                                                            }
                                                            user={user}
                                                            auth={auth.user}
                                                            className="bg-white shadow-lg rounded-xl overflow-hidden"
                                                        >
                                                            {scientificEvents && (
                                                                <div className="p-6 space-y-6">
                                                                    {scientificEvents.map(
                                                                        (
                                                                            event
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    event.id
                                                                                }
                                                                                className="flex flex-col space-y-4 p-6 bg-gray-50 rounded-lg shadow-sm"
                                                                            >
                                                                                <div className="flex justify-between items-start">
                                                                                    <div>
                                                                                        <h3 className="text-2xl font-bold text-gray-900">
                                                                                            {
                                                                                                event.title
                                                                                            }
                                                                                        </h3>
                                                                                        <p className="text-gray-700 text-sm mt-1">
                                                                                            {
                                                                                                event.description
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                    {user.id ===
                                                                                        auth
                                                                                            .user
                                                                                            ?.id && (
                                                                                        <div className="flex items-center gap-2">
                                                                                            <button
                                                                                                onClick={() =>
                                                                                                    openEditEventModal(
                                                                                                        event
                                                                                                    )
                                                                                                }
                                                                                                className="text-blue-500 hover:text-blue-700"
                                                                                            >
                                                                                                <PencilIcon className="h-6 w-6" />
                                                                                            </button>
                                                                                            <AlertDialog>
                                                                                                <AlertDialogTrigger
                                                                                                    asChild
                                                                                                >
                                                                                                    <button className="text-red-500 hover:text-red-700">
                                                                                                        <TrashIcon className="h-6 w-6" />
                                                                                                    </button>
                                                                                                </AlertDialogTrigger>
                                                                                                <AlertDialogContent>
                                                                                                    <AlertDialogHeader>
                                                                                                        <AlertDialogTitle>
                                                                                                            {language ===
                                                                                                            "en"
                                                                                                                ? "Are you sure?"
                                                                                                                : language ===
                                                                                                                  "ar"
                                                                                                                ? "هل أنت متأكد؟"
                                                                                                                : "Êtes-vous sûr ?"}
                                                                                                        </AlertDialogTitle>
                                                                                                        <AlertDialogDescription>
                                                                                                            {language ===
                                                                                                            "en"
                                                                                                                ? "This action cannot be undone."
                                                                                                                : language ===
                                                                                                                  "ar"
                                                                                                                ? "لا يمكن التراجع عن هذا الإجراء."
                                                                                                                : "Cette action est irréversible."}
                                                                                                        </AlertDialogDescription>
                                                                                                    </AlertDialogHeader>
                                                                                                    <AlertDialogFooter>
                                                                                                        <AlertDialogCancel>
                                                                                                            Cancel
                                                                                                        </AlertDialogCancel>
                                                                                                        <AlertDialogAction
                                                                                                            onClick={() =>
                                                                                                                handleDeleteEvent(
                                                                                                                    event
                                                                                                                )
                                                                                                            }
                                                                                                        >
                                                                                                            Delete
                                                                                                        </AlertDialogAction>
                                                                                                    </AlertDialogFooter>
                                                                                                </AlertDialogContent>
                                                                                            </AlertDialog>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        </Card>
                                                    </div>
                                                </div>
                                            )}

                                            {user.id === auth.user?.id && (
                                                <div className="pt-12">
                                                    <Card
                                                        collapsed={true}
                                                        header="Security"
                                                        className="bg-white shadow-md rounded-lg overflow-hidden"
                                                    >
                                                        <div className="p-6">
                                                            <UpdatePasswordForm />
                                                        </div>
                                                    </Card>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {auth.user && (
                <>
                    <UploadBackgroundModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                    />
                    <UploadAvatarModal
                        isOpen={isAvatarModalOpen}
                        onClose={closeAvatarModal}
                    />
                    <EditUserModal
                        isOpen={isEditUserModalOpen}
                        onClose={closeEditUserModal}
                        labm={labm}
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                    />

                    <AddTeachingExperienceModal
                        isOpen={isAddTeachingModalOpen}
                        onClose={closeAddTeachingModal}
                        user={user}
                    />

                    {selectedTeaching && (
                        <EditTeachingExperienceModal
                            isOpen={isEditTeachingModalOpen}
                            onClose={closeEditTeachingModal}
                            teaching={selectedTeaching}
                        />
                    )}

                    <AddMasterThesisModal
                        isOpen={isAddThesisModalOpen}
                        onClose={closeAddThesisModal}
                        user={user}
                    />
                    {selectedThesis && (
                        <EditMasterThesisModal
                            isOpen={isEditThesisModalOpen}
                            onClose={closeEditThesisModal}
                            thesis={selectedThesis}
                        />
                    )}

                    <AddEventModal
                        isOpen={isAddEventModalOpen}
                        onClose={closeAddEventModal}
                        user={user}
                    />

                    {selectedEvent && (
                        <EditEventModal
                            isOpen={isEditEventModalOpen}
                            onClose={closeEditEventModal}
                            event={selectedEvent}
                        />
                    )}
                </>
            )}
        </Layout>
    );
}
