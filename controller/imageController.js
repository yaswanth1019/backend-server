const { uploadToCloudinary } = require('../helpers/cloudinaryHelper');
const Image = require('../models/Image')
const fs = require('fs')
const cloudinary = require('../config/cloudinary')

const uploadImage = async (req, res) => {
    try {
        // Support single or multiple file uploads
        const files = req.files || (req.file ? [req.file] : []);
        if (!files.length) {
            return res.status(400).json({
                success: false,
                message: 'File is required. Please upload at least one image.'
            })
        }

        const uploadedImages = [];
        for (const file of files) {
            const { url, publicId } = await uploadToCloudinary(file.path);
            const newImage = new Image({
                url,
                publicId,
                uploadedBy: req.user.userId
            });
            await newImage.save();
            uploadedImages.push(newImage);
            // delete the file from disk
            try {
                console.log('Deleting file:', file.path);
                fs.unlinkSync(file.path);
            } catch (err) {
                console.error('Failed to delete file:', file.path, err);
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Images uploaded successfully',
            images: uploadedImages
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || error
        });
    }
}

const fetchImages = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page -1) * limit;

        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const totalImages = await Image.countDocuments();
        const totalPages = Math.ceil(totalImages / limit);

        const sortObj = {};
        sortObj[sortBy] = sortOrder

        const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

        if (!images || images.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No images found for this user.',
                data: []
            });
        }
        return res.status(200).json({
            success: true,
            currentPage : page,
            totalImages : totalImages,
            totalPages : totalPages,
            data: images
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || error
        });
    }
}

const deleteImage = async (req, res) => {
    try {
        const currentImageId = req.params.id
        const userId = req.user.userId

        const deleteImages = await Image.findById(currentImageId)

        if (!deleteImages) {
            return res.status(404).json({
                error: true,
                message: 'Images not found with this id'
            })
        }

        await cloudinary.uploader.destroy(deleteImages.publicId)

        await Image.findByIdAndDelete(currentImageId);

        return res.status(200).json({
            success : true,
            message : 'Image deleted successfully'
        })

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: error.message || error
        });
    }
}

module.exports = { uploadImage, fetchImages ,deleteImage };