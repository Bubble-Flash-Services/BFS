import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration via environment variables
// Required: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
export const configureCloudinary = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary env vars missing. Uploads will fail until set.');
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export const uploadImage = async (filePathOrDataUri, options = {}) => {
  return cloudinary.uploader.upload(filePathOrDataUri, {
    folder: options.folder || 'bfs/uploads',
    resource_type: 'image',
    overwrite: true,
  use_filename: true,
  unique_filename: false,
    ...options,
  });
};

export const deleteByPublicId = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

// Fetch a resource by its full public_id (including folder)
export const getResourceByPublicId = async (publicId) => {
  // cloudinary.api.resource throws if not found
  return cloudinary.api.resource(publicId);
};

export const searchByFolderAndAge = async ({ folder, olderThanDays = 7 }) => {
  const olderThan = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000).toISOString();
  const expression = `folder:${folder} AND uploaded_at<${olderThan}`;
  return cloudinary.search.expression(expression).max_results(500).execute();
};

export default cloudinary;
