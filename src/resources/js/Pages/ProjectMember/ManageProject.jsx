import React from "react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/ProjectMemberLayout";
import ProjectDetails from "./Partials/ProjectDetails";
import TeamMembersTable from "./Partials/ProjectMembersTable";
import GlobalReportCard from "./Partials/GlobalReportCard"; // Import the GlobalReportCard component
import PersonalReportCard from "./Partials/PersonalReportCard"; // Import the PersonalReportCard component
import { Head } from "@inertiajs/react";

const ManageProjectPage = ({
    auth,
    projectDetails,
    projectMembers,
    lab_members,
    labs,
    lab_members_all,
    noProjectMembers,
    userRole,
    globalReport,
    personalReports,
    personalReport,
    isProjectMember,
    isExternalMember,
}) => {
    return (
        <Layout user={auth.user} userRole={userRole}>
            <Head title="Manage Project" />
            <SpaceLayout>
                <div className="mt-8 container mx-auto pb-12 pt-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
                        Manage Project
                    </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <ProjectDetails project={projectDetails} />
                        <TeamMembersTable
                            members={projectMembers}
                            lab_members={lab_members}
                            labs={labs}
                            lab_members_all={lab_members_all}
                            project={projectDetails}
                            externalMembers={noProjectMembers}
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
                        <GlobalReportCard
                            globalReport={globalReport}
                            project={projectDetails}
                        />
                        <PersonalReportCard
                            personalReports={personalReports}
                            isProjectMember={isProjectMember}
                            isExternalMember={isExternalMember}
                            personalReport={personalReport}
                            project={projectDetails}
                            user={auth.user}
                        />
                    </div>
                </div>
            </SpaceLayout>
        </Layout>
    );
};

export default ManageProjectPage;
