import React, { useState } from "react";
import { FiPlus, FiSettings, FiTrash2, FiChevronDown, FiChevronUp } from "react-icons/fi";
import AddResearchThemeModal from "./Modals/AddResearchThemeModal"; // Import the AddResearchThemeModal component
import DeleteResearchThemeModal from "./Modals/DeleteResearchThemeModal"; // Import the DeleteResearchThemeModal component

const ResearchThemeSection = ({ researchThemes,team }) => {
    const [expandedIds, setExpandedIds] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(null); // State to track the selected research theme for deletion

    const toggleExpansion = (id) => {
        if (expandedIds.includes(id)) {
            setExpandedIds(expandedIds.filter((item) => item !== id));
        } else {
            setExpandedIds([...expandedIds, id]);
        }
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openDeleteModal = (theme) => {
        setSelectedTheme(theme);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="p-6 relative">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Research Themes
            </h3>
            <button
                onClick={openAddModal}
                className="absolute top-0 right-0 bg-black text-white p-2 rounded-full hover:bg-gray-800 hover:text-white-500"
            >
                <FiPlus className="h-6 w-6" />
            </button>
            {researchThemes ? (
                <ul className="divide-y divide-gray-800">
                    {researchThemes.map((theme) => (
                        <li key={theme.id} className="py-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold text-red-400">
                                        {theme.title}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => toggleExpansion(theme.id)}
                                        className="text-gray-700 focus:outline-none"
                                    >
                                        {expandedIds.includes(theme.id) ? (
                                            <FiChevronUp />
                                        ) : (
                                            <FiChevronDown />
                                        )}
                                    </button>
                                    <FiTrash2
                                        className="ml-4 text-red-500 cursor-pointer"
                                        onClick={() => openDeleteModal(theme)}
                                    />
                                </div>
                            </div>
                            {expandedIds.includes(theme.id) && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>{theme.description}</p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No research themes available</p>
            )}
            {isAddModalOpen && (
                <AddResearchThemeModal onClose={closeAddModal} team={team} />
            )}
            {/* Delete modal */}
            {isDeleteModalOpen && (
                <DeleteResearchThemeModal
                    onClose={closeDeleteModal}
                    theme={selectedTheme}
                />
            )}
        </div>
    );
};

export default ResearchThemeSection;
