import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateFeed from '../feed/CreateFeed';
import { getFullImageUrl } from '../../services/utils';
import { useNavigate } from "react-router-dom";
import Sidebar from '../feed/Siderbar';
import EditProfile from './EditProfile';
import AccountStatus from './AccountStatus';

interface User {
    id: number;
    username: string;
    profile_picture: string;
    name: string;
    website: string;
    bio: string;
    birth_date: string;
    is_active: boolean;
}

const Settings: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCreateFeedOpen, setIsCreateFeedOpen] = useState(false);
    const [activeComponent, setActiveComponent] = useState<'editProfile' | 'accountStatus' | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('/api/users/me/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCurrentUser({
                    ...response.data,
                    is_active: response.data.is_active === true || response.data.is_active === 'true'
                });
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/');
    };

    const handleOpenCreateFeed = () => {
        setIsCreateFeedOpen(true);
    };

    const handleCloseCreateFeed = () => {
        setIsCreateFeedOpen(false);
    };

    const handleOpenProfile = () => {
        navigate("/profile");
    }

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleOpenReels = () => {
        navigate("/reels");
    }

    const handleOpenEditProfile = () => {
        setActiveComponent("editProfile");
    }

    const handleCloseComponent = () => {
        setActiveComponent(null);
    }

    const handleOpenChat = () => {
        navigate("/chat");
    }

    const handelOpenAccountStatus = () => {
        setActiveComponent("accountStatus");
    }

    return (
        <div className='main-container w-full h-screen bg-[rgba(0,0,0,0)] relative mx-auto my-0'>
            <div className="layout-content-container flex flex-col w-60 border-r border-gray-300 h-full z-10">
                <div className="flex h-full flex-col justify-between bg-white p-4">
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
                            <div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={handleOpenReels}>
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
                            <div className="mt-auto pt-4">
                                <div
                                    className="flex items-center gap-3 px-3 py-2 cursor-pointer"
                                    onClick={() => navigate('/settings')}
                                >
                                    <div className="text-[#111418]" data-icon="Gear" data-size="24px" data-weight="regular">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                            <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.49A107.71,107.71,0,0,0,73.89,34.49a8,8,0,0,0-3.94,6L67.21,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.93,107.21,107.21,0,0,0-10.88,26.25,8,8,0,0,0,1.48,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.49,107.71,107.71,0,0,0,26.25-10.87,8,8,0,0,0,3.94-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.93,107.21,107.21,0,0,0,10.88-26.25,8,8,0,0,0-1.48-7.06ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"></path>
                                        </svg>
                                    </div>
                                    <p className="text-[#111418] text-sm font-medium leading-normal hidden md:inline">설정</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarToggle} />
            <div className='w-[300px] h-full bg-[rgba(0,0,0,0)] absolute bottom-0 left-[220px] z-[139] border-r border-gray-300 z-[10]'>
                <div className="flex flex-col items-center gap-3 px-3 py-2">
                    <div className='w-[238px] h-[50px] bg-[rgba(0,0,0,0)] relative z-[164] mt-0 mr-0 mb-0 ml-0'>
                        <span className="flex justify-start items-center font-['Inter'] text-[12px] font-semibold leading-[25.415px] text-[#1f1f1f] absolute bottom-[5px] right-[115px] text-left whitespace-nowrap z-[165]">
                            내 Origram 사용 방식
                        </span>
                    </div>
                    <div className="flex w-full items-center rounded-md ml-5 cursor-pointer hover:bg-gray-200 px-3 py-1.5" onClick={handleOpenEditProfile}>
                        <img src="https://i.ibb.co/gm1bXVY/ori-profile-icon.png" alt="Profile Edit" className="h-5 w-5 rounded-full" />
                        <span className="ml-3 text-[#1f1f1f] text-[12px] font-semibold leading-[25.415px]">프로필 편집</span>
                    </div>
                    <div className='w-[238px] h-[50px] bg-[rgba(0,0,0,0)] relative z-[164] mt-0 mr-0 mb-0 ml-0'>
                        <span className="flex justify-start items-center font-['Inter'] text-[12px] font-semibold leading-[25.415px] text-[#1f1f1f] absolute bottom-[5px] right-[135px] text-left whitespace-nowrap z-[165]">
                            계정 정보 및 지원
                        </span>
                    </div>
                    <div className="flex w-full items-center rounded-md ml-5 cursor-pointer hover:bg-gray-200 px-3 py-1.5" onClick={handelOpenAccountStatus}>
                        <img src="https://i.ibb.co/wrpLsTJ/ori-people-icon.png" alt="Profile Edit" className="h-5 w-5 rounded-full" />
                        <span className="ml-3 text-[#1f1f1f] text-[12px] font-semibold leading-[25.415px]">계정 상태</span>
                    </div>
                    <div className="flex w-full items-center rounded-md ml-5 cursor-pointer hover:bg-gray-200 px-3 py-1.5" onClick={logout}>
                        <img src="https://i.ibb.co/TTX0cy2/ori-icon-exit.png" alt="Profile Edit" className="h-5 w-5 rounded-full" />
                        <span className="ml-3 text-[#1f1f1f] text-[12px] font-semibold leading-[25.415px]">로그아웃</span>
                    </div>
                </div>
            </div>
            <div className='absolute top-0 left-[540px] w-[720px] h-full bg-[#fefefe]'>
                {activeComponent === 'editProfile' && currentUser && (
                    <EditProfile currentUser={currentUser} onClose={handleCloseComponent} />
                )}
                {activeComponent === 'accountStatus' && currentUser && (
                    <AccountStatus
                        currentUser={currentUser}
                        onClose={handleCloseComponent}
                    />
                )}
            </div>
            {isCreateFeedOpen && <CreateFeed onClose={handleCloseCreateFeed} />}
        </div>
    );
};

export default Settings;
