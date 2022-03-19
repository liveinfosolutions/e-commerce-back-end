'use strict';

var express = require('express');
var api = express.Router();
var VendorController = require('../controllers/vendor.controller');
const { verifyToken } = require('../middlewares/auth-verification');

api.post('add-vendor',verifyToken,VendorController.addVendor);
api.post('update-vendor',verifyToken,VendorController.updateVendor);
api.post('vendor-change-password',verifyToken,VendorController.changePassword); 