import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import Avatar from "@/Components/Avatar";
import { IoMdClose } from "react-icons/io";
import { FiImage, FiFile } from "react-icons/fi";
import { AiOutlineSend } from "react-icons/ai";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

const Chat = ({ chatId, userR, onClose, project, phdThesis, user }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const messagesEndRef = useRef(null);
    const [isImgSelected, setIsImgSelected] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const [openImg, setOpenImg] = useState(null);
    const [openFile, setOpenFile] = useState(null);

    const itemImgSelected = () => {
        setIsImgSelected(true);
        setOpenImg(false);
        scrollToBottom();
    };
    const itemFileSelected = () => {
        setIsFileSelected(true);
        setOpenFile(false);
        scrollToBottom();
    };
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        axios.get(`/chats/${chatId}`).then((response) => {
            setMessages(response.data.messages);
        });

        const channel = window.Echo.channel(`chat.${chatId}`);
        channel.listen("MessageSent", (e) => {
            setMessages((prevMessages) => [...prevMessages, e.message]);
        });

        return () => {
            channel.stopListening("MessageSent");
            window.Echo.leaveChannel(`chat.${chatId}`);
        };
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const sendMessage = () => {
        if (!message.trim() && !file && !image) return;

        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("sender_id", user.id);
        formData.append("message", message);

        if (file) formData.append("file", file);
        if (image) formData.append("image", image);

        setIsUploading(true);
        setUploadProgress(0);

        axios
            .post("/messages", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentage = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(percentage);
                },
            })
            .then(() => {
                setMessage("");
                setFile(null);
                setImage(null);
                setIsUploading(false);
                setUploadProgress(0);
                scrollToBottom();
            })
            .catch((error) => {
                console.error("Error sending message:", error);
                setIsUploading(false);
            });
    };

    const truncateFileName = (filePath) => {
        const fileName = filePath.replace(/^message_files\/\d+\//, "");
        return fileName.length > 10
            ? `${fileName.substring(0, 10)}...`
            : fileName;
    };

    return (
        <div className="relative flex flex-col h-[470px] w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-700 text-white rounded-t-lg">
                <div className="text-base font-semibold">
                    {project
                        ? `${project.title}`
                        : phdThesis
                        ? `${phdThesis.thesis_title}`
                        : userR
                        ? `${userR.first_name} ${userR.last_name}`
                        : "Chat"}
                </div>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-300 focus:outline-none"
                    aria-label="Close chat"
                >
                    <IoMdClose size={20} />
                </button>
            </div>

            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-end space-x-2 transition-transform duration-200 ease-in-out ${
                            msg.sender_id === user.id
                                ? "justify-start"
                                : "justify-end"
                        }`}
                    >
                        {msg.sender_id === user.id && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Avatar
                                            user={msg.sender}
                                            className="w-9 h-9"
                                        ></Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {msg.sender?.first_name}{" "}
                                        {msg.sender?.last_name}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        <div
                            className={`p-3 rounded-lg text-sm max-w-[70%] shadow-md transition-all duration-300 ${
                                msg.sender_id === user.id
                                    ? "bg-main text-white self-end"
                                    : "bg-gray-700 text-white"
                            }`}
                        >
                            {msg.file && (
                                <a
                                    href={`storage/${msg.file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-300 underline hover:text-blue-400"
                                >
                                    {truncateFileName(msg.file)}
                                </a>
                            )}
                            {msg.image && (
                                <img
                                    src={`storage/${msg.image}`}
                                    alt="Uploaded"
                                    className="w-40 h-auto rounded-lg mt-2"
                                />
                            )}
                            {msg.message && <p>{msg.message}</p>}
                        </div>

                        {msg.sender_id != user.id && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Avatar
                                            user={msg.sender}
                                            className="w-8 h-8"
                                        ></Avatar>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {msg.sender.first_name} {msg.sender.last_name}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                ))}

                <div ref={messagesEndRef} />

                {isImgSelected && (
                    <>
                        {image && (
                            <div className="mt-4 flex items-center space-x-4">
                                <div className="relative">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Preview"
                                        className={`w-16 h-16 rounded-lg object-cover ${
                                            isUploading ? "blur-sm" : ""
                                        }`}
                                    />
                                    {isUploading && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                                            <div className="text-white text-sm">
                                                {uploadProgress}%
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <span className="text-sm text-gray-700 flex items-center">
                                    <span className="truncate max-w-[130px]">
                                        {image.name}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">
                                        ({(image.size / 1024).toFixed(1)} KB)
                                    </span>
                                </span>
                                
                                <button
                                    onClick={() => setImage(null)}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </>
                )}

                {isFileSelected && (
                    <>
                        {file && (
                            <div className="mt-4 flex items-center space-x-4">
                            <FiFile size={20} className="text-gray-500" />
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-700 flex items-center">
                                    <span className="truncate max-w-[130px]">
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-2">
                                        ({(file.size / 1024).toFixed(1)} KB)
                                    </span>
                                </span>
                                {isUploading && (
                                    <div className="text-sm text-gray-500 mt-1">
                                        Uploading: {uploadProgress}%
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setFile(null)}
                                className="text-red-500 hover:text-red-600"
                            >
                                Remove
                            </button>
                        </div>
                        
                        )}
                    </>
                )}
            </div>

            {/* Input Section */}
            <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-3">
                <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main text-sm"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    aria-label="Message input"
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Dialog open={openImg} onOpenChange={setOpenImg}>
                                <DialogTrigger>
                                    <FiImage
                                        size={20}
                                        className="text-gray-600 hover:text-main transition-colors duration-200"
                                    />
                                </DialogTrigger>
                                <DialogContent className="p-6 rounded-lg shadow-lg bg-white border border-gray-200 max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-semibold text-gray-800">
                                            Upload Image
                                        </DialogTitle>
                                        <DialogDescription className="text-sm text-gray-500">
                                            Choose an image file to share.
                                            Supported formats: JPG, PNG, GIF.
                                            Max size: 5MB.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                        <Label className="flex items-center justify-center w-full h-40 bg-gray-100 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                                            <FiImage
                                                size={40}
                                                className="text-gray-400"
                                            />
                                            <span className="ml-2 text-gray-600">
                                                Click to upload an image
                                            </span>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                aria-label="Upload Image"
                                            />
                                        </Label>
                                    </div>
                                    {image && (
                                        <div className="mt-4 flex items-center space-x-4">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt="Preview"
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <span className="text-sm text-gray-700 flex items-center">
                                                <span className="truncate max-w-[180px]">
                                                    {image.name}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    (
                                                    {(
                                                        image.size / 1024
                                                    ).toFixed(1)}{" "}
                                                    KB)
                                                </span>
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setImage(null);
                                                    setIsImgSelected(false);
                                                }}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => {
                                                itemImgSelected();
                                            }}
                                            className="px-4 py-2 text-white bg-main rounded-lg hover:bg-main-dark focus:outline-none"
                                        >
                                            Select
                                        </button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>Upload Image</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <Dialog open={openFile} onOpenChange={setOpenFile}>
                                <DialogTrigger>
                                    <FiFile
                                        size={20}
                                        className="text-gray-600 hover:text-main transition-colors duration-200"
                                    />
                                </DialogTrigger>
                                <DialogContent className="p-6 rounded-lg shadow-lg bg-white border border-gray-200 max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="text-lg font-semibold text-gray-800">
                                            Upload File
                                        </DialogTitle>
                                        <DialogDescription className="text-sm text-gray-500">
                                            Select a file to share. Supported
                                            formats: PDF, DOCX, XLSX. Max size:
                                            10MB.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                        <Label className="flex items-center justify-center w-full h-40 bg-gray-100 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200">
                                            <FiFile
                                                size={40}
                                                className="text-gray-400"
                                            />
                                            <span className="ml-2 text-gray-600">
                                                Click to upload a file
                                            </span>
                                            <Input
                                                type="file"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                aria-label="Upload File"
                                            />
                                        </Label>
                                    </div>
                                    {file && (
                                        <div className="mt-4 flex items-center space-x-4">
                                            <FiFile
                                                size={20}
                                                className="text-gray-500"
                                            />

                                            <span className="text-sm text-gray-700 flex items-center">
                                                <span className="truncate max-w-[180px]">
                                                    {file.name}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    (
                                                    {(file.size / 1024).toFixed(
                                                        1
                                                    )}{" "}
                                                    KB)
                                                </span>
                                            </span>

                                            <button
                                                onClick={() => {
                                                    setFile(null);
                                                    setIsFileSelected(false);
                                                }}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => {
                                                itemFileSelected();
                                            }}
                                            className="px-4 py-2 text-white bg-main rounded-lg hover:bg-main-dark focus:outline-none"
                                        >
                                            Select
                                        </button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </TooltipTrigger>
                        <TooltipContent>Upload File</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <button
                    onClick={sendMessage}
                    disabled={
                        isUploading || (!message.trim() && !file && !image)
                    }
                    className="bg-main text-white px-3 py-2 rounded-lg hover:bg-main-dark transition-colors duration-200 focus:outline-none"
                    aria-label="Send Message"
                >
                    <AiOutlineSend size={18} />
                </button>
            </div>
        </div>
    );
};

export default Chat;
