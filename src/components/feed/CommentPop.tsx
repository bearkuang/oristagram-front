import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CommentPopProps {
  feed: any;
  onClose: () => void;
}

const getFullImageUrl = (url: string) => {
  if (url.startsWith('/media/')) {
    return `http://localhost:8000${url}`;
  }
  return url;
};

const CommentPop: React.FC<CommentPopProps> = ({ feed, onClose }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:8000/api/posts/${feed.id}/comments/`, {
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
  }, [feed.id]);

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`http://localhost:8000/api/posts/${feed.id}/comment/`, { content: newComment }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setComments([...comments, response.data]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[1102px] h-[694px] flex">
        <div className="w-[702px] bg-center bg-no-repeat bg-cover" style={{ backgroundImage: `url(${getFullImageUrl(feed.image)})` }} />
        <div className="w-[400px] bg-white flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-300">
            <div className="flex items-center">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10"
                style={{ backgroundImage: `url(${getFullImageUrl(feed.author.profile_picture)})` }}
              ></div>
              <span className="ml-2 text-sm font-medium text-gray-700">{feed.author.username}</span>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {comments.map(comment => (
              <div key={comment.id} className="flex items-start mb-4">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-8 w-8"
                  style={{ backgroundImage: `url(${getFullImageUrl(comment.user.profile_picture)})` }}
                ></div>
                <div className="ml-2">
                  <span className="block text-sm font-medium text-gray-700">{comment.user.username}</span>
                  <span className="block text-sm text-gray-500">{comment.content}</span>
                  <span className="block text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-300 flex items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 p-2 border rounded-lg mr-2"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
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
  );
};

export default CommentPop;
