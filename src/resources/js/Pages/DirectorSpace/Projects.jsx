import React, { useEffect } from "react";
import { FiPlus, FiSettings, FiCheckCircle } from "react-icons/fi";
import { Link, Head, usePage } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SpaceLayout";

import { Button } from "@/Components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/Components/ui/card";
import { Label } from "@/Components/ui/label";

import { CheckCircle, AlertCircle } from "lucide-react";

import { ToastAction } from "@/Components/ui/toast";
import { useToast } from "@/Components/ui/use-toast";
import dayjs from 'dayjs'; // Import dayjs for date formatting

const ProjectsSection = ({ projects, auth, userRole ,notifications}) => {
    const { props } = usePage();

    const { toast } = useToast();

    useEffect(() => {
        if (props.flash.message) {
            let icon;
            let variant;
            switch (props.flash.message) {
                case "Project Added Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Project deleted Succesfully":
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
            <Head title="Projects" />
            <SpaceLayout>
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                            Projects
                        </h3>
                        <Button
                            variant="outline"
                            asChild
                            className="flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
                        >
                            <Link
                                href={route("lab.add.project.index")}
                                className="flex items-center space-x-2"
                            >
                                <FiPlus className="h-5 w-5" />
                                <span className="hidden sm:inline font-medium">
                                    New Project
                                </span>
                            </Link>
                        </Button>
                    </div>

                    {projects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                            {projects.map((project) => (
                                <Card
                                key={project.id}
                                className="shadow-md rounded-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl border border-gray-200 flex flex-col"  // Add 'flex' and 'flex-col' to make it a flex container
                            >
                                <CardHeader className="bg-gradient-to-r bg-main p-4">
                                    <CardTitle className="text-xl font-semibold text-white">
                                        {project.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 bg-white flex-grow"> {/* Add 'flex-grow' to make it grow and fill remaining space */}
                                    <p className="text-base text-gray-700 mb-4">
                                        {project.description}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoLabel label="Project Leader" value={`${project.user.first_name} ${project.user.last_name}`} />
                                        <InfoLabel label="Type" value={project.type} />
                                        <InfoLabel label="Code" value={project.code} />
                                        <InfoLabel label="Problematic" value={project.problematic} />
                                        <InfoLabel label="Reference" value={project.reference} />
                                        <InfoLabel label="Objective" value={project.objective} />
                                        <InfoLabel label="Keywords" value={project.keywords} />
                                        <InfoLabel label="Methodology" value={project.methodology} />
                                        <InfoLabel label="Date" value={dayjs(project.created_at).format('MMM D, YYYY')} />
                                        <InfoSection label="Material" items={JSON.parse(project.material)} />
                                        <InfoSection label="Expected Results" items={JSON.parse(project.expected_results)} />
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-gray-100 p-4 flex justify-end mt-auto"> {/* Add 'mt-auto' to push it to the bottom */}
                                    <Button variant="link" asChild>
                                        <Link
                                            href={route("lab.project.manage", project.id)}
                                            className="text-indigo-600 hover:text-indigo-800 flex items-center"
                                        >
                                            Manage <FiSettings className="ml-1" />
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
