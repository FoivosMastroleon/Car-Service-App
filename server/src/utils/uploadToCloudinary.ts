import cloudinary from "./cloudinary";

export const uploadBufferToCloudinary = (buffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error || !result) {
        reject(error);
        return;
      }
      resolve(result.secure_url);
    });

    stream.end(buffer);
  });
};
