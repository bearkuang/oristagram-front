import React from 'react';

interface ProfilePictureModalProps {
    onClose: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onResetPicture: () => void;
}

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({ onClose, onFileChange, onResetPicture }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[1000]">
            <div className="bg-white p-4 rounded-lg shadow-lg w-80 relative z-60">
                <h2 className="flex justify-center text-lg font-semibold mb-4">프로필 사진 바꾸기</h2>
                <button
                    className="w-full text-blue-500 font-semibold py-2 rounded mb-2 border-t cursor-pointer"
                    onClick={() => document.getElementById('fileInput')?.click()}
                >
                    사진 변경
                </button>
                <input
                    type="file"
                    id="fileInput"
                    className="hidden"
                    onChange={onFileChange}
                />
                <button
                    className="w-full text-gray-500 font-semibold py-2 rounded mb-2 border-t cursor-pointer"
                    onClick={onResetPicture}
                >
                    기본 프로필로 변경
                </button>
                <button
                    className="w-full text-red-500 font-semibold py-2 rounded border-t cursor-pointer"
                    onClick={onClose}
                >
                    취소
                </button>
            </div>
        </div>
    );
};

export default ProfilePictureModal;