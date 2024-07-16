import React, { useState, useEffect, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import { ImageData, CropArea } from '../../services/types';

interface ImageEditorProps {
    image: ImageData;
    onEdit: (editedImage: ImageData) => void;
    initialCrop: CropArea | null;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ image, onEdit, initialCrop }) => {
    const [crop, setCrop] = useState<Point>(initialCrop ? { x: initialCrop.x, y: initialCrop.y } : { x: 0, y: 0 });
    const [zoom, setZoom] = useState(initialCrop?.zoom || 1);
    const [aspect, setAspect] = useState(4 / 5);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    useEffect(() => {
        if (initialCrop) {
            setCrop({ x: initialCrop.x, y: initialCrop.y });
            setZoom(initialCrop.zoom);
        }
    }, [initialCrop]);

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const cropImage = useCallback(async (imageSrc: string, pixelCrop: Area) => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error('No 2d context');
        }

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        );

        return new Promise<string>((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(URL.createObjectURL(blob));
            }, 'image/jpeg');
        });
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', error => reject(error));
            image.src = url;
        });

    const handleSaveCrop = useCallback(async () => {
        if (croppedAreaPixels) {
            try {
                const croppedImageUrl = await cropImage(image.url, croppedAreaPixels);
                onEdit({
                    ...image,
                    croppedUrl: croppedImageUrl,
                    cropped: croppedImageUrl,
                    crop: { ...croppedAreaPixels, zoom },
                });
            } catch (e) {
                console.error('Error cropping image:', e);
            }
        }
    }, [cropImage, croppedAreaPixels, image, onEdit, zoom]);

    return (
        <div className="image-editor w-full h-full">
            <div className="crop-container w-full h-full">
                <Cropper
                    image={image.url}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
            </div>
            <div className="absolute bottom-4 left-4">
                <button onClick={() => setAspect(1 / 1)} className="bg-gray-200 text-black px-4 py-2 rounded ml-2">1:1</button>
                <button onClick={() => setAspect(4 / 5)} className="bg-gray-200 text-black px-4 py-2 rounded ml-2">4:5</button>
                <button onClick={() => setAspect(16 / 9)} className="bg-gray-200 text-black px-4 py-2 rounded ml-2">16:9</button>
            </div>
            <div className="absolute bottom-4 right-4">
                <button onClick={handleSaveCrop} className="bg-blue-500 text-white px-4 py-2 rounded">Save Crop</button>
            </div>
        </div>
    );
};

export default ImageEditor;