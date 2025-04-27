import React from "react";

const ButtonPrimary = ({ children, addClass }) => {
    return (
        <button
            className={
                "font-semibold tracking-wide py-2 px-6 sm:px-8  text-white rounded-xl bg-main hover:shadow-main-md transition-all outline-none  " +
                addClass
            }
        >
            {children}
        </button>
    );
};

export default ButtonPrimary;
