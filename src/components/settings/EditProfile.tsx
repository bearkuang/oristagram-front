import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../services/utils';
import ProfilePictureModal from './ProfilePictureModal';

interface User {
    id: number;
    username: string;
    name: string;
    profile_picture: string;
    bio: string;
    birth_date: string;
    website: string;
}

interface EditProfileProps {
    currentUser: User;
    onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ currentUser, onClose }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [name, setName] = useState<string>('');
    const [website, setWebsite] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [isFormDirty, setIsFormDirty] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);  // 모달 상태 추가

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`/api/users/${currentUser.id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const userData = response.data;
                setUser(userData);
                setName(userData.name);
                setWebsite(userData.website);
                setBio(userData.bio);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        fetchUserProfile();
    }, [currentUser.id]);

    useEffect(() => {
        if (user) {
            setIsFormDirty(name !== user.name || website !== user.website || bio !== user.bio);
        }
    }, [name, website, bio, user]);

    const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            setProfilePicture(selectedFile);

            // 바로 프로필 사진 업데이트
            const token = localStorage.getItem('accessToken');
            const formData = new FormData();
            formData.append('profile_picture', selectedFile);

            try {
                await axios.patch(`/api/users/${currentUser.id}/`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });

                alert('Profile picture updated successfully');
                setIsModalOpen(false);  // 모달 닫기
            } catch (error) {
                console.error('Error updating profile picture:', error);
            }
        }
    };

    const handleResetProfilePicture = async () => {
        try {
            const token = localStorage.getItem('accessToken');

            await axios.patch(`/api/users/${currentUser.id}/`, {
                profile_picture: null
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Profile picture reset to default');
            setIsModalOpen(false);  // 모달 닫기
        } catch (error) {
            console.error('Error resetting profile picture:', error);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('accessToken');
            const formData = new FormData();
            formData.append('name', name);
            formData.append('website', website);
            formData.append('bio', bio);

            await axios.patch(`/api/users/${currentUser.id}/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex w-full max-w-lg justify-start">
                <h1 className="text-2xl font-bold mb-4">프로필 편집</h1>
            </div>
            <form className="w-full max-w-lg mt-3" onSubmit={handleFormSubmit}>
                <div className="flex items-center mb-6 bg-gray-100 rounded-xl p-4 justify-between">
                    <div className="flex items-center">
                        <img
                            src={getFullImageUrl(user.profile_picture)}
                            alt={`${user.username}'s profile`}
                            className="w-16 h-16 rounded-full object-cover mr-4"
                        />
                        <div className="flex flex-col">
                            <span className="font-semibold">{user.username}</span>
                        </div>
                    </div>
                    <button type="button" onClick={() => setIsModalOpen(true)} className="text-white font-semibold bg-blue-500 rounded px-2 py-1">
                        사진 변경
                    </button>
                </div>
                {isModalOpen && (
                    <ProfilePictureModal
                        onClose={() => setIsModalOpen(false)}
                        onFileChange={handleProfilePictureChange}
                        onResetPicture={handleResetProfilePicture}
                    />
                )}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-semibold mb-2">이름</label>
                    <input
                        type="text"
                        id="name"
                        className="w-full border rounded p-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="website" className="block text-sm font-semibold mb-2">웹사이트</label>
                    <input
                        type="text"
                        id="website"
                        className="w-full border rounded p-2"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="bio" className="block text-sm font-semibold mb-2">소개</label>
                    <input
                        type="text"
                        id="bio"
                        className="w-full border rounded p-2"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white font-semibold px-4 py-2 rounded ${isFormDirty ? '' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={!isFormDirty}
                    >
                        제출
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile;
