// Card.js
import React from "react";

const HeaderCard = ({ children, className }) => {
    return (
        <div
        className={`relative sm:p-0.5 sm:rounded-lg  md ${className}`}
        >
            {children}
        </div>
    );
};

export default HeaderCard;