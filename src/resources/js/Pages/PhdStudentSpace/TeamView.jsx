import React from "react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/PhdStudentLayout";
import LabTeamSection from "./Partials/LabTeamSection";
import ScientificProductionSection from "./Partials/ScientificProductionSection";
import ProjectsSection from "./Partials/ProjectsSections";
import {
    FiUsers,
    FiBarChart2,
    FiClipboard,
    FiChevronRight,
} from "react-icons/fi";
import { Link } from "@inertiajs/react";
import ResearchThemeSection from "./Partials/ResearchThemeSection";

const ManageTeamPage = ({
    auth,
    team,
    team_members,
    labs,
    lab_members,
    lab_members_all,
    scientificProductions,
    projects,
    researchThemes,
    userRole
}) => {
    
    return (

        <Layout user={auth.user} userRole={userRole}>
            <SpaceLayout>
                <div className="mt-8 container mx-auto px-4 pb-32 pt-12">
                    <div className="flex items-center mb-4 text-gray-600">
                        <FiChevronRight className="w-5 h-5" />
                        <Link
                            href="/member-space/teams"
                            className="ml-2 font-semibold hover:text-gray-900"
                        >
                            Teams
                        </Link>
                        <FiChevronRight className="mx-2 w-5 h-5" />
                        <span className="font-semibold cursor-default">
                            View Team
                        </span>
                    </div>
                    <div className="mb-8">
                        <div className="bg-red-500 rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gray-900 px-6 py-4 text-white-500 flex items-center justify-between">
                                <h2 className="text-xl md:text-2xl mb-2">
                                    Team Members
                                </h2>
                                <FiUsers className="text-xl" />
                            </div>
                            <div className="p-6 bg-gray-100">
                                <LabTeamSection
                                    team={team}
                                    team_members={team_members}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-red-500 rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gray-900 px-6 py-4 text-white-500 flex items-center justify-between">
                                <h2 className="text-xl md:text-2xl mb-2">
                                    Scientific Productions
                                </h2>
                                <FiBarChart2 className="text-xl" />
                            </div>
                            <div className="p-6 bg-gray-100">
                                <ScientificProductionSection
                                    scientificProductions={
                                        scientificProductions
                                    }
                                    team={team}
                                    lab_members={lab_members}
                                    lab_members_all={lab_members_all}
                                    labs={labs}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="bg-red-500 rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gray-900 px-6 py-4 text-white-500 flex items-center justify-between">
                                <h2 className="text-xl md:text-2xl mb-2">
                                    Research Theme
                                </h2>
                                {/* You can add an icon here if needed */}
                            </div>
                            <div className="p-6 bg-gray-100">
                                <ResearchThemeSection
                                team={team}
                                    researchThemes={researchThemes}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Add bottom margin to create space */}
                    <div className="mb-8">
                        <div className="bg-red-500 rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gray-900 px-6 py-4 text-white-500 flex items-center justify-between">
                                <h2 className="text-xl md:text-2xl mb-2">
                                    Projects
                                </h2>
                                <FiClipboard className="text-xl" />
                            </div>
                            <div className="p-6 bg-gray-100">
                                <ProjectsSection
                                    projects={projects}
                                    team={team}
                                    lab_members={lab_members}
                                    lab_members_all={lab_members_all}
                                    labs={labs}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SpaceLayout>
        </Layout>
    );
};

export default ManageTeamPage;
