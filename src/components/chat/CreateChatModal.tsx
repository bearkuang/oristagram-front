import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../services/utils';

interface CreateChatModalProps {
    onClose: () => void;
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<{ users: any[] }>({ users: [] });
    const [selectedUser, setSelectedUser] = useState<any | null>(null);

    useEffect(() => {
        if (searchTerm === '') {
            setSearchResults({ users: [] });
            return;
        }

        const fetchData = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                console.error('No token found, redirecting to login...');
                return;
            }

            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            try {
                const response = await axios.get(`http://localhost:8000/api/search/usernames/?q=${searchTerm}`, config);
                setSearchResults({ users: response.data });
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchData();
    }, [searchTerm]);

    const handleUserClick = (user: any) => {
        setSelectedUser(user);
    };

    const handleCreateChat = async () => {
        if (!selectedUser) return;

        const token = localStorage.getItem('accessToken');
        if (!token) {
            console.error('No token found, redirecting to login...');
            return;
        }

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            const response = await axios.post('http://localhost:8000/api/chatrooms/create/', { user_id: selectedUser.id }, config);
            onClose();
        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-[60]">
            <div className="bg-white w-[600px] h-[800px] flex flex-col rounded-2xl">
                <div className="flex items-center justify-center p-4 border-b border-gray-300 relative">
                    <span className="text-lg font-semibold">새로운 메시지</span>
                    <button onClick={onClose} className="absolute right-4 text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 border-b border-gray-300">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="검색"
                    />
                </div>
                <div className="p-4 border-b border-gray-300">
                    <span className="font-semibold">받는 사람:</span>
                    {selectedUser && (
                        <span className="ml-2 text-blue-500">{selectedUser.username}</span>
                    )}
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {searchResults.users.length > 0 && (
                        <div>
                            <ul>
                                {searchResults.users.map((user) => (
                                    <li key={user.id} className="flex items-center py-2 border-b border-gray-300 cursor-pointer" onClick={() => handleUserClick(user)}>
                                        <div
                                            className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8 mr-2"
                                            style={{ backgroundImage: `url(${getFullImageUrl(user.profile_picture)})` }}
                                        ></div>
                                        <div>
                                            <p className="font-semibold">{user.username}</p>
                                            <p className="text-gray-600 text-sm">{user.name}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleCreateChat}
                    className="w-full text-red-400 font-semibold px-4 py-2 border-t border-gray-300"
                    disabled={!selectedUser}
                >
                    채팅
                </button>
            </div>
        </div>
    );
};

export default CreateChatModal;
