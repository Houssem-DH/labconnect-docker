import React, { useEffect } from "react";
import { FiPlus, FiSettings, FiCheckCircle } from "react-icons/fi";
import { Link, Head, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/ProjectLeaderLayout";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";

const ProjectsSection = ({ projects, auth, userRole }) => {
    const { props } = usePage();

    useEffect(() => {
        if (props.flash.message) {
            toast(props.flash.message, {
                icon:
                    props.flash.message === "Project Added Successfully"
                        ? "✅"
                        : "❌",
                style: {
                    borderRadius: "8px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }
    }, [props]);

    return (
        <Layout user={auth.user} userRole={userRole}>
            <Head title="Projects" />
            <SpaceLayout>
                <Toaster position="bottom-right" />
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                            Projects
                        </h3>
                        
                    </div>

                    {projects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                            {projects.map((project) => (
                                <Card
                                    key={project.id}
                                    className="shadow-md rounded-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl border border-gray-200"
                                >
                                    <CardHeader className="bg-gradient-to-r bg-main p-4">
                                        <CardTitle className="text-xl font-semibold text-white">
                                            {project.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6 bg-white">
                                        <p className="text-base text-gray-700 mb-4">
                                            {project.description}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InfoLabel
                                                label="Project Leader"
                                                value={`${project.user.first_name} ${project.user.last_name}`}
                                            />
                                            <InfoLabel
                                                label="Type"
                                                value={project.type}
                                            />
                                            <InfoLabel
                                                label="Code"
                                                value={project.code}
                                            />
                                            <InfoLabel
                                                label="Problematic"
                                                value={project.problematic}
                                            />
                                            <InfoLabel
                                                label="Reference"
                                                value={project.reference}
                                            />
                                            <InfoLabel
                                                label="Objective"
                                                value={project.objective}
                                            />
                                            <InfoLabel
                                                label="Keywords"
                                                value={project.keywords}
                                            />
                                            <InfoLabel
                                                label="Methodology"
                                                value={project.methodology}
                                            />
                                            <InfoLabel
                                                label="Year"
                                                value={project.year}
                                            />
                                            <InfoSection
                                                label="Material"
                                                items={JSON.parse(
                                                    project.material
                                                )}
                                            />
                                            <InfoSection
                                                label="Expected Results"
                                                items={JSON.parse(
                                                    project.expected_results
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="bg-gray-100 p-4 flex justify-end">
                                        <Button variant="link" asChild>
                                            <Link
                                                href={route(
                                                    "project.leader.project.manage",
                                                    project.id
                                                )}
                                                className="text-indigo-600 hover:text-indigo-800 flex items-center"
                                            >
                                                Manage{" "}
                                                <FiSettings className="ml-1" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-lg text-gray-500 text-center mt-16">
                            No projects available
                        </p>
                    )}
                </div>
            </SpaceLayout>
        </Layout>
    );
};

const InfoLabel = ({ label, value }) => (
    <div>
        <Label className="text-sm text-gray-600 font-medium">{label}:</Label>
        <p className="text-sm text-gray-900 font-semibold">{value}</p>
    </div>
);

const InfoSection = ({ label, items }) => (
    <div className="col-span-2">
        <Label className="text-sm text-gray-600 font-medium">{label}:</Label>
        <div className="flex flex-wrap mt-2">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full mr-2 mb-2"
                >
                    {label === "Expected Results" && (
                        <FiCheckCircle className="inline-block mr-1 text-green-500" />
                    )}
                    {item}
                </div>
            ))}
        </div>
    </div>
);

export default ProjectsSection;
