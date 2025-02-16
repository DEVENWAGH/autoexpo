import ImageKit from "imagekit";

console.log('Loading ImageKit configuration...');
console.log('Environment variables:', {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  hasPrivateKey: !!process.env.IMAGEKIT_PRIVATE_KEY
});

const initImageKit = () => {
  if (!process.env.NEXT_PUBLIC_PUBLIC_KEY) {
    console.error('Missing NEXT_PUBLIC_PUBLIC_KEY');
    return null;
  }
  if (!process.env.PRIVATE_KEY) {
    console.error('Missing PRIVATE_KEY');
    return null;
  }
  if (!process.env.NEXT_PUBLIC_URL_ENDPOINT) {
    console.error('Missing NEXT_PUBLIC_URL_ENDPOINT');
    return null;
  }

  return new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY,
    privateKey: process.env.PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT
  });
};

export const imageKit = initImageKit();

export const verifyImageKitConfig = () => {
  if (!imageKit) {
    throw new Error('ImageKit not initialized. Check environment variables.');
  }
  return true;
};
