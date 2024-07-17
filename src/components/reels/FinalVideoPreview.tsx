import React, { useRef, useEffect } from 'react';

interface FinalVideoPreviewProps {
    video: File;
    duration: { start: number; end: number; };
}

const FinalVideoPreview: React.FC<FinalVideoPreviewProps> = ({ video, duration }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.src = URL.createObjectURL(video);
            videoRef.current.currentTime = duration.start;
        }
    }, [video, duration]);

    const handleTimeUpdate = () => {
        if (videoRef.current && videoRef.current.currentTime >= duration.end) {
            videoRef.current.currentTime = duration.start;
        }
    };

    return (
        <video
            ref={videoRef}
            onTimeUpdate={handleTimeUpdate}
            controls
            className="max-w-full max-h-full"
        />
    );
};

export default FinalVideoPreview;