import React, { useEffect } from "react";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/MemberLayout";
import ScientificProductionDetails from "./Partials/ScientificProductionDetails";
import TeamMembersTable from "./Partials/TeamMembersTable";

import { Head } from "@inertiajs/react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { ToastAction } from "@/Components/ui/toast";
import { useToast } from "@/Components/ui/use-toast";

const ManageScientificProductionPage = ({
    auth,
    productionDetails,
    members,
    lab_members,
    labs,
    lab_members_all,
    noTeamMembers,
    userRole,
    globalReport,  // Add globalReport
    personalReports,  // Add personalReports
    personalReport,  // Add personalReport
    external_members,
    isProductionMember,  // Add membership check if needed
}) => {
    const { props } = usePage();
    const { toast } = useToast();

    useEffect(() => {
        if (props.flash.message) {
            let icon;
            let variant;
            switch (props.flash.message) {
                case "Production added successfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;
                case "Member added successfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;
                case "Production updated successfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;
                case "Something went wrong":
                    icon = <XCircle className="w-6 h-6 text-red-500" />;
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
            <Head title="Manage Scientific Production" />
            <SpaceLayout>
                <div className="mt-8 container mx-auto pb-12 pt-12 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-8 text-center ">
                        Manage Scientific Production
                    </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left column for production details */}
                        <ScientificProductionDetails production={productionDetails} />

                        {/* Right column for team members */}
                        <TeamMembersTable
                            members={members}
                            lab_members={lab_members}
                            external_members={external_members}
                            labs={labs}
                            lab_members_all={lab_members_all}
                            sc={productionDetails}
                            noTeamMembers={noTeamMembers}
                        />
                    </div>

                    
                </div>
            </SpaceLayout>
        </Layout>
    );
};

export default ManageScientificProductionPage;
