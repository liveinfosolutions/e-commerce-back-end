'use strict';

var express = require('express');
var api = express.Router();
var CategoryController = require('../controllers/category.controller');
const { verifyToken } = require('../middlewares/auth-verification');

api.post('add-category',verifyToken, CategoryController.addCategory);
api.post('update-category',verifyToken, CategoryController.updateCategory);
api.post('remove-category', verifyToken, CategoryController.removeCategory);

api.post('add-sub-category',verifyToken, CategoryController.addSubCategory);
api.post('update-sub-category',verifyToken, CategoryController.updateSubCategory);
api.post('remove-sub-category',verifyToken, CategoryController.removeSubCategory);