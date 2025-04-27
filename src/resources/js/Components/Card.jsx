// Card.js
import React, { useState } from "react";
import { FiChevronUp, FiChevronDown, FiEdit, FiPlus } from "react-icons/fi"; // Import the icons

const Card = ({
    children,
    className,
    header,
    openEditModal,

    openAddModal,
    addIconOpen,
    editIconOpen,
    collapsed,
    user,
    auth,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(collapsed);

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`relative bg-white shadow-md ${className}`}>
            <div className="p-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">
                    {header}{" "}
                    {editIconOpen && (
                        <>
                            {user.id === auth?.id && (
                                <button
                                    className="rounded-full p-2 text-gray-600 hover:bg-gray-200 transition duration-300"
                                    onClick={openEditModal}
                                >
                                    <FiEdit className="inline-block w-6 h-6" />
                                </button>
                            )}
                        </>
                    )}
                    {addIconOpen && (
                        <>
                            {user.id === auth?.id && (
                                <button
                                    className="rounded-full p-2 text-gray-600 hover:bg-gray-200 transition duration-300"
                                    onClick={openAddModal}
                                >
                                    <FiPlus className="inline-block w-6 h-6" />
                                </button>
                            )}
                        </>
                    )}
                </h1>

                {/* Collapse/uncollapse button */}
                <button
                    className="p-2 bg-gray-100 rounded-full"
                    onClick={handleToggleCollapse}
                >
                    {isCollapsed ? (
                        <FiChevronDown className="w-6 h-6" />
                    ) : (
                        <FiChevronUp className="w-6 h-6" />
                    )}
                </button>
            </div>
            {/* Content */}
            <div className={isCollapsed ? "hidden" : "block"}>{children}</div>
        </div>
    );
};

export default Card;
