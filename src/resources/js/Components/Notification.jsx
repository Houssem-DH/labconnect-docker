import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

const Notification = ({ message, onClose }) => {
    return (
        <div className="fixed bottom-4 right-4 bg-white p-4 shadow-lg rounded-md flex items-center space-x-2 z-50">
            <div className="flex-1">
                <p className="text-gray-800">{message.sender.first_name} {message.sender.last_name}:</p>
                <p className="text-gray-500">{message.message}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <IoMdClose />
            </button>
        </div>
    );
};

export default Notification;
