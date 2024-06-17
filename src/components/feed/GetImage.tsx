import React, { useState } from 'react';

interface GetImageProps {
  onClose: () => void;
}

const GetImage: React.FC<GetImageProps> = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="main-container w-[879px] h-[934px] bg-[rgba(0,0,0,0)] relative overflow-hidden mx-auto my-0">
      <div className="h-[934px] bg-[#595959] absolute top-0 left-0 right-0">
        <div className="w-[879px] h-[915px] bg-cover bg-no-repeat absolute bottom-[12px] right-0 z-[1]">
          <div className="w-[861px] h-[49px] bg-cover bg-no-repeat relative z-[6] mt-[10px] mr-0 mb-0 ml-[11px]" />
        </div>
        <div className="w-[879px] h-[550px] bg-[rgba(0,0,0,0)] absolute bottom-[2px] right-0 z-[2] flex flex-col items-center justify-center">
          {selectedImage ? (
            <img src={selectedImage} alt="Selected" className="h-[500px] w-auto" />
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-[90px] h-[69px] bg-cover bg-no-repeat relative z-[5] mt-[27px] mr-0 mb-0 ml-[396px]" />
              <div className="w-[371px] h-[31px] bg-cover bg-no-repeat relative z-[4] mt-[12px] mr-0 mb-0 ml-[255px]" />
              <div className="w-[142px] h-[40px] bg-cover bg-no-repeat relative z-[3] mt-[16px] mr-0 mb-0 ml-[369px]" />
              <p className="text-center">사진과 동영상을 여기에 끌어다 놓으세요</p>
              <input type="file" accept="image/*" onChange={handleImageChange} className="mt-4" />
            </div>
          )}
          {selectedImage && (
            <button className="mt-4 p-2 bg-blue-500 text-white rounded" onClick={() => console.log('Next button clicked')}>
              다음
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetImage;
