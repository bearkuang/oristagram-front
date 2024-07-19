import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../services/utils';
import { useNavigate, useParams } from "react-router-dom";
import CreateFeed from '../feed/CreateFeed';
import Sidebar from '../feed/Siderbar';
import ReelsCommentPop from '../reels/ReelsCommentPop';
import FollowModal from './FollowModal';
import FollowerModal from './FollowerModal';
import CommentPop from '../feed/CommentPop';
import VideoSelector from '../reels/VideoSelector';

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
}

interface Image {
    id: number;
    file: string;
}

interface Video {
    id: number;
    file: string;
}

interface Post {
    id: number;
    content: string;
    images: Image[];
    created_at: string;
}

interface Reel {
    id: number;
    content: string;
    videos: Video[];
    created_at: string;
}

interface Feed extends Post {
    author: User;
    like_count: number;
    comment_count: number;
    is_liked: boolean;
    is_saved: boolean;
    videos?: Video[];
}

interface CombinedFeed {
    id: number;
    content: string;
    created_at: string;
    images?: Image[];
    videos?: Video[];
    author: User;
    like_count: number;
    comment_count: number;
    is_liked: boolean;
    is_saved: boolean;
}

interface Feed extends CombinedFeed {
    images: Image[];
}

interface Reel extends CombinedFeed {
    videos: Video[];
}

const UserPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const { userId } = useParams<{ userId: string }>();
    const [feeds, setFeeds] = useState<Feed[]>([]);
    const [reels, setReels] = useState<Reel[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isCreateFeedOpen, setIsCreateFeedOpen] = useState(false);
    const [isCommentPopOpen, setIsCommentPopOpen] = useState(false);
    const [feedType, setFeedType] = useState<'posts' | 'reels'>('posts');
    const [selectedFeed, setSelectedFeed] = useState<CombinedFeed | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [isCreateReelsOpen, setIsCreateReelsOpen] = useState(false);
    const [isSelectedFeedReels, setIsSelectedFeedReels] = useState(false);
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false);
    const filteredFeeds: CombinedFeed[] = [...feeds, ...reels];
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
                console.log('Fetched reels:', response.data);
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
                const response = await axios.get(`http://localhost:8000/api/users/${userId}/check_follow_status/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setIsFollowing(response.data.is_following);
            } catch (error) {
                console.error('Error checking follow status:', error);
            }
        };

        if (currentUser && currentUser.id !== parseInt(userId as string)) {
            checkFollowStatus();
        }

        fetchUserData();
        fetchFeeds();
        fetchReels();
        fetchCurrentUser();
    }, [navigate, userId]);

    const handleFollowToggle = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (isFollowing) {
                await axios.post(`http://localhost:8000/api/users/${userId}/unfollow/`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } else {
                await axios.post(`http://localhost:8000/api/users/${userId}/follow/`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            setIsFollowing(!isFollowing);
            // 팔로워 수 업데이트
            setUser(prevUser => prevUser ? { ...prevUser, followers_count: isFollowing ? prevUser.followers_count - 1 : prevUser.followers_count + 1 } : null);
        } catch (error) {
            console.error('Error toggling follow status:', error);
        }
    };

    if (!user) {
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

    const handleOpenChat = () => {
        navigate("/chat");
    }

    const handleCloseCommentPop = () => {
        setIsCommentPopOpen(false);
        setSelectedFeed(null);
    };

    const handleOpenFollowModal = () => {
        setIsFollowModalOpen(true);
    };

    const handleCloseFollowModal = () => {
        setIsFollowModalOpen(false);
    };

    const handleOpenFollowerModal = () => {
        setIsFollowerModalOpen(true);
    };

    const handleCloseFollowerModal = () => {
        setIsFollowerModalOpen(false);
    };

    const handleOpenCreateReels = () => {
        setIsCreateReelsOpen(true);
    }

    const handleOpenReels = () => {
        navigate("/reels");
    }

    const handleOpenCommentPop = (feed: CombinedFeed) => {
        setSelectedFeed(feed);
        setIsSelectedFeedReels(
            'videos' in feed &&
            feed.videos !== undefined &&
            feed.videos.length > 0
        );
        setIsCommentPopOpen(true);
    };

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
                                                <img className="w-6 h-6" src="/image/icon-rubber-duck.png" alt="chat" />
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
                                            <p className="text-[#111418] text-sm font-medium leading-normal hidden md:inline">Create Feed</p>
                                        </div>
                                        <div className="flex items-center gap-3 px-3.5 py-2 cursor-pointer" onClick={handleOpenReels}>
                                            <img className="w-5 h-5" src="/image/reels-icon.png" alt="reels" />
                                            <p className="text-[#111418] text-sm font-medium leading-normal hidden md:inline">Reels</p>
                                        </div>
                                        <div className="flex items-center gap-3 px-3.5 py-2 cursor-pointer" onClick={handleOpenCreateReels}>
                                            <img className="w-5 h-5" src="/image/add-reels-icon.png" alt="create reels" />
                                            <p className="text-[#111418] text-sm font-medium leading-normal hidden md:inline">Create Reels</p>
                                        </div>
                                        <div className="flex items-center gap-3 px-3 py-2 cursor-pointer" onClick={handleOpenChat}>
                                            <img className="w-6 h-6" src="/image/chat-icon.png" alt="chat" />
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
                                <div className="flex items-center">
                                    <h1 className='text-3xl font-normal'>{user.username}</h1>
                                    {currentUser && currentUser.id !== user.id && (
                                        <button
                                            onClick={handleFollowToggle}
                                            className={`ml-4 px-3 py-1 rounded-lg ${isFollowing
                                                ? 'bg-gray-200 text-black font-semibold'
                                                : 'bg-blue-500 text-white font-semibold'
                                                }`}
                                        >
                                            {isFollowing ? '팔로우 취소' : '팔로우'}
                                        </button>
                                    )}
                                </div>
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
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {filteredFeeds.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(feed => (
                                    <div key={feed.id} className='border rounded-lg overflow-hidden' onClick={() => handleOpenCommentPop(feed)}>
                                        {'images' in feed && feed.images && feed.images.length > 0 && (
                                            <img
                                                src={getFullImageUrl(feed.images[0].file)}
                                                alt="Post content"
                                                className='w-full h-64 object-cover'
                                            />
                                        )}
                                        {'videos' in feed && feed.videos && feed.videos.length > 0 && (
                                            <video
                                                src={getFullImageUrl(feed.videos[0].file)}
                                                className='w-full h-64 object-cover'
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {isCommentPopOpen && selectedFeed && (
                        isSelectedFeedReels ? (
                            <ReelsCommentPop feed={selectedFeed} onClose={handleCloseCommentPop} />
                        ) : (
                            <CommentPop feed={selectedFeed} onClose={handleCloseCommentPop} />
                        )
                    )}
                    {isCreateFeedOpen && (
                        <CreateFeed onClose={handleCloseCreateFeed} />
                    )}
                    {isCreateReelsOpen && <VideoSelector onClose={() => setIsCreateReelsOpen(false)} />}
                    {isFollowModalOpen && <FollowModal onClose={handleCloseFollowModal} />}
                    {isFollowerModalOpen && <FollowerModal onClose={handleCloseFollowerModal} />}
                </div>
            </div>
        </div>
    );
};

export default UserPage;
