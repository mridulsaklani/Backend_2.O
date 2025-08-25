import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import path from 'path';
import { apiError } from './apiError.utils.js';


const FOLDERS = {
    PROFILE: 'users/profiles',
    DOCUMENTS: 'users/documents',
    POSTS: 'posts',
    GALLERY: 'gallery'
};


const FILE_CONFIGS = {
    image: {
        resource_type: 'image',
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
        ]
    },
    video: {
        resource_type: 'video',
        allowedFormats: ['mp4', 'avi', 'mov', 'wmv'],
        transformation: [
            { quality: 'auto' }
        ]
    },
    document: {
        resource_type: 'raw',
        allowedFormats: ['pdf', 'doc', 'docx', 'txt']
    }
};


export const cloudUpload = async (fileInput, options = {}) => {
    if (!fileInput) {
        throw new apiError(400, "File is required for upload");
    }

    const defaultOptions = {
        folder: FOLDERS.PROFILE,
        resource_type: 'auto',
        public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}`,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        quality: 'auto',
        fetch_format: 'auto'
    };

    const uploadOptions = { ...defaultOptions, ...options };

    try {
        const result = await cloudinary.uploader.upload(fileInput, uploadOptions);

        
        if (typeof fileInput === 'string' && await fileExists(fileInput)) {
            await fs.unlink(fileInput);
        }

        return result.secure_url;


    } catch (error) {
       
        if (typeof fileInput === 'string' && await fileExists(fileInput)) {
            await fs.unlink(fileInput);
        }

        console.error('Cloudinary upload failed:', error);
        throw new apiError(500, `Upload failed: ${error.message}`, error);
    }
};


export const uploadProfileImage = async (fileInput, userId) => {
    const options = {
        folder: FOLDERS.PROFILE,
        public_id: `profile_${userId}_${Date.now()}`,
        transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
        ],
        overwrite: true
    };

    return await cloudUpload(fileInput, options);
    
};


