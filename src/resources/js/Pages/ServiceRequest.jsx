
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";  // Import Shadcn UI select components
import React, { useContext } from "react";
import { useForm } from "@inertiajs/react";
import { Input } from "@/Components/ui/input";
import InputError from "@/Components/InputError";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { LanguageContext } from "@/lib/LanguageContext";
import Layout from "@/Layouts/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

const ServiceRequest = ({ auth, service }) => {
    const { language } = useContext(LanguageContext);

    const { data, setData, post, processing, errors } = useForm({
        applicant_type: "",
        applicant_tlp: "",
        applicant_adresse_email: "",
        request_date: "",
        required_by: "",
        comments: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("exist.service.request.insert", { id: service.id })); // Adjust route as needed
    };

    return (
        <Layout user={auth.user}>
            <div className="py-32 px-6 lg:px-16">
                <Card className="max-w-3xl mx-auto shadow-lg border border-gray-200 rounded-lg">
                    <CardHeader className="mb-6">
                        <CardTitle className="text-center text-2xl font-semibold">
                            {language === "en"
                                ? "Service Request Form"
                                : language === "ar"
                                ? "نموذج طلب الخدمة"
                                : "Formulaire de demande de service"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-col">
                                <Label htmlFor="applicant_type" className="mb-1 font-medium">
                                    Type
                                </Label>
                                <Select
                                    id="applicant_type"
                                    value={data.applicant_type}
                                    onValueChange={(value) => setData("applicant_type", value)}
                                    className="focus:ring-2 focus:ring-indigo-500 border-gray-300 rounded-lg"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="usine">Factory</SelectItem>
                                        <SelectItem value="laboratoire">Laboratory</SelectItem>
                                        <SelectItem value="simple_citoyen">Simple Citizen</SelectItem>
                                        <SelectItem value="hopital">Hospital</SelectItem>
                                        <SelectItem value="faculte_universitaire">University Faculty</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.applicant_type && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.applicant_type}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Label
                                    htmlFor="applicant_tlp"
                                    className="mb-1 font-medium"
                                >
                                    Telephone
                                </Label>
                                <Input
                                    id="applicant_tlp"
                                    type="text"
                                    value={data.applicant_tlp}
                                    onChange={(e) =>
                                        setData("applicant_tlp", e.target.value)
                                    }
                                    placeholder="Enter contact number"
                                    className="focus:ring-2 focus:ring-indigo-500 border-gray-300 rounded-lg"
                                />
                                {errors.applicant_tlp && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.applicant_tlp}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Label
                                    htmlFor="applicant_adresse_email"
                                    className="mb-1 font-medium"
                                >
                                    Email Address
                                </Label>
                                <Input
                                    id="applicant_adresse_email"
                                    type="email"
                                    value={data.applicant_adresse_email}
                                    onChange={(e) =>
                                        setData(
                                            "applicant_adresse_email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter email (optional)"
                                    className="focus:ring-2 focus:ring-indigo-500 border-gray-300 rounded-lg"
                                />
                                {errors.applicant_adresse_email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.applicant_adresse_email}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Label
                                    htmlFor="request_date"
                                    className="mb-1 font-medium"
                                >
                                    Request Date
                                </Label>
                                <Input
                                    id="request_date"
                                    type="date"
                                    value={data.request_date}
                                    onChange={(e) =>
                                        setData("request_date", e.target.value)
                                    }
                                    className="focus:ring-2 focus:ring-indigo-500 border-gray-300 rounded-lg"
                                />
                                {errors.request_date && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.request_date}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Label
                                    htmlFor="required_by"
                                    className="mb-1 font-medium"
                                >
                                    Required By
                                </Label>
                                <Input
                                    id="required_by"
                                    type="date"
                                    value={data.required_by}
                                    onChange={(e) =>
                                        setData("required_by", e.target.value)
                                    }
                                    className="focus:ring-2 focus:ring-indigo-500 border-gray-300 rounded-lg"
                                />
                                {errors.required_by && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.required_by}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <Label
                                    htmlFor="comments"
                                    className="mb-1 font-medium"
                                >
                                    Comments
                                </Label>
                                <Textarea
                                    id="comments"
                                    value={data.comments}
                                    onChange={(e) =>
                                        setData("comments", e.target.value)
                                    }
                                    placeholder="Enter comments (optional)"
                                    className="focus:ring-2 focus:ring-indigo-500 border-gray-300 rounded-lg"
                                />
                                {errors.comments && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.comments}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full text-white font-medium py-2 rounded-lg"
                            >
                                {processing ? "Submitting..." : "Submit Request"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default ServiceRequest;
