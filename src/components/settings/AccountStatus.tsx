import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DeleteAccountModal from './DeleteAccountModal';

interface AccountStatusProps {
    currentUser: {
        id: number;
        username: string;
        name: string;
        profile_picture: string;
        is_active: boolean;
    };
    onClose: () => void;
}

const AccountStatus: React.FC<AccountStatusProps> = ({ currentUser, onClose }) => {
    const navigate = useNavigate();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        console.log(currentUser);
    })

    const handleToggleActivation = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const endpoint = currentUser.is_active ? 'deactivate' : 'reactivate_account';
            await axios.post(`/api/users/${endpoint}/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(currentUser.is_active ? '계정이 비활성화되었습니다.' : '계정이 재활성화되었습니다.');
            navigate('/feed');
        } catch (error) {
            console.error('계정 상태 변경 오류:', error);
            alert('계정 상태 변경에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex w-full max-w-lg justify-start">
                <h1 className="text-2xl font-bold mb-4">계정 상태</h1>
            </div>
            <div className="w-full max-w-lg mt-3">
                <div className="mb-6 bg-gray-100 rounded-xl p-4">
                    <h2 className="text-xl font-semibold mb-2">계정 활성화 상태</h2>
                    <p className="mb-4">현재 계정 상태: {currentUser.is_active ? '비활성화' : '활성화'}</p>
                    <button
                        onClick={handleToggleActivation}
                        className={`px-4 py-2 rounded text-white font-semibold ${currentUser.is_active ? 'bg-yellow-500' : 'bg-blue-500'}`}
                    >
                        {currentUser.is_active ? '계정 재활성화' : '계정 비활성화'}
                    </button>
                </div>
                <div className="mb-6 bg-gray-100 rounded-xl p-4">
                    <h2 className="text-xl font-semibold mb-2">계정 삭제</h2>
                    <p className="mb-4">계정을 영구적으로 삭제하려면 아래 버튼을 클릭하세요. 이 작업은 되돌릴 수 없습니다.</p>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="bg-red-500 text-white font-semibold px-4 py-2 rounded"
                    >
                        계정 삭제
                    </button>
                </div>
            </div>
            {isDeleteModalOpen && (
                <DeleteAccountModal
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={() => {/* 계정 삭제 로직 */ }}
                />
            )}
        </div>
    );
};

export default AccountStatus;