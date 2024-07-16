import React, { useRef } from 'react';
import { ImageData } from '../../services/types';

interface ImageSelectorProps {
    onSelect: (images: ImageData[]) => void;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const imageDataArray: ImageData[] = Array.from(e.target.files).map(file => ({
                file,
                url: URL.createObjectURL(file),
                cropped: URL.createObjectURL(file),
                filter: 'none'
            }));
            onSelect(imageDataArray);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h3 className="text-xl mb-4">새 게시물 만들기</h3>
            <div className="flex flex-col items-center justify-center border-dashed border-4 border-gray-300 rounded-lg p-8">
                <img src="/image/icon-add-photo.png" alt="Upload" className="mb-4 w-32 h-32" />
                <p className="text-gray-500 mb-4">사진과 동영상을 여기에 끌어다 놓으세요</p>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    컴퓨터에서 선택
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                />
            </div>
        </div>
    );
};

export default ImageSelector;
