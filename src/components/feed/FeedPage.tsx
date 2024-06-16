import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FollowedUser {
  id: number;
  username: string;
  profile_picture: string | null; // 프로필 사진 필드가 null일 수 있으므로 nullable로 지정
}

interface Feed {
  id: number;
  author: {
    username: string;
    profile_picture: string | null;
  };
  image: string;
  created_at: string;
  like_count: number;
}

const getFullImageUrl = (url: string | null) => {
  if (!url) {
    return 'path/to/default/image.png'; // 기본 이미지 경로 설정
  }
  if (url.startsWith('http')) {
    return url;
  }
  return `http://localhost:8000${url}`;
};

const FeedPage: React.FC = () => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [followedUsers, setFollowedUsers] = useState<FollowedUser[]>([]);

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

    fetchFeeds();
    fetchFollowedUsers();
  }, []);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f0f2f4]">
                    <div className="text-[#111418]" data-icon="House" data-size="24px" data-weight="fill">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-[#111418] text-sm font-medium leading-normal">Home</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#111418]" data-icon="Compass" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-[#111418] text-sm font-medium leading-normal">Explore</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#111418]" data-icon="Plus" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                      </svg>
                    </div>
                    <p className="text-[#111418] text-sm font-medium leading-normal">Create</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#111418]" data-icon="MonitorPlay" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Zm-3.56-110.66-48-32A8,8,0,0,0,104,88v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,137.05V103l25.58,17Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-[#111418] text-sm font-medium leading-normal">Reels</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#111418]" data-icon="ShoppingBag" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-[#111418] text-sm font-medium leading-normal">Shop</p>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="text-[#111418]" data-icon="User" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-[#111418] text-sm font-medium leading-normal">Profile</p>
                  </div>
                </div>
              </div>
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1972d2] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Post</span>
              </button>
            </div>
          </div>
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">Home</p>
            </div>
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
              <div key={feed.id} className="mb-6">
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
                <div className="flex w-full grow bg-white @container py-3">
                  <div className="w-full gap-1 overflow-hidden bg-white @[480px]:gap-2 aspect-[2/3] flex">
                    <div
                      className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
                      style={{ backgroundImage: `url(${getFullImageUrl(feed.image)})` }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 px-4 py-2 py-2 justify-between">
                  <div className="flex items-center justify-center gap-2 px-3 py-2">
                    <div className="text-[#637588]" data-icon="Heart" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"
                        ></path>
                      </svg>
                    </div>
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
                    <p className="text-[#637588] text-[13px] font-bold leading-normal tracking-[0.015em]">345</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 px-3 py-2">
                    <div className="text-[#637588]" data-icon="PaperPlaneTilt" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path
                          d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.42,29.84l85.62,40.55,40.55,85.62A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14L118.42,148.9l47.24-47.25a8,8,0,0,0-11.31-11.31L107.1,137.58,24,98.22l.14,0L216,40Z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-[#637588] text-[13px] font-bold leading-normal tracking-[0.015em]">678</p>
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
                      <p className="text-[#637588] text-sm font-normal leading-normal line-clamp-2">View all 23 comments</p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <p className="text-[#637588] text-sm font-normal leading-normal">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center px-4 py-3 gap-3 @container">
                  <label className="flex flex-col min-w-40 h-12 flex-1">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                      <input
                        placeholder="Add a comment..."
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-[#f0f2f4] focus:border-none h-full placeholder:text-[#637588] px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                        value=""
                      />
                      <div className="flex border-none bg-[#f0f2f4] items-center justify-center pr-4 rounded-r-xl border-l-0 !pr-2">
                        <div className="flex items-center gap-4 justify-end">
                          <div className="flex items-center gap-1">
                            <button className="flex items-center justify-center p-1.5">
                              <div className="text-[#637588]" data-icon="Smiley" data-size="20px" data-weight="regular">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                  <path
                                    d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM80,108a12,12,0,1,1,12,12A12,12,0,0,1,80,108Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,176,108Zm-1.07,48c-10.29,17.79-27.4,28-46.93,28s-36.63-10.2-46.92-28a8,8,0,1,1,13.84-8c7.47,12.91,19.21,20,33.08,20s25.61-7.1,33.07-20a8,8,0,0,1,13.86,8Z"
                                  ></path>
                                </svg>
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
