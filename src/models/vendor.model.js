//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const { SchemaStatusPropertyEnum, StatusActive, EmailAddressValidation, MobileNumberValidation } = require('./common/shared-btw-models');
//---------------------------------------------------------------------------------

// * Schema for vendor
const VendorSchema = mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: EmailAddressValidation,
    mobile_number: MobileNumberValidation,
    password: { type: String, required: true },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
}, { timestamps: true });

exports.VendorModel = mongoose.model('Vendors', VendorSchema);