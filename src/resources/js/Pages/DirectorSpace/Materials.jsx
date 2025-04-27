import React, { useState, useEffect } from "react";
import {
    FiChevronDown,
    FiChevronUp,
    FiPlus,
    FiTrash2,
    FiEdit,
    FiSearch,
} from "react-icons/fi";
import { Input } from "@/Components/ui/input";
import DeleteMaterialModal from "./Partials/Modals/DeleteMaterialModal";
import EditMaterialModal from "./Partials/Modals/EditMaterialModal";
import { Link, Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SpaceLayout";
import { usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import { CheckCircle, XCircle, AlertCircle, Clock, Zap } from "lucide-react";
import { ToastAction } from "@/Components/ui/toast";
import { useToast } from "@/Components/ui/use-toast";
import { Badge } from "@/Components/ui/badge";
import { Skeleton } from "@/Components/ui/skeleton";

const MaterialsSection = ({ materials, auth, userRole, notifications }) => {
    const [expandedIds, setExpandedIds] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const toggleExpansion = (id) => {
        setExpandedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const openDeleteModal = (material) => {
        setSelectedMaterial(material);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedMaterial(null);
    };

    const openEditModal = (material) => {
        setSelectedMaterial(material);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedMaterial(null);
    };

    const { props } = usePage();

    const { toast } = useToast();

    useEffect(() => {
        if (props.flash.message) {
            let icon;
            let variant;
            switch (props.flash.message) {
                case "Material Added Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Material Updated Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Team updated Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Material Deleted Succesfully":
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

    const [searchQuery, setSearchQuery] = useState("");

    const filteredMaterials = materials?.filter(
        (material) =>
            material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            material.reference.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout
            user={auth.user}
            userRole={userRole}
            notifications={notifications.list}
            notifications_count={notifications.count}
        >
            <Head title="Materials" />
            <SpaceLayout>
                <Toaster position="bottom-right" reverseOrder={false} />
                <div className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Material Inventory
                            </h1>
                            <p className="text-gray-500 mt-2">
                                {materials?.length} items in stock
                            </p>
                        </div>

                        <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
                            <div className="relative w-full md:w-64">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search materials..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>

                            <Button
                                asChild
                                className=""
                            >
                                <Link
                                    href={route("lab.add.material.index")}
                                    className="flex items-center gap-2"
                                >
                                    <FiPlus className="h-5 w-5" />
                                    <span>New Material</span>
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {filteredMaterials ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMaterials.map((material) => (
                                <Card
                                    key={material.id}
                                    className="relative group hover:shadow-xl transition-shadow duration-300 rounded-xl border border-gray-100 overflow-hidden"
                                >
                                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b">
                                        <div className="flex justify-between items-start gap-2">
                                            <div>
                                                <CardTitle className="text-lg font-semibold text-gray-900">
                                                    {material.name}
                                                </CardTitle>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge
                                                        variant={
                                                            material.availability
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                        className="flex items-center gap-1"
                                                    >
                                                        {material.availability ? (
                                                            <>
                                                                <Zap className="h-3 w-3" />
                                                                Available
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="h-3 w-3" />
                                                                Unavailable
                                                            </>
                                                        )}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        {
                                                            material.reservation_type
                                                        }
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        toggleExpansion(
                                                            material.id
                                                        )
                                                    }
                                                    className="text-gray-600 hover:bg-gray-100 rounded-lg"
                                                >
                                                    {expandedIds.includes(
                                                        material.id
                                                    ) ? (
                                                        <FiChevronUp className="h-5 w-5" />
                                                    ) : (
                                                        <FiChevronDown className="h-5 w-5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    {expandedIds.includes(material.id) && (
                                        <CardContent className="p-4 space-y-4 animate-in fade-in">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Use Case
                                                    </p>
                                                    <p className="font-medium">
                                                        {material.use_case ||
                                                            "-"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Reference
                                                    </p>
                                                    <p className="font-mono font-medium text-blue-600">
                                                        {material.reference}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Price
                                                    </p>
                                                    <p className="font-medium">
                                                        {material.reservation_price
                                                            ? `DA ${material.reservation_price}`
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Last Updated
                                                    </p>
                                                    <p className="font-medium">
                                                        {new Date(
                                                            material.updated_at
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    Description
                                                </p>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {material.description ||
                                                        "No description available"}
                                                </p>
                                            </div>

                                            {material.picture && (
                                                <div className="relative aspect-square rounded-lg overflow-hidden">
                                                    <img
                                                        src={`storage/${material.picture}`}
                                                        alt={material.name}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}

                                            <CardFooter className="flex justify-end gap-2 p-0">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openEditModal(material)
                                                    }
                                                    className="gap-2"
                                                >
                                                    <FiEdit className="h-4 w-4" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() =>
                                                        openDeleteModal(
                                                            material
                                                        )
                                                    }
                                                    className="gap-2"
                                                >
                                                    <FiTrash2 className="h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </CardFooter>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 space-y-6">
                            <div className="text-gray-400">
                                <FiPackage className="h-24 w-24" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-semibold">
                                    No Materials Found
                                </h3>
                                <p className="text-gray-500">
                                    Start by adding new materials to your
                                    inventory
                                </p>
                            </div>
                            <Button
                                asChild
                                className="bg-gradient-to-r from-blue-600 to-indigo-600"
                            >
                                <Link href={route("lab.add.material.index")}>
                                    <FiPlus className="mr-2 h-4 w-4" />
                                    Add First Material
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
                {selectedMaterial && (
                    <>
                        <EditMaterialModal
                            isOpen={isEditModalOpen}
                            onClose={closeEditModal}
                            material={selectedMaterial}
                        />
                        <DeleteMaterialModal
                            isOpen={isDeleteModalOpen}
                            onClose={closeDeleteModal}
                            material={selectedMaterial}
                        />
                    </>
                )}
            </SpaceLayout>
        </Layout>
    );
};

export default MaterialsSection;
