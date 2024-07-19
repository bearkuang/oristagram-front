import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface ReelsCommentPopProps {
  feed: any;
  onClose: () => void;
}

const getFullImageUrl = (url: string | null) => {
  if (!url) {
    return '/image/default_profile_image.png';
  }
  if (url.startsWith('/media/')) {
    return `http://localhost:8000${url}`;
  }
  return url;
};

const getFullVideoUrl = (url: string | null) => {
  if (!url) return '';
  if (url.startsWith('/media/')) {
    return `http://localhost:8000${url}`;
  }
  return url;
};

const ReelsCommentPop: React.FC<ReelsCommentPopProps> = ({ feed, onClose }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [parentCommentId, setParentCommentId] = useState<number | null>(null);
  const [currentFeed, setCurrentFeed] = useState(feed);
  const [repliesVisibility, setRepliesVisibility] = useState<{ [key: number]: boolean }>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:8000/api/reels/${currentFeed.id}/comments/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [currentFeed.id]);

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const data: { text: string; parent_id?: number } = { text: commentText };
      if (parentCommentId) {
        data.parent_id = parentCommentId;
      }
      const response = await axios.post(`http://localhost:8000/api/reels/${currentFeed.id}/comment/`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 201) {
        setComments([...comments, response.data]);
        setCommentText('');
        setParentCommentId(null);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLike = async (id: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8000/api/reels/${currentFeed.id}/like/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setCurrentFeed((prevFeed: any) => ({ ...prevFeed, is_liked: true, like_count: prevFeed.like_count + 1 }));
      }
    } catch (error) {
      console.error('Error liking reels:', error);
    }
  };

  const handleUnlike = async (id: any) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8000/api/reels/${currentFeed.id}/unlike/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setCurrentFeed((prevFeed: any) => ({ ...prevFeed, is_liked: false, like_count: prevFeed.like_count - 1 }));
      }
    } catch (error) {
      console.error('Error unliking reels:', error);
    }
  };

  const handleSave = async (postId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8000/api/reels/${postId}/mark/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setCurrentFeed((prevFeed: any) => ({ ...prevFeed, is_saved: true }));
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleUnsave = async (postId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8000/api/reels/${postId}/unmark/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setCurrentFeed((prevFeed: any) => ({ ...prevFeed, is_saved: false }));
      }
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  const handleReply = (username: string, commentId: number) => {
    setCommentText(prev => `${prev}@${username} `);
    setParentCommentId(commentId);
  };

  const toggleRepliesVisibility = async (commentId: number) => {
    setRepliesVisibility(prev => ({ ...prev, [commentId]: !prev[commentId] }));

    if (!repliesVisibility[commentId]) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:8000/api/reels/${commentId}/replies/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const replies = response.data;

        setComments(prevComments =>
          prevComments.map(comment =>
            comment.id === commentId ? { ...comment, replies } : comment
          )
        );
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[1102px] h-[694px] flex">
        <div className="relative w-[702px] bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            src={getFullVideoUrl(currentFeed.videos[0]?.file)}
            className="max-w-full max-h-full"
            controls
            autoPlay
            loop
          />
        </div>
        <div className="w-[400px] bg-white flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <div className="flex items-center">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10"
                style={{ backgroundImage: `url(${getFullImageUrl(currentFeed.author.profile_picture)})` }}
              ></div>
              <span className="ml-2 text-sm font-medium text-gray-700">{currentFeed.author.username}</span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 border-b border-gray-200 pb-4">
              <div className="flex items-start">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-8 w-8"
                  style={{ backgroundImage: `url(${getFullImageUrl(currentFeed.author.profile_picture)})` }}
                ></div>
                <div className="ml-2 flex-1">
                  <span className="block text-sm font-medium text-gray-700">{currentFeed.author.username}</span>
                  <span className="block text-sm text-gray-500">{currentFeed.content}</span>
                  <span className="block text-xs text-gray-400">{new Date(currentFeed.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
            {comments
              .filter(comment => !comment.parent) // 부모 댓글만 필터링
              .map(comment => (
                <div key={comment.id} className="flex flex-col mb-4">
                  <div className="flex items-start">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-8 w-8"
                      style={{ backgroundImage: `url(${getFullImageUrl(comment.user.profile_picture)})` }}
                    ></div>
                    <div className="ml-2 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="block text-sm font-medium text-gray-700">{comment.user.username}</span>
                        <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                      </div>
                      <span className="block text-sm text-gray-500">{comment.text}</span>
                      <button
                        onClick={() => handleReply(comment.user.username, comment.id)}
                        className="text-blue-500 text-xs mt-1"
                      >
                        답글 달기
                      </button>
                    </div>
                  </div>
                  {comment.replies?.length > 0 && (
                    <>
                      <button
                        onClick={() => toggleRepliesVisibility(comment.id)}
                        className="text-blue-500 text-xs mt-2 self-start"
                      >
                        {repliesVisibility[comment.id] ? '- 답글 숨기기' : `- 답글 보기 (${comment.replies.length}개)`}
                      </button>
                      {repliesVisibility[comment.id] && (
                        <div className="ml-4 mt-2">
                          {comment.replies.map((reply: { id: React.Key | null | undefined; user: { profile_picture: string; username: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }; text: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; created_at: string | number | Date; }) => (
                            <div key={reply.id} className="flex items-start mb-2">
                              <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-6 w-6"
                                style={{ backgroundImage: `url(${getFullImageUrl(reply.user.profile_picture)})` }}
                              ></div>
                              <div className="ml-2">
                                <span className="block text-sm font-medium text-gray-700">{reply.user.username}</span>
                                <span className="block text-sm text-gray-500">{reply.text}</span>
                                <span className="block text-xs text-gray-400">{new Date(reply.created_at).toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
          </div>
          <div className="p-4 border-t border-gray-300 flex items-center">
            <div className="flex flex-wrap gap-4 px-4 py-2 py-2 justify-between">
              <div className="flex items-center justify-center gap-2 px-3 py-2">
                {currentFeed.is_liked ? (
                  <button onClick={() => handleUnlike(currentFeed.id)} className="text-[#e74c3c]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
                    </svg>
                  </button>
                ) : (
                  <button onClick={() => handleLike(currentFeed.id)} className="text-[#637588]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M178,32c-20.65,0-38.73,8.88-50,23.89C116.73,40.88,98.65,32,78,32A62.07,62.07,0,0,0,16,94c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,220.66,240,164,240,94A62.07,62.07,0,0,0,178,32ZM128,206.8C109.74,196.16,32,147.69,32,94A46.06,46.06,0,0,1,78,48c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,147.61,146.24,196.15,128,206.8Z"></path>
                    </svg>
                  </button>
                )}
                <p className="text-[#637588] text-[13px] font-bold leading-normal tracking-[0.015em]">{currentFeed.like_count}</p>
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2">
                <div className="text-[#637588]" data-icon="ChatCircle" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2">
                {currentFeed.is_saved ? (
                  <button onClick={() => handleUnsave(currentFeed.id)} className="text-[#ff9800]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"
                      ></path>
                    </svg>
                  </button>
                ) : (
                  <button onClick={() => handleSave(currentFeed.id)} className="text-[#637588]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM176,88a48,48,0,0,1-96,0,8,8,0,0,1,16,0,32,32,0,0,0,64,0,8,8,0,0,1,16,0Z"
                      ></path>
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="댓글 달기..."
                className="flex-1 p-2 border rounded-lg mr-2"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                onClick={handleAddComment}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                게시
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsCommentPop;
