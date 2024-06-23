import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../services/utils';

interface CommentBubbleProps {
    reelsId: number;
    onClose: () => void;
}

interface User {
    id: number;
    username: string;
    profile_picture: string;
}

interface Comment {
    id: number;
    user: User;
    text: string;
    created_at: string;
}

const CommentBubble: React.FC<CommentBubbleProps> = ({ reelsId, onClose }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState('');
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://localhost:8000/api/reels/${reelsId}/comments/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
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

        fetchComments();
        fetchCurrentUser();
    }, [reelsId]);

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(`http://localhost:8000/api/reels/${reelsId}/comment/`, {
                text: commentText
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                setComments((prevComments) => [...prevComments, response.data]);
                setCommentText('');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4 relative">
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                    <h3 className="text-lg font-bold">댓글</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col space-y-4 mb-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10"
                                style={{ backgroundImage: `url(${getFullImageUrl(comment.user.profile_picture)})` }}
                            ></div>
                            <div className="flex flex-col">
                                <span className="font-bold">{comment.user.username}</span>
                                <span>{comment.text}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center space-x-3">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10"
                        style={currentUser ? { backgroundImage: `url(${getFullImageUrl(currentUser.profile_picture)})` } : {}}
                    ></div>
                    <input
                        type="text"
                        placeholder="댓글 달기..."
                        className="flex-1 p-2 border rounded-lg"
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
        </div>
    );
};

export default CommentBubble;
