import React, { useState, useCallback, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { Badge } from "@/Components/ui/badge";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/Components/ui/table";
import { FaRocketchat } from "react-icons/fa";
import AddMemberModal from "./Modals/AddMemberToProjectModal";
import DeleteMemberModal from "./Modals/DeleteProjectMemberModal";
import DeleteNoMemberModal from "./Modals/DeleteNoProjectMemberModal";
import Avatar from "@/Components/Avatar";
import Chat from "@/Components/Chat";
import { HiOutlineUserGroup } from "react-icons/hi";
import axios from "axios";

// Helper function to sort members, placing project leaders first
const sortMembers = (members) => {
    return [...members].sort((a, b) => {
        if (a.role === "Project Leader") return -1;
        if (b.role === "Project Leader") return 1;
        return 0;
    });
};

const TeamMembersTable = ({
    members,
    lab_members,
    labs,
    lab_members_all,
    project,
    externalMembers,
    userAuth,
}) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const [isDeleteExternalModalOpen, setIsDeleteExternalModalOpen] =
        useState(false);
    const [selectedExternalMember, setSelectedExternalMember] = useState(null);

    const [openChats, setOpenChats] = useState({});
    const [responseChat, setResponseChat] = useState(null);

    const openAddModal = () => setIsAddModalOpen(true);
    const closeAddModal = () => setIsAddModalOpen(false);
    const [isExternal, setIsExternal] = useState(0);
    const openDeleteModal = (member) => {
        let isExternalFlag = 0; // Default to internal member
        let selectedExternalMember = null; // Track if an external member is found

        console.log("Opening delete modal for member:", member);
        console.log("External Members:", externalMembers);

        for (const externalMember of externalMembers) {
            console.log("Checking externalMember:", externalMember);

            // Check if user IDs match
            if (member.user.id === externalMember.user_id) {
                console.log("User IDs match:", member.user.id);

                // Parse project_id safely and check if member.project_id exists
                const parsedProjectIds = JSON.parse(
                    externalMember.project_id || "[]"
                );
                console.log("Parsed Project IDs:", parsedProjectIds);

                if (parsedProjectIds.includes(member.project_id)) {
                    console.log(`Project ID match found: ${member.project_id}`);
                    isExternalFlag = 1; // Mark as external
                    selectedExternalMember = externalMember; // Set the external member
                    break; // Exit loop on first match
                }
            }
        }

        // Update state
        setIsExternal(isExternalFlag);
        setSelectedMember(selectedExternalMember || member); // Use external if found, otherwise original member
        setIsDeleteModalOpen(true);

        console.log("isExternalFlag:", isExternalFlag);
        console.log("selectedMember:", selectedExternalMember || member);
    };

    const closeDeleteModal = () => setIsDeleteModalOpen(false);
    const openDeleteExternalModal = (member) => {
        setSelectedExternalMember(member);
        setIsDeleteExternalModalOpen(true);
    };
    const closeDeleteExternalModal = () => setIsDeleteExternalModalOpen(false);

    const sortedMembers = sortMembers(members);

    const openChatWindow = async (user) => {
        try {
            const response = await axios.get(`/chat-session/${user.id}`);
            const chatId = response.data.chatId;
            setOpenChats((prevChats) => ({
                ...prevChats,
                [chatId]: {
                    userId: userAuth.id,
                    user: user,
                },
            }));
        } catch (error) {
            console.error("Error fetching chat session:", error);
        }
    };

    const openGroupChatWindow = async (project) => {
        try {
            const response = await axios.get(
                `/group-project-chat-session/${project.id}`
            );
            const chatId = response.data.chatId;
            setOpenChats((prevChats) => ({
                ...prevChats,
                [chatId]: {
                    projectId: project.id,
                    chatId: chatId,
                    userId: userAuth.id,
                    project: project,
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

    const fetchChatSession = useCallback(async () => {
        try {
            const response = await axios.get("/pop-up-chat-session/");
            setResponseChat(response.data);
        } catch (error) {
            console.error("Error fetching chat session:", error);
        }
    }, []);

    useEffect(() => {
        fetchChatSession();
    }, [fetchChatSession]);

    useEffect(() => {
        if (!responseChat || openChats[responseChat.chatId]) {
            return;
        }

        const channel = window.Echo.channel("chat." + responseChat.chatId);
        channel.listen("MessageSent", (event) => {
            const chatId = event.message.chat_id;
            if (openChats[chatId]) return;

            setOpenChats((prevChats) => ({
                ...prevChats,
                [chatId]: {
                    userId: userAuth.id,
                    user: event.message.sender,
                },
            }));

            fetchChatSession();
        });

        return () => {
            channel.stopListening("MessageSent");
        };
    }, [responseChat, fetchChatSession, openChats]);

    const [responseGroupChat, setResponseGroupChat] = useState(null);

    const fetchChatGroupSession = useCallback(async () => {
        try {
            const projectId = project.id || "";
            const response = await axios.get(
                `/pop-up-group-chat-session/${projectId}`
            );
            setResponseGroupChat(response.data);
        } catch (error) {
            console.error("Error fetching group chat session:", error);
        }
    }, [project]);

    useEffect(() => {
        fetchChatGroupSession();
    }, [fetchChatGroupSession]);

    useEffect(() => {
        if (!responseGroupChat || openChats[responseGroupChat.chatId]) {
            return;
        }

        const groupChannel = window.Echo.channel(
            "chat." + responseGroupChat.chatId
        );
        groupChannel.listen("MessageSent", (event) => {
            const chatId = event.message.chat_id;
            if (openChats[chatId]) return;

            setOpenChats((prevChats) => ({
                ...prevChats,
                [chatId]: {
                    userId: userAuth.id,
                    projectId: responseGroupChat.projectId,
                    project: project,
                },
            }));

            fetchChatGroupSession();
        });

        return () => {
            groupChannel.stopListening("MessageSent");
        };
    }, [responseGroupChat, fetchChatGroupSession, openChats]);

    return (
        <Card className="border border-gray-300 shadow-lg rounded-lg bg-white overflow-hidden">
            <CardHeader className="bg-gray-100 border-b border-gray-200 p-4">
                <div className="flex justify-between items-center w-full">
                    <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
                        Project Members
                    </CardTitle>
                    <Button
                        onClick={() => openGroupChatWindow(project)}
                        className="bg-blue-500 text-white hover:bg-blue-600 transition p-2 rounded-full"
                    >
                        <FaRocketchat size={20} />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <div className="flex justify-end mb-6">
                    <Button
                        onClick={openAddModal}
                        className=" text-white transition flex items-center"
                    >
                        <FiPlus className="w-5 h-5 mr-2" /> Add Member
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableCell className="font-medium text-gray-600">
                                Member
                            </TableCell>
                            <TableCell className="font-medium text-gray-600">
                                Role
                            </TableCell>
                            <TableCell className="font-medium text-gray-600">
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedMembers.map((member) => (
                            <TableRow
                                key={member.id}
                                className="hover:bg-gray-50 transition duration-200"
                            >
                                <TableCell className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <Avatar
                                            user={member.user}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {member.user.first_name}{" "}
                                                {member.user.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {member.user.email}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="p-4 text-gray-700">
                                    <div className="font-medium">
                                        {member.user.id ==
                                        project.project_leader_id ? (
                                            <Badge className="text-xs text-white bg-main">
                                                Project Leader
                                            </Badge>
                                        ) : (
                                            <Badge className="text-xs text-white bg-blue-700">
                                                Member
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="p-4 text-red-500 flex items-center justify-center space-x-2">
                                    {member.user.id !==
                                        project.project_leader_id &&
                                        (userAuth.director === 1 ||
                                            project.project_leader_id !==
                                                userAuth.id) &&
                                        member.user.id !== userAuth.id &&
                                        (project.project_leader_id ==
                                            userAuth.id ||
                                            userAuth.director == 1) && (
                                            <FiTrash2
                                                className="w-5 h-5 cursor-pointer hover:text-red-700 transition"
                                                onClick={() =>
                                                    openDeleteModal(member)
                                                }
                                            />
                                        )}

                                    {member.user.id != userAuth.id && (
                                        <button
                                            onClick={() =>
                                                openChatWindow(member.user)
                                            }
                                            className="text-blue-500 hover:text-blue-700 transition"
                                        >
                                            <FaRocketchat />
                                        </button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            {/* Add modal component */}
            {isAddModalOpen && (
                <AddMemberModal
                    onClose={closeAddModal}
                    lab_members={lab_members}
                    labs={labs}
                    lab_members_all={lab_members_all}
                    externalMembers={externalMembers}
                    project={project}
                />
            )}

            {/* Delete modal */}
            {isDeleteModalOpen && (
                <DeleteMemberModal
                    onClose={closeDeleteModal}
                    isOpen={isAddModalOpen}
                    member={selectedMember}
                    isExternal={isExternal}
                    project={project}
                />
            )}

            {/* Chat windows container */}
            <div className="fixed z-50 bottom-0 right-0 m-4 flex space-x-4">
                {Object.entries(openChats).map(
                    ([chatId, { userId, user, projectId, project }]) => (
                        <div key={chatId} className="relative">
                            <Chat
                                user={user}
                                chatId={chatId}
                                userId={userId}
                                projectId={projectId}
                                project={project} // Pass projectId if needed
                                onClose={() => closeChatWindow(chatId)}
                            />
                        </div>
                    )
                )}
            </div>
        </Card>
    );
};

export default TeamMembersTable;
