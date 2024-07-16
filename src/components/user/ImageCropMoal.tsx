import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';

interface ImageCropModalProps {
    image: string;
    onCropComplete: (croppedAreaPixels: Area) => void;
    onClose: () => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({ image, onCropComplete, onClose }) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropChange = (crop: Point) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteHandler = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropConfirm = () => {
        if (croppedAreaPixels) {
            onCropComplete(croppedAreaPixels);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg w-96 h-96">
                <div className="relative h-64">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onCropComplete={onCropCompleteHandler}
                    />
                </div>
                <div className="mt-4 flex justify-between">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">취소</button>
                    <button onClick={handleCropConfirm} className="px-4 py-2 bg-blue-500 text-white rounded">확인</button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropModal;