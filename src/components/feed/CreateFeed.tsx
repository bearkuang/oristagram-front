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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [content, setContent] = useState('');
  const [site, setSite] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleCreatePost = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('content', content);
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post('http://localhost:8000/api/posts/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  useEffect(() => {
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

    fetchCurrentUser();
  }, []);

  const handlePrevFile = () => {
    setSelectedFiles((prevFiles) => [prevFiles[prevFiles.length - 1], ...prevFiles.slice(0, prevFiles.length - 1)]);
  };

  const handleNextFile = () => {
    setSelectedFiles((prevFiles) => [...prevFiles.slice(1), prevFiles[0]]);
  };

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
          <div className="relative w-[702px] h-full flex items-center justify-center bg-gray-200">
            {selectedFiles.length > 0 ? (
              <>
                {selectedFiles[0].type.startsWith('image/') && (
                  <img src={URL.createObjectURL(selectedFiles[0])} alt="Selected" className="object-contain h-full" />
                )}
                {selectedFiles[0].type.startsWith('video/') && (
                  <video controls className="object-contain h-full">
                    <source src={URL.createObjectURL(selectedFiles[0])} />
                  </video>
                )}
                {selectedFiles.length > 1 && (
                  <>
                    <button onClick={handlePrevFile} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full opacity-50 hover:opacity-100">
                      &lt;
                    </button>
                    <button onClick={handleNextFile} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full opacity-50 hover:opacity-100">
                      &gt;
                    </button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {selectedFiles.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-gray-800' : 'bg-gray-400'}`}
                        ></div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-center">사진과 동영상을 여기에 끌어다 놓으세요</p>
                <input type="file" accept="image/*,video/*" multiple onChange={handleFileChange} className="mt-4" />
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
                    <path
                      d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z"
                    ></path>
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
        </div>
      </div>
    </div>
  );
};

export default CreateFeed;
