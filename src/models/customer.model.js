//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const { SchemaStatusPropertyEnum, StatusActive, EmailAddressValidation, MobileNumberValidation } = require('./common/shared-btw-models');
//---------------------------------------------------------------------------------

const CustomerSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: EmailAddressValidation,
    mobile_number: MobileNumberValidation,
    password: { type: String, required: true },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
}, { timestamps: true });

exports.CustomerModel = mongoose.model('Customers', CustomerSchema);