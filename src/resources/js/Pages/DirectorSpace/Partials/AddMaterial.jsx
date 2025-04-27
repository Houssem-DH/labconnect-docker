import React from "react";
import { useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SpaceLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/Components/ui/card";
import { Textarea } from "@/Components/ui/textarea";
import { FiTrash2, FiPlus, FiChevronRight } from "react-icons/fi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox"; // Import the Checkbox component
import { Link, Head } from "@inertiajs/react";

const AddProject = ({ auth, userRole, lab }) => {
    const { data, setData, post, errors } = useForm({
        name: "",
        use_case: "",
        reference: "",
        description: "",
        picture: "",
        reservation_price: "",
        reservation_type: "",
        availability: false, // Add availability field
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("lab.material.insert", { id: lab.id }));
    };

    return (
        <Layout user={auth.user} userRole={userRole}>
            <Head title="Add Material" />
            <SpaceLayout>
                <div className="flex justify-center items-center text-gray-600 max-w-5xl w-full overflow-hidden">
                    <FiChevronRight className="w-5 h-5" />
                    <Link
                        href="/director-space/materials"
                        className="ml-2 font-semibold hover:text-gray-900"
                    >
                        Materials
                    </Link>
                    <FiChevronRight className="mx-2 w-5 h-5" />
                    <span className="font-semibold cursor-default">
                        Add Material
                    </span>
                </div>
                <div className="flex justify-center items-center h-full pb-24 pt-12">
                    <div className="max-w-5xl w-full">
                        <Card>
                            <CardHeader className="bg-gray-100 text-black p-6">
                                <CardTitle>Add Material</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <Label htmlFor="name">Name:</Label>
                                        <Input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            placeholder="Enter name"
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="use_case">
                                            Use Case:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="use_case"
                                            name="use_case"
                                            value={data.use_case}
                                            onChange={(e) =>
                                                setData(
                                                    "use_case",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter use case"
                                        />
                                        {errors.use_case && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.use_case}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="reference">
                                            Reference:
                                        </Label>
                                        <Input
                                            type="text"
                                            id="reference"
                                            name="reference"
                                            value={data.reference}
                                            onChange={(e) =>
                                                setData(
                                                    "reference",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter reference"
                                        />
                                        {errors.reference && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.reference}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="description">
                                            Description:
                                        </Label>
                                        <Input
                                            as="textarea"
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter description"
                                        />
                                        {errors.description && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Availability Checkbox */}
                                    <div className="mb-4 flex items-center space-x-2">
                                        <Checkbox
                                            id="availability"
                                            checked={data.availability}
                                            onCheckedChange={(checked) => 
                                                setData("availability", checked)
                                            }
                                        />
                                        <Label htmlFor="availability">
                                            Available for reservation
                                        </Label>
                                    </div>
                                    {errors.availability && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.availability}
                                        </p>
                                    )}

                                    <div className="mb-4">
                                        <Label htmlFor="reservation_price">
                                            Reservation Price:
                                        </Label>
                                        <div className="relative mt-2">
                                            <Input
                                                type="number"
                                                id="reservation_price"
                                                name="reservation_price"
                                                value={data.reservation_price}
                                                onChange={(e) =>
                                                    setData(
                                                        "reservation_price",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Enter reservation price"
                                                min="0"
                                                step="0.01"
                                                className="pr-10" // Add right padding for the DA symbol
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                                DA
                                            </span>
                                        </div>
                                        {errors.reservation_price && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.reservation_price}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <Label htmlFor="reservation_type">
                                            Reservation Type:
                                        </Label>
                                        <Select
                                            value={data.reservation_type}
                                            onValueChange={(value) =>
                                                setData(
                                                    "reservation_type",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select reservation type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hourly">
                                                    Hourly
                                                </SelectItem>
                                                <SelectItem value="daily">
                                                    Daily
                                                </SelectItem>
                                                <SelectItem value="weekly">
                                                    Weekly
                                                </SelectItem>
                                                <SelectItem value="project">
                                                    Project Basis
                                                </SelectItem>
                                                <SelectItem value="other">
                                                    Other
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.reservation_type && (
                                            <p className="text-red-500 text-sm mt-1">
                                                {errors.reservation_type}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <Label htmlFor="file">file:</Label>
                                        <Input
                                            type="file"
                                            id="file"
                                            name="file"
                                            onChange={(e) =>
                                                setData(
                                                    "picture",
                                                    e.target.files[0]
                                                )
                                            }
                                        />
                                    </div>
                                    <CardFooter>
                                        <Button type="submit">Submit</Button>
                                    </CardFooter>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SpaceLayout>
        </Layout>
    );
};

export default AddProject;