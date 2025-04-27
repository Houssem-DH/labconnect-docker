import React from "react";
import Layout from "@/Layouts/CollaborationSpaceLayout";

import ProjectDetails from "./Partials/ProjectDetails"; // Import the ProjectDetails component
import TeamMembersTable from "./Partials/ProjectMembersTable";
import GlobalReportCard from "./Partials/GlobalReportCard"; // Import the GlobalReportCard component
import PersonalReportCard from "./Partials/PersonalReportCard"; // Import the PersonalReportCard component
import { Head } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";

const ManageProjectPage = ({
    auth,
    projectDetails,
    projectMembers,
    projectMemberss,
    lab_members,
    labs,
    lab_members_all,
    noProjectMembers,
    lab,
    domains,
    globalReport,
    establishments,
    userRole,
    projects_count,
    phd_thesis_count,
    notifications,
    
    isProjectLeader,
    isProjectMember,
    personalReports,
    personalReport
}) => {


    console.log(projectMembers);

    return (
        <Layout
            user={auth.user}
            userRole={userRole}
            projects_count={projects_count}
            phd_thesis_count={phd_thesis_count}
            notifications={notifications.list}
            notifications_count={notifications.count}
        >
            <Head title="Manage Project" />

            <div className="mt-8 container mx-auto pb-12 pt-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
                        View Project
                    </h1>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <ProjectDetails
                        user={auth.user}
                        project={projectDetails}
                        lab={lab}
                        lab_members={lab_members}
                        domains={domains}
                        labs={labs}
                        establishments={establishments}
                    />

                    {/* Right card for team members */}

                    <TeamMembersTable
                        members={projectMemberss}
                        lab_members={lab_members}
                        labs={labs}
                        userAuth={auth.user}
                        lab_members_all={lab_members_all}
                        project={projectDetails}
                        externalMembers={noProjectMembers}
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
        </Layout>
    );
};

export default ManageProjectPage;
