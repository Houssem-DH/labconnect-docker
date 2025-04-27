import React, { useState, useCallback } from "react";
import Chat from "@/Components/Chat";
import axios from "axios";

const ChatManager = ({ user, project }) => {
    const [openChats, setOpenChats] = useState({});

    // Open individual chat window
    const openChatWindow = async (user) => {
        try {
            const response = await axios.get(`/chat-session/${user.id}`);
            const chatId = response.data.chatId;

            setOpenChats((prevChats) => ({
                ...prevChats,
                [chatId]: {
                    userId: user.id,
                    user: user,
                    type: "individual",
                },
            }));
        } catch (error) {
            console.error("Error fetching chat session:", error);
        }
    };

    // Open group chat window
    const openGroupChatWindow = async (project) => {
        try {
            const response = await axios.get(`/group-project-chat-session/${project.id}`);
            const chatId = response.data.chatId;

            setOpenChats((prevChats) => ({
                ...prevChats,
                [chatId]: {
                    projectId: project.id,
                    chatId: chatId,
                    type: "group",
                    projectt: project,
                },
            }));
        } catch (error) {
            console.error("Error fetching group chat session:", error);
        }
    };

    // Close a chat window
    const closeChatWindow = useCallback((chatId) => {
        setOpenChats((prevChats) => {
            const { [chatId]: _, ...remainingChats } = prevChats;
            return remainingChats;
        });
    }, []);

    return (
        <div className="fixed z-50 bottom-0 right-0 m-4 flex space-x-4">
            {Object.entries(openChats).map(
                ([chatId, { userId, user, projectId, projectt, type }]) => (
                    <div key={chatId} className="relative">
                        <Chat
                            chatId={chatId}
                            userId={userId}
                            projectId={projectId}
                            user={user}
                            project={projectt}
                            type={type} // individual or group
                            onClose={() => closeChatWindow(chatId)}
                        />
                    </div>
                )
            )}
        </div>
    );
};

export default ChatManager;
