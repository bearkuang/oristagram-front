import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../services/utils';
import { useNavigate, useParams } from "react-router-dom";
import CreateFeed from '../feed/CreateFeed';
import CommentPop from '../feed/CommentPop';
import Sidebar from '../feed/Siderbar';

interface User {
    id: number;
    username: string;
    name: string;
    profile_picture: string;
    bio: string;
    birth_date: string;
    website: string;
    followers_count: number;
    following_count: number;
    posts_count: number;
    is_active: number;
}

interface Image {
    id: number;
    file: string;
}

interface Video {
    id: number;
    file: string;
}

interface CommonFeed {
    id: number;
    content: string;
    created_at: string;
}

interface Feed extends CommonFeed {
    author: User;
    images: Image[];
    like_count: number;
    comment_count: number;
    is_liked: boolean;
    is_saved: boolean;
}

interface Reel extends CommonFeed {
    videos: Video[];
}

const UserPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const { userId } = useParams<{ userId: string }>();
    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isCreateFeedOpen, setIsCreateFeedOpen] = useState(false);
    const [feedType, setFeedType] = useState<'posts' | 'reels'>('posts');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCommentPopOpen, setIsCommentPopOpen] = useState(false);
    const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://localhost:8000/api/users/profile/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchFeeds = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://localhost:8000/api/posts/user/${userId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFeeds(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        const fetchReels = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://localhost:8000/api/reels/user/${userId}/`, {
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

        const checkFollowStatus = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://localhost:8000/api/follows/${userId}/follow_status/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIsFollowing(response.data.is_following);
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };

        fetchUserData();
        fetchFeeds();
        fetchReels();
        fetchCurrentUser();
        checkFollowStatus();
    }, [navigate, userId]);

    if (!user) {
        return <div>Loading...</div>;
    }

    const handleFollow = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`http://localhost:8000/api/users/follow/${userId}/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsFollowing(true);
            setUser(prev => prev ? { ...prev, followers_count: prev.followers_count + 1 } : null);
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`http://localhost:8000/api/users/unfollow/${userId}/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIsFollowing(false);
            setUser(prev => prev ? { ...prev, followers_count: prev.followers_count - 1 } : null);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

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

    const handleOpenChat = () => {
        navigate("/chat");
    }

    const handleOpenCommentPop = (feed: Feed | Reel) => {
        if ('author' in feed) {
            setSelectedFeed(feed);
            setIsCommentPopOpen(true);
        }
    };

    const handleCloseCommentPop = () => {
        setIsCommentPopOpen(false);
        setSelectedFeed(null);
    };

    const filteredFeeds: (Feed | Reel)[] = feedType === 'posts' ? feeds : reels;

    return (
        <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
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
                    </div>
                    <div className='flex-1 py-2'>
                        <div className='flex flex-col items-center md:flex-row md:items-start ml-2'>
                            <div className='w-32 h-32 rounded-full overflow-hidden mr-4 mb-4 md:mb-0'>
                                <img
                                    src={getFullImageUrl(user.profile_picture)}
                                    alt={`${user.username}'s profile`}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div>
                                <div className='flex items-center'>
                                    <h1 className='text-3xl font-bold'>{user.username}</h1>
                                    {currentUser && currentUser.id !== user.id && (
                                        <button
                                            className={`ml-4 px-4 py-2 rounded-md text-sm font-semibold ${isFollowing ? 'bg-gray-200 text-black' : 'bg-blue-500 text-white'
                                                }`}
                                            onClick={isFollowing ? handleUnfollow : handleFollow}
                                        >
                                            {isFollowing ? '언팔로우' : '팔로우'}
                                        </button>
                                    )}
                                </div>
                                <p className='text-1xl font-bold py-2'>{user.name}</p>
                                <div className='flex mt-4'>
                                    <div className='flex-2'>
                                        <span className='block text-center'>
                                            <span className='text-gray-600'>게시물</span>
                                            <span className='text-1xl font-bold px-1'>{user.posts_count}</span>
                                        </span>
                                    </div>
                                    <div className='flex-2'>
                                        <span className='block text-center'>
                                            <span className='text-gray-600'>팔로워</span>
                                            <span className='text-1xl font-bold px-1'>{user.followers_count}</span>
                                        </span>
                                    </div>
                                    <div className='flex-2'>
                                        <span className='block text-center'>
                                            <span className='text-gray-600'>팔로우</span>
                                            <span className='text-1xl font-bold px-1'>{user.following_count}</span>
                                        </span>
                                    </div>
                                </div>
                                <p className='text-gray-600 mt-4'>{user.bio}</p>
                                <a href={user.website} target="_blank" rel="noopener noreferrer" className='text-blue-500'>{user.website}</a>
                            </div>
                        </div>
                        <div className='mt-6'>
                            <div className='flex justify-center border-b border-gray-300 mb-4'>
                                <button className={`mx-2 px-4 py-2 flex items-center ${feedType === 'posts' ? 'border-b-2 border-black' : ''}`} onClick={() => setFeedType('posts')}>
                                    <img src="https://i.ibb.co/BG5fQTK/feeds-icon.png" alt="feeds icon" className='w-4 h-4 mr-2' />
                                    게시물
                                </button>
                                <button className={`mx-2 px-4 py-2 flex items-center ${feedType === 'reels' ? 'border-b-2 border-black' : ''}`} onClick={() => setFeedType('reels')}>
                                    <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 256 256'><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path></svg>
                                    릴스
                                </button>
                            </div>
                            {user.is_active === 0 ? (
                                <div className='text-center text-gray-600 text-lg'>
                                    계정이 비활성화되었습니다. 비활성화를 해제해주세요.
                                </div>
                            ) : filteredFeeds.length > 0 ? (
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                    {filteredFeeds.map(feed => (
                                        <div key={feed.id} className='border rounded-lg overflow-hidden relative cursor-pointer' onClick={() => handleOpenCommentPop(feed)}>
                                            {feedType === 'posts' && 'images' in feed && feed.images.length > 0 && (
                                                <>
                                                    <img
                                                        src={getFullImageUrl(feed.images[0].file)}
                                                        alt="Post image"
                                                        className='w-full h-64 object-cover'
                                                    />
                                                    <div className="absolute top-2 right-2 bg-opacity-50 rounded-full p-1">
                                                        <img src="https://i.ibb.co/4V2Mdyc/icon-images.png" alt="Image icon" className="w-6 h-6" />
                                                    </div>
                                                </>
                                            )}
                                            {feedType === 'reels' && 'videos' in feed && feed.videos.length > 0 && (
                                                <>
                                                    <video
                                                        src={getFullImageUrl(feed.videos[0].file)}
                                                        className='w-full h-64 object-cover'
                                                        controls
                                                    />
                                                    <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1">
                                                        <img src="https://i.ibb.co/bJ04f69/ori-icon-video.png" alt="Video icon" className="w-6 h-6" />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className='text-center text-gray-600 text-lg'>
                                    게시물 없음
                                </div>
                            )}
                        </div>
                    </div>
                    {isCommentPopOpen && selectedFeed && (
                        <CommentPop feed={selectedFeed} onClose={handleCloseCommentPop} />
                    )}
                    {isCreateFeedOpen && <CreateFeed onClose={handleCloseCreateFeed} />}
                </div>
            </div>
        </div>
    );
};

export default UserPage;
