import React, { useState, useEffect } from "react";
import {
    FiChevronDown,
    FiChevronUp,
    FiPlus,
    FiTrash2,
    FiEdit,
} from "react-icons/fi";

import { Link, Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/MemberLayout";
import { usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/Components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";

const MaterialsSection = ({ materials, auth, userRole }) => {
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

    
    const { props } = usePage();

    

    return (
        <Layout user={auth.user} userRole={userRole}>
            <Head title="Materials" />
            <SpaceLayout>
                <Toaster position="bottom-right" reverseOrder={false} />
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-900">
                            Materials
                        </h3>


                      
                       
                    </div>
                    {materials ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {materials.map((material) => (
                                <Card
                                    key={material.id}
                                    className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200"
                                >
                                    <CardHeader className="bg-gray-200 text-white p-4">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg text-gray-950 font-semibold">
                                                {material.name}
                                            </CardTitle>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        toggleExpansion(
                                                            material.id
                                                        )
                                                    }
                                                    className="text-gray-800 focus:outline-none"
                                                >
                                                    {expandedIds.includes(
                                                        material.id
                                                    ) ? (
                                                        <FiChevronUp />
                                                    ) : (
                                                        <FiChevronDown />
                                                    )}
                                                </button>
                                                
                                                    
                                                
                                            </div>
                                        </div>
                                    </CardHeader>
                                    {expandedIds.includes(material.id) && (
                                        <CardContent className="p-4 bg-gray-50">
                                            <p className="mb-2">
                                                <strong>Use Case:</strong>{" "}
                                                {material.use_case}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Reference:</strong>{" "}
                                                {material.reference}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Description:</strong>{" "}
                                                {material.description}
                                            </p>
                                            <img
                                                src={`storage/${material.picture}`}
                                                alt={material.name}
                                                className="mt-4 w-full h-48 object-cover rounded-md"
                                            />
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-600 text-center">No materials found.</div>
                    )}
                </div>
               
            </SpaceLayout>
        </Layout>
    );
};

export default MaterialsSection;
