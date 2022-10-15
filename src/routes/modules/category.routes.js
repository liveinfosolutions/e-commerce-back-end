'use strict';
//------------------------------------------IMPORTS-------------------------------
var express = require('express');
var api = express.Router();
var CategoryController = require('../../controllers/category.controller');
const { verifyToken } = require('../../middlewares/auth-verification');
const multer = require('multer');
const { IMAGE_SIZE_LIMIT, MIME_TYPE_MAP } = require('../../../_global/global');
//--------------------------------------------------------------------------------


// Stroage for category images
const categoryStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('This MIME TYPE is not supported.');
        if (isValid) error = null
        // Path where images will be stored
        callback(error, 'assets/images/categories');
    },
    filename: (req, file, callback) => {
        // Alter the name of uploaded image
        const name = file.originalname.toLowerCase().split(' ').join('-');
        // Get the extension of uploaded image
        const ext = MIME_TYPE_MAP[file.mimetype]
        callback(null, `${name}-${Date.now()}.${ext}`)
    }
});

const subCategoryStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('This MIME TYPE is not supported.');
        if (isValid) error = null
        // Path where images will be stored
        callback(error, 'assets/images/subCategories');
    },
    filename: (req, file, callback) => {
        // Alter the name of uploaded image
        const name = file.originalname.toLowerCase().split(' ').join('-');
        // Get the extension of uploaded image
        const ext = MIME_TYPE_MAP[file.mimetype]
        callback(null, `${name}-${Date.now()}.${ext}`)
    }
});

api.post('add-category', multer({ storage: categoryStorage, limits: { fileSize: IMAGE_SIZE_LIMIT } }).single('image'), verifyToken, CategoryController.addCategory);
api.post('update-category', multer({ storage: categoryStorage, limits: { fileSize: IMAGE_SIZE_LIMIT } }).single('image'), verifyToken, CategoryController.updateCategory);
api.post('remove-category', verifyToken, CategoryController.removeCategory);

api.post('add-sub-category', multer({ storage: subCategoryStorage, limits: { fileSize: IMAGE_SIZE_LIMIT } }).single('image'), verifyToken, CategoryController.addSubCategory);
api.post('update-sub-category', multer({ storage: subCategoryStorage, limits: { fileSize: IMAGE_SIZE_LIMIT } }).single('image'), verifyToken, CategoryController.updateSubCategory);
api.post('remove-sub-category', verifyToken, CategoryController.removeSubCategory);

module.exports = api;