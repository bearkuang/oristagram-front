import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FollowModalProps {
    onClose: () => void;
}

const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/media/')) {
        return `http://localhost:8000${url}`;
    }
    return url;
};

const FollowModal: React.FC<FollowModalProps> = ({ onClose }) => {
    const [following, setFollowing] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFollowing, setFilteredFollowing] = useState<any[]>([]);
    const [isUnfollowModalOpen, setIsUnfollowModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:8000/api/users/following/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFollowing(response.data);
                setFilteredFollowing(response.data);
            } catch (error) {
                console.error('Error fetching following list:', error);
            }
        };

        fetchFollowing();
    }, []);

    useEffect(() => {
        const filtered = following.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFollowing(filtered);
    }, [searchTerm, following]);

    const handleUnfollow = async (userId: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`http://localhost:8000/api/follows/${userId}/unfollows/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            setFollowing(following.filter(user => user.id !== userId));
            setFilteredFollowing(filteredFollowing.filter(user => user.id !== userId));
            setIsUnfollowModalOpen(false);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    const openUnfollowModal = (user: any) => {
        setSelectedUser(user);
        setIsUnfollowModalOpen(true);
    };

    const closeUnfollowModal = () => {
        setIsUnfollowModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[600px] h-[800px] flex flex-col rounded-2xl">
                <div className="flex items-center justify-center p-4 border-b border-gray-300 relative">
                    <span className="text-lg font-semibold">팔로잉</span>
                    <button onClick={onClose} className="absolute right-4 text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 border-b border-gray-300">
                    <input
                        type="text"
                        placeholder="Search username..."
                        className="w-full p-2 border rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {filteredFollowing.map(user => (
                        <div key={user.id} className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10"
                                    style={{ backgroundImage: `url(${getFullImageUrl(user.profile_picture)})` }}
                                ></div>
                                <div className="ml-2">
                                    <span className="block text-sm font-medium text-gray-700">{user.username}</span>
                                    <span className="block text-sm text-gray-500">{user.name}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => openUnfollowModal(user)}
                                className="bg-gray-300 text-black font-semibold px-4 py-2 rounded-lg"
                            >
                                팔로잉
                            </button>
                        </div>
                    ))}
                </div>
                {isUnfollowModalOpen && selectedUser && (
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white w-[400px] p-6 rounded-lg flex flex-col items-center">
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 mb-4"
                                style={{ backgroundImage: `url(${getFullImageUrl(selectedUser.profile_picture)})` }}
                            ></div>
                            <p className="text-center mb-4">생각이 바뀌면 {selectedUser.username}님의 팔로우를 다시 요청할 수 있습니다.</p>
                            <div className="w-full border-t border-gray-300 mt-4">
                                <button
                                    onClick={() => handleUnfollow(selectedUser.id)}
                                    className="w-full text-red-400 font-semibold px-4 py-2 border-b border-gray-300"
                                >
                                    팔로우 취소
                                </button>
                                <button
                                    onClick={closeUnfollowModal}
                                    className="w-full text-gray-600 font-semibold px-4 py-2"
                                >
                                    취소
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FollowModal;
