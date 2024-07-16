import React from 'react';

interface ImagePaginationProps {
    totalImages: number;
    currentIndex: number;
}

const ImagePagination: React.FC<ImagePaginationProps> = ({ totalImages, currentIndex }) => {
    return (
        <div className="flex justify-center items-center p-4">
            {Array.from({ length: totalImages }).map((_, index) => (
                <div
                    key={index}
                    className={`w-2 h-2 rounded-full mx-1 ${index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                />
            ))}
        </div>
    );
};

export default ImagePagination;