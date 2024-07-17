import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../services/utils';
import VideoEditModal from './VideoEditModal';
import FinalVideoPreview from './FinalVideoPreview';

interface User {
    id: number;
    username: string;
    profile_picture: string;
}

interface CreateReelsProps {
    video: File;
    onClose: () => void;
    onBack: () => void;
}

const CreateReels: React.FC<CreateReelsProps> = ({ video, onClose, onBack }) => {
    const [step, setStep] = useState<'edit' | 'post'>('edit');
    const [editedVideo, setEditedVideo] = useState<File>(video);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [content, setContent] = useState('');
    const [duration, setDuration] = useState<{ start: number, end: number } | null>(null);

    const handleVideoEditComplete = (editedVideo: File, selectedDuration: { start: number, end: number }) => {
        setEditedVideo(editedVideo);
        setDuration(selectedDuration);
        setStep('post');
    };

    const handleCreatePost = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const formData = new FormData();
            formData.append('content', content);
            formData.append('files', editedVideo, 'video.mp4');
            if (duration) formData.append('duration', JSON.stringify(duration));

            const response = await axios.post('http://localhost:8000/api/reels/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                console.log('Reels created successfully:', response.data);
                onClose();
            }
        } catch (error) {
            console.error('Error creating reels:', error);
        }
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:8000/api/users/me/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[1102px] h-[694px] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-300">
                    <button onClick={step === 'edit' ? onBack : () => setStep('edit')} className="text-gray-500 hover:text-gray-700">
                        뒤로
                    </button>
                    <span className="text-lg font-medium">새 릴스 등록</span>
                    {step === 'post' && (
                        <button onClick={handleCreatePost} className="text-blue-500 px-4 py-2">
                            게시
                        </button>
                    )}
                </div>
                <div className="flex flex-1 overflow-hidden">
                    {step === 'edit' ? (
                        <VideoEditModal video={editedVideo} onComplete={handleVideoEditComplete} onClose={onBack} />
                    ) : (
                        <>
                            <div className="w-[702px] flex items-center justify-center bg-black relative">
                                {duration && (
                                    <FinalVideoPreview video={editedVideo} duration={duration} />
                                )}
                            </div>
                            <div className="w-[400px] bg-white flex flex-col">
                                <div className="flex items-center p-4 border-b border-gray-300">
                                    {currentUser ? (
                                        <div
                                            className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10"
                                            style={{ backgroundImage: `url(${getFullImageUrl(currentUser.profile_picture)})` }}
                                        ></div>
                                    ) : (
                                        <div className="text-[#111418]" data-icon="User" data-size="24px" data-weight="regular">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                                                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                                            </svg>
                                        </div>
                                    )}
                                    <span className="ml-2 text-sm font-medium text-gray-700">{currentUser?.username}</span>
                                </div>
                                <textarea
                                    className="p-4 border-b border-gray-300 flex-1 resize-none"
                                    placeholder="문구 입력..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateReels;