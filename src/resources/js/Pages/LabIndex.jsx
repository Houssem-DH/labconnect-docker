import React, { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { FaArrowLeft, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import {
    FaUniversity,
    FaBuilding,
    FaClipboardList,
    FaCalendarAlt,
    FaCog,
    FaUserAlt,
    FaInfoCircle,
    FaEnvelope,
    FaLink,
    FaTags,
    FaUserTie,
} from "react-icons/fa";
import Avatar from "@/Components/Avatar"; // Import Avatar component
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
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Badge } from "@/Components/ui/badge";
import MembersSection from "@/Components/LabSections/MembersSection";
import TeamsSection from "@/Components/LabSections/TeamsSection";
import MaterialsSection from "@/Components/LabSections/MaterialsSection";
import ProjectsSection from "@/Components/LabSections/ProjectsSection";
import ServicesSection from "@/Components/LabSections/ServicesSection";
import LocationSection from "@/Components/LabSections/LocationSection";

const Lab = ({
    auth,
    lab,
    materials,
    projects,
    services,
    teams,
    lab_members_all,
    members,
    notifications,
    labMember,
    users,
}) => {
    const [activeTab, setActiveTab] = useState("members");

    return (
        <Layout
            user={auth.user}
            notifications={notifications.list}
            notifications_count={notifications.count}
            labMember={labMember}
            users={users.users}
            chat_groups={users.chat_groups}
        >
            <Head title={lab.title} />
            <div className="container mx-auto py-32 px-4">
                {/* Lab Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800">
                        {lab.title}
                        <span className="text-lg text-gray-500 ml-2">
                            ({lab.acronym_lab_name})
                        </span>
                    </h1>
                    <Link
                        href="/labs"
                        className="text-gray-600 hover:text-main transition duration-300 flex items-center"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Labs
                    </Link>
                </div>

                {/* Lab Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* First Card: Lab Picture & Basic Info */}
                    <motion.div
                        className="bg-white shadow-lg rounded-lg p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Lab Picture */}
                        <img
                            src={`storage/${lab.picture}`}
                            alt={lab.title}
                            className="w-full h-56 object-cover rounded-lg mb-6"
                        />

                        {/* Director Info */}
                        {lab.director && (
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="flex-shrink-0">
                                    <Link>
                                        <Avatar
                                            user={lab.director}
                                            className="h-14 w-14 rounded-full border-2 border-main shadow-md"
                                        />
                                    </Link>
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-lg">
                                        {lab.director.first_name}{" "}
                                        {lab.director.last_name}
                                    </div>
                                    <div className="text-gray-500">
                                        {lab.director.email ||
                                            "Email not available"}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Info */}
                        <p className="text-gray-600 mb-4">
                            <FaEnvelope className="inline-block mr-2 text-main" />{" "}
                            {lab.e_adresse || "Email not available"}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <FaPhone className="inline-block mr-2 text-main" />{" "}
                            {lab.tlp || "Phone not available"}
                        </p>
                    </motion.div>

                    {/* Second Card: Detailed Lab Info */}
                    <motion.div
                        className="bg-white shadow-lg rounded-lg p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="flex items-center mb-6">
                            <FaInfoCircle className="text-main mr-3 w-6 h-6" />
                            <h2 className="text-3xl font-semibold text-main">
                                Lab Information
                            </h2>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <FaUniversity className="text-main mr-3 w-6 h-6" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-1">
                                        Establishment
                                    </h3>
                                    <p className="text-gray-600">
                                        {lab.establishment || "Not available"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaBuilding className="text-main mr-3 w-6 h-6" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-1">
                                        Faculty/Institute
                                    </h3>
                                    <p className="text-gray-600">
                                        {lab.faculty?.name || "Not available"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaCalendarAlt className="text-main mr-3 w-6 h-6" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-1">
                                        Creation Date
                                    </h3>
                                    <p className="text-gray-600">
                                        {lab.creation_date || "Not available"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <FaUserTie className="text-main mr-3 w-6 h-6" />
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-1">
                                        Previous Director
                                    </h3>
                                    <p className="text-gray-600">
                                        {lab.previous_director ||
                                            "Not available"}
                                    </p>
                                </div>
                            </div>

                            {/* Domain */}
                            <div className="flex items-center space-x-4">
                                <FiGrid className="text-main w-6 h-6" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-800 mb-1">
                                        Domains
                                    </h3>
                                    {lab.domain ? (
                                        <div className="flex flex-wrap gap-2">
                                            {JSON.parse(lab.domain).map(
                                                (domain, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="text-main border-main"
                                                    >
                                                        {domain}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">
                                            Not available
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Speciality */}
                            <div className="flex items-center space-x-4">
                                <FiLayers className="text-main w-6 h-6" />
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-800 mb-1">
                                        Specialities
                                    </h3>
                                    {lab.speciality ? (
                                        <div className="flex flex-wrap gap-2">
                                            {JSON.parse(lab.speciality).map(
                                                (speciality, index) => (
                                                    <Badge
                                                        key={index}
                                                        variant="outline"
                                                        className="text-main border-main"
                                                    >
                                                        {speciality}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-600">
                                            Not available
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Third Card: Materials and Projects */}
                <motion.div
                    className="bg-white shadow-md rounded-lg p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    {/* Horizontal Titles */}
                    <div className="flex items-center mb-6 border-b border-gray-200 pb-4 space-x-8">
                        <button
                            onClick={() => setActiveTab("members")}
                            className={`text-lg font-semibold ${
                                activeTab === "members"
                                    ? "text-main border-b-2 border-main"
                                    : "text-gray-500"
                            } transition duration-300`}
                        >
                            Members
                        </button>
                        <button
                            onClick={() => setActiveTab("teams")}
                            className={`text-lg font-semibold ${
                                activeTab === "teams"
                                    ? "text-main border-b-2 border-main"
                                    : "text-gray-500"
                            } transition duration-300`}
                        >
                            Teams
                        </button>
                        <button
                            onClick={() => setActiveTab("materials")}
                            className={`text-lg font-semibold ${
                                activeTab === "materials"
                                    ? "text-main border-b-2 border-main"
                                    : "text-gray-500"
                            } transition duration-300`}
                        >
                            Materials
                        </button>
                        <button
                            onClick={() => setActiveTab("projects")}
                            className={`text-lg font-semibold ${
                                activeTab === "projects"
                                    ? "text-main border-b-2 border-main"
                                    : "text-gray-500"
                            } transition duration-300`}
                        >
                            Projects
                        </button>

                        <button
                            onClick={() => setActiveTab("services")}
                            className={`text-lg font-semibold ${
                                activeTab === "services"
                                    ? "text-main border-b-2 border-main"
                                    : "text-gray-500"
                            } transition duration-300`}
                        >
                            Services
                        </button>
                        <button
                            onClick={() => setActiveTab("location")}
                            className={`text-lg font-semibold ${
                                activeTab === "location"
                                    ? "text-main border-b-2 border-main"
                                    : "text-gray-500"
                            } transition duration-300`}
                        >
                            Location
                        </button>
                    </div>

                    {/* Tab Content */}

                    {activeTab === "members" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {members ? (
                                <MembersSection lab_members={members} />
                            ) : (
                                <p className="text-gray-500">
                                    No Members available.
                                </p>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "teams" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {teams ? (
                                <TeamsSection
                                    lab={lab}
                                    teams={teams}
                                    lab_members_all={lab_members_all}
                                />
                            ) : (
                                <p className="text-gray-500">
                                    No Teams available.
                                </p>
                            )}
                        </motion.div>
                    )}
                    {activeTab === "materials" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {materials ? (
                                <ul className="space-y-4">
                                    <MaterialsSection materials={materials} />
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    No materials available.
                                </p>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "projects" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {projects ? (
                                <ul className="space-y-4">
                                    <ProjectsSection projects={projects} />
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    No projects available.
                                </p>
                            )}
                        </motion.div>
                    )}

                    {activeTab === "services" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {services ? (
                                <ul className="space-y-4">
                                    <ServicesSection services={services} />
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    No services available.
                                </p>
                            )}
                        </motion.div>
                    )}
                    {activeTab === "location" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {lab.maps ? (
                                <ul className="space-y-4">
                                    <LocationSection lab={lab} />
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    No Location available.
                                </p>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </Layout>
    );
};

export default Lab;
