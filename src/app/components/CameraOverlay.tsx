import React from 'react';

const CameraOverlay: React.FC<{
  type?: 'face' | 'id-front' | 'id-back';
  message?: string;
  highlight?: boolean;
}> = ({ type, message, highlight = false }) => {
  let overlayClassName = '';
  let overlayMessage = 'Position your face in the circle'; // Default message

  if (type === 'face') {
    overlayClassName = 'w-70 h-90 rounded-full';
  } else if (type === 'id-front' || type === 'id-back') {
    overlayClassName = 'w-80 h-48 rounded-lg';
    overlayMessage = 'Position your ID inside the frame'; // Custom message for ID photos
  }

  return (
    <div className="absolute inset-0 z-40 pointer-events-none">
      <div className="relative w-full h-full">
        <div
          className={`absolute ${overlayClassName} left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 ${
            highlight ? 'border-green-400' : 'border-white'
          }`}
          style={{
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
          }}
        />
        <div className="absolute bottom-10 w-full text-center text-white text-lg font-medium px-4">
          {highlight ? 'Hold steady...' : overlayMessage}
        </div>
      </div>
    </div>
  );
};

export default CameraOverlay;
