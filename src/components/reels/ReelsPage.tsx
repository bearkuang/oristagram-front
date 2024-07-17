import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CommentBubble from './CommentBubble';
import CreateFeed from '../feed/CreateFeed';
import Sidebar from '../feed/Siderbar';
import { getFullImageUrl } from '../../services/utils';
import VideoSelector from './VideoSelector';

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
    const reelsContainerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const [isCreateReelsOpen, setIsCreateReelsOpen] = useState(false);

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
            if (reelsContainerRef.current) {
                const container = reelsContainerRef.current;
                const scrollPosition = container.scrollTop;
                const reelHeight = container.clientHeight;
                const newIndex = Math.round(scrollPosition / reelHeight);

                if (newIndex !== currentIndex) {
                    setCurrentIndex(newIndex);
                }
            }
        };

        const container = reelsContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
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

    const handleOpenCreateReels = () => {
        setIsCreateReelsOpen(true);
    }

    return (
        <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
            <div className="flex h-full grow flex-col">
                <div className="flex">
                    <div className="flex flex-col w-60 border-r border-gray-300">
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
                                    <div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={handleOpenCreateReels}>
                                        <div className="text-[#111418]" data-icon="MonitorPlay" data-size="24px" data-weight="regular">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Zm-3.56-110.66-48-32A8,8,0,0,0,104,88v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,137.05V103l25.58,17Z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <p className="text-[#111418] text-sm font-medium leading-normal hidden md:inline">Create Reels</p>
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
                    <div className="relative ml-40">
                        <div className="flex relative justify-center items-center bg-white min-h-screen">
                            <div className="relative w-[650px] h-[1200px]">
                                <div ref={reelsContainerRef} className="w-full h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
                                    {reels.map((reel, index) => (
                                        <div key={reel.id} className="relative h-full w-full snap-center py-4">
                                            <div className="absolute inset-0 rounded-3xl shadow-lg overflow-hidden" style={{ margin: '5% 0' }}>
                                                <div className="relative w-full h-full rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                                                    <video
                                                        ref={(el) => (videoRefs.current[index] = el)}
                                                        src={reel.videos && reel.videos[0]?.file ? getFullImageUrl(reel.videos[0].file) : ''}
                                                        className="w-full h-full object-cover rounded-3xl"
                                                        onClick={(e) => {
                                                            const video = e.target as HTMLVideoElement;
                                                            video.paused ? video.play() : video.pause();
                                                        }}
                                                        muted
                                                        loop
                                                        playsInline
                                                    />
                                                    <div className="absolute bottom-4 left-4 right-12">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <img className="w-10 h-10 rounded-full" onClick={() => handleUserClick(reel.author.id)} src={getFullImageUrl(reel.author.profile_picture)} alt={reel.author.username} />
                                                            <span className="text-white font-semibold">{reel.author.username}</span>
                                                        </div>
                                                        <p className="text-white text-sm">{reel.content}</p>
                                                    </div>
                                                    <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-4">
                                                        <button onClick={() => reel.is_liked ? handleUnlike(reel.id) : handleLike(reel.id)} className="text-white">
                                                            {reel.is_liked ? "❤️" : "🤍"}
                                                        </button>
                                                        <p className="text-white text-xs">{reel.like_count}</p>
                                                        <button onClick={() => handleOpenCommentPop(reel)} className="text-white">
                                                            💬
                                                        </button>
                                                        <p className="text-white text-xs">{reel.comment_count}</p>
                                                        <button onClick={() => reel.is_saved ? handleUnsave(reel.id) : handleSave(reel.id)} className="text-white">
                                                            {reel.is_saved ? "📥" : "📤"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
                {isCreateReelsOpen && <VideoSelector onClose={() => setIsCreateReelsOpen(false)} />}
            </div>
        </div>
    );
};

export default ReelsPage;
