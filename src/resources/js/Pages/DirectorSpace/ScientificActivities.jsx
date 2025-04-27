import React, { useState, useEffect } from "react";
import {
    FiChevronDown,
    FiChevronUp,
    FiPlus,
    FiTrash2,
    FiEdit,
} from "react-icons/fi";
import DeleteActivityModal from "./Partials/Modals/DeleteActivityModal";
import EditActivityModal from "./Partials/Modals/EditActivityModal";
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

const ActivitiesSection = ({ scientificActivities, auth, userRole, notifications }) => {
    const [expandedIds, setExpandedIds] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const toggleExpansion = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const openDeleteModal = (activity) => {
        setSelectedActivity(activity);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedActivity(null);
    };

    const openEditModal = (activity) => {
        setSelectedActivity(activity);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedActivity(null);
    };

    const { props } = usePage();

    const { toast } = useToast();

    useEffect(() => {
        if (props.flash.message) {
            let icon;
            let variant;
            switch (props.flash.message) {
                case "Scientific Activity Added Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Scientific Activity Deleted Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Scientific Activity Updated Succesfully":
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
            <Head title="Scientific Activities" />
            <SpaceLayout>
                <Toaster position="bottom-right" reverseOrder={false} />
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-900">
                            Scientific Activities
                        </h3>
                        <Button
                            variant="outline"
                            asChild
                            className="flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
                        >
                            <Link
                                href={route("lab.add.activity.index")}
                                className="flex items-center space-x-2"
                            >
                                <FiPlus className="h-6 w-6" />
                                <span className="ml-2">Add Activity</span>
                            </Link>
                        </Button>
                    </div>
                    {scientificActivities.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {scientificActivities.map((activity) => (
                                <Card
                                    key={activity.id}
                                    className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200"
                                >
                                    <CardHeader className="bg-gray-200 text-white p-4">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg text-gray-950 font-semibold">
                                                {activity.title}
                                            </CardTitle>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        toggleExpansion(
                                                            activity.id
                                                        )
                                                    }
                                                    className="text-gray-800 focus:outline-none"
                                                >
                                                    {expandedIds.includes(
                                                        activity.id
                                                    ) ? (
                                                        <FiChevronUp />
                                                    ) : (
                                                        <FiChevronDown />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openEditModal(activity)
                                                    }
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <FiEdit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(
                                                            activity
                                                        )
                                                    }
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FiTrash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    {expandedIds.includes(activity.id) && (
                                        <CardContent className="p-4 bg-gray-50">
                                            <p className="mb-2">
                                                <strong>Description:</strong>{" "}
                                                {activity.description}
                                            </p>
                                            {/* You can add more details if needed */}
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-600 text-center">
                            No scientific activities found.
                        </div>
                    )}
                </div>
                {selectedActivity && (
                    <>
                        <EditActivityModal
                            isOpen={isEditModalOpen}
                            onClose={closeEditModal}
                            activity={selectedActivity}
                        />
                        <DeleteActivityModal
                            isOpen={isDeleteModalOpen}
                            onClose={closeDeleteModal}
                            activity={selectedActivity}
                        />
                    </>
                )}
            </SpaceLayout>
        </Layout>
    );
};

export default ActivitiesSection;
