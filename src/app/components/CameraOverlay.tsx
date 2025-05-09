'use client';
import React from 'react';

const overlayText: Record<'face' | 'document', string> = {
  face: 'Position your face in the circle',
  document: 'Place the ID card within the frame',
};

const CameraOverlay: React.FC<{
  type?: 'face' | 'document';
  message?: string;
  highlight?: boolean;
}> = ({ type = 'face', message, highlight = false }) => {
  // Size dimensions depending on type
  const shapeStyles =
    type === 'face'
      ? 'w-[280px] h-[420px] rounded-full'
      : 'w-[320px] h-[200px] rounded-md md:w-[400px] md:h-[250px]';

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      <div className="relative w-full h-full">
        <div
          className={`absolute ${shapeStyles} left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 ${
            highlight ? 'border-green-400' : 'border-white'
          }`}
          style={{
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
          }}
        />
        <div className="absolute bottom-10 w-full text-center text-white text-lg font-medium px-4">
          {highlight ? 'Hold steady...' : message || overlayText[type]}
        </div>
      </div>
    </div>
  );
};

export default CameraOverlay;
