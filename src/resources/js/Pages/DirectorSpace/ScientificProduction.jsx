import React, { useState, useEffect } from "react";
import {
    FiChevronDown,
    FiChevronUp,
    FiPlus,
    FiTrash2,
    FiEye,
} from "react-icons/fi";
import AddScientificProductionModal from "./Partials/Modals/AddScientificProductionModal";
import { Link, Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SpaceLayout";
import { usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ToastAction } from "@/Components/ui/toast";
import { useToast } from "@/Components/ui/use-toast";

const ScientificProduction = ({ scientificProductions, auth, userRole ,notifications}) => {
    const [expandedIds, setExpandedIds] = useState([]);
    const [selectedProduction, setSelectedProduction] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [detailsId, setDetailsId] = useState(null);

    const toggleExpansion = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const openDeleteModal = (production) => {
        setSelectedProduction(production);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedProduction(null);
    };

    const openEditModal = (production) => {
        setSelectedProduction(production);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduction(null);
    };

    const openAddModal = () => {
        setShowModal(true);
    };

    const closeAddModal = () => {
        setShowModal(false);
    };

    const toggleDetails = (id) => {
        setDetailsId((prevId) => (prevId === id ? null : id));
    };
    const { props } = usePage();

    const { toast } = useToast();
    useEffect(() => {
        if (props.flash.message) {
            let icon;
            let variant;
            switch (props.flash.message) {
                case "Scientific Production Added Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;
                case "Scientific Production deleted successfully":
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
            <Head title="Scientific Productions" />
            <SpaceLayout>
                <Toaster position="bottom-right" reverseOrder={false} />
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-4xl font-bold text-gray-900">
                            Scientific Productions
                        </h3>
                        <Button
                            onClick={openAddModal}
                            variant="default"
                            className="flex items-center space-x-2 bg-main text-white shadow-lg hover:shadow-xl transition-shadow duration-200 px-4 py-2 rounded-md"
                        >
                            <FiPlus className="h-6 w-6" />
                            <span className="ml-2">Add Production</span>
                        </Button>
                    </div>
                    {scientificProductions.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {scientificProductions.map((production) => (
                                <Card
                                    key={production.id}
                                    className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200"
                                >
                                    <CardHeader className="bg-gray-100 text-gray-900 p-4">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg font-semibold text-black">
                                                {production.title}
                                            </CardTitle>
                                            <div className="flex items-center space-x-2">
                                                <button className="text-main hover:text-red-700">
                                                    <Link
                                                        href={route(
                                                            "lab.team.scientific.production.manage",
                                                            production.id
                                                        )}
                                                    >
                                                        <FiEye className="h-5 w-5" />
                                                    </Link>
                                                </button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 bg-white">
                                        <div className="flex justify-between items-center">
                                            <p className="mb-2 text-gray-600">
                                                <strong>Type:</strong>{" "}
                                                {production.type}
                                            </p>
                                            <Button
                                                onClick={() =>
                                                    toggleDetails(production.id)
                                                }
                                                variant="outline"
                                                className="text-main border-main"
                                            >
                                                {detailsId === production.id
                                                    ? "Hide Details"
                                                    : "View Details"}
                                            </Button>
                                        </div>
                                        {detailsId === production.id && (
                                            <div className="mt-4 text-sm text-gray-700">
                                                <p className="mb-2">
                                                    <strong>
                                                        Description:
                                                    </strong>{" "}
                                                    {production.description ||
                                                        "No description available"}
                                                </p>
                                                <p className="mb-2">
                                                    <strong>URL:</strong>{" "}
                                                    <a
                                                        href={production.url}
                                                        className="text-blue-500 hover:underline"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {production.url ||
                                                            "No URL available"}
                                                    </a>
                                                </p>
                                                <p className="mb-2">
                                                    <strong>
                                                        Year of Publication:
                                                    </strong>{" "}
                                                    {new Date(
                                                        production.year_publication
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-600 text-center">
                            No scientific productions found.
                        </div>
                    )}
                </div>
            </SpaceLayout>

            {/* Modals */}
            <AddScientificProductionModal
                isOpen={showModal}
                onClose={closeAddModal}
                user={auth.user}
            />
        </Layout>
    );
};

export default ScientificProduction;
