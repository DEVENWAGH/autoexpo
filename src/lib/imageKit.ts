import ImageKit from "imagekit";

// Check if we're on the client side
const isClient = typeof window !== 'undefined';

// Only create ImageKit instance on server-side
const isServer = typeof window === 'undefined';

if (isClient && (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT)) {
  console.error('ImageKit public environment variables are not properly configured');
}

// Server-side check for all variables
if (!isClient && (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT)) {
  throw new Error('ImageKit environment variables are not properly configured');
}

// Server-side ImageKit instance
export const imageKit = isServer ? new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!
}) : null;

// Client-side config - no private key needed
export const imageKitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
};

// Server-side signature generation
export const getAuthenticationParameters = () => {
  if (!imageKit) {
    throw new Error('ImageKit not initialized on server');
  }
  return imageKit.getAuthenticationParameters();
};
