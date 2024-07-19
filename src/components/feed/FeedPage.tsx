import React, { useCallback, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import CommentPop from './CommentPop';
import ReelsCommentPop from '../reels/ReelsCommentPop';
import CreateFeed from './CreateFeed';
import VideoSelector from '../reels/VideoSelector';
import { getFullImageUrl } from '../../services/utils';
import { useNavigate } from "react-router-dom";
import Sidebar from './Siderbar';

interface User {
  id: number;
  username: string;
  name: string;
  profile_picture: string;
}

interface NewUser {
  id: number;
  username: string;
  profile_picture: string | null;
}

interface Image {
  id: number;
  file: string;
}

interface Feed {
  id: number;
  author: User;
  content: string;
  images?: Image[];
  videos?: Video[];
  site: string;
  created_at: string;
  like_count: number;
  comment_count: number;
  is_liked: boolean;
  is_saved: boolean;
  type: 'post' | 'reels';
}

interface Video {
  id: number;
  file: string;
}

const FeedPage: React.FC = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [followedUsers, setFollowedUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<NewUser[]>([]);
  const [isCommentPopOpen, setIsCommentPopOpen] = useState(false);
  const [isCreateFeedOpen, setIsCreateFeedOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>({});
  const [currentImageIndexes, setCurrentImageIndexes] = useState<{ [key: number]: number }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
  const [isCreateReelsOpen, setIsCreateReelsOpen] = useState(false);
  const [mutedVideos, setMutedVideos] = useState<Set<number>>(new Set());
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({});
  const [isReelsCommentPopOpen, setIsReelsCommentPopOpen] = useState(false);
  const [expandedContents, setExpandedContents] = useState<{ [key: number]: boolean }>({});
  const navigate = useNavigate();

  const fetchNewUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get<NewUser[]>('http://localhost:8000/api/users/new_users/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNewUser(response.data);
    } catch (error) {
      console.error('Error fetching new user:', error);
    }
  }, []);

  useEffect(() => {
    const fetchCombinedFeed = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/posts/combined_feed/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setFeeds(response.data);
      } catch (error) {
        console.error('Error fetching combined feed:', error);
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

    fetchCombinedFeed();
    fetchFollowedUsers();
    fetchCurrentUser();
    fetchNewUser();
  }, [fetchNewUser]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLVideoElement).play();
          } else {
            (entry.target as HTMLVideoElement).pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.values(videoRefs.current).forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [feeds]);

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
    if (feed.type === 'post') {
      setIsCommentPopOpen(true);
    } else if (feed.type === 'reels') {
      setIsReelsCommentPopOpen(true);
    }
  };

  const handleCloseCommentPop = () => {
    setIsCommentPopOpen(false);
    setIsReelsCommentPopOpen(false);
    setSelectedFeed(null);
  };

  const handleAddComment = async (feedId: number) => {
    const commentText = commentTexts[feedId];
    if (!commentText || !commentText.trim()) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8000/api/posts/${feedId}/comment/`, {
        text: commentText
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        setFeeds((prevFeeds) => prevFeeds.map((feed) =>
          feed.id === feedId ? { ...feed, comment_count: feed.comment_count + 1 } : feed
        ));
        setCommentTexts((prevTexts) => ({ ...prevTexts, [feedId]: '' }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleCommentTextChange = (feedId: number, text: string) => {
    setCommentTexts((prevTexts) => ({ ...prevTexts, [feedId]: text }));
  };

  const handlePrevImage = (feedId: number) => {
    setCurrentImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[feedId] || 0;
      const feed = feeds.find(feed => feed.id === feedId);
      const imagesLength = feed?.images?.length || 0;
      const newIndex = (currentIndex - 1 + imagesLength) % imagesLength;
      return { ...prevIndexes, [feedId]: newIndex };
    });
  };

  const handleNextImage = (feedId: number) => {
    setCurrentImageIndexes((prevIndexes) => {
      const currentIndex = prevIndexes[feedId] || 0;
      const feed = feeds.find(feed => feed.id === feedId);
      const imagesLength = feed?.images?.length || 0;
      const newIndex = (currentIndex + 1) % imagesLength;
      return { ...prevIndexes, [feedId]: newIndex };
    });
  };

  const handleFollow = async (userId: number) => {
    setIsLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`/api/follows/${userId}/follow/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        console.log('User follow success');
        fetchNewUser();
      }
    } catch (error) {
      console.error('Error while follow user', error);
    } finally {
      setIsLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const handleToggleMute = (feedId: number) => {
    setMutedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(feedId)) {
        newSet.delete(feedId);
        if (videoRefs.current[feedId]) {
          videoRefs.current[feedId].muted = false;
        }
      } else {
        newSet.add(feedId);
        if (videoRefs.current[feedId]) {
          videoRefs.current[feedId].muted = true;
        }
      }
      return newSet;
    });
  };

  const toggleContentExpansion = (feedId: number) => {
    setExpandedContents(prev => ({
      ...prev,
      [feedId]: !prev[feedId]
    }));
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

  const handleOpenCreateReels = () => {
    setIsCreateReelsOpen(true);
  }

  const handleOpenChat = () => {
    navigate("/chat");
  }

  const handleUserClick = (userId: number) => {
    navigate(`/user/${userId}`);
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col min-h-screen">
        <div className="flex justify-between flex h-full min-h-screen">
          <div className="relative">
            <div className="fixed top-0 left-0 layout-content-container flex flex-col w-60 border-r border-gray-300 h-full">
              <div className="flex flex-col h-full justify-between p-4">
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
                          style={{
                            backgroundImage: `url(${currentUser.profile_picture
                              ? getFullImageUrl(currentUser.profile_picture)
                              : '/image/default_profile_image.png'})`,
                            height: '24px',
                            width: '24px'
                          }}
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
          <div className="gap-1 px-6 flex flex-1 justify-center py-5 ml-60 p-4">
            <div className="layout-content-container flex flex-col max-w-[960px] ml-5 flex-1">
              {followedUsers.length > 0 && (
                <div className="flex gap-4 overflow-x-auto py-4">
                  {followedUsers.map((user) => (
                    <div key={user.id} className="flex flex-col items-center">
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-14 cursor-pointer"
                        style={{ backgroundImage: `url(${getFullImageUrl(user.profile_picture)})` }}
                        onClick={() => handleUserClick(user.id)}
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
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit cursor-pointer"
                        style={{ backgroundImage: `url(${getFullImageUrl(feed.author.profile_picture)})` }}
                        onClick={() => handleUserClick(feed.author.id)}
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
                    {feed.type === 'post' && feed.images && feed.images.length > 0 && (
                      <div className="w-full h-0 pb-[100%] relative">
                        <img
                          src={getFullImageUrl(feed.images[currentImageIndexes[feed.id] || 0]?.file || '')}
                          alt="Post"
                          className="absolute top-0 left-0 w-full h-full object-cover"
                        />
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
                                  key={`${feed.id}-${index}`}
                                  className={`w-2 h-2 rounded-full ${index === currentImageIndexes[feed.id] ? 'bg-gray-800' : 'bg-gray-400'}`}
                                ></div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {feed.type === 'reels' && feed.videos && feed.videos.length > 0 && (
                      <div className="w-full h-0 pb-[177.78%] relative">
                        <video
                          ref={(el) => { if (el) videoRefs.current[feed.id] = el; }}
                          src={getFullImageUrl(feed.videos[0].file)}
                          className="absolute top-0 left-0 w-full h-full object-cover"
                          autoPlay
                          loop
                          muted // 항상 음소거 상태로 시작 (브라우저 정책 오류 해결)
                          playsInline
                          controls={false}
                        />
                        <button
                          onClick={() => handleToggleMute(feed.id)}
                          className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full"
                          aria-label={mutedVideos.has(feed.id) ? "Unmute video" : "Mute video"}
                        >
                          {mutedVideos.has(feed.id) ? '🔇' : '🔊'}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 px-4 py-2 justify-between">
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
                          <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"></path>
                        </svg>
                      </div>
                      <button onClick={() => handleOpenCommentPop(feed)} className="text-[#637588] text-[13px] font-bold leading-normal tracking-[0.015em]">
                        댓글 달기...
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-3 py-2">
                      {feed.is_saved ? (
                        <button onClick={() => handleUnsave(feed.id)} className="text-[#ff9800]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path>
                          </svg>
                        </button>
                      ) : (
                        <button onClick={() => handleSave(feed.id)} className="text-[#637588]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex flex-col justify-center w-full">
                        <div className="flex justify-between">
                          <div className="flex flex-col bg-white py-2 w-full">
                            <div className="flex items-start gap-2 mb-2">
                              <p className="text-[#111418] text-xs font-semibold leading-normal mr-2">{feed.author.username}</p>
                              <div className="flex-1">
                                <p
                                  className="text-sm text-base font-medium leading-normal"
                                  style={{ whiteSpace: 'pre-wrap' }}
                                >
                                  {expandedContents[feed.id]
                                    ? feed.content
                                    : (
                                      <>
                                        {feed.content.slice(0, 48)}
                                        {feed.content.length > 100 && (
                                          <>
                                            ...
                                            <button
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleContentExpansion(feed.id);
                                              }}
                                              className="text-blue-500 text-sm font-medium ml-1 inline"
                                            >
                                              더보기
                                            </button>
                                          </>
                                        )}
                                      </>
                                    )
                                  }
                                </p>
                                {expandedContents[feed.id] && (
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleContentExpansion(feed.id);
                                    }}
                                    className="text-blue-500 text-sm font-medium mt-1 self-start"
                                  >
                                    접기
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2 cursor-pointer" onClick={() => handleOpenCommentPop(feed)}>댓글 {feed.comment_count}개 모두 보기</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
                    <input
                      type="text"
                      placeholder="댓글 달기..."
                      className="flex-1 p-2 mr-2 w-full"
                      value={commentTexts[feed.id] || ''}
                      onChange={(e) => handleCommentTextChange(feed.id, e.target.value)}
                    />
                    <button
                      onClick={() => handleAddComment(feed.id)}
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
            <div className="flex flex-col bg-white p-4">
              <div className="flex flex-col gap-4 cursor-pointer" onClick={handleOpenProfile}>
                {currentUser && (
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div
                      className="bg-center bg-no-repeat bg-cover rounded-full h-14 w-14"
                      style={{
                        backgroundImage: `url(${currentUser.profile_picture
                          ? getFullImageUrl(currentUser.profile_picture)
                          : '/image/default_profile_image.png'})`,
                      }}
                    ></div>
                    <div className="flex flex-col justify-center">
                      <p className="text-lg text-base font-semibold leading-normal line-clamp-1">{currentUser.username}</p>
                      <p className="text-xs text-base font-medium leading-normal line-clamp-1">{currentUser.name}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <p className="text-[#111418] text-base font-medium leading-normal mb-4">회원님을 위한 추천</p>
                <div className="flex flex-col gap-4">
                  {newUser.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-3 px-3 py-2">
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleUserClick(user.id)}>
                        <div
                          className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10"
                          style={{
                            backgroundImage: `url(${user.profile_picture
                              ? getFullImageUrl(user.profile_picture)
                              : '/image/default_profile_image.png'})`,
                          }}
                        ></div>
                        <div className="flex flex-col justify-center">
                          <p className="text-[#111418] text-sm font-medium leading-normal line-clamp-1">{user.username}</p>
                        </div>
                      </div>
                      <button
                        className={`text-sm font-medium ${isLoading[user.id] ? 'text-gray-500' : 'text-blue-500'}`}
                        onClick={() => handleFollow(user.id)}
                        disabled={isLoading[user.id] || false}
                      >
                        {isLoading[user.id] ? '처리 중...' : '팔로우'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isCommentPopOpen && selectedFeed && selectedFeed.type === 'post' && (
        <CommentPop feed={selectedFeed} onClose={handleCloseCommentPop} />
      )}
      {isReelsCommentPopOpen && selectedFeed && selectedFeed.type === 'reels' && (
        <ReelsCommentPop feed={selectedFeed} onClose={handleCloseCommentPop} />
      )}
      {isCreateFeedOpen && (
        <CreateFeed onClose={handleCloseCreateFeed} />
      )}
      {isCreateReelsOpen && <VideoSelector onClose={() => setIsCreateReelsOpen(false)} />}
    </div>
  );
};

export default FeedPage;
