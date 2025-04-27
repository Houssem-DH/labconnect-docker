import React from "react";
import { useForm } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SpaceLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/Components/ui/card";
import { FiChevronRight } from "react-icons/fi";
import { Link, Head } from "@inertiajs/react";
import InputError from "@/Components/InputError"; // Ensure you have this component or use a similar error display component

const AddScientificActivity = ({ auth, userRole, lab }) => {
    const { data, setData, post, errors } = useForm({
        title: "",
        description: "",
        // Add any additional fields required
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("lab.activity.insert", { id: lab.id }));
    };

    return (
        <Layout user={auth.user} userRole={userRole}>
            <Head title="Add Scientific Activity" />
            <SpaceLayout>
                <div className="flex justify-center items-center text-gray-600 max-w-5xl w-full overflow-hidden">
                    <FiChevronRight className="w-5 h-5" />
                    <Link
                        href="/director-space/scientific-activities"
                        className="ml-2 font-semibold hover:text-gray-900"
                    >
                        Scientific Activities
                    </Link>
                    <FiChevronRight className="mx-2 w-5 h-5" />
                    <span className="font-semibold cursor-default">
                        Add Scientific Activity
                    </span>
                </div>
                <div className="flex justify-center items-center h-full pb-24 pt-12">
                    <div className="max-w-5xl w-full">
                        <Card>
                            <CardHeader className="bg-gray-100 text-black p-6">
                                <CardTitle>Add Scientific Activity</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <Label htmlFor="title" value="Title" />
                                        <Input
                                            id="title"
                                            type="text"
                                            name="title"
                                            value={data.title}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            placeholder="Enter title"
                                        />
                                        <InputError message={errors.title} className="mt-2" />
                                    </div>

                                    <div className="mt-4">
                                        <Label htmlFor="description" value="Description" />
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            autoComplete="description"
                                            placeholder="Enter description"
                                            onChange={(e) =>
                                                setData("description", e.target.value)
                                            }
                                            required
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <CardFooter className="flex justify-end mt-4">
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

export default AddScientificActivity;
