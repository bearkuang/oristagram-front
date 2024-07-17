import React, { useState, useRef } from 'react';
import ImageSelector from './ImageSelector';
import ImageEditor from './ImageEditor';
import FilterApplier from './FilterApplier';
import ImagePagination from './ImagePagination';
import { ImageData, CropArea } from '../../services/types';

interface ImageEditModalProps {
    onComplete: (images: ImageData[]) => void;
    onClose: () => void;
}

const ImageEditModal: React.FC<ImageEditModalProps> = ({ onComplete, onClose }) => {
    const [step, setStep] = useState<'select' | 'edit' | 'filter'>('select');
    const [selectedImages, setSelectedImages] = useState<ImageData[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (images: ImageData[]) => {
        setSelectedImages(images);
        setStep('edit');
    };

    const handleImageEdit = (editedImage: ImageData) => {
        console.log('Saving crop for image:', currentImageIndex, editedImage.crop);
        setSelectedImages(prevImages => {
            const newImages = [...prevImages];
            newImages[currentImageIndex] = editedImage;
            return newImages;
        });
    };

    const handleSaveFilter = (index: number, filter: string) => {
        setSelectedImages(prevImages => {
            const newImages = [...prevImages];
            newImages[index] = { ...newImages[index], filter: filter };
            return newImages;
        });
    };

    const handleFilterApply = (filteredImages: ImageData[]) => {
        setSelectedImages(filteredImages);
    };

    const handlePrevImage = () => {
        setCurrentImageIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : selectedImages.length - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prevIndex => (prevIndex < selectedImages.length - 1 ? prevIndex + 1 : 0));
    };

    const handleNext = () => {
        if (step === 'edit') {
            setStep('filter');
        } else if (step === 'filter') {
            onComplete(selectedImages);
        }
    };

    const handleBack = () => {
        if (step === 'edit') {
            setStep('select');
        } else if (step === 'filter') {
            setStep('edit');
        } else {
            onClose();
        }
    };

    const handleAddMoreImages = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[1102px] h-[694px] flex flex-col rounded-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    X
                </button>
                <div className="flex justify-between items-center p-4 border-b w-full">
                    <button onClick={handleBack}>
                        {step === 'select' ? 'X' : '뒤로'}
                    </button>
                    <span className="mx-auto">{step === 'select' ? '새 게시물 만들기' : step === 'edit' ? '자르기' : '필터'}</span>
                    {step !== 'select' && (
                        <button onClick={handleNext}>
                            {step === 'filter' ? '완료' : '다음'}
                        </button>
                    )}
                </div>
                <div className="flex-grow flex flex-col">
                    <div className="flex-grow relative">
                        {step === 'select' && (
                            <div className="w-full h-full flex items-center justify-center">
                                <ImageSelector onSelect={handleImageSelect} />
                            </div>
                        )}
                        {step === 'edit' && (
                            <>
                                <ImageEditor
                                    image={selectedImages[currentImageIndex]}
                                    onEdit={handleImageEdit}
                                    initialCrop={selectedImages[currentImageIndex].crop || null}
                                />
                                <button
                                    onClick={handlePrevImage}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 z-10"
                                >
                                    &#8249;
                                </button>
                                <button
                                    onClick={handleNextImage}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 z-10"
                                >
                                    &#8250;
                                </button>
                                <div className="absolute bottom-4 right-4 flex items-center">
                                    <button onClick={handleAddMoreImages} className="bg-blue-500 text-white px-4 py-2 rounded">
                                        +
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const newImages: ImageData[] = Array.from(e.target.files).map(file => ({
                                                    file,
                                                    url: URL.createObjectURL(file),
                                                    cropped: URL.createObjectURL(file),
                                                    filter: 'none'
                                                }));
                                                setSelectedImages(prev => [...prev, ...newImages]);
                                            }
                                        }}
                                        className="hidden"
                                        ref={fileInputRef}
                                    />
                                </div>
                            </>
                        )}
                        {step === 'filter' && (
                            <FilterApplier
                                images={selectedImages}
                                currentIndex={currentImageIndex}
                                onApply={handleFilterApply}
                                onPrevImage={handlePrevImage}
                                onNextImage={handleNextImage}
                                onSaveFilter={handleSaveFilter}
                            />
                        )}
                    </div>
                    {step !== 'select' && (
                        <div className="flex-shrink-0">
                            <ImagePagination totalImages={selectedImages.length} currentIndex={currentImageIndex} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageEditModal;