import React, { useEffect } from "react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/TeamLeaderSpaceLayout";
import ProjectDetails from "./Partials/ProjectDetails";
import TeamMembersTable from "./Partials/ProjectMembersTable";
import GlobalReportCard from "./Partials/GlobalReportCard"; // Import the GlobalReportCard component
import PersonalReportCard from "./Partials/PersonalReportCard"; // Import the PersonalReportCard component
import { Head } from "@inertiajs/react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { ToastAction } from "@/Components/ui/toast";
import { useToast } from "@/Components/ui/use-toast";

const ManageProjectPage = ({
    auth,
    projectDetails,
    projectMembers,
    lab_members,
    labs,
    lab_members_all,
    externalMembers,
    noProjectMembers,
    userRole,
    globalReport,
    personalReports,
    personalReport,
    isProjectMember,
    isProjectLeader,

}) => {
    const { props } = usePage();

   
    
    const { toast } = useToast();

    useEffect(() => {
        if (props.flash.message) {
            let icon;
            let variant;
            switch (props.flash.message) {
                case "report Added Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Member added Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Project member deleted Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;
                case "Project updated successfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Something wrong in this operation , try again":
                    icon = <XCircle className="w-6 h-6 text-red-500" />;
                    variant = "default";
                    break;

                case "Project already exists for this member":
                    icon = <XCircle className="w-6 h-6 text-red-500" />;
                    variant = "default";
                    break;

                case "a report is already added to this project":
                    icon = <AlertCircle className="w-6 h-6 text-yellow-500" />;
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
        <Layout user={auth.user} userRole={userRole}>
            <Head title="Manage Project" />
            <SpaceLayout>
                <div className="mt-8 container mx-auto pb-12 pt-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
                        Manage Project
                    </h1>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <ProjectDetails project={projectDetails}  isProjectLeader={isProjectLeader} />
                        <TeamMembersTable
                            members={projectMembers}
                            lab_members={lab_members}
                            labs={labs}
                            isProjectLeader={isProjectLeader}
                            externalMembers={externalMembers}
                            lab_members_all={lab_members_all}
                            project={projectDetails}
                            noProjectMembers={noProjectMembers}
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
                        <GlobalReportCard
                            globalReport={globalReport}
                            project={projectDetails}
                            isProjectLeader={isProjectLeader}
                            isProjectMember={isProjectMember}
                        />
                        <PersonalReportCard
                            personalReports={personalReports}
                            personalReport={personalReport}
                            isProjectLeader={isProjectLeader}
                            project={projectDetails}
                            user={auth.user}
                            isProjectMember={isProjectMember}
                        />
                    </div>
                </div>
            </SpaceLayout>
        </Layout>
    );
};

export default ManageProjectPage;
