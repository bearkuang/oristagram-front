import React, { useState, useRef, useEffect } from 'react';

interface VideoEditModalProps {
    video: File;
    onComplete: (editedVideo: File, selectedDuration: { start: number; end: number; }) => void;
    onClose: () => void;
}

const VideoEditModal: React.FC<VideoEditModalProps> = ({ video, onComplete, onClose }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.src = URL.createObjectURL(video);
            videoRef.current.onloadedmetadata = () => {
                if (videoRef.current) {
                    setDuration(videoRef.current.duration);
                    setEndTime(videoRef.current.duration);
                }
            };
        }
    }, [video]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartTime = parseFloat(e.target.value);
        setStartTime(newStartTime);
        if (videoRef.current) {
            videoRef.current.currentTime = newStartTime;
        }
    };

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndTime = parseFloat(e.target.value);
        setEndTime(newEndTime);
    };

    const handleNext = () => {
        onComplete(video, { start: startTime, end: endTime });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" >
            <div className="bg-white w-[1102px] h-[694px] flex flex-col rounded-lg relative">
                <div className="flex justify-between items-center p-4 border-b">
                    <button onClick={onClose}>뒤로</button>
                    <span>새 릴스 등록</span>
                    <button onClick={handleNext}>다음</button>
                </div>
                <div className="flex flex-1">
                    <div className="w-3/4 h-full flex items-center justify-center bg-black overflow-hidden">
                        <div className="w-full h-full max-h-[600px] flex items-center justify-center">
                            <video
                                ref={videoRef}
                                onTimeUpdate={handleTimeUpdate}
                                controls
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    </div>
                    <div className="w-1/4 h-full p-4 flex flex-col justify-start">
                        <div className="mb-4">
                            <label className="block mb-2">시작 시간: {startTime.toFixed(2)}초</label>
                            <input
                                type="range"
                                min="0"
                                max={duration}
                                step="0.1"
                                value={startTime}
                                onChange={handleStartTimeChange}
                                className="w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">종료 시간: {endTime.toFixed(2)}초</label>
                            <input
                                type="range"
                                min="0"
                                max={duration}
                                step="0.1"
                                value={endTime}
                                onChange={handleEndTimeChange}
                                className="w-full"
                            />
                        </div>
                        <div>총 길이: {(endTime - startTime).toFixed(2)}초</div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default VideoEditModal;