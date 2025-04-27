import Layout from "@/Layouts/CollaborationSpaceLayout";
import React, { useState } from "react";
import { FiPlus, FiSettings, FiCheckCircle } from "react-icons/fi";

import { Label } from "@/Components/ui/label";
import dayjs from 'dayjs'; // Import dayjs for date formatting

import { Link, Head } from "@inertiajs/react";
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
import CreateProject from "./Partials/Modals/CreateProject";

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
const Projects = ({
    auth,
    userRole,
    lab_projects = [], // Default to an empty array if null/undefined
    leader_projects = [], // Default to an empty array if null/undefined
    member_projects = [], // Default to an empty array if null/undefined
    lab,
    lab_members,
    domains,
    labs,
    establishments,
    projects_count,
    phd_thesis_count,
    notifications,
    
}) => {
    const [showAddTeamModal, setShowAddTeamModal] = useState(false);

    const openAddModal = () => {
        setShowAddTeamModal(true);
    };

    const closeAddModal = () => {
        setShowAddTeamModal(false);
    };

    // Combine projects, ensuring no repetition
    const combinedProjects = [
        ...lab_projects,
        ...leader_projects,
        ...member_projects,
    ];

    // Create a Map to remove duplicates and assign roles
    const projectsMap = new Map();

    combinedProjects.forEach((project) => {
        if (!projectsMap.has(project.id)) {
            // Assign initial role based on the array it was added from
            let role = lab_projects.includes(project)
                ? "lab"
                : leader_projects.includes(project)
                ? "leader"
                : "member";

            projectsMap.set(project.id, { ...project, projectRole: role });
        } else {
            // Update the role if the project appears in multiple arrays
            const existingProject = projectsMap.get(project.id);
            if (leader_projects.includes(project)) {
                existingProject.projectRole = "leader";
            } else if (member_projects.includes(project)) {
                existingProject.projectRole = "member";
            }
            projectsMap.set(project.id, existingProject);
        }
    });

    // Convert map back to an array
    const projects = Array.from(projectsMap.values());

    return (
        <Layout
            user={auth.user}
            userRole={userRole}
            projects_count={projects_count}
            phd_thesis_count={phd_thesis_count}
            notifications={notifications.list}
            notifications_count={notifications.count}
        >
            <Head title="Projects" />

            <Toaster position="bottom-right" reverseOrder={false} />

            {/* Project Collaborations Section */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-md mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Projects
                    </h3>
                    {auth.user.director == 1 && (
                        <Button
                            variant="outline"
                            onClick={openAddModal}
                            className="flex items-center text-main border-main hover:bg-blue-100"
                        >
                            <FiPlus className="mr-2" size={18} />
                            Create New Project
                        </Button>
                    )}
                </div>
                {projects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-32">
                        {projects.map((project) => (
                            <Card
                            key={project.id}
                            className="shadow-md rounded-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl border border-gray-200 flex flex-col justify-between"
                        >
                            <CardHeader className="bg-gradient-to-r bg-main p-4">
                                <CardTitle className="text-xl font-semibold text-white">
                                    {project.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 bg-white flex-grow">
                                <p className="text-base text-gray-700 mb-4">
                                    {project.description}
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <InfoLabel
                                        label="Project Leader"
                                        value={`${project.user.first_name} ${project.user.last_name}`}
                                    />
                                    <InfoLabel label="Type" value={project.type} />
                                    <InfoLabel label="Code" value={project.code} />
                                    <InfoLabel label="Problematic" value={project.problematic} />
                                    <InfoLabel label="Reference" value={project.reference} />
                                    <InfoLabel label="Objective" value={project.objective} />
                                    <InfoLabel label="Keywords" value={project.keywords} />
                                    <InfoLabel label="Methodology" value={project.methodology} />
                                    <InfoLabel
                                        label="Date"
                                        value={dayjs(project.created_at).format("MMM D, YYYY")}
                                    />
                                    <InfoSection
                                        label="Material"
                                        items={JSON.parse(project.material)}
                                    />
                                    <InfoSection
                                        label="Expected Results"
                                        items={JSON.parse(project.expected_results)}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-100 p-4 mt-auto flex justify-end">
                                <Button variant="link" asChild>
                                    <Link
                                        href={route("collaboration.space.project.view", project.id)}
                                        className="text-indigo-600 hover:text-indigo-800 flex items-center"
                                    >
                                        View <FiSettings className="ml-1" />
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

            {/* Create Project Modal */}
            {showAddTeamModal && (
                <CreateProject
                    isOpen={showAddTeamModal}
                    onClose={closeAddModal}
                    lab={lab}
                    labs={labs}
                    doms={domains}
                    establishments={establishments}
                    lab_members={lab_members}
                />
            )}
        </Layout>
    );
};

export default Projects;
