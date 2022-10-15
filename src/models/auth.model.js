//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
const { SchemaStatusPropertyEnum, StatusActive, EmailAddressValidation, MobileNumberValidation } = require('./common/shared-btw-models');
//---------------------------------------------------------------------------------


// SCHEMA FOR ADMIN USERS
const PermissionsSchema = mongoose.Schema({
    component: { type: String, required: true },
    route: { type: String, required: true },
    create_action: { type: Boolean, required: true, default: false },
    update_action: { type: Boolean, required: true, default: false },
    read_action: { type: Boolean, required: true, default: false },
    delete_action: { type: Boolean, required: true, default: false },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
}, { timestamps: true });

const AdminUserSchema = mongoose.Schema({
    email: EmailAddressValidation,
    password: { type: String, required: true },
    name: { type: String, required: true },
    mobile_number: MobileNumberValidation,
    is_super_admin: { type: Boolean, required: true, default: false },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminUser', required: false, default: null },
    permissions: [{ type: PermissionsSchema, default: [] }],
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
}, { timestamps: true });

AdminUserSchema.plugin(uniqueValidator, { message: 'Email address is already used.' })
exports.AdminUserModel = mongoose.model('AdminUser', AdminUserSchema);

