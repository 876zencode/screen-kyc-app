// preview.tsx

'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useZeroClient } from '@/lib/zero';

const PreviewPage: React.FC = () => {
  const router = useRouter();
  const [capturedImages, setCapturedImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to load images from the Zero database
  const loadImages = async () => {
    const zero = await useZeroClient();

    // Fetch all captured images from Zero
    const images = await zero.query['capturedImages'];

    // Set images to the state
    setCapturedImages(images);
    setLoading(false);
  };

  // Run the loadImages function once when the page is mounted
  useEffect(() => {
    loadImages();
  }, []);

  const handleRetake = () => {
    router.push('/'); // Navigate back to the image selection page
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 h-screen bg-black text-white">
      <h1 className="text-3xl">Preview Your Images</h1>

      {/* Face Image Preview */}
      <div>
        {capturedImages.find((img) => img.type === 'face') ? (
          <div>
            <h2>Face</h2>
            <img
              src={capturedImages.find((img) => img.type === 'face')?.imageUrl}
              alt="Face"
              className="w-72 h-auto rounded-lg"
            />
          </div>
        ) : (
          <p>No face image captured.</p>
        )}
      </div>

      {/* ID Front Image Preview */}
      <div>
        {capturedImages.find((img) => img.type === 'id-front') ? (
          <div>
            <h2>ID Front</h2>
            <img
              src={capturedImages.find((img) => img.type === 'id-front')?.imageUrl}
              alt="ID Front"
              className="w-72 h-auto rounded-lg"
            />
          </div>
        ) : (
          <p>No ID front image captured.</p>
        )}
      </div>

      {/* ID Back Image Preview */}
      <div>
        {capturedImages.find((img) => img.type === 'id-back') ? (
          <div>
            <h2>ID Back</h2>
            <img
              src={capturedImages.find((img) => img.type === 'id-back')?.imageUrl}
              alt="ID Back"
              className="w-72 h-auto rounded-lg"
            />
          </div>
        ) : (
          <p>No ID back image captured.</p>
        )}
      </div>

      <button onClick={handleRetake} className="px-6 py-3 bg-blue-500 text-xl rounded-full">
        Home
      </button>
    </div>
  );
};

export default PreviewPage;
