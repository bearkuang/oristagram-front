import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CommentBubble from './CommentBubble';
import CreateFeed from '../feed/CreateFeed';
import Sidebar from '../feed/Siderbar';
import { getFullImageUrl } from '../../services/utils';

interface User {
    id: number;
    username: string;
    profile_picture: string;
}

interface Video {
    id: number;
    file: string;
}

interface Reels {
    id: number;
    author: User;
    content: string;
    videos: Video[];
    created_at: string;
    like_count: number;
    comment_count: number;
    is_liked: boolean;
    is_saved: boolean;
}

const ReelsPage: React.FC = () => {
    const [reels, setReels] = useState<Reels[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isCommentPopOpen, setIsCommentPopOpen] = useState(false);
    const [isCreateFeedOpen, setIsCreateFeedOpen] = useState(false);
    const [selectedReels, setSelectedReels] = useState<Reels | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0); // 처음 시작 인덱스를 0으로 설정
    const navigate = useNavigate();
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        const fetchReels = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:8000/api/reels/top_reels/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setReels(response.data);
            } catch (error) {
                console.error('Error fetching reels:', error);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
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

        fetchReels();
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            videoRefs.current.forEach((video, index) => {
                if (video) {
                    if (index === currentIndex) {
                        video.play();
                    } else {
                        video.pause();
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentIndex]);

    useEffect(() => {
        videoRefs.current.forEach((video, index) => {
            if (video) {
                if (index === currentIndex) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        });
    }, [currentIndex]);

    const handleLike = async (reelsId: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(`http://localhost:8000/api/reels/${reelsId}/like/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setReels((prevReels) => prevReels.map((reel) =>
                    reel.id === reelsId ? { ...reel, is_liked: true, like_count: reel.like_count + 1 } : reel
                ));
            }
        } catch (error) {
            console.error('Error liking reels:', error);
        }
    };

    const handleUnlike = async (reelsId: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(`http://localhost:8000/api/reels/${reelsId}/unlike/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setReels((prevReels) => prevReels.map((reel) =>
                    reel.id === reelsId ? { ...reel, is_liked: false, like_count: reel.like_count - 1 } : reel
                ));
            }
        } catch (error) {
            console.error('Error unliking reels:', error);
        }
    };

    const handleSave = async (reelsId: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(`http://localhost:8000/api/reels/${reelsId}/mark/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setReels((prevReels) => prevReels.map((reel) =>
                    reel.id === reelsId ? { ...reel, is_saved: true } : reel
                ));
            }
        } catch (error) {
            console.error('Error saving reels:', error);
        }
    };

    const handleUnsave = async (reelsId: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(`http://localhost:8000/api/reels/${reelsId}/unmark/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setReels((prevReels) => prevReels.map((reel) =>
                    reel.id === reelsId ? { ...reel, is_saved: false } : reel
                ));
            }
        } catch (error) {
            console.error('Error unsaving reels:', error);
        }
    };

    const handleOpenCommentPop = (reels: Reels) => {
        setSelectedReels(reels);
        setIsCommentPopOpen(true);
    };

    const handleCloseCommentPop = () => {
        setIsCommentPopOpen(false);
        setSelectedReels(null);
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

    const handleUserClick = (userId: number) => {
        navigate(`/user/${userId}`);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reels.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + reels.length) % reels.length);
    };

    return (
        <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <div className="flex justify-between">
                    <div className="layout-content-container flex flex-col w-60 border-r border-gray-300">
                        <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={() => navigate('/feed')}>
                                        <div className="text-[#111418]" data-icon="House" data-size="24px" data-weight="fill">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"
                                                ></path>
                                            </svg>
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
                                    <div className="flex items-center gap-3 px-3 py-2 cursor-pointer">
                                        <div className="text-[#111418]" data-icon="ShoppingBag" data-size="24px" data-weight="regular">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <p className="text-[#111418] text-sm font-medium leading-normal hidden md:inline">Shop</p>
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
                        </div>
                    </div>
                    <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarToggle} />
                    <div className="gap-1 px-6 flex flex-1 justify-center py-5 overflow-x-auto">
                        <div className="relative flex items-center">
                            <button onClick={handlePrev} className="absolute left-0 z-10 p-2 bg-gray-800 text-white rounded-full">
                                &lt;
                            </button>
                            <div className="layout-content-container flex flex-row justify-center items-center space-x-6" style={{ transform: `translateX(-${(currentIndex - 1) * 100}%)`, transition: 'transform 0.5s ease' }}>
                                {reels.map((reel, index) => (
                                    <div key={reel.id} className={`relative ${index === currentIndex ? 'z-20' : 'z-10'} transition-transform duration-500`} style={{ transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)', width: '300px', height: '500px' }}>
                                        <video
                                            ref={(el) => (videoRefs.current[index] = el)}
                                            src={reel.videos && reel.videos[0]?.file ? getFullImageUrl(reel.videos[0].file) : ''}
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                            onClick={(e) => {
                                                const video = e.target as HTMLVideoElement;
                                                video.paused ? video.play() : video.pause();
                                            }}
                                            muted
                                            loop
                                            playsInline
                                        />
                                        <div className="absolute bottom-2 left-2 flex flex-col items-start gap-2 p-2 bg-opacity-50 rounded cursor-pointer" onClick={() => handleUserClick(reel.author.id)}>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10"
                                                    style={{ backgroundImage: `url(${getFullImageUrl(reel.author.profile_picture)})` }}
                                                ></div>
                                                <p className="text-white text-sm font-semibold">{reel.author.username}</p>
                                            </div>
                                            <div>
                                                <p className="text-white text-sm font-semibold">{reel.content}</p>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2 right-2 flex flex-col items-end p-2 space-y-2">
                                            {reel.is_liked ? (
                                                <button onClick={() => handleUnlike(reel.id)} className="text-[#e74c3c]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                        <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
                                                    </svg>
                                                </button>
                                            ) : (
                                                <button onClick={() => handleLike(reel.id)} className="text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                        <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
                                                    </svg>
                                                </button>
                                            )}
                                            <p className="text-white text-xs font-bold mr-2">{reel.like_count}</p>
                                            <button onClick={() => handleOpenCommentPop(reel)} className="text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                    <path
                                                        d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"
                                                    ></path>
                                                </svg>
                                            </button>
                                            {reel.is_saved ? (
                                                <button onClick={() => handleUnsave(reel.id)} className="text-[#ff9800]">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                        <path
                                                            d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"
                                                        ></path>
                                                    </svg>
                                                </button>
                                            ) : (
                                                <button onClick={() => handleSave(reel.id)} className="text-white">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                        <path
                                                            d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"
                                                        ></path>
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleNext} className="absolute right-0 z-10 p-2 bg-gray-800 text-white rounded-full">
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isCommentPopOpen && selectedReels && (
                <CommentBubble reelsId={selectedReels.id} onClose={handleCloseCommentPop} />
            )}
            {isCreateFeedOpen && (
                <CreateFeed onClose={handleCloseCreateFeed} />
            )}
        </div>
    );
};

export default ReelsPage;
