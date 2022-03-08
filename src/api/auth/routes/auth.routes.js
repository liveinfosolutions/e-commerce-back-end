'use strict';

var express = require('express');
var api = express.Router();
var AuthController = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth-verification');

api.post('/admin-login', AuthController.adminLogin)
api.post('/forgot-password', AuthController.forgotPassword)
api.post('/reset-password', AuthController.resetPassword)
// NOT IN USE CURRENTLY
api.get('/have-super-admin', AuthController.haveSuperAdmin)


api.post('/admin-signup', AuthController.adminSignup);
api.post('/change-password',verifyToken, AuthController.changePassword);
api.post('/update-my-profile',verifyToken, AuthController.updateMyProfile);
api.post('/get-permissions',verifyToken, AuthController.getPermissionsList);
api.post('/update-permissions',verifyToken, AuthController.updatePermissions);

module.exports = api;