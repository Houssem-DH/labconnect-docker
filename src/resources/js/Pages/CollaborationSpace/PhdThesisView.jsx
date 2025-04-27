import React, { useState, useCallback, useEffect } from "react";
import Layout from "@/Layouts/CollaborationSpaceLayout";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Head } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import AddMemberModal from "./Partials/Modals/AddMemberToPhdThesisModal";
import Avatar from "@/Components/Avatar";
import { FaTrash, FaRocketchat } from "react-icons/fa";
import axios from "axios";
import Chat from "@/Components/Chat";
import { useForm } from "@inertiajs/react";

const PhdThesisView = ({
    auth,
    phd_thesis,
    lab_member,
    external_members,
    userRole,
    projects_count,
    phd_thesis_count,
    notifications,
    lab_members,
    lab_members_all,
    members,
}) => {
    console.log(members);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [openChats, setOpenChats] = useState({});
    const [phdChat, setPhdChat] = useState(null);

    const [responseChat, setResponseChat] = useState(null);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);

    const openChatWindow = async (user) => {
        try {
            const response = await axios.get(`/chat-session/${user.id}`);
            const chatId = response.data.chatId;
            setPhdChat(null);
            setOpenChats((prevChats) => ({
                ...prevChats,
                [chatId]: {
                    userId: auth.user.id,
                    user: user,
                },
            }));
        } catch (error) {
            console.error("Error fetching chat session:", error);
        }
    };

    const openGroupChatWindow = async () => {
        try {
            const response = await axios.get(
                `/group-phd-thesis-chat-session/${phd_thesis.id}`
            );
            const chatId = response.data.chatId;

            setPhdChat(phd_thesis);

            setOpenChats((prevChats) => ({
                ...prevChats,
                [chatId]: {
                    phdThesisId: phd_thesis.id,
                    chatId: chatId,
                    userId: auth.user.id, // Include current user ID
                    phdThesis: phd_thesis,
                },
            }));
        } catch (error) {
            console.error("Error fetching group chat session:", error);
        }
    };

    const closeChatWindow = useCallback((chatId) => {
        setOpenChats((prevChats) => {
            const { [chatId]: _, ...remainingChats } = prevChats;
            return remainingChats;
        });
    }, []);

    // Function to fetch chat session
    const fetchChatSession = useCallback(async () => {
        try {
            const response = await axios.get("/pop-up-chat-session/");
            setResponseChat(response.data);
        } catch (error) {
            console.error("Error fetching chat session:", error);
        }
    }, []);

    // Fetch chat session on component mount
    useEffect(() => {
        fetchChatSession();
    }, [fetchChatSession]);

    // Set up WebSocket listener for new messages
    // Set up WebSocket listener for new messages
    useEffect(() => {
        if (!responseChat || openChats[responseChat.chatId]) {
            // If the chat window is already open, don't do anything
            return;
        }

        // Ensure the Echo instance is set up
        const channel = window.Echo.channel("chat." + responseChat.chatId);

        // Listen for new messages
        channel.listen("MessageSent", (event) => {
            console.log("New message received:", event.message);
            const chatId = event.message.chat_id;

            // Check if the chat window for this chatId is already open
            if (openChats[chatId]) {
                return; // If it's open, don't open a new one
            }

            // Set the open chats with the new chatId
            setOpenChats((prevChats) => ({
                ...prevChats,
                [chatId]: {
                    userId: auth.user.id,
                    user: event.message.sender,
                },
            }));

            // Refresh chat session when a new message is received
            fetchChatSession();
        });

        // Cleanup on component unmount
        return () => {
            channel.stopListening("MessageSent");
        };
    }, [responseChat, fetchChatSession, openChats]);

    const [responseGroupChat, setResponseGroupChat] = useState(null);

    // Function to fetch group chat session
    const fetchChatGroupSession = useCallback(async () => {
        try {
            const projectId = 0;
            const phdThesisId = phd_thesis.id || ""; // or use a valid value if applicable
            const response = await axios.get(
                `/pop-up-group-chat-session/${projectId}/${phdThesisId}`
            );
            console.log("fetching group chat session:", response.data);

            setResponseGroupChat(response.data);
        } catch (error) {
            console.error("Error fetching group chat session:", error);
        }
    }, [phd_thesis]);

    console.log(responseGroupChat);

    // Fetch group chat session on component mount
    useEffect(() => {
        fetchChatGroupSession();
    }, [fetchChatGroupSession]);

    // Set up WebSocket listener for new group chat messages
    useEffect(() => {
        if (!responseGroupChat || openChats[responseGroupChat.chatId]) {
            // If the group chat window is already open, don't do anything
            return;
        }

        // Ensure the Echo instance is set up
        const groupChannel = window.Echo.channel(
            "chat." + responseGroupChat.chatId
        );

        // Listen for new group chat messages
        groupChannel.listen("MessageSent", (event) => {
            console.log("New group message received:", event.message);
            const chatId = event.message.chat_id;

            // Check if the group chat window for this chatId is already open
            if (openChats[chatId]) {
                return; // If it's open, don't open a new one
            }

            // Set the open chats with the new group chatId
            setOpenChats((prevChats) => ({
                ...prevChats,
                [chatId]: {
                    userId: auth.user.id,
                    phdThesisId: responseGroupChat.phdThesisId, // Assuming you're tracking projectId in the group chat
                    phdThesis: phd_thesis,
                },
            }));

            // Refresh group chat session when a new message is received
            fetchChatGroupSession();
        });

        // Cleanup on component unmount
        return () => {
            groupChannel.stopListening("MessageSent");
        };
    }, [responseGroupChat, fetchChatGroupSession, openChats]);

    console.log(responseGroupChat);

    const { delete: deleteRequest } = useForm();
    const handleDelete = (user) => {
        // Handle the refuse action, e.g., send a request to the server
        deleteRequest(
            `/collaboration-space/projects/delete-thesis-member/${phd_thesis.id}/${user.id}`
        );
    };

    return (
        <Layout
            user={auth.user}
            userRole={userRole}
            projects_count={projects_count}
            phd_thesis_count={phd_thesis_count}
            notifications={notifications.list}
            notifications_count={notifications.count}
        >
            <Head title="View PhD Thesis" />

            <div className="flex justify-center items-center min-h-screen py-12 bg-gray-50">
                <div className="w-full max-w-4xl space-y-8">
                    <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
                        View PhD Thesis
                    </h1>

                    <Card className="border border-gray-300 shadow-lg rounded-xl overflow-hidden bg-white">
                        <CardHeader className="bg-gradient-to-r from-gray-100 to-gray-200 border-b border-gray-300">
                            <div className="flex justify-between items-center p-4">
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    PhD Thesis Details
                                </CardTitle>
                                <div className="flex items-center space-x-2">
                                    {lab_member.is_supervisor === 1 &&
                                        phd_thesis.supervisor_id ===
                                            auth.user.id && (
                                            <Button
                                                onClick={openAddModal}
                                                className=" text-white font-semibold py-2 px-4 rounded-lg shadow"
                                            >
                                                Invite Member to PhD Thesis
                                            </Button>
                                        )}
                                    <button
                                        onClick={openGroupChatWindow}
                                        className="text-blue-500 hover:text-blue-600 transition-transform transform hover:scale-105"
                                    >
                                        <FaRocketchat className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    {
                                        label: "Title",
                                        value: phd_thesis.thesis_title,
                                    },
                                    {
                                        label: "Keywords",
                                        value: phd_thesis.keywords,
                                    },
                                    {
                                        label: "References",
                                        value: phd_thesis.references,
                                    },
                                    {
                                        label: "Abstract",
                                        value: phd_thesis.abstract,
                                    },
                                    {
                                        label: "Advancement State Percentage",
                                        value: `${phd_thesis.advancement_state_percentage}%`,
                                    },
                                    {
                                        label: "Advancement State Description",
                                        value: phd_thesis.advancement_state_description,
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="flex flex-col">
                                        <Label className="text-gray-700 font-semibold">
                                            {item.label}:
                                        </Label>
                                        <p className="text-gray-900">
                                            {item.value || "Not available"}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Supervisor Remarks */}
                            <div className="mt-6">
                                <Label className="text-gray-700 font-semibold">
                                    Supervisor Remarks:
                                </Label>
                                {phd_thesis.supervisor_remarks ? (
                                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 space-y-2">
                                        {JSON.parse(
                                            phd_thesis.supervisor_remarks
                                        ).map((remark, index) => (
                                            <div
                                                key={index}
                                                className="text-gray-900"
                                            >
                                                - {remark}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">
                                        No remarks available
                                    </p>
                                )}
                            </div>

                            {/* Co-Supervisor Remarks */}
                            <div className="mt-6">
                                <Label className="text-gray-700 font-semibold">
                                    Co-Supervisor Remarks:
                                </Label>
                                {phd_thesis.co_supervisor_remarks ? (
                                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 space-y-2">
                                        {JSON.parse(
                                            phd_thesis.co_supervisor_remarks
                                        ).map((remark, index) => (
                                            <div
                                                key={index}
                                                className="text-gray-900"
                                            >
                                                - {remark}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">
                                        No remarks available
                                    </p>
                                )}
                            </div>

                            {/* Members Section */}
                            <div className="mt-6">
                                <Label className="text-gray-700 font-semibold">
                                    Members:
                                </Label>
                                <div className="bg-white shadow-sm rounded-lg border border-gray-300 overflow-x-auto">
                                    <div className="flex bg-gray-100 text-gray-700 border-b border-gray-300 font-medium text-sm">
                                        <div className="flex-1 py-3 px-4">
                                            User
                                        </div>
                                        <div className="flex-1 py-3 px-4">
                                            Full Name
                                        </div>
                                        <div className="flex-1 py-3 px-4 text-right">
                                            Actions
                                        </div>
                                    </div>

                                    {members.length > 0 ? (
                                        members.map((member, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center border-b border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex-1 py-3 px-4 flex items-center">
                                                    <Avatar
                                                        user={member}
                                                        className="w-12 h-12 rounded-full border border-gray-300"
                                                    />
                                                </div>
                                                <div className="flex-1 py-3 px-4 font-medium">
                                                    {member.first_name}{" "}
                                                    {member.last_name}
                                                </div>
                                                <div className="flex-1 py-3 px-4 text-right space-x-3">
                                                    {auth.user.id !=
                                                        member.id && (
                                                        <button
                                                            className="text-blue-500 hover:text-blue-600 transition-transform transform hover:scale-105"
                                                            onClick={() =>
                                                                openChatWindow(
                                                                    member
                                                                )
                                                            }
                                                        >
                                                            <FaRocketchat className="w-5 h-5 inline-block" />
                                                        </button>
                                                    )}

                                                    {lab_member.is_supervisor ===
                                                        1 &&
                                                        phd_thesis.supervisor_id ===
                                                            auth.user.id &&
                                                        auth.user.id !=
                                                            member.id && (
                                                            <button
                                                                className="text-red-500 hover:text-red-600 transition-colors duration-200"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        member
                                                                    )
                                                                }
                                                            >
                                                                <FaTrash className="w-5 h-5 inline-block" />
                                                            </button>
                                                        )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex items-center justify-center py-3 text-gray-500">
                                            No members available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Add modal component */}
            {isAddModalOpen && (
                <AddMemberModal
                    onClose={closeAddModal}
                    lab_members={lab_members}
                    external_members={external_members}
                    lab_members_all={lab_members_all}
                    phd_thesis={phd_thesis}
                />
            )}

            {/* Chat windows container */}
            <div className="fixed z-50 bottom-0 right-0 m-4 flex space-x-4">
                {Object.entries(openChats).map(
                    ([chatId, { user, phdThesisId, phdThesis }]) => (
                        <div key={chatId} className="relative">
                            <Chat
                                user={user}
                                chatId={chatId}
                                userId={auth.user.id}
                                phdThesis={phdThesis}
                                phdThesisId={phdThesisId}
                                onClose={() => closeChatWindow(chatId)}
                            />
                        </div>
                    )
                )}
            </div>
        </Layout>
    );
};

export default PhdThesisView;
