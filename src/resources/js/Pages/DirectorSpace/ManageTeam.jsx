import React, { useState, useEffect } from "react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/SpaceLayout";
import LabTeamSection from "./Partials/LabTeamSection";
import ScientificProductionSection from "./Partials/ScientificProductionSection";
import ResearchThemeSection from "./Partials/ResearchThemeSection";
import { FiChevronRight, FiUsers, FiBarChart2 } from "react-icons/fi";
import { Link, Head, usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";

const ManageTeamPage = ({
    auth,
    team,
    team_members,
    labs,
    lab_members,
    lab_members_all,
    scientificProductions,
    researchThemes,
    userRole,
    notifications
}) => {
    const { props } = usePage();

    useEffect(() => {
        if (props.flash.message) {
            toast[props.flash.message.includes("Success") ? 'success' : 'error'](props.flash.message);
        }
    }, [props]);

    return (
        <Layout user={auth.user} userRole={userRole} notifications={notifications.list}
        notifications_count={notifications.count}>
            <Head title="Manage Team" />
            <SpaceLayout>
                <Toaster position="bottom-right" reverseOrder={false} />
                <div className="container mx-auto px-6 py-12 space-y-8">
                    <nav className="flex items-center text-gray-800 mb-6">
                        <FiChevronRight className="w-5 h-5 text-primary" />
                        <Link href="/director-space/teams" className="ml-2 text-lg font-semibold hover:text-primary">
                            Teams
                        </Link>
                        <FiChevronRight className="mx-2 w-5 h-5 text-primary" />
                        <span className="text-lg font-semibold">Manage Team</span>
                    </nav>
                    <div className="space-y-6">
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-primary text-white flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Team Members</h2>
                                <FiUsers className="text-2xl" />
                            </div>
                            <div className="p-6">
                                <LabTeamSection team={team} team_members={team_members} />
                            </div>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-primary text-white flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Scientific Productions</h2>
                                <FiBarChart2 className="text-2xl" />
                            </div>
                            <div className="p-6">
                                <ScientificProductionSection
                                    scientificProductions={scientificProductions}
                                    team={team}
                                    lab_members={lab_members}
                                    lab_members_all={lab_members_all}
                                    labs={labs}
                                />
                            </div>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 bg-primary text-white flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Research Themes</h2>
                                {/* Optional icon here */}
                            </div>
                            <div className="p-6">
                                <ResearchThemeSection
                                    team={team}
                                    researchThemes={researchThemes}
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
