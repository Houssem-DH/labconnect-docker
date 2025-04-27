import React, { useMemo, useContext } from "react";
import ButtonPrimary from "@/Components/ButtonPrimary";
import { motion } from "framer-motion";
import getScrollAnimation from "@/utils/getScrollAnimation";
import ScrollAnimationWrapper from "@/Layouts/ScrollAnimationWrapper";
import TypingEffect from "react-typing-effect";
import {
    User,
    FlaskConical,
    Briefcase,
    HardDrive,
    Layers,
    Users,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { LanguageContext } from "@/lib/LanguageContext";

const Hero = ({
    count_users,
    count_labs,
    count_projects,
    count_productions,
    count_services,
    count_teams,
}) => {
    const { language } = useContext(LanguageContext);

    let listUser = [
        {
            name: "Users",
            number: count_users,
            icon: <User size={24} className="text-main" />,
        },
        {
            name: "Labs",
            number: count_labs,
            icon: <FlaskConical size={24} className="text-main" />,
        },
        {
            name: "Projects",
            number: count_projects,
            icon: <Briefcase size={24} className="text-main" />,
        },
        {
            name: "Productions",
            number: count_productions,
            icon: <HardDrive size={24} className="text-main" />,
        },
        {
            name: "Services",
            number: count_services,
            icon: <Layers size={24} className="text-main" />,
        },
        {
            name: "Teams",
            number: count_teams,
            icon: <Users size={24} className="text-main" />,
        },
    ];

    const scrollAnimation = useMemo(() => getScrollAnimation(), []);

    // Define the text for each language
    const staticText = language === 'fr' ? "Élevez votre expérience de laboratoire avec" : language === 'ar' ? "رفع تجربتك في المختبر مع" : "Elevate Your Lab Experience with";

    const animatedTexts = [
        language === 'fr' ? " LabConnect" : language === 'ar' ? " LabConnect" : " LabConnect",
        language === 'fr' ? " Solutions de laboratoire transformatrices" : language === 'ar' ? " حلول مختبرية تحويليه" : " Transformative Lab Solutions",
        language === 'fr' ? " Facilitation de la recherche innovante" : language === 'ar' ? " تسهيل البحث المبتكر" : " Innovative Research Facilitation",
        language === 'fr' ? " Gestion des ressources de pointe" : language === 'ar' ? " إدارة الموارد المتطورة" : " Cutting-edge Resource Management",
        language === 'fr' ? " Options de collaboration intégrées" : language === 'ar' ? " خيارات التعاون المتكاملة" : " Integrated Collaboration Options",
    ];

    return (
        <div className="max-w-screen-xl mt-24 px-8 xl:px-16 mx-auto relative" id="about">
            <ScrollAnimationWrapper>
                <motion.div
                    className="grid grid-flow-row sm:grid-flow-col grid-rows-2 md:grid-rows-1 sm:grid-cols-2 gap-8 py-6 sm:py-16"
                    variants={scrollAnimation}
                >
                    <div className="flex flex-col justify-center items-start p-6 sm:p-8">
                        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-snug">
                            {staticText}
                            <TypingEffect
                                text={animatedTexts}
                                speed={45}
                                eraseSpeed={30}
                                cursorRenderer={(cursor) => <span>{cursor}</span>}
                                displayTextRenderer={(text, i) => {
                                    return (
                                        <span key={i} className="text-main">
                                            {text}
                                        </span>
                                    );
                                }}
                            />
                        </h1>
                        <p className="text-gray-700 mt-4 mb-6 text-lg">
                            <b>{language === 'fr' ? "LabConnect" : language === 'ar' ? "LabConnect" : "LabConnect"}</b> 
                            {language === 'fr' ? 
                                " redéfinit la manière dont vous gérez et interagissez avec les environnements de laboratoire. Accédez facilement aux ressources, favorisez des collaborations dynamiques et optimisez vos opérations de laboratoire avec des outils de pointe et des intégrations. Découvrez l'efficacité et l'innovation comme jamais auparavant." : 
                                language === 'ar' ? 
                                " يعيد تعريف كيفية إدارة والتفاعل مع بيئات المختبر. الوصول بسهولة إلى الموارد، وتعزيز التعاون الديناميكي، وتحسين عمليات المختبر باستخدام أدوات متطورة ودمجها. تجربة الكفاءة والابتكار كما لم يحدث من قبل." : 
                                " redefines how you manage and interact with lab environments. Seamlessly access resources, foster dynamic collaborations, and optimize your lab operations with cutting-edge tools and integrations. Experience efficiency and innovation like never before."}
                        </p>
                        <Link href={route("login")}>
                            <ButtonPrimary className="mt-4 bg-main text-white px-8 py-3 rounded-lg hover:bg-red-600 transition">
                                {language === 'fr' ? "Commencer" : language === 'ar' ? "ابدأ الآن" : "Get Started"}
                            </ButtonPrimary>
                        </Link>
                    </div>
                    <div className="flex w-full">
                        <motion.div className="h-full w-full" variants={scrollAnimation}>
                            <div className="relative w-[612px] h-[383px] overflow-hidden rounded-3xl bg-gray-200">
                                <img
                                    src="/assets/Lab.jpg"
                                    alt="Lab Management Illustration"
                                    className="object-cover w-full h-full absolute inset-0"
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </ScrollAnimationWrapper>

            <div className="relative w-full flex">
                <ScrollAnimationWrapper className="rounded-lg w-full grid grid-flow-row sm:grid-flow-row grid-cols-1 sm:grid-cols-3 py-9 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-gray-100 bg-white-500 z-10">
                    {listUser.map((item, index) => (
                        <motion.div
                            className="flex items-center justify-start sm:justify-center py-4 sm:py-6 w-8/12 px-4 sm:w-auto mx-auto sm:mx-0"
                            key={index}
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.2,
                                type: "spring",
                                stiffness: 300,
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="flex mx-auto w-40 sm:w-auto">
                                <div className="flex items-center justify-center bg-main-light w-12 h-12 mr-6 rounded-full shadow-lg transition-transform duration-300 hover:scale-105">
                                    {item.icon}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-xl text-black font-bold">
                                        {item.number}+{" "}
                                    </p>
                                    <p className="text-lg text-black">{item.name}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </ScrollAnimationWrapper>
                <div
                    className="absolute bg-black-600 opacity-5 w-11/12 rounded-lg h-64 sm:h-48 top-0 mt-8 mx-auto left-0 right-0"
                    style={{ filter: "blur(114px)" }}
                ></div>
            </div>
        </div>
    );
};

export default Hero;
