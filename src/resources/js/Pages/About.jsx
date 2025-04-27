import React, { useContext } from "react";
import { Head } from "@inertiajs/react";
import { LanguageContext } from "@/lib/LanguageContext";
import Layout from "@/Layouts/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";

const About = ({ auth, notifications }) => {
    const { language } = useContext(LanguageContext);

    return (
        <Layout user={auth.user} notifications={notifications.list} notifications_count={notifications.count}>
            <Head title="About LabConnect" />
            
            <div className="py-32 px-8 lg:px-16 flex flex-col items-center text-center">
                <h1 className="text-5xl font-extrabold text-gray-800 mb-8">
                    {language === "en" ? "About LabConnect" : language === "fr" ? "À propos de LabConnect" : "عن LabConnect"}
                </h1>
                
                <Card className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-gray-900">
                            {language === "en" ? "Welcome to LabConnect" : language === "fr" ? "Bienvenue sur LabConnect" : "مرحبًا بك في LabConnect"}
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 mt-4">
                            {language === "en" ? (
                                "LabConnect redefines how you manage and interact with lab environments. Seamlessly access resources, foster dynamic collaborations, and optimize your lab operations with cutting-edge tools and integrations. Experience efficiency and innovation like never before."
                            ) : language === "fr" ? (
                                "LabConnect redéfinit la manière dont vous gérez et interagissez avec les environnements de laboratoire. Accédez facilement aux ressources, favorisez les collaborations dynamiques et optimisez les opérations de votre laboratoire grâce à des outils et des intégrations de pointe. Découvrez l'efficacité et l'innovation comme jamais auparavant."
                            ) : (
                                "LabConnect يعيد تعريف كيفية إدارة والتفاعل مع بيئات المعامل. الوصول بسهولة إلى الموارد، وتعزيز التعاون الديناميكي، وتحسين عمليات المعمل باستخدام أدوات ودمج متطورة. تجربة الكفاءة والابتكار كما لم يحدث من قبل."
                            )}
                        </CardDescription>
                    </CardHeader>
                </Card>
                
            </div>
        </Layout>
    );
};

export default About;
