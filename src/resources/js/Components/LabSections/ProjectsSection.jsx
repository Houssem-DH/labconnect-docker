import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import {
    FaProjectDiagram,
    FaCalendarAlt,
    FaLink,
    FaUser,
    FaInfoCircle,
} from "react-icons/fa";
import Avatar from "@/Components/Avatar";

const ProjectsSection = ({ projects }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <motion.div
                    key={project.id}
                    className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="p-6">
                        {/* Project Leader */}
                        <div className="flex items-center mb-6">
                            <div className="flex-shrink-0 mr-4">
                                <Link>
                                <Avatar
                                    user={project.user}
                                    className="w-12 h-12 rounded-full border-2 border-main shadow-lg"
                                />
                                </Link>
                            </div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-1">
                                    Project Leader
                                </h4>
                                <p className="text-gray-800 font-semibold">
                                    {project.user.first_name} {project.user.last_name}
                                </p>
                                <p className="text-gray-600">
                                    {project.user.email || "Email not available"}
                                </p>
                            </div>
                        </div>

                        {/* Project Title */}
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                            {project.title}
                        </h3>

                        {/* Project Description */}
                        <div className="flex items-center mb-4">
                            <FaProjectDiagram className="text-main mr-3 w-6 h-6" />
                            <p className="text-gray-700">
                                {project.problematic || "Problematic not available"}
                            </p>
                        </div>

                        {/* Objective */}
                        <div className="flex items-center mb-4">
                            <FaInfoCircle className="text-main mr-3 w-6 h-6" />
                            <p className="text-gray-600">
                                {project.objective || "Objective not available"}
                            </p>
                        </div>

                       
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default ProjectsSection;
