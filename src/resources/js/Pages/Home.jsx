import React, { useContext, useState, useEffect } from "react";
import { Link, Head, usePage } from "@inertiajs/react";

import { LanguageContext } from "@/lib/LanguageContext";
import Layout from "@/Layouts/Layout";
import HeroSection from "@/Components/Sections/HeroSection";
import FeatureSection from "@/Components/Sections/FeatureSection";
import ReviewSection from "@/Components/Sections/ReviewSection"; // Import the new Review Section
import SubscribeSection from "@/Components/Sections/SubscribeSection"; // Import the new Review Section
import SponsorSection from "@/Components/Sections/SponsorSection"; // Import the new Review Section

import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ToastAction } from "@/Components/ui/toast";
import { useToast } from "@/Components/ui/use-toast";

const Home = ({
    auth,
    count_users,
    count_labs,
    count_projects,
    count_productions,
    count_services,
    count_teams,
    notifications,
    labMember,
    users
}) => {
    const { language } = useContext(LanguageContext);

    const { props } = usePage();

    const { toast } = useToast();

    useEffect(() => {
        if (props.flash.message) {
            let icon;
            let variant;
            switch (props.flash.message) {
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
        <Layout
            user={auth.user}
            notifications={notifications.list}
            notifications_count={notifications.count}
            labMember={labMember}
            users={users.users}
            chat_groups={users.chat_groups}
        >
            <Head title="Home" />
            <HeroSection
                count_labs={count_labs}
                count_users={count_users}
                count_projects={count_projects}
                count_productions={count_productions} // New prop
                count_services={count_services} // New prop
                count_teams={count_teams} // New prop
            />

            {/*<FeatureSection />
            <ReviewSection />
            {/* <SponsorSection /> */}
            <SubscribeSection />
        </Layout>
    );
};

export default Home;
