import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../context/RegisterContext';
import axios from 'axios';

const SettingProfilePage: React.FC = () => {
    const { state, dispatch } = useRegister();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', state.username);
            formData.append('email', state.email);
            formData.append('password', state.password);
            formData.append('name', state.name);
            formData.append('birth_date', state.birth_date);
            if (state.profile_picture) formData.append('profile_picture', state.profile_picture);
            formData.append('website', state.website);
            formData.append('bio', state.bio);

            await axios.post('/api/auth/register/', formData);

            navigate('/');
        } catch (error) {
            console.error('Error during registration:', error);
            setLoading(false);
        }
    };

    const handleToLogin = () => {
        navigate('/');
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="bg-white p-8 shadow rounded-lg">
                    <div className="flex justify-center">
                        <label htmlFor="profilePictureInput" className="relative cursor-pointer">
                            <input
                                type="file"
                                id="profilePictureInput"
                                className="hidden"
                                onChange={e => dispatch({ type: 'SET_PROFILE_PICTURE', file: e.target.files?.[0] || null })}
                            />
                            <img
                                src={state.profile_picture ? URL.createObjectURL(state.profile_picture) : "/image/icon-camera.png"}
                                alt="Profile"
                                className="h-32 w-32 rounded-full object-cover border-2 border-gray-300"
                            />
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                                <span className="text-white">사진 선택</span>
                            </div>
                        </label>
                    </div>
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">프로필 설정</h2>
                    <form className="space-y-6 mt-10" onSubmit={e => e.preventDefault()}>
                        <div>
                            <input
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="웹사이트"
                                value={state.website}
                                onChange={e => dispatch({ type: 'SET_FIELD', field: 'website', value: e.target.value })}
                            />
                        </div>
                        <div>
                            <textarea
                                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="소개"
                                value={state.bio}
                                onChange={e => dispatch({ type: 'SET_FIELD', field: 'bio', value: e.target.value })}
                            />
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="flex w-full justify-center rounded-md bg-sky-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                disabled={loading}
                            >
                                가입
                            </button>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => navigate('/register/birth')}
                                className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-blue-500 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                돌아가기
                            </button>
                        </div>
                    </form>
                </div>
                <div className="bg-white p-4 shadow rounded-lg mt-4">
                    <p className="text-center text-sm text-blue-500 font-semibold cursor-pointer" onClick={handleToLogin}>
                        이미 계정이 있으신가요?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SettingProfilePage;
