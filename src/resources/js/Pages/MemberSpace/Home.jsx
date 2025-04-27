import React, { useState, useRef, useEffect, useContext } from "react";

import { Link, Head, useForm } from "@inertiajs/react";

import HeaderCard from "@/Components/HeaderCard";
import Avatar from "@/Components/Avatar"; // Import Avatar component
import background_image from "/public/assets/img/background_image.jpg";

import { FiCamera } from "react-icons/fi";
import Layout from "@/Layouts/Layout";
import SpaceLayout from "@/Layouts/MemberLayout";
import { usePage } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import { ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/Components/ui/badge";
import LabLocationMap from "@/Components/LabLocation";

import {
    Users,
    UserCheck,
    UserPlus,
    UserX,
    UserMinus,
    Wrench,
} from "lucide-react";
import {
    FiMoreVertical,
    FiCalendar,
    FiUser,
    FiMail,
    FiPhone,
    FiTag,
    FiHome,
    FiGrid,
    FiLayers,
    FiMapPin,
} from "react-icons/fi";
import { Card, CardContent, CardTitle } from "@/Components/ui/card";

import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { ToastAction } from "@/Components/ui/toast";
import { useToast } from "@/Components/ui/use-toast";
import LabStats from "@/Components/LabStats";

const Home = ({
    lab,
    recentLabMembers,
    user,
    auth,
    userRole,
    domains,
    specialities,
    number_teams,
    number_lab_members,
    number_researchers,
    researchers_establishment,
    researchers_out_establishment,
    number_support_stuff,
    faculty,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);
    const [isModalPicOpen, setIsModalPicOpen] = useState(false);

    const openModalPic = () => {
        setIsModalPicOpen(true);
    };

    const closeModalPic = () => {
        setIsModalPicOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleHover = () => {
        setIsHovered(!isHovered);
    };

    const { props } = usePage();

    const { toast } = useToast();

    useEffect(() => {
        if (props.flash.message) {
            let icon;
            let variant;
            switch (props.flash.message) {
                case "Lab Updated Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    variant = "default";
                    break;

                case "Lab Picture Updated Succesfully":
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
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
            <Head title="Director Space" />
            <SpaceLayout>
                <Toaster position="bottom-right" reverseOrder={false} />
                <div className="relative pb-24">
                    <HeaderCard>
                        <div
                            onMouseEnter={handleHover}
                            onMouseLeave={handleHover}
                            ref={cardRef}
                        >
                            <img
                                src={
                                    lab.picture
                                        ? `storage/${lab.picture}`
                                        : background_image
                                }
                                alt="Background Photo"
                                className="w-full h-80 rounded-lg object-cover"
                            />
                           
                        </div>
                    </HeaderCard>

                    <div className="flex space-x-6 mt-6 pt-4">
                        {/* Left side with two smaller cards */}
                        <div className="flex flex-col gap-6 w-[40%]">
                            <Card className="bg-white rounded-lg shadow-lg border border-gray-300 h-[15rem] overflow-hidden ">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between py-4 px-8 border-b border-gray-200">
                                        <CardTitle className="text-xl font-semibold">
                                            Director
                                        </CardTitle>
                                        <Link
                                            href={route("profile.edit", {
                                                id: user.id,
                                            })}
                                            className="text-gray-600 hover:text-gray-900"
                                            aria-label="More options"
                                        >
                                            <ExternalLink className="h-6 w-6" />
                                        </Link>
                                    </div>
                                    <div className="border-b border-gray-200"></div>{" "}
                                    <CardContent className="text-gray-700 flex items-center space-x-4 py-4">
                                        <div className="flex-shrink-0">
                                            <Avatar
                                                user={user}
                                                className="h-14 w-14 rounded-full border-2 border-main shadow-md"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold ">
                                                {user.first_name}{" "}
                                                {user.last_name}
                                            </div>
                                            <div className="text-gray-500">
                                                {user.email}
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>

                            <Card className="bg-white rounded-lg shadow-lg border border-gray-300 h-full overflow-hidden">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between py-4 px-8 border-b border-gray-200">
                                        <CardTitle className="text-xl font-semibold">
                                            Recent Members
                                        </CardTitle>
                                        <Link
                                            href={route(
                                                "director.space.members"
                                            )}
                                            className="text-gray-600 hover:text-gray-900"
                                            aria-label="More options"
                                        >
                                            <ExternalLink className="h-6 w-6" />
                                        </Link>
                                    </div>
                                    <div className="border-b border-gray-200"></div>
                                    <CardContent className="text-gray-700 p-6 flex-1 overflow-y-auto h-full relative">
                                        {/* Assuming 'members' is an array with member data */}
                                        <ul className="space-y-4">
                                            {recentLabMembers.length > 0 ? (
                                                recentLabMembers.map(
                                                    (member, index) => (
                                                        <li
                                                            key={index}
                                                            className="flex items-center space-x-4"
                                                        >
                                                            <div className="flex-shrink-0">
                                                                <Link
                                                                    href={route(
                                                                        "profile.edit",
                                                                        {
                                                                            id: member
                                                                                .user
                                                                                .id,
                                                                        }
                                                                    )}
                                                                >
                                                                    <Avatar
                                                                        user={
                                                                            member.user
                                                                        } // Assuming 'member' has avatar information
                                                                        className="h-12 w-12 rounded-full border-2 border-main shadow-md"
                                                                    />
                                                                </Link>
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-semibold">
                                                                    {
                                                                        member
                                                                            .user
                                                                            .first_name
                                                                    }{" "}
                                                                    {
                                                                        member
                                                                            .user
                                                                            .last_name
                                                                    }
                                                                </div>
                                                                <div className="text-gray-500">
                                                                    {formatDistanceToNow(
                                                                        new Date(
                                                                            member.created_at
                                                                        ),
                                                                        {
                                                                            addSuffix: true,
                                                                        }
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                )
                                            ) : (
                                                <li className="text-center text-gray-500">
                                                    No recent members found.
                                                </li>
                                            )}
                                        </ul>
                                        {/* Line chart at the bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 w-full h-24 ">
                                            <svg
                                                width="100%"
                                                height="100%"
                                                className="bg-white"
                                            >
                                                <path
                                                    d="
                        M 0,80
                        L 50,60
                        L 100,80
                        L 150,50
                        L 200,70
                        L 250,40
                        L 300,70
                        L 350,50
                        L 400,90
                        L 450,30
                        L 500,60
                        L 550,20
                        L 600,70
                        L 650,10
                        L 700,80
                        L 750,50
                        L 800,70
                        L 850,40
                        L 900,80
                        L 950,50
                        L 1000,70
                        L 1050,30
                        L 1100,80
                        L 1150,60
                        L 1200,90
                        L 1250,50
                        L 1300,70
                        L 1350,20
                        L 1400,80
                        L 1450,10
                        L 1500,90
                        L 1500,100
                        L 0,100
                        Z"
                                                    fill="rgba(255, 0, 0, 0.2)"
                                                    stroke="red"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        </div>
                        <div className="w-[calc(60%)]">
                            <Card className="bg-white rounded-lg shadow-lg border border-gray-300 h-full overflow-hidden">
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between py-4 px-8 border-b border-gray-200">
                                        <CardTitle className="text-xl font-semibold">
                                            Lab Details
                                        </CardTitle>

                                        
                                    </div>
                                    <div className="border-b border-gray-200"></div>{" "}
                                    {/* Vertical rule */}
                                    <CardContent className="text-gray-700 flex-1 p-6 space-y-4">
                                        {/* Establishment */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <FiHome className="text-main h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex">
                                                    <span className="font-semibold text-gray-600 w-60">
                                                        Establishment
                                                    </span>
                                                    <span className="font-semibold">
                                                        {lab.establishment}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Faculty/Institute */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <FiHome className="text-main h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex">
                                                    <span className="font-semibold text-gray-600 w-60">
                                                        Faculty/Institute
                                                    </span>
                                                    <span className="font-semibold">
                                                        {faculty.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Domain */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <FiGrid className="text-main h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex">
                                                    <span className="font-semibold text-gray-600 w-60">
                                                        Domains
                                                    </span>

                                                    {lab.domain && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {JSON.parse(
                                                                lab.domain
                                                            ).map(
                                                                (
                                                                    domain,
                                                                    index
                                                                ) => (
                                                                    <Badge
                                                                        key={
                                                                            index
                                                                        }
                                                                        variant="outline"
                                                                    >
                                                                        {domain}
                                                                    </Badge>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Speciality */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <FiLayers className="text-main h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex">
                                                    <span className="font-semibold text-gray-600 w-60">
                                                        Specialities
                                                    </span>

                                                    {lab.speciality && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {JSON.parse(
                                                                lab.speciality
                                                            ).map(
                                                                (
                                                                    speciality,
                                                                    index
                                                                ) => (
                                                                    <Badge
                                                                        key={
                                                                            index
                                                                        }
                                                                        variant="outline"
                                                                    >
                                                                        {
                                                                            speciality
                                                                        }
                                                                    </Badge>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <FiTag className="text-main h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex">
                                                    <span className="font-semibold text-gray-600 w-60">
                                                        Title
                                                    </span>
                                                    <span className="font-semibold">
                                                        {lab.title}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Acronym Lab Name */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <FiTag className="text-main h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex">
                                                    <span className="font-semibold text-gray-600 w-60">
                                                        Acronym Lab Name
                                                    </span>
                                                    <span className="font-semibold">
                                                        {lab.acronym_lab_name}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Creation Date */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <FiCalendar className="text-main h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex">
                                                    <span className="font-semibold text-gray-600 w-60">
                                                        Creation Date
                                                    </span>
                                                    <span className="font-semibold">
                                                        {lab.creation_date}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date of Appointment */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <FiCalendar className="text-main h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex">
                                                    <span className="font-semibold text-gray-600 w-60">
                                                        Date of Appointment
                                                    </span>
                                                    <span className="font-semibold">
                                                        {lab.date_appointment}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Previous Director */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <FiUser className="text-main h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex">
                                                    <span className="font-semibold text-gray-600 w-60">
                                                        Previous Director
                                                    </span>
                                                    <span className="font-semibold">
                                                        {lab.previous_director}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Email Address */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <FiMail className="text-main h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex">
                                                    <span className="font-semibold text-gray-600 w-60">
                                                        Email Address
                                                    </span>
                                                    <span className="font-semibold">
                                                        {lab.e_adresse}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Telephone */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <FiPhone className="text-main h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex">
                                                    <span className="font-semibold text-gray-600 w-60">
                                                        Telephone
                                                    </span>
                                                    <span className="font-semibold">
                                                        +213 {lab.tlp}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        {lab.maps && (
                                            <div className="flex items-center space-x-4">
                                                {/* Icon */}
                                                <div className="flex-shrink-0">
                                                    <FiMapPin className="text-main h-5 w-5" />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1">
                                                    <div className="flex flex-col space-y-2">
                                                        {/* Title */}
                                                        <span className="font-semibold text-gray-600 w-60"></span>

                                                        {/* Map */}
                                                        <div
                                                            className="relative w-full h-64 rounded-lg overflow-hidden shadow-md border border-gray-200 bg-gray-100"
                                                            style={{
                                                                zIndex: 1,
                                                            }}
                                                        >
                                                            <LabLocationMap
                                                                lat={
                                                                    JSON.parse(
                                                                        lab.maps
                                                                    )[0]
                                                                }
                                                                lng={
                                                                    JSON.parse(
                                                                        lab.maps
                                                                    )[1]
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <LabStats
                        number_teams={number_teams}
                        number_lab_members={number_lab_members}
                        number_researchers={number_researchers}
                        researchers_establishment={researchers_establishment}
                        researchers_out_establishment={
                            researchers_out_establishment
                        }
                        number_support_stuff={number_support_stuff}
                    />

                    
                </div>
            </SpaceLayout>
        </Layout>
    );
};

export default Home;
