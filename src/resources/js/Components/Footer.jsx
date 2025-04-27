import React from "react";
import ApplicationLogo from "./ApplicationLogo";
import Facebook from "/public/assets/Icon/facebook.svg";
import Twitter from "/public/assets/Icon/twitter.svg";
import Instagram from "/public/assets/Icon/instagram.svg";

const Footer = () => {
    return (
        <div className="bg-white-300 pt-44 pb-24">
            <div className="max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4">
                <div className="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start">
                    <ApplicationLogo className="h-8 w-auto mb-6" />
                    <p className="mb-4">
                        <strong className="font-medium">UnilabConnect</strong> is a platform dedicated to connecting university and private labs, facilitating collaboration, and streamlining project management with innovative features and secure communication.
                    </p>
                    <div className="flex w-full mt-2 mb-8 -mx-2">
                        <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
                            <img src={Facebook} alt="Facebook" className="h-6 w-6" />
                        </div>
                        <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
                            <img src={Twitter} alt="Twitter" className="h-6 w-6" />
                        </div>
                        <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
                            <img src={Instagram} alt="Instagram" className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="text-gray-400">
                        ©{new Date().getFullYear()} - UnilabConnect
                    </p>
                </div>
                <div className="row-span-2 sm:col-span-2 sm:col-start-7 sm:col-end-9 flex flex-col">
                    <p className="text-black-600 mb-4 font-medium text-lg">
                        Platform
                    </p>
                    <ul className="text-black-500">
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Lab Directory
                        </li>
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Research Projects
                        </li>
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Collaboration Tools
                        </li>
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Resource Management
                        </li>
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Network Opportunities
                        </li>
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Support & FAQ
                        </li>
                    </ul>
                </div>
                <div className="row-span-2 sm:col-span-2 sm:col-start-9 sm:col-end-11 flex flex-col">
                    <p className="text-black-600 mb-4 font-medium text-lg">
                        Engage
                    </p>
                    <ul className="text-black-500">
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            About UnilabConnect
                        </li>
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Join Our Community
                        </li>
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Tutorials & Webinars
                        </li>
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            News & Updates
                        </li>
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Privacy Policy
                        </li>
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Terms of Service
                        </li>
                    </ul>
                </div>
                <div className="row-span-2 sm:col-span-2 sm:col-start-11 sm:col-end-13 flex flex-col">
                    <p className="text-black-600 mb-4 font-medium text-lg">
                        Collaborate
                    </p>
                    <ul className="text-black-500">
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Partner with Us
                        </li>
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Research Collaborations
                        </li>
                        <li className="my-2 hover:text-blue-500 cursor-pointer transition-all">
                            Affiliate Programs
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Footer;
