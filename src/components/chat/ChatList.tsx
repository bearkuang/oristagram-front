import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../services/utils';
import { useNavigate } from "react-router-dom";
import CreateFeed from '../feed/CreateFeed';
import Sidebar from '../feed/Siderbar';
import CreateChatModal from './CreateChatModal';
import ChatRoom from './ChatRoom';

interface User {
    id: number;
    username: string;
    profile_picture: string;
    name: string;
    website: string;
    bio: string;
    birth_date: string;
}

interface ChatRoom {
    chatroom_id: number;
    user: User;
}

const ChatList: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [isCreateFeedOpen, setIsCreateFeedOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
    const [activeChatRoomId, setActiveChatRoomId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await axios.get('http://localhost:8000/api/users/me/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        const fetchChatRooms = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    navigate("/login");
                    return;
                }
                const response = await axios.get('http://localhost:8000/api/chatrooms/my_chatrooms/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setChatRooms(response.data);
            } catch (error) {
                console.error('Error fetching chat rooms:', error);
            }
        };

        fetchCurrentUser();
        fetchChatRooms();
    }, [navigate]);

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    const handleOpenCreateFeed = () => {
        setIsCreateFeedOpen(true);
    };

    const handleCloseCreateFeed = () => {
        setIsCreateFeedOpen(false);
    };

    const handleOpenProfile = () => {
        navigate("/profile");
    };

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleOpenCreateChatModal = () => {
        setIsCreateChatModalOpen(true);
    }

    const handleCloseCreateChatModal = () => {
        setIsCreateChatModalOpen(false);
    }

    const handleOpenChatRoom = (chatroomId: number) => {
        setActiveChatRoomId(chatroomId);
    }

    const handleCloseComponent = () => {
        setActiveChatRoomId(null);
    }

    const handleOpenChat = () => {
        navigate("/chat");
    }

    return (
        <div className='main-container w-full h-screen bg-[rgba(0,0,0,0)] relative mx-auto my-0'>
            <div className="layout-container flex h-full grow flex-col min-h-screen">
                <div className="relative flex h-full min-h-screen">
                    <div className="relative">
                        <div className="layout-content-container flex flex-col w-60 border-r border-gray-300 h-full">
                            <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={() => navigate('/feed')}>
                                            <div className="text-[#111418]" data-icon="House" data-size="24px" data-weight="fill">
                                                <img className="w-6 h-6" src="https://i.ibb.co/2WZXyjX/icon-rubber-duck.png" alt="chat" />
                                            </div>
                                            <p className="text-[#111418] text-sm font-medium leading-normal hidden md:inline">Origram</p>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={handleSidebarToggle}>
                                            <div className="text-[#111418]" data-icon="Compass" data-size="24px" data-weight="regular">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <p className="text-[#111418] text-sm font-medium leading-normal hidden md:inline">Explore</p>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={handleOpenCreateFeed}>
                                            <div className="text-[#111418]" data-icon="Plus" data-size="24px" data-weight="regular">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                    <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                                                </svg>
                                            </div>
                                            <p className="text-[#111418] text-sm font-medium leading-normal hidden md:inline">Create</p>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer">
                                            <div className="text-[#111418]" data-icon="MonitorPlay" data-size="24px" data-weight="regular">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Zm-3.56-110.66-48-32A8,8,0,0,0,104,88v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,137.05V103l25.58,17Z"
                                                    ></path>
                                                </svg>
                                            </div>
                                            <p className="text-[#111418] text-sm font-medium leading-normal hidden md:inline">Reels</p>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={handleOpenChat}>
                                            <img className="w-6 h-6" src="https://i.ibb.co/WcxN6vm/chat-icon.png" alt="chat" />
                                            <p className="text-[#111418] text-sm font-medium leading-normal hidden md:inline">Chat</p>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={handleOpenProfile}>
                                            {currentUser ? (
                                                <div
                                                    className="bg-center bg-no-repeat bg-cover rounded-full h-6 w-6"
                                                    style={{ backgroundImage: `url(${getFullImageUrl(currentUser.profile_picture)})`, height: '24px', width: '24px' }}
                                                ></div>
                                            ) : (
                                                <div className="text-[#111418]" data-icon="User" data-size="24px" data-weight="regular">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                        <path
                                                            d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"
                                                        ></path>
                                                    </svg>
                                                </div>
                                            )}
                                            <p className="text-[#111418] text-sm font-medium leading-normal hidden md:inline">Profile</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-[300px] h-full bg-[rgba(0,0,0,0)] absolute bottom-0 left-[220px] z-[139] border-r border-gray-300 z-10'>
                                    <div className="flex flex-col items-center gap-3 px-3 py-2">
                                        <div className='w-[238px] h-[50px] bg-[rgba(0,0,0,0)] relative z-[164] mt-0 mr-0 mb-0 ml-0'>
                                            <span className="flex justify-start items-center font-['Inter'] text-[20px] font-semibold leading-[25.415px] text-[#1f1f1f] absolute bottom-[5px] text-left whitespace-nowrap z-[165]">
                                                {currentUser.username}
                                            </span>
                                        </div>
                                        <div className="flex w-full items-center rounded-md ml-5 cursor-pointer hover:bg-gray-200 px-3 py-1.5">
                                            {chatRooms.length > 0 ? (
                                                chatRooms.map(chatRoom => (
                                                    <div key={chatRoom.chatroom_id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-200" onClick={() => handleOpenChatRoom(chatRoom.chatroom_id)}>
                                                        <div
                                                            className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10"
                                                            style={{ backgroundImage: `url(${getFullImageUrl(chatRoom.user.profile_picture)})` }}
                                                        ></div>
                                                        <div>
                                                            <p className="text-sm font-medium">{chatRoom.user.username}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full">
                                                    <div className="flex flex-col items-center">
                                                        <div className="border-4 border-black rounded-full p-4 mb-4">
                                                            <img src="https://i.ibb.co/WcxN6vm/chat-icon.png" alt="No messages" className="w-16 h-16" />
                                                        </div>
                                                        <p className="text-xl font-bold mb-2">내 메시지</p>
                                                        <p className="text-gray-500 mb-4">친구에게 메시지를 보내 보세요</p>
                                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={handleOpenCreateChatModal}>메시지 보내기</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='absolute top-0 left-[540px] w-[720px] h-full bg-[#fefefe]'>
                                    {activeChatRoomId && currentUser && (
                                        <ChatRoom chatroomId={Number(activeChatRoomId)} currentUser={currentUser} onClose={handleCloseComponent} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarToggle} />
                    {isCreateFeedOpen && <CreateFeed onClose={handleCloseCreateFeed} />}
                    {isCreateChatModalOpen && <CreateChatModal onClose={handleCloseCreateChatModal} />}
                </div>
            </div>
        </div>
    );
};

export default ChatList;
