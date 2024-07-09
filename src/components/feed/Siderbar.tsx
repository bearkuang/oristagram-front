import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getFullImageUrl } from '../../services/utils';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<{ tags: any[], users: any[] }>({ tags: [], users: [] });
    const navigate = useNavigate();

    useEffect(() => {
        if (searchTerm === '') {
            setSearchResults({ tags: [], users: [] });
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

            if (searchTerm.startsWith('#')) {
                const query = searchTerm.slice(1);
                try {
                    const response = await axios.get(`http://localhost:8000/api/search/tags/?q=${query}`, config);
                    setSearchResults({ tags: response.data, users: [] });
                } catch (error) {
                    console.error('Error fetching tags:', error);
                }
            } else {
                try {
                    const response = await axios.get(`http://localhost:8000/api/search/usernames/?q=${searchTerm}`, config);
                    setSearchResults({ tags: [], users: response.data });
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
        };

        fetchData();
    }, [searchTerm]);

    const handleTagClick = (tag: string) => {
        navigate(`/tagged/${tag}`);
        onClose();
    };

    const handleUserClick = (userId: number) => {
        navigate(`/user/${userId}`);
        onClose();
    };

    return (
        <div
            className={`fixed top-0 left-0 w-80 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            style={{ zIndex: 50, display: isOpen ? 'block' : 'none', marginLeft: '240px' }}
        >
            <div className="flex justify-between items-center p-4 border-b border-gray-300">
                <h2 className="text-xl font-bold">Explore</h2>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M200.49,55.51a12,12,0,0,0-17,0L128,110.05,72.49,55.51a12,12,0,0,0-17,17L110.05,128,55.51,183.51a12,12,0,1,0,17,17L128,145.95l55.51,55.56a12,12,0,0,0,17-17L145.95,128l55.56-55.51A12,12,0,0,0,200.49,55.51Z"></path>
                    </svg>
                </button>
            </div>
            <div className="p-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Search..."
                />
                <div className="mt-4">
                    {searchResults.tags.length > 0 && (
                        <div>
                            <ul>
                                {searchResults.tags.map((tag) => (
                                    <li key={tag.id} className="py-2 border-b border-gray-300 cursor-pointer" onClick={() => handleTagClick(tag.name)}>#{tag.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {searchResults.users.length > 0 && (
                        <div>
                            <ul>
                                {searchResults.users.map((user) => (
                                    <li key={user.id} className="flex items-center py-2 border-b border-gray-300 cursor-pointer" onClick={() => handleUserClick(user.id)}>
                                        <div
                                            className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8 mr-2"
                                            style={{
                                                backgroundImage: `url(${getFullImageUrl(user.profile_picture) || '/image/default_profile_image.png'})`,
                                            }}
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
            </div>
        </div>
    );
};

export default Sidebar;
