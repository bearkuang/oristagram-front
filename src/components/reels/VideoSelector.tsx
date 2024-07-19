import React, { useRef, useState } from 'react';
import CreateReels from './CreateReels';

interface VideoSelectorProps {
    onClose: () => void;
}

const VideoSelector: React.FC<VideoSelectorProps> = ({ onClose }) => {
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedVideo(e.target.files[0]);
        }
    };

    const handleBack = () => {
        setSelectedVideo(null);
    };

    if (selectedVideo) {
        return <CreateReels video={selectedVideo} onClose={onClose} onBack={handleBack} />;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-200 hover:text-gray-700">
                X
            </button>
            <div className="bg-white w-[1102px] h-[694px] flex flex-col rounded-lg relative">
                <div className="flex justify-center items-center h-full">
                    <div className="text-center">
                        <h3 className="text-xl mb-4">새 릴스 만들기</h3>
                        <div className="flex flex-col items-center justify-center border-dashed border-4 border-gray-300 rounded-lg p-8">
                            <img src="/image/icon-add-video.png" alt="Upload" className="mb-4 w-32 h-32" />
                            <p className="text-gray-500 mb-4">동영상을 여기에 끌어다 놓으세요</p>
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
                                accept="video/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoSelector;