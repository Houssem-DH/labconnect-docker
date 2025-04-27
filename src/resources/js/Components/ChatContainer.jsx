// components/ChatContainer.js
import React from 'react';
import Chat from './Chat';
import useChat from '@/utils/useChat'; // Adjust the path as necessary

const ChatContainer = ({ userAuth, project }) => {
    const { openChats, closeChatWindow, openChatWindow, openGroupChatWindow } = useChat(userAuth);

    return (
        <>
            <div className="fixed z-50 bottom-0 right-0 m-4 flex space-x-4">
                {Object.entries(openChats).map(([chatId, { userId, user, projectId, project }]) => (
                    <div key={chatId} className="relative">
                        <Chat
                            user={user}
                            chatId={chatId}
                            userId={userId}
                            projectId={projectId}
                            project={project}
                            onClose={() => closeChatWindow(chatId)}
                        />
                    </div>
                ))}
            </div>
            {/* You can include buttons or other elements to open chat windows */}
        </>
    );
};

export default ChatContainer;
