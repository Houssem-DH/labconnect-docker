import React, { useState, useEffect, useContext } from "react";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import AddServiceModal from "./Partials/Modals/AddServiceModal";
import EditServiceModal from "./Partials/Modals/EditServiceModal";
import { Link, Head, useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SpaceLayout";
import { usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/Components/ui/button";
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
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { LanguageContext } from "@/lib/LanguageContext";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ToastAction } from "@/Components/ui/toast";
import { useToast } from "@/Components/ui/use-toast";

const Services = ({ services, auth, lab, userRole,notifications }) => {
    const { language } = useContext(LanguageContext);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const { props } = usePage();

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
    };

    const openEditModal = (service) => {
        setSelectedService(service);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setSelectedService(null);
        setShowEditModal(false);
    };

    const { delete: deleteRequest } = useForm();

    const handleDelete = (service) => {
        // Wrap the deleteRequest call inside a callback function
        deleteRequest(
            `/director-space/manage-lab/delete-service/${service.id}`
        );
    };

    const { toast } = useToast();

    useEffect(() => {
        if (props.flash.message) {
            let icon;
            let variant;
            switch (props.flash.message) {
                case "Service Added Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Service Updated Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Service Deleted Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                default:
                    icon = <AlertCircle className="w-6 h-6 text-yellow-500" />;
                    variant = "default";
                    break;
            }

            toast({
                variant,
                title: (
                    <div className="flex items-center space-x-2">
                        {icon}
                        <span>{props.flash.message}</span>
                    </div>
                ),

                action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
            });
        }
    }, [props]);

    return (
        <Layout user={auth.user} userRole={userRole} notifications={notifications.list}
        notifications_count={notifications.count}>
            <Head title="Services" />
            <SpaceLayout>
                <Toaster position="bottom-right" reverseOrder={false} />
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-4xl font-bold text-gray-900">
                            Services
                        </h3>
                        <Button
                            onClick={openAddModal}
                            variant="default"
                            className="flex items-center space-x-2 bg-main text-white shadow-lg hover:shadow-xl transition-shadow duration-200 px-4 py-2 rounded-md"
                        >
                            <FiPlus className="h-6 w-6" />
                            <span className="ml-2">Add Service</span>
                        </Button>
                    </div>
                    {services && services.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {services.map((service) => (
                                <Card
                                    key={service.id}
                                    className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200"
                                >
                                    <CardHeader className="bg-gray-100 p-4">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg font-semibold text-black">
                                                {service.title}
                                            </CardTitle>
                                            <Badge className="bg-main text-white">
                                                {service.category}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 bg-white">
                                        {service.picture && (
                                            <img
                                                src={`storage/${service.picture}`}
                                                alt={service.title}
                                                className="w-full h-48 object-cover mb-4 rounded"
                                            />
                                        )}
                                        <p className="text-gray-700 mb-2">
                                            <strong>Description:</strong>{" "}
                                            {service.description}
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            <strong>Price:</strong>{" "}
                                            {service.price} DA
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            <strong>Duration:</strong>{" "}
                                            {service.duration} days
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            <strong>Requirements:</strong>{" "}
                                            {service.requirements || "N/A"}
                                        </p>
                                        <p
                                            className={`text-sm font-bold ${
                                                service.availability
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            <strong>Availability:</strong>{" "}
                                            {service.availability
                                                ? "Available"
                                                : "Not Available"}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="flex justify-end space-x-3 p-4 bg-gray-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center space-x-1"
                                            onClick={() =>
                                                openEditModal(service)
                                            }
                                        >
                                            <FiEdit2 />
                                            <span>Edit</span>
                                        </Button>

                                        {/* Delete Action */}
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center space-x-1 text-red-600"
                                                >
                                                    <FiTrash2 />
                                                    <span>Delete</span>
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        {language === "en"
                                                            ? "Are you absolutely sure?"
                                                            : language === "ar"
                                                            ? "هل أنت متأكد تمامًا؟"
                                                            : "Êtes-vous absolument sûr?"}
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {language === "en"
                                                            ? "This action cannot be undone. This will permanently delete the Service and remove the data from our servers."
                                                            : language === "ar"
                                                            ? "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف المنشأة بشكل دائم وإزالة البيانات من خوادمنا."
                                                            : "Cette action est irréversible. Cela supprimera définitivement le membre du laboratoire et supprimera les données de nos serveurs."}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        {language === "en"
                                                            ? "Cancel"
                                                            : language === "ar"
                                                            ? "إلغاء"
                                                            : "Annuler"}
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDelete(
                                                                service
                                                            )
                                                        }
                                                        className="bg-red-600 text-white hover:bg-red-700"
                                                    >
                                                        {language === "en"
                                                            ? "Delete"
                                                            : language === "ar"
                                                            ? "حذف"
                                                            : "Supprimer"}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-600 text-center mt-12">
                            No services found. Add a new service to get started.
                        </div>
                    )}
                </div>
            </SpaceLayout>

            {/* Modals */}
            <AddServiceModal
                isOpen={showAddModal}
                onClose={closeAddModal}
                lab={lab}
                user={auth.user}
            />

            {selectedService && (
                <EditServiceModal
                    isOpen={showEditModal}
                    onClose={closeEditModal}
                    service={selectedService}
                    user={auth.user}
                />
            )}
        </Layout>
    );
};

export default Services;
