import React, { useState, useCallback, useEffect } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Avatar from "@/Components/Avatar";
import Chat from "@/Components/Chat";
import axios from "axios";
import { Toaster } from "@/Components/ui/toaster";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";

export default function Layout({
    user,
    userRole,
    children,
    notifications,
    notifications_count,
    labMember,
    users,
    chat_groups = [],
}) {
    const [openChats, setOpenChats] = useState({});
    const [responseChat, setResponseChat] = useState(null);
    const [showUsers, setShowUsers] = useState(false);
    const [activeTab, setActiveTab] = useState('chats');

    // Filter groups
    const projectGroups = chat_groups.filter(group => group.project);
    const phdThesisGroups = chat_groups.filter(group => group.phdthesis);

    const openChatWindow = async (item) => {
        try {
            const endpoint = item.project ? `/group-project-chat-session/${item.project.id}` :
                          item.phdthesis ? `/group-phd-thesis-chat-session/${item.phdthesis.id}` : 
                          `/chat-session/${item.id}`;

            const response = await axios.get(endpoint);
            const chatId = response.data.chatId;
            
            setOpenChats((prevChats) => ({
                ...prevChats,
                [chatId]: { 
                    userR: item.user || item,
                    user: user,
                    project: item.project,
                    phdThesis: item.phdthesis
                },
            }));
        } catch (error) {
            console.error("Error fetching chat session:", error);
        }
    };

    const closeChatWindow = useCallback((chatId) => {
        setOpenChats((prevChats) => {
            const { [chatId]: _, ...remainingChats } = prevChats;
            return remainingChats;
        });
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
                    userId: event.message.sender.id,
                    user: event.message.sender,
                },
            }));
        });

        return () => {
            channel.stopListening("MessageSent");
        };
    }, [responseChat, openChats]);

    const renderGroupSection = (items, type) => {
        if (items.length === 0) {
            return (
                <div className="p-4 text-center text-gray-500 italic">
                    No {type} groups found
                </div>
            );
        }

        return (
            <div className="space-y-3 p-4">
                {items.map((group) => (
                    <div
                        key={group.id}
                        onClick={() => openChatWindow(group)}
                        className="p-4 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors cursor-pointer shadow-sm hover:shadow-md"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-800 truncate">
                                    {group.project?.title || group.phdthesis?.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {type === 'projects' ? 
                                        `Members: ${group.members?.length || 0}` :
                                        `Supervisor: ${group.phdthesis?.supervisor?.name}`
                                    }
                                </p>
                            </div>
                            <Badge variant={type === 'projects' ? 'default' : 'secondary'}>
                                {type === 'projects' ? 'Project' : 'PhD Thesis'}
                            </Badge>
                        </div>
                        {group.description && (
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                                {group.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div>
            <Navbar
                user={user}
                userRole={userRole}
                labMember={labMember}
                notifications={notifications}
                notifications_count={notifications_count}
            />
            <main className="pt-8 bg-gray-100 min-h-screen">
                {children}
                {(user && users) && (
                    <div>
                        {/* Toggle button */}
                        <div
                            className={`fixed top-1/2 -translate-y-1/2 z-50 bg-primary text-white flex items-center justify-center w-12 h-24 rounded-l-lg shadow-md cursor-pointer transform transition-all duration-300 ease-in-out hover:shadow-lg hover:bg-primary-dark ${
                                showUsers ? "right-[400px]" : "right-0"
                            }`}
                            onClick={() => setShowUsers(!showUsers)}
                        >
                            {showUsers ? (
                                <HiChevronRight className="w-6 h-6" />
                            ) : (
                                <HiChevronLeft className="w-6 h-6" />
                            )}
                        </div>

                        {/* Collapsible panel */}
                        <div
                            className={`fixed right-0 top-0 z-40 h-full bg-white shadow-lg rounded-l-lg transform transition-transform duration-300 ${
                                showUsers ? "translate-x-0" : "translate-x-full"
                            }`}
                            style={{ width: "400px" }}
                        >
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                                <div className="p-4 bg-gray-50 border-b">
                                    <TabsList className="grid w-full grid-cols-3 gap-2">
                                        <TabsTrigger value="chats">Chats</TabsTrigger>
                                        <TabsTrigger value="projects">Projects</TabsTrigger>
                                        <TabsTrigger value="phd">PhD Theses</TabsTrigger>
                                    </TabsList>
                                </div>
                                
                                <TabsContent value="chats" className="flex-1 overflow-y-auto">
                                    <div className="space-y-3 p-4">
                                        {users.length === 0 ? (
                                            <div className="p-4 text-center text-gray-500 italic">
                                                No chats available
                                            </div>
                                        ) : (
                                            users.map((user) => (
                                                <div
                                                    key={user.id}
                                                    onClick={() => openChatWindow(user)}
                                                    className="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors cursor-pointer shadow-sm hover:shadow-md"
                                                >
                                                    <Avatar
                                                        user={user}
                                                        className="w-10 h-10 ring-2 ring-primary"
                                                    />
                                                    <div className="ml-4 flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-800 truncate">
                                                            {user.first_name} {user.last_name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 truncate">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="projects" className="flex-1 overflow-y-auto">
                                    {renderGroupSection(projectGroups, 'projects')}
                                </TabsContent>

                                <TabsContent value="phd" className="flex-1 overflow-y-auto">
                                    {renderGroupSection(phdThesisGroups, 'phd')}
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Chat windows */}
                        <div className="fixed bottom-0 right-4 flex space-x-4 z-50">
                            {Object.entries(openChats).map(
                                ([chatId, { userR, user, project, phdThesis }]) => (
                                    <Chat
                                        key={chatId}
                                        chatId={chatId}
                                        user={user}
                                        userR={userR}
                                        project={project}
                                        phdThesis={phdThesis}
                                        onClose={() => closeChatWindow(chatId)}
                                    />
                                )
                            )}
                        </div>
                    </div>
                )}
            </main>
            <Toaster />
            <Footer />
        </div>
    );
}