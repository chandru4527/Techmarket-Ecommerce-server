import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "uploads",
                resource_type: "image",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        stream.end(file.buffer);
    });
};

export const uploadMedia = asyncHandler(async (req, res) => {
    const files = req.files || (req.file ? [req.file] : []);

    if (!files.length) {
        throw new AppError("No files uploaded", 400);
    }

    const results = await Promise.all(
        files.map(async (file) => {
            const result = await uploadToCloudinary(file);

            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        })
    );

    return res.status(200).json({
        success: true,
        message: "Media uploaded successfully",
        result: req.file ? results[0] : results,
    });
});