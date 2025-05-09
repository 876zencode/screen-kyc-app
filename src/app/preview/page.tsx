'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useZeroClient } from '@/lib/zero';

const PreviewPage: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // Store only a single image
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCapturedImages = async () => {
    try {
      const zero = await useZeroClient();
      const capturedImagesQuery = zero.query['capturedImages'];

      // Retrieve dataUrls from captured images and filter out invalid ones
      const images = (await capturedImagesQuery)
        .map((row: any) => row.dataUrl)
        .filter((dataUrl: string) => dataUrl);

      console.log(images);

      // Only set the latest image (first one in the list)
      setCapturedImage(images.length > 0 ? images[0] : null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching captured images:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCapturedImages(); // Fetch only once when the component mounts
  }, []); // Empty dependency array ensures it runs only once

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : capturedImage ? (
        <img src={capturedImage} alt="Latest Captured Image" />
      ) : (
        <p>No images available.</p>
      )}
    </div>
  );
};

export default PreviewPage;
