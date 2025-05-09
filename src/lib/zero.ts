import { Zero, Schema } from '@rocicorp/zero';
import { z } from 'zod';

const capturedImagesSchema = z.object({
  imageUrl: z.string(),
  type: z.enum(['face', 'id-front', 'id-back']),
});

const schema: Schema = {
  tables: {
    capturedImages: {
      name: 'capturedImages',
      columns: {
        imageUrl: {
          type: 'string',
          customType: capturedImagesSchema.shape.imageUrl,
        },
        type: {
          type: 'string',
          customType: capturedImagesSchema.shape.type,
        },
      },
      primaryKey: ['imageUrl'],
    },
  },
  relationships: {},
};

const userID = 'user-12345'; // Replace with dynamic user ID from auth

// Ensure userID is valid
if (!userID || userID.trim() === '') {
  throw new Error('userID must be a non-empty string');
}

// Declare zeroClient globally to avoid recreating it on every call
let zeroClient: Zero<typeof schema> | null = null;

// Async function to initialize and return the Zero instance
export const useZeroClient = async () => {
  // Only initialize once
  if (!zeroClient) {
    zeroClient = new Zero({
      schema,
      userID,
    });
  }
  return zeroClient;
};

// Function to save images (selfie, idFront, idBack) into the database
export const saveCapturedImages = async (selfie: string | null, idFront: string | null, idBack: string | null) => {
  const zero = await useZeroClient();
  
  // Insert new images into capturedImages table
  await zero.mutate.capturedImages.insert({
    selfie: selfie ?? '',
    idFront: idFront ?? '',
    idBack: idBack ?? '',
  });
};

// Function to fetch captured images (selfie, idFront, idBack)
export const fetchCapturedImages = async () => {
  const zero = await useZeroClient();
  const capturedImagesQuery = await zero.query['capturedImages'];

  // Return the captured image URLs
  return capturedImagesQuery.map((row: any) => ({
    selfie: row.selfie,
    idFront: row.idFront,
    idBack: row.idBack,
  }));
};
