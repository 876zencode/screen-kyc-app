'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CaptureTypePage: React.FC = () => {
  const [selectedCaptureType, setSelectedCaptureType] = useState<'face' | 'id-front' | 'id-back' | null>(null);
  const router = useRouter();

  const handleButtonClick = (captureType: 'face' | 'id-front' | 'id-back') => {
    setSelectedCaptureType(captureType);
    router.push(`/camera?type=${captureType}`); // Navigate to the camera page with the selected capture type
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-6">Select the type of picture to take</h1>
        <div className="flex flex-col gap-4">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600"
            onClick={() => handleButtonClick('face')}
          >
            Take Selfie
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg hover:bg-green-600"
            onClick={() => handleButtonClick('id-front')}
          >
            Capture ID Front
          </button>
          <button
            className="px-6 py-3 bg-red-500 text-white rounded-lg text-lg hover:bg-red-600"
            onClick={() => handleButtonClick('id-back')}
          >
            Capture ID Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptureTypePage;
