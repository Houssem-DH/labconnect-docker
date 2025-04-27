import React, { useContext } from "react";
import { Button } from "@/Components/ui/button";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { LanguageContext } from "@/lib/LanguageContext";
import { FiPlus, FiTrash2, FiEdit2 } from "react-icons/fi";
import { Link } from "@inertiajs/react";

function ServicesSection({ services }) {
    const { language } = useContext(LanguageContext);

    return (
        <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <Card
                        key={service.id}
                        className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200 flex flex-col justify-between"
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
                        <CardContent className="p-4 bg-white flex-grow">
                            {service.picture && (
                                <img
                                    src={`storage/${service.picture}`}
                                    alt={service.title}
                                    className="w-full h-48 object-cover mb-4 rounded"
                                />
                            )}
                            <p className="text-gray-700 mb-2">
                                <strong>Description:</strong> {service.description}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <strong>Price:</strong> {service.price} DA
                            </p>
                            <p className="text-gray-600 mb-2">
                                <strong>Duration:</strong> {service.duration} days
                            </p>
                            <p className="text-gray-600 mb-2">
                                <strong>Requirements:</strong> {service.requirements || "N/A"}
                            </p>
                            <p
                                className={`text-sm font-bold ${
                                    service.availability
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                <strong>Availability:</strong> {service.availability ? "Available" : "Not Available"}
                            </p>
                        </CardContent>
                        <CardFooter className="mt-auto flex justify-end space-x-3 p-4 bg-gray-100">
                            <Link href={`/service-request/${service.id}`}>
                                <Button
                                    size="sm"
                                    className="flex items-center space-x-1"
                                >
                                    <FiEdit2 />
                                    <span>request a service</span>
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default ServicesSection;
