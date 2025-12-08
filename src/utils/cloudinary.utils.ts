import { v2 as cloudinary, ResourceType } from "cloudinary";
import fs from "fs/promises";
import { apiError } from "./apiError.utils";
import { FOLDERS } from "../constants/enums";

export type UploadInput = Express.Multer.File | string;


interface CloudUploadResult {
  secure_url: string;
  public_id: string;
}


type UploadOptions = Record<string, any>;



export const cloudUpload = async (
  fileInput: UploadInput,
  options: UploadOptions = {}
): Promise<{ url: string; key: string }> => {

  if (!fileInput) {
    throw new apiError(400, "File is required for upload");
  }

  const defaultOptions: UploadOptions = {
    folder: FOLDERS.PROFILE,
    resource_type: "auto",
    public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    quality: "auto",
    fetch_format: "auto",
  };

  const uploadOptions = { ...defaultOptions, ...options };

  try {
    const uploadSource =
      typeof fileInput === "string" ? fileInput : fileInput.path || fileInput.buffer;

    const result = await cloudinary.uploader.upload(uploadSource as any, uploadOptions);

  
    if (typeof fileInput === "string" && (await fileExists(fileInput))) {
      await fs.unlink(fileInput);
    }

    return { url: result.secure_url, key: result.public_id };

  } catch (error: any) {

    if (typeof fileInput === "string" && (await fileExists(fileInput))) {
      await fs.unlink(fileInput);
    }

    console.error("Cloudinary upload failed:", error);
    throw new apiError(500, `Upload failed: ${error.message}`, error);
  }
};



export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};



export const uploadProfileImage = async (fileInput: UploadInput) => {
  const options = {
    folder: FOLDERS.PROFILE,
    public_id: `profile_${Date.now()}`,
    transformation: [
      { width: 400, height: 400, crop: "fill", gravity: "face" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
    overwrite: true,
  };

  return await cloudUpload(fileInput, options);
};



export const simpleImage = async (fileInput: UploadInput) => {
  const options = {
    folder: FOLDERS.POSTS,
    public_id: `img_${Date.now()}`,
    overwrite: true,
  };

  return await cloudUpload(fileInput, options);
};


export const deleteImage = async (key: string, resourceType: ResourceType  = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(key, { resource_type: resourceType });

    if (result.result === "ok" || result.result === "deleted") {
      return { success: true, message: "Image deleted successfully" };
    }

    if (result.result === "not found") {
      return { success: false, message: "Image not found on Cloudinary" };
    }

    return result;

  } catch (error: any) {
    console.error("Cloudinary delete failed:", error);
    throw new apiError(500, "Failed to delete image from Cloudinary", error);
  }
};
