import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommentPop from './CommentPop';
import CreateFeed from './CreateFeed';
import { getFullImageUrl } from '../../services/utils';
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  profile_picture: string;
}

interface Image {
  id: number;
  file: string;
}
interface Feed {
  id: number;
  author: User;
  content: string;
  images: Image[];
  created_at: string;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_saved: boolean;
}

const FeedPage: React.FC = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [followedUsers, setFollowedUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCommentPopOpen, setIsCommentPopOpen] = useState(false);
  const [isCreateFeedOpen, setIsCreateFeedOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [commentText, setCommentText] = useState('');
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: number]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/posts/feed/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFeeds(response.data);
      } catch (error) {
        console.error('Error fetching feeds:', error);
      }
    };

    const fetchFollowedUsers = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/users/following/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFollowedUsers(response.data);
      } catch (error) {
        console.error('Error fetching followed users:', error);
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

    fetchFeeds();
    fetchFollowedUsers();
    fetchCurrentUser();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8000/api/posts/${postId}/like/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setFeeds((prevFeeds) => prevFeeds.map((feed) =>
          feed.id === postId ? { ...feed, is_liked: true, like_count: feed.like_count + 1 } : feed
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleUnlike = async (postId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8000/api/posts/${postId}/unlike/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setFeeds((prevFeeds) => prevFeeds.map((feed) =>
          feed.id === postId ? { ...feed, is_liked: false, like_count: feed.like_count - 1 } : feed
        ));
      }
    } catch (error) {
      console.error('Error unliking post:', error);
    }
  };

  const handleSave = async (postId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8000/api/posts/${postId}/mark/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setFeeds((prevFeeds) => prevFeeds.map((feed) =>
          feed.id === postId ? { ...feed, is_saved: true } : feed
        ));
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleUnsave = async (postId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8000/api/posts/${postId}/unmark/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setFeeds((prevFeeds) => prevFeeds.map((feed) =>
          feed.id === postId ? { ...feed, is_saved: false } : feed
        ));
      }
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  const handleOpenCommentPop = (feed: Feed) => {
    setSelectedFeed(feed);
    setIsCommentPopOpen(true);
  };

  const handleCloseCommentPop = () => {
    setIsCommentPopOpen(false);
    setSelectedFeed(null);
  };

  const handleAddComment = async () => {
    if (!selectedFeed || !commentText.trim()) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8000/api/posts/${selectedFeed.id}/comment/`, {
        text: commentText
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        setFeeds((prevFeeds) => prevFeeds.map((feed) =>
          feed.id === selectedFeed.id ? { ...feed, comment_count: feed.comment_count + 1 } : feed
        ));
        setCommentText('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handlePrevImage = (feedId: number) => {
    setCurrentImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[feedId] || 0;
      const feed = feeds.find(feed => feed.id === feedId);
      const imagesLength = feed?.images.length || 0;
      const newIndex = (currentIndex - 1 + imagesLength) % imagesLength;
      return { ...prevIndexes, [feedId]: newIndex };
    });
  };

  const handleNextImage = (feedId: number) => {
    setCurrentImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[feedId] || 0;
      const feed = feeds.find(feed => feed.id === feedId);
      const imagesLength = feed?.images.length || 0;
      const newIndex = (currentIndex + 1) % imagesLength;
      return { ...prevIndexes, [feedId]: newIndex };
    });
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
                  <div className="flex items-center gap-3 px-3 py-2 cursor-pointer">
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
          <div className="gap-1 px-6 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-[960px] ml-5 flex-1">
              {followedUsers.length > 0 && (
                <div className="flex gap-4 overflow-x-auto py-4">
                  {followedUsers.map((user) => (
                    <div key={user.id} className="flex flex-col items-center">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14"
                        style={{ backgroundImage: `url(${getFullImageUrl(user.profile_picture)})` }}
                      ></div>
                      <p className="text-[#111418] text-sm font-medium leading-normal">{user.username}</p>
                    </div>
                  ))}
                </div>
              )}
              {feeds.map((feed) => (
                <div key={feed.id} className="mb-6 border-b border-gray-300">
                  <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit"
                        style={{ backgroundImage: `url(${getFullImageUrl(feed.author.profile_picture)})` }}
                      ></div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">{feed.author.username}</p>
                        <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">{new Date(feed.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="text-[#111418] flex size-7 items-center justify-center" data-icon="DotsThree" data-size="24px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex w-full grow bg-white @container py-3">
                    {feed.images.length > 1 && (
                      <>
                        <button onClick={() => handlePrevImage(feed.id)} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full opacity-50 hover:opacity-100">
                          &lt;
                        </button>
                        <button onClick={() => handleNextImage(feed.id)} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full opacity-50 hover:opacity-100">
                          &gt;
                        </button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {feed.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${index === currentImageIndexes[feed.id] ? 'bg-gray-800' : 'bg-gray-400'}`}
                            ></div>
                          ))}
                        </div>
                      </>
                    )}
                    <div className="w-full gap-1 overflow-hidden bg-white @[480px]:gap-2 aspect-[2/3] flex">
                      <div
                        className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
                        style={{ backgroundImage: `url(${getFullImageUrl(feed.images[currentImageIndexes[feed.id] || 0]?.file || '')})` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 px-4 py-2 py-2 justify-between">
                    <div className="flex items-center justify-center gap-2 px-3 py-2">
                      {feed.is_liked ? (
                        <button onClick={() => handleUnlike(feed.id)} className="text-[#e74c3c]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
                          </svg>
                        </button>
                      ) : (
                        <button onClick={() => handleLike(feed.id)} className="text-[#637588]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
                          </svg>
                        </button>
                      )}
                      <p className="text-[#637588] text-[13px] font-bold leading-normal tracking-[0.015em]">{feed.like_count}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-3 py-2">
                      <div className="text-[#637588]" data-icon="ChatCircle" data-size="24px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                          <path
                            d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"
                          ></path>
                        </svg>
                      </div>
                      <button
                        onClick={() => handleOpenCommentPop(feed)}
                        className="text-[#637588] text-[13px] font-bold leading-normal tracking-[0.015em]"
                      >
                        댓글 달기...
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-3 py-2">
                      {feed.is_saved ? (
                        <button onClick={() => handleUnsave(feed.id)} className="text-[#ff9800]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path
                              d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"
                            ></path>
                          </svg>
                        </button>
                      ) : (
                        <button onClick={() => handleSave(feed.id)} className="text-[#637588]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path
                              d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"
                            ></path>
                          </svg>
                        </button>
                      )}
                      <p className="text-[#637588] text-[13px] font-bold leading-normal tracking-[0.015em]">{feed.like_count}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit"
                        style={{ backgroundImage: `url(${getFullImageUrl(feed.author.profile_picture)})` }}
                      ></div>
                      <div className="flex flex-col justify-center">
                        <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">{feed.author.username}</p>
                        <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">댓글 {feed.comment_count}개 모두 보기</p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <p className="text-[#637588] text-sm font-normal leading-normal">1시간 전</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                    <input
                      type="text"
                      placeholder="댓글 달기..."
                      className="flex-1 p-2 mr-2 w-full"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button
                      onClick={handleAddComment}
                      className="text-blue-700 px-4 py-2 rounded-lg"
                    >
                      게시
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
              <div className="flex flex-col gap-4">
                {currentUser && (
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14"
                      style={{ backgroundImage: `url(${getFullImageUrl(currentUser.profile_picture)})` }}
                    ></div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[#111418] text-base font-medium leading-normal line-clamp-1">{currentUser.username}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isCommentPopOpen && selectedFeed && (
        <CommentPop feed={selectedFeed} onClose={handleCloseCommentPop} />
      )}
      {isCreateFeedOpen && (
        <CreateFeed onClose={handleCloseCreateFeed} />
      )}
    </div>
  );
};

export default FeedPage;
