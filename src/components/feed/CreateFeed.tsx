import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../services/utils';

interface User {
  id: number;
  username: string;
  profile_picture: string;
}

interface CreateFeedProps {
  onClose: () => void;
}

const CreateFeed: React.FC<CreateFeedProps> = ({ onClose }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [postContent, setPostContent] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(file =>
        URL.createObjectURL(file)
      );
      setSelectedImages(filesArray);
      Array.from(e.target.files).map(file => URL.revokeObjectURL(file.name));
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:8000/api/users/me/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const handlePostSubmit = async () => {
    // 피드 등록 API 호출 구현
    console.log('Post submitted');
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[1102px] h-[694px] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <p className="text-lg font-medium">새 게시글 등록</p>
          <button onClick={handlePostSubmit} className="text-blue-500 hover:text-blue-700">
            게시
          </button>
        </div>
        <div className="flex flex-1">
          <div className="relative w-[702px] bg-center bg-no-repeat bg-cover flex items-center justify-center" style={{ backgroundImage: selectedImages.length > 0 ? `url(${selectedImages[currentImageIndex]})` : 'none' }}>
            {selectedImages.length > 0 ? (
              <>
                <button onClick={handlePrevImage} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full opacity-50 hover:opacity-100">
                  &lt;
                </button>
                <button onClick={handleNextImage} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full opacity-50 hover:opacity-100">
                  &gt;
                </button>
                <div className="absolute bottom-0 w-full flex justify-center pb-2">
                  {selectedImages.map((_, index) => (
                    <span key={index} className={`mx-1 w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-white' : 'bg-gray-400'}`}></span>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-center">사진과 동영상을 여기에 끌어다 놓으세요</p>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="mt-4" />
              </div>
            )}
          </div>
          <div className="w-[400px] bg-white flex flex-col p-4">
            <div className="flex items-center mb-4">
              {currentUser ? (
                <div
                  className="bg-center bg-no-repeat bg-cover rounded-full h-6 w-6"
                  style={{ backgroundImage: `url(${getFullImageUrl(currentUser.profile_picture)})`, height: '24px', width: '24px' }}
                ></div>
              ) : (
                <div className="text-[#111418]" data-icon="User" data-size="24px" data-weight="regular">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                    <path
                      d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"
                    ></path>
                  </svg>
                </div>
              )}
              <span className="ml-2 text-sm font-medium text-gray-700">{currentUser?.username}</span>
            </div>
            <textarea
              className="w-full h-40 p-2 border border-gray-300 rounded-lg resize-none"
              placeholder="문구 입력..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFeed;
