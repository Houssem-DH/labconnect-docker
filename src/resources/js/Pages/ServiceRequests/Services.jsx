import React, { useContext, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { LanguageContext } from "@/lib/LanguageContext";
import { Button } from "@/Components/ui/button";
import Layout from "@/Layouts/Layout";
import AddRequestModal from "./Partials/Modals/AddRequestModal";
import EditRequestModal from "./Partials/Modals/EditRequestModal";
import ViewDetailsModal from "./Partials/Modals/ViewDetailsModal"; // Import the new modal
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
} from "@/Components/ui/card";
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
import { Trash, Edit, UserPlus } from "lucide-react";

const Services = ({
    auth,
    service_requests,
    exist_service_requests, // Make sure this is passed into the component
    labs,
    establishments,
    domains,
}) => {
    const { language } = useContext(LanguageContext);
    const [showAddRequestModal, setShowAddRequestModal] = useState(false);
    const [showEditRequestModal, setShowEditRequestModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false); // Add state for details modal
    const [selectedService, setSelectedService] = useState(null);

    const openAddModal = () => setShowAddRequestModal(true);
    const closeAddModal = () => setShowAddRequestModal(false);

    const openEditModal = (service) => {
        setShowEditRequestModal(true);
        setSelectedService(service);
    };
    const closeEditModal = () => {
        setShowEditRequestModal(false);
        setSelectedService(null);
    };

    const openDetailsModal = (service) => {
        setSelectedService(service);
        setShowDetailsModal(true);
    };
    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedService(null);
    };

    const { delete: deleteRequest } = useForm();
    const handleDelete = (service) => {
        deleteRequest(`/services/request/delete/${service.id}`);
    };

    return (
        <Layout user={auth.user}>
            <Head title="Service Requests" />
            <div className="py-32 px-4 md:px-8 lg:px-16 min-h-screen">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide mb-4 sm:mb-0">
                        {language === "en"
                            ? "My Service Requests"
                            : language === "ar"
                            ? "طلباتي"
                            : "Mes demandes de service"}
                    </h1>
                    <Button
                        onClick={openAddModal}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white hover:from-purple-600 hover:to-red-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 rounded-lg px-6 py-3 font-semibold text-lg"
                    >
                        <UserPlus className="w-5 h-5" />
                        {language === "en"
                            ? "Request a Service"
                            : language === "ar"
                            ? "طلب خدمة"
                            : "Demander un service"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Display service_requests */}
                    {service_requests.length > 0 ? (
                        service_requests.map((request) => (
                            <Card
                                key={request.id}
                                className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-100 hover:border-gray-300 hover:ring-2 hover:ring-indigo-300"
                            >
                                <CardHeader className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white rounded-t-2xl">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-2xl font-bold text-gray-800">
                                            {request.title}
                                        </CardTitle>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() =>
                                                    openEditModal(request)
                                                }
                                                className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-all transform hover:scale-110"
                                                title="Edit"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>

                                            {/* Delete Action */}
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button
                                                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-all transform hover:scale-110"
                                                        title="Delete"
                                                    >
                                                        <Trash className="w-5 h-5" />
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            {language === "en"
                                                                ? "Are you absolutely sure?"
                                                                : language ===
                                                                  "ar"
                                                                ? "هل أنت متأكد تمامًا؟"
                                                                : "Êtes-vous absolument sûr?"}
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {language === "en"
                                                                ? "This action cannot be undone. This will permanently delete the Service and remove the data from our servers."
                                                                : language ===
                                                                  "ar"
                                                                ? "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف المنشأة بشكل دائم وإزالة البيانات من خوادمنا."
                                                                : "Cette action est irréversible. Cela supprimera définitivement le membre du laboratoire et supprimera les données de nos serveurs."}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            {language === "en"
                                                                ? "Cancel"
                                                                : language ===
                                                                  "ar"
                                                                ? "إلغاء"
                                                                : "Annuler"}
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                handleDelete(
                                                                    request
                                                                )
                                                            }
                                                            className="bg-red-600 text-white hover:bg-red-700"
                                                        >
                                                            {language === "en"
                                                                ? "Delete"
                                                                : language ===
                                                                  "ar"
                                                                ? "حذف"
                                                                : "Supprimer"}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <CardDescription className="text-gray-700 mb-2 leading-relaxed">
                                        {request.description}
                                    </CardDescription>
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <p>
                                            <span className="font-medium text-indigo-600">
                                                Applicant Type:
                                            </span>{" "}
                                            {request.applicant_type}
                                        </p>
                                        <p>
                                            <span className="font-medium text-indigo-600">
                                                Email:
                                            </span>{" "}
                                            {request.applicant_adresse_email ||
                                                "N/A"}
                                        </p>
                                        <p>
                                            <span className="font-medium text-indigo-600">
                                                Requested By:
                                            </span>{" "}
                                            {new Date(
                                                request.request_date
                                            ).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <span className="font-medium text-indigo-600">
                                                Required By:
                                            </span>{" "}
                                            {new Date(
                                                request.required_by
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="px-5 py-4 bg-gradient-to-r from-white to-indigo-50 border-t border-gray-200 flex items-center justify-between rounded-b-2xl">
                                    <button
                                        onClick={() =>
                                            openDetailsModal(request)
                                        }
                                        className="text-indigo-600 hover:text-indigo-800 transition font-semibold underline decoration-indigo-300 hover:decoration-indigo-600"
                                    >
                                        View Details →
                                    </button>
                                    <div className="absolute right-2">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                                                // Check if any status is "accepted"
                                                Object.values(
                                                    request.request
                                                ).includes("accepted")
                                                    ? "bg-green-100 text-green-700" // Show Accepted in green
                                                    : Object.values(
                                                          request.request
                                                      ).includes("pending") // Check if there's a "pending"
                                                    ? "bg-yellow-100 text-yellow-700" // Show Pending in yellow
                                                    : "bg-red-100 text-red-700" // If neither accepted nor pending, show Rejected in red
                                            }`}
                                        >
                                            {/* Display status based on request */}
                                            {Object.values(
                                                request.request
                                            ).includes("accepted")
                                                ? "Accepted"
                                                : Object.values(
                                                      request.request
                                                  ).includes("pending")
                                                ? "Pending"
                                                : "Rejected"}
                                        </span>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center col-span-full text-gray-600 text-lg mt-6">
                            No service requests found.
                        </p>
                    )}

                    {/* Display exist_service_requests */}
                    {exist_service_requests.length > 0 ? (
                        exist_service_requests.map((request) => (
                            <Card
                                key={request.id}
                                className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border border-gray-100 hover:border-gray-300 hover:ring-2 hover:ring-indigo-300"
                            >
                                <CardHeader className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white rounded-t-2xl">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-2xl font-bold text-gray-800">
                                            {request.service.title}
                                        </CardTitle>
                                        <div className="flex gap-2">
                                           
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-5 space-y-4">
                                    <CardDescription className="text-gray-700 mb-2 leading-relaxed">
                                        {request.comments}
                                    </CardDescription>
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <p>
                                            <span className="font-medium text-indigo-600">
                                               Type:
                                            </span>{" "}
                                            {request.applicant_type}
                                        </p>
                                        <p>
                                            <span className="font-medium text-indigo-600">
                                                Email:
                                            </span>{" "}
                                            {request.applicant_adresse_email ||
                                                "N/A"}
                                        </p>
                                        <p>
                                            <span className="font-medium text-indigo-600">
                                                Requested By:
                                            </span>{" "}
                                            {new Date(
                                                request.request_date
                                            ).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <span className="font-medium text-indigo-600">
                                                Required By:
                                            </span>{" "}
                                            {new Date(
                                                request.required_by
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="px-5 py-4 bg-gradient-to-r from-white to-indigo-50 border-t border-gray-200 flex items-center justify-between rounded-b-2xl">
                                    <button
                                        onClick={() =>
                                            openDetailsModal(request)
                                        }
                                        className="text-indigo-600 hover:text-indigo-800 transition font-semibold underline decoration-indigo-300 hover:decoration-indigo-600"
                                    >
                                        View Details →
                                    </button>
                                    <div className="absolute right-2">
                                        <span
                                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                                                // Check if any status is "accepted"
                                                Object.values(
                                                    request.request
                                                ).includes("accepted")
                                                    ? "bg-green-100 text-green-700" // Show Accepted in green
                                                    : Object.values(
                                                          request.request
                                                      ).includes("pending") // Check if there's a "pending"
                                                    ? "bg-yellow-100 text-yellow-700" // Show Pending in yellow
                                                    : "bg-red-100 text-red-700" // If neither accepted nor pending, show Rejected in red
                                            }`}
                                        >
                                            {/* Display status based on request */}
                                            {Object.values(
                                                request.request
                                            ).includes("accepted")
                                                ? "Accepted"
                                                : Object.values(
                                                      request.request
                                                  ).includes("pending")
                                                ? "Pending"
                                                : "Rejected"}
                                        </span>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center col-span-full text-gray-600 text-lg mt-6">
                            No existing service requests found.
                        </p>
                    )}
                </div>
            </div>

            <AddRequestModal
                isOpen={showAddRequestModal}
                onClose={closeAddModal}
                user={auth.user}
                labs={labs}
                doms={domains}
                establishments={establishments}
            />

            {selectedService && (
                <EditRequestModal
                    isOpen={showEditRequestModal}
                    onClose={closeEditModal}
                    request={selectedService}
                    user={auth.user}
                    labs={labs}
                    doms={domains}
                    establishments={establishments}
                />
            )}

            {selectedService && (
                <ViewDetailsModal
                    isOpen={showDetailsModal}
                    onClose={closeDetailsModal}
                    request={selectedService}
                    labs={labs}
                    language={language}
                />
            )}
        </Layout>
    );
};

export default Services;
