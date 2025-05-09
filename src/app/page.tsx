'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import CameraOverlay from '@/app/components/CameraOverlay';
import { useRouter } from 'next/navigation';
import { useZeroClient } from '@/lib/zero';

const CameraPage: React.FC = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLCanvasElement>(null);
  const faceDetectorRef = useRef<FaceDetector | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const [highlight, setHighlight] = useState(false);
  const [captured, setCaptured] = useState(false);

  const isFaceInCenter = (box: any, vw: number, vh: number) => {
    const overlaySize = 240;
    const centerX = vw / 2;
    const centerY = vh / 2;
    const faceCenterX = box.originX + box.width / 2;
    const faceCenterY = box.originY + box.height / 2;
    const dx = faceCenterX - centerX;
    const dy = faceCenterY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < overlaySize / 2;
  };

  useEffect(() => {
    const initialize = async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      faceDetectorRef.current = await FaceDetector.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: 'blaze_face_short_range.tflite',
        },
        runningMode: 'VIDEO',
        minDetectionConfidence: 0.6,
      });

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        detectLoop();
      }
    };

    const detectLoop = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const photoCanvas = photoRef.current;
      const ctx = canvas?.getContext('2d');
      if (!video || !canvas || !ctx || !faceDetectorRef.current) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const runDetection = async () => {
        if (video.readyState === 4) {
          const results = await faceDetectorRef.current!.detectForVideo(video, performance.now());
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const box = results.detections[0]?.boundingBox;
          if (box) {
            const inCenter = isFaceInCenter(box, canvas.width, canvas.height);
            setHighlight(inCenter);

            if (inCenter && !captured) {
              if (!timeoutRef.current) {
                timeoutRef.current = setTimeout(async () => {
                  if (photoCanvas && video) {
                    photoCanvas.width = video.videoWidth;
                    photoCanvas.height = video.videoHeight;
                    const photoCtx = photoCanvas.getContext('2d');
                    photoCtx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

                    const dataUrl = photoCanvas.toDataURL('image/jpeg');
                    const zero = await useZeroClient();

                    // Clear previous images
                    const existingImages = await zero.query['capturedImages'];
                    for (const row of existingImages) {
                      await zero.mutate.capturedImages.delete(row.dataUrl); // Clear the images
                    }

                    // Insert the new image
                    await zero.mutate.capturedImages.insert({ dataUrl });

                    console.log("📸 Image captured and stored in Zero.");
                    setCaptured(true);
                  }
                }, 3000);
              }
            } else {
              clearTimeout(timeoutRef.current as NodeJS.Timeout);
              timeoutRef.current = null;
            }
          } else {
            setHighlight(false);
            clearTimeout(timeoutRef.current as NodeJS.Timeout);
            timeoutRef.current = null;
          }
        }
        animationFrameId.current = requestAnimationFrame(runDetection);
      };

      runDetection();
    };

    initialize();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      faceDetectorRef.current?.close();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [captured]);

  useEffect(() => {
    if (captured) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach((track) => track.stop());
      faceDetectorRef.current?.close();
      router.push('/preview');
    }
  }, [captured, router]);

  return (
    <div className="relative w-full h-screen bg-black">
      <video ref={videoRef} className="absolute w-full h-full object-cover" muted playsInline />
      <canvas ref={canvasRef} className="absolute w-full h-full z-30" />
      <CameraOverlay type="face" highlight={highlight} />
      <canvas ref={photoRef} className="hidden" />
    </div>
  );
};

export default CameraPage;
