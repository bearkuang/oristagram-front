import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FollowerModalProps {
    onClose: () => void;
}

const getFullImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/media/')) {
        return `http://localhost:8000${url}`;
    }
    return url;
};

const FollowerModal: React.FC<FollowerModalProps> = ({ onClose }) => {
    const [followers, setFollowers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFollowers, setFilteredFollowers] = useState<any[]>([]);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get('http://localhost:8000/api/users/followers/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setFollowers(response.data);
                setFilteredFollowers(response.data);
            } catch (error) {
                console.error('Error fetching followers list:', error);
            }
        };

        fetchFollowers();
    }, []);

    useEffect(() => {
        const filtered = followers.filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredFollowers(filtered);
    }, [searchTerm, followers]);

    const handleUnfollow = async (userId: number) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(`http://localhost:8000/api/users/${userId}/unfollow/`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setFollowers(followers.filter(user => user.id !== userId));
            setFilteredFollowers(filteredFollowers.filter(user => user.id !== userId));
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[600px] h-[800px] flex flex-col rounded-2xl">
                <div className="flex items-center justify-center p-4 border-b border-gray-300 relative">
                    <span className="text-lg font-semibold">팔로워</span>
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
                    {filteredFollowers.map(user => (
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
                                onClick={() => handleUnfollow(user.id)}
                                className="bg-gray-300 text-black font-semibold px-4 py-2 rounded-lg"
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FollowerModal;
