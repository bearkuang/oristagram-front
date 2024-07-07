import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DeactivatedAccountModalProps {
    tempToken: string;
    onClose: () => void;
}

const DeactivatedAccountModal: React.FC<DeactivatedAccountModalProps> = ({ tempToken, onClose }) => {
    const navigate = useNavigate();

    const handleReactivate = () => {
        localStorage.setItem('tempToken', tempToken);
        navigate('/settings');
        onClose();
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Account Deactivated</h2>
                <p className="mb-4">계정이 현재 비활성화 상태입니다. 계정을 활성화 하거나 탈퇴를 원하시면 이동해주세요.</p>
                <div className="flex justify-end">
                    <button
                        className="mr-2 px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={handleReactivate}
                    >
                        설정으로 이동하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeactivatedAccountModal;