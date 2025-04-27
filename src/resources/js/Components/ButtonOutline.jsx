import React from "react";

const ButtonOutline = ({ children }) => {
    return (
        <button className="font-medium tracking-wide py-2 px-5 sm:px-8 border border-main text-main bg-white outline-none rounded-l-full rounded-r-full capitalize hover:bg-main hover:text-white transition-all hover:shadow-main ">
            {" "}
            {children}
        </button>
    );
};

export default ButtonOutline;
