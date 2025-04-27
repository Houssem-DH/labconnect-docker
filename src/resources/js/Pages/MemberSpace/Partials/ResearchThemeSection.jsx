import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";


const ResearchThemeSection = ({ researchThemes,team }) => {
    const [expandedIds, setExpandedIds] = useState([]);


    const toggleExpansion = (id) => {
        if (expandedIds.includes(id)) {
            setExpandedIds(expandedIds.filter((item) => item !== id));
        } else {
            setExpandedIds([...expandedIds, id]);
        }
    };



    return (
        <div className="p-6 relative">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Research Themes
            </h3>
           
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

        </div>
    );
};

export default ResearchThemeSection;
