const express = require('express');
const authMiddleWare = require('../middleware/authMiddleWare');
const adminMiddleWare = require('../middleware/adminMiddleWare');
const uploadMiddleWare = require('../middleware/uploadMiddleWare');
const { uploadImage, fetchImages, deleteImage } = require('../controller/imageController');
const imageRouter = express.Router();


imageRouter.post('/upload',authMiddleWare,adminMiddleWare,uploadMiddleWare.array('image',2),uploadImage)
imageRouter.get('/get',fetchImages)
imageRouter.delete('/delete/:id',authMiddleWare,deleteImage)

module.exports = imageRouter