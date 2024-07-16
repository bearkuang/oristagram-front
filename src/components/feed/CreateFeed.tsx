import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../services/utils';
import ImageEditModal from './ImageEditModal';
import { ImageData } from '../../services/types';

interface User {
  id: number;
  username: string;
  profile_picture: string;
}

interface CreateFeedProps {
  onClose: () => void;
}

const CreateFeed: React.FC<CreateFeedProps> = ({ onClose }) => {
  const [step, setStep] = useState<'edit' | 'post'>('edit');
  const [editedImages, setEditedImages] = useState<ImageData[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [content, setContent] = useState('');
  const [site, setSite] = useState('');

  const applyFilterToImage = async (imageData: ImageData): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.filter = imageData.filter || 'none';
        console.log(`Applying filter: ${ctx.filter}`);
        ctx.drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob((blob) => {
          if (blob) {
            console.log('Blob created:', blob);
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/jpeg');
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageData.cropped as string;
    });
  };

  const handleCreatePost = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('content', content);
      formData.append('site', site);

      for (let i = 0; i < editedImages.length; i++) {
        console.log(`Processing image ${i} with filter ${editedImages[i].filter}`);
        const filteredBlob = await applyFilterToImage(editedImages[i]);
        formData.append('files', filteredBlob, `image${i}.jpg`);
        console.log(`Appended image ${i} to formData`);
      }

      // Debugging FormData content
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      const response = await axios.post('http://localhost:8000/api/posts/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        console.log('Post created successfully:', response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleImageEditComplete = (images: ImageData[]) => {
    setEditedImages(images);
    setStep('post');
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : editedImages.length - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex < editedImages.length - 1 ? prevIndex + 1 : 0));
  };

  const handleImageEditClose = () => {
    onClose();
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:8000/api/users/me/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[1102px] h-[694px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-300">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-lg font-medium">새 게시글 등록</span>
          <button onClick={handleCreatePost} className="text-blue-500 px-4 py-2">
            게시
          </button>
        </div>
        <div className="flex flex-1 overflow-hidden">
          {step === 'edit' ? (
            <ImageEditModal onComplete={handleImageEditComplete} onClose={handleImageEditClose} />
          ) : (
            <>
              <div className="w-[702px] flex items-center justify-center bg-black relative">
                {editedImages.length > 0 && (
                  <div className="w-full h-full flex items-center justify-center overflow-hidden">
                    <img
                      src={editedImages[currentImageIndex].cropped as string}
                      alt="Post"
                      className={`max-w-full max-h-full object-contain ${editedImages[currentImageIndex].filter}`}
                    />
                    {editedImages.length > 1 && (
                      <>
                        <button onClick={handlePrevImage} className="absolute left-2 bg-white rounded-full p-2 z-10">
                          &#8249;
                        </button>
                        <button onClick={handleNextImage} className="absolute right-2 bg-white rounded-full p-2 z-10">
                          &#8250;
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="w-[400px] bg-white flex flex-col">
                <div className="flex items-center p-4 border-b border-gray-300">
                  {currentUser ? (
                    <div
                      className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10"
                      style={{ backgroundImage: `url(${getFullImageUrl(currentUser.profile_picture)})` }}
                    ></div>
                  ) : (
                    <div className="text-[#111418]" data-icon="User" data-size="24px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"></path>
                      </svg>
                    </div>
                  )}
                  <span className="ml-2 text-sm font-medium text-gray-700">{currentUser?.username}</span>
                </div>
                <textarea
                  className="p-4 border-b border-gray-300 flex-1 resize-none"
                  placeholder="문구 입력..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="쇼핑몰 연결하기..."
                  className="flex-1 p-2 rounded-lg h-10 py-2 mr-2"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateFeed;
