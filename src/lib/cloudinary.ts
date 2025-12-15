import { v2 as cloudinary } from 'cloudinary';

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadImage(
  file: Buffer,
  folder: string = 'vet-animals'
): Promise<{ success: boolean; url?: string; publicId?: string; error?: string }> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return { success: false, error: 'Cloudinary not configured' };
  }

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder,
              resource_type: 'image',
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result as { secure_url: string; public_id: string });
            }
          )
          .end(file);
      }
    );

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: String(error) };
  }
}

export async function deleteImage(publicId: string) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return { success: false, error: 'Cloudinary not configured' };
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: String(error) };
  }
}

export { cloudinary };
