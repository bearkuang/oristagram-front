import React, { useState, useEffect } from 'react';
import { ImageData } from '../../services/types';
import ImagePagination from './ImagePagination';

interface FilterApplierProps {
    images: ImageData[];
    currentIndex: number;
    onApply: (filteredImages: ImageData[]) => void;
    onPrevImage: () => void;
    onNextImage: () => void;
    onSaveFilter: (index: number, filter: string) => void;
}

const filters = [
    { name: 'Normal', class: '' },
    { name: 'Grayscale', class: 'grayscale' },
    { name: 'Sepia', class: 'sepia' },
    { name: 'Invert', class: 'invert' },
    { name: 'Brightness', class: 'brightness' },
    { name: 'Contrast', class: 'contrast' },
    { name: 'Sharpness', class: 'sharpness' },
    { name: 'Blur', class: 'blur' },
    { name: 'Emboss', class: 'emboss' },
    { name: 'Edge Enhance', class: 'edge_enhance' },
];

const FilterApplier: React.FC<FilterApplierProps> = ({ images, currentIndex, onApply, onPrevImage, onNextImage, onSaveFilter }) => {
    const [filteredImages, setFilteredImages] = useState<ImageData[]>(images);
    const [selectedFilter, setSelectedFilter] = useState('');

    useEffect(() => {
        setSelectedFilter(filteredImages[currentIndex].filter || '');
    }, [currentIndex, filteredImages]);

    const applyFilter = (filterClass: string) => {
        setSelectedFilter(filterClass);
        const updatedImages = filteredImages.map((img, index) =>
            index === currentIndex ? { ...img, filter: filterClass } : img
        );
        setFilteredImages(updatedImages);
        onApply(updatedImages);
    };

    const handleSaveFilter = () => {
        onSaveFilter(currentIndex, selectedFilter);
    };

    return (
        <div className="filter-applier w-full h-full flex flex-col">
            <div className="flex-grow flex">
                <div className="image-container w-3/4 h-full flex items-center justify-center relative overflow-hidden">
                    <div className="relative w-full h-[600px] flex items-center justify-center">
                        <img
                            src={filteredImages[currentIndex].croppedUrl || filteredImages[currentIndex].url}
                            alt="Filtered"
                            className={`max-w-full max-h-full object-contain ${selectedFilter}`}
                            style={{
                                width: 'auto',
                                height: 'auto',
                                maxWidth: '100%',
                                maxHeight: '100%',
                            }}
                        />
                    </div>
                    <button onClick={onPrevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 z-10">
                        &#8249;
                    </button>
                    <button onClick={onNextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 z-10">
                        &#8250;
                    </button>
                </div>
                <div className="filter-options w-1/4 h-full overflow-y-auto flex flex-col items-center p-4">
                    {filters.map((filter) => (
                        <button
                            key={filter.name}
                            onClick={() => applyFilter(filter.class)}
                            className={`mb-2 p-2 w-full text-center ${selectedFilter === filter.class ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {filter.name}
                        </button>
                    ))}
                    <button
                        onClick={handleSaveFilter}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                    >
                        필터 적용
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterApplier;