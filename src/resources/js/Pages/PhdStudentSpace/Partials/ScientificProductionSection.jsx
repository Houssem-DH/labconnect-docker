import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

import {
    FiChevronDown,
    FiChevronUp,

} from "react-icons/fi";


const ScientificProductionSection = ({
    scientificProductions,

}) => {
  
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
                Scientific Productions
            </h3>
          
                
            {scientificProductions ? (
                <ul className="divide-y divide-gray-800">
                    {scientificProductions.map((production) => (
                        <li key={production.id} className="py-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-semibold text-red-400">
                                        {production.title}
                                    </p>
                                    <p className="text-sm text-gray-800">
                                        Type: {production.type}
                                    </p>
                                    <p className="text-sm text-gray-800">
                                        Year: {production.year_publication}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => {
                                            toggleExpansion(production.id);
                                            Inertia.reload({
                                                data: {
                                                    expandedIds: expandedIds,
                                                },
                                            });
                                        }}
                                        className="text-gray-700 focus:outline-none"
                                    >
                                        {expandedIds.includes(production.id) ? (
                                            <FiChevronUp />
                                        ) : (
                                            <FiChevronDown />
                                        )}
                                    </button>
                                   
                                   
                                </div>
                            </div>
                            {expandedIds.includes(production.id) && (
                                <div className="mt-2 text-sm text-gray-600">
                                    <p className="text-sm text-gray-800">
                                        Url: {production.url}
                                    </p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No scientific productions available</p>
            )}
           
        </div>
    );
};

export default ScientificProductionSection;
