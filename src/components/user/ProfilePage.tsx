import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../services/utils';
import { useNavigate } from "react-router-dom";
import CreateFeed from '../feed/CreateFeed';
import CommentPop from '../feed/CommentPop';
import Sidebar from '../feed/Siderbar';
import FollowModal from './FollowModal';
import FollowerModal from './FollowerModal';

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

interface Feed extends Post {
  author: User;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_saved: boolean;
  videos?: Video[];
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Feed[]>([]);
  const [reels, setReels] = useState<Feed[]>([]);
  const [savedPosts, setSavedPosts] = useState<Feed[]>([]);
  const [savedReels, setSavedReels] = useState<Feed[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCreateFeedOpen, setIsCreateFeedOpen] = useState(false);
  const [isCommentPopOpen, setIsCommentPopOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [feedType, setFeedType] = useState<'posts' | 'saved'>('posts');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [isFollowerModalOpen, setIsFollowerModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.log('No token found, redirecting to login...');
          navigate("/login");
          return;
        }
        console.log('Fetching profile...');
        const response = await axios.get('http://localhost:8000/api/users/profile/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Profile data:', response.data);
        setUser(response.data);
        setPosts(response.data.posts);
        setReels(response.data.reels);
        setSavedPosts(response.data.saved_posts);
        setSavedReels(response.data.saved_reels);
      } catch (error) {
        console.error('Error fetching profile:', error);
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
        const response = await axios.get('http://localhost:8000/api/users/me/', {
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

    fetchProfile();
    fetchCurrentUser();
  }, [navigate]);

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

  const handleOpenCommentPop = (feed: Feed) => {
    setSelectedFeed(feed);
    setIsCommentPopOpen(true);
  };

  const handleCloseCommentPop = () => {
    setIsCommentPopOpen(false);
    setSelectedFeed(null);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

  const handleEditProfile = () => {
    navigate("/settings");
  };

  const handleOpenChat = () => {
    navigate("/chat");
  }

  const filteredFeeds = feedType === 'posts' ? [...posts, ...reels] : [...savedPosts, ...savedReels];

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col min-h-screen">
        <div className="relative flex h-full min-h-screen">
          <div className="relative">
            <div className="layout-content-container flex flex-col w-60 border-r border-gray-300 h-full min-h-full">
              <div className="flex h-full min-h-full flex-col justify-between bg-white p-4">
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
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z"></path>
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
                  <button className='ml-4 px-4 py-2 border rounded-md text-sm font-semibold' onClick={handleEditProfile}>
                    프로필 편집
                  </button>
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
                    <span className='block text-center cursor-pointer' onClick={handleOpenFollowerModal}>
                      <span className='text-gray-600'>팔로워</span>
                      <span className='text-1xl font-bold px-1'>{user.followers_count}</span>
                    </span>
                  </div>
                  <div className='flex-2'>
                    <span className='block text-center cursor-pointer' onClick={handleOpenFollowModal}>
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
                <button className={`mx-2 px-4 py-2 flex items-center ${feedType === 'saved' ? 'border-b-2 border-black' : ''}`} onClick={() => setFeedType('saved')}>
                  <svg className='w-4 h-4 mr-2' fill='currentColor' viewBox='0 0 256 256'>
                    <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path>
                  </svg>
                  저장됨
                </button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {filteredFeeds.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(feed => (
                  <div key={feed.id} className='border rounded-lg overflow-hidden' onClick={() => handleOpenCommentPop(feed)}>
                    {'images' in feed && feed.images.length > 0 && (
                      <img
                        src={getFullImageUrl(feed.images[0].file)}
                        alt="Post image"
                        className='w-full h-64 object-cover'
                      />
                    )}
                    {'videos' in feed && feed.videos && feed.videos.length > 0 && (
                      <video
                        src={getFullImageUrl(feed.videos[0].file)}
                        className='w-full h-64 object-cover'
                        controls
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
          {isFollowModalOpen && <FollowModal onClose={handleCloseFollowModal} />}
          {isFollowerModalOpen && <FollowerModal onClose={handleCloseFollowerModal} />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
