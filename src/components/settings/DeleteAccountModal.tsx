import React from 'react';

interface DeleteAccountModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">계정 삭제 확인</h2>
                <p className="mb-4">
                    정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
                </p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-2 px-4 py-2 bg-gray-300 text-black rounded"
                    >
                        취소
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        삭제 확인
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;