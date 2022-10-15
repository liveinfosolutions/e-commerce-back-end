'use strict';
//------------------------------------------IMPORTS-------------------------------
var express = require('express');
var api = express.Router();
var CustomerController = require('../controllers/customer.controller');
const { verifyToken } = require('../middlewares/auth-verification');
//--------------------------------------------------------------------------------

api.post('add-customer',verifyToken,CustomerController.addVendor);
api.post('update-customer',verifyToken,CustomerController.updateVendor);
api.post('customer-change-password',verifyToken,CustomerController.changeCustomerPassword); 