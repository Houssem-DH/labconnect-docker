import React, { useState, useRef } from "react";
import ManageLabModal from "./Modals/ManageLabModal";
import HeaderCard from "@/Components/HeaderCard";
import background_image from "/public/assets/img/background_image.jpg";
import UploadBackgroundModal from "./Modals/UploadBackgroundModal";
import { FiCamera, FiEdit, FiTrash2 } from "react-icons/fi";

const Home = ({ lab, user ,domains,specialities}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);

    const [isModalPicOpen, setIsModalPicOpen] = useState(false);

    const openModalPic = () => {
        setIsModalPicOpen(true);
    };

    const closeModalPic = () => {
        setIsModalPicOpen(false);
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleHover = () => {
        setIsHovered(!isHovered);
    };
    return (
        <div className="pb-24">
            <div className="pb-24">
                <HeaderCard>
                    <div
                        onMouseEnter={handleHover}
                        onMouseLeave={handleHover}
                        ref={cardRef}
                    >
                        {lab.picture ? (
                            <img
                                src={`storage/${lab.picture}`}
                                alt="Background Photo"
                                className="w-full h-80 mb-4 rounded-lg object-cover"
                            />
                        ) : (
                            <img
                                src={background_image}
                                alt="Background Photo"
                                className="w-full h-80 mb-4 rounded-lg object-cover"
                            />
                        )}

                        {isHovered && (
                            <div className="absolute top-2 right-2">
                                <button
                                    className="bg-red-500 rounded-full p-2 text-white hover:bg-white-500"
                                    onClick={openModalPic}
                                >
                                    <FiCamera className="h-6 w-6" />
                                </button>
                            </div>
                        )}
                    </div>
                </HeaderCard>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Left card for director information */}
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
        <div className="p-6">
            <h3 className="text-2xl font-bold mb-4">
                Director Information
            </h3>
            <div className="text-gray-600">
                <p>
                    <strong>Director:</strong> {user.first_name}{" "}
                    {user.last_name}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Phone:</strong> {lab.directorPhone}
                </p>
            </div>
        </div>
    </div>

    {/* Right card for lab information */}
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300">
        <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">
                Lab Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <div>
                    <p>
                        <strong>Title:</strong> {lab.title}
                    </p>
                    <p>
                        <strong>Acronym:</strong>{" "}
                        {lab.acronym_lab_name}
                    </p>
                    <p>
                        <strong>Establishment:</strong>{" "}
                        {lab.establishment}
                    </p>
                    <p>
                        <strong>Faculty/Institute:</strong>{" "}
                        {lab.faculty_institute}
                    </p>
                    <p>
                        <strong>Department:</strong>{" "}
                        {lab.department}
                    </p>
                    {/* Add more lab details here */}

                    <p>
                        <strong>N Order:</strong> {lab.n_ordered}
                    </p>
                    <p>
                        <strong>Creation Date:</strong>{" "}
                        {lab.creation_date}
                    </p>
                    <p>
                        <strong>Date of Appointment:</strong>{" "}
                        {lab.date_appointment}
                    </p>
                </div>
                <div>
                    <p>
                        <strong>Previous Director:</strong>{" "}
                        {lab.previous_director}
                    </p>
                    <p>
                        <strong>Email Address:</strong>{" "}
                        {lab.e_adresse}
                    </p>
                    <p>
                        <strong>Website:</strong> {lab.website}
                    </p>
                    <p>
                        <strong>Telephone:</strong> {lab.tlp}
                    </p>
                    <p>
                        <strong>Localisation:</strong>{" "}
                        {lab.localisation}
                    </p>
                    <p>
                        <strong>Presentation:</strong>{" "}
                        {lab.presentation}
                    </p>
                    <p>
                        <strong>Research Objectives:</strong>{" "}
                        {lab.research_objectives}
                    </p>
                    <p>
                        <strong>Keywords:</strong> {lab.Keywords}
                    </p>
                </div>
            </div>
            <div className="mt-4">
                <button
                    onClick={openModal}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 font-bold"
                >
                    Manage Lab
                </button>
            </div>
        </div>
    </div>
</div>


            {isModalOpen && (
                <ManageLabModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    domains={domains}
                    specialities={specialities}
                    lab={lab}
                />
            )}

            <UploadBackgroundModal
                isOpen={isModalPicOpen}
                onClose={closeModalPic}
                lab={lab}
            />
        </div>
    );
};

export default Home;
