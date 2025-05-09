import { Zero, Schema } from '@rocicorp/zero';
import { z } from 'zod';

// Define your schema for capturedImages
const capturedImagesSchema = z.string();

const schema: Schema = {
  tables: {
    capturedImages: {
      name: 'capturedImages',
      columns: {
        dataUrl: {
          type: 'string',
          customType: capturedImagesSchema,
        },
      },
      primaryKey: ['dataUrl'],
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
