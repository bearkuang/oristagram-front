import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../services/utils';
import { useNavigate, useParams } from "react-router-dom";
import CommentPop from '../feed/CommentPop';
import CreateFeed from './CreateFeed';
import Sidebar from '../feed/Siderbar';

interface User {
    id: number;
    username: string;
    profile_picture: string;
    bio: string;
    birth_date: string;
    website: string;
}

interface Image {
    id: number;
    file: string;
}

interface Post {
    id: number;
    content: string;
    images: Image[];
    created_at: string;
    like_count: number;
}

interface Feed extends Post {
    author: User;
    comment_count: number;
    is_liked: boolean;
    is_saved: boolean;
}

const TaggedPage: React.FC = () => {
    const [posts, setPosts] = useState<Feed[]>([]);
    const [topPost, setTopPost] = useState<Feed | null>(null);
    const [isCommentPopOpen, setIsCommentPopOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
    const [isCreateFeedOpen, setIsCreateFeedOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { tag } = useParams<{ tag: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTaggedPosts = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    console.log('No token found, redirecting to login...');
                    navigate("/login");
                    return;
                }
                console.log(`Fetching posts tagged with ${tag}...`);
                const response = await axios.get(`/api/search/tagged/?tag=${tag}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('Tagged posts data:', response.data);
                setPosts(response.data);
                if (response.data.length > 0) {
                    setTopPost(response.data.reduce((max: { like_count: number; }, post: { like_count: number; }) => post.like_count > max.like_count ? post : max, response.data[0]));
                }
            } catch (error) {
                console.error('Error fetching tagged posts:', error);
            }
        };

        const fetchCurrentUser = async () => {
            try {
              const token = localStorage.getItem('accessToken');
              if (!token) {
                console.log('No token found, redirecting to login...');
                navigate("/login");
                return;
              }
              console.log('Fetching current user...');
              const response = await axios.get('/api/users/me/', {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              console.log('Current user data:', response.data);
              setCurrentUser(response.data);
            } catch (error) {
              console.error('Error fetching current user:', error);
            }
          };
      
        fetchCurrentUser();
        fetchTaggedPosts();
    }, [navigate, tag]);

    if (!tag) {
        return <div>Loading...</div>;
    }

    const handleOpenCreateFeed = () => {
        setIsCreateFeedOpen(true);
      };
    
      const handleCloseCreateFeed = () => {
        setIsCreateFeedOpen(false);
      };

    const handleOpenCommentPop = (feed: Feed) => {
        setSelectedFeed(feed);
        setIsCommentPopOpen(true);
    };

    const handleOpenProfile = () => {
        navigate("/profile");
    };

    const handleCloseCommentPop = () => {
        setIsCommentPopOpen(false);
        setSelectedFeed(null);
    };

    const handleSidebarToggle = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <div className="relative flex justify-between">
                    <div className="relative">
                        <div className="layout-content-container flex flex-col w-60 border-r border-gray-300">
                            <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
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
                        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarToggle} />
                    </div>
                    <div className='flex-1 py-2'>
                        <div className='flex flex-col items-center md:flex-row md:items-start ml-2'>
                            <div className='w-32 h-32 rounded-full overflow-hidden mr-4 mb-4 md:mb-0'>
                                {topPost && topPost.images.length > 0 && (
                                    <img
                                        src={getFullImageUrl(topPost.images[0].file)}
                                        alt="Top post"
                                        className='w-full h-full object-cover'
                                    />
                                )}
                            </div>
                            <div>
                                <h1 className='text-3xl font-bold'>{`#${tag}`}</h1>
                                <div className='flex mt-4'>
                                    <div className='flex-2'>
                                        <span className='block text-center'>
                                            <span className='text-gray-600'>태그된 게시물</span>
                                            <span className='text-1xl font-bold px-1'>{posts.length}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-6'>
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                                {posts.map(feed => (
                                    <div key={feed.id} className='border rounded-lg overflow-hidden' onClick={() => handleOpenCommentPop(feed)}>
                                        {feed.images.length > 0 && (
                                            <img
                                                src={getFullImageUrl(feed.images[0].file)}
                                                alt="Post image"
                                                className='w-full h-64 object-cover'
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
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

export default TaggedPage;
