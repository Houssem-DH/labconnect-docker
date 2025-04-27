// hooks/useChat.js
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Echo from "laravel-echo";

const useChat = (userAuth, project) => {
    const [openChats, setOpenChats] = useState({});
    const [responseChat, setResponseChat] = useState(null);
    const [responseGroupChat, setResponseGroupChat] = useState(null);

    const openChatWindow = useCallback(async (user) => {
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
    }, [userAuth.id]);

    const openGroupChatWindow = useCallback(async (project) => {
        try {
            const response = await axios.get(`/group-project-chat-session/${project.id}`);
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
    }, [project.id, userAuth.id]);

    const closeChatWindow = useCallback((chatId) => {
        setOpenChats((prevChats) => {
            const { [chatId]: _, ...remainingChats } = prevChats;
            return remainingChats;
        });
    }, []);

    useEffect(() => {
        const fetchChatSession = async () => {
            try {
                const response = await axios.get("/pop-up-chat-session/");
                setResponseChat(response.data);
            } catch (error) {
                console.error("Error fetching chat session:", error);
            }
        };

        fetchChatSession();
    }, []);

    useEffect(() => {
        if (!responseChat || openChats[responseChat.chatId]) return;

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
    }, [responseChat, openChats]);

    useEffect(() => {
        const fetchChatGroupSession = async () => {
            try {
                const response = await axios.get(`/pop-up-group-chat-session/${project.id}`);
                setResponseGroupChat(response.data);
            } catch (error) {
                console.error("Error fetching group chat session:", error);
            }
        };

        fetchChatGroupSession();
    }, [project.id]);

    useEffect(() => {
        if (!responseGroupChat || openChats[responseGroupChat.chatId]) return;

        const groupChannel = window.Echo.channel("chat." + responseGroupChat.chatId);

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
    }, [responseGroupChat, openChats]);

    return {
        openChats,
        openChatWindow,
        openGroupChatWindow,
        closeChatWindow,
    };
};

export default useChat;
