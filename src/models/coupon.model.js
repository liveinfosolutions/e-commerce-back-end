//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const { SchemaStatusPropertyEnum, StatusActive, DiscountTypeEnum, PercentDiscountType, DiscountTargetTypeEnum, DiscountTargetTypeCustomer } = require('./common/shared-btw-models');
//---------------------------------------------------------------------------------

const CouponSchema = mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },// ! Need to add particular format like FLAT50
    type: { type: String, enum: DiscountTypeEnum, default: PercentDiscountType, required: true },
    value: { type: Number, required: true }, // Value of discount amount like if percentage 2 or 3% or Rs 500
    targetType: { type: String, enum: DiscountTargetTypeEnum, default: DiscountTargetTypeCustomer },
    usageLimit: { type: Number, required: true }, // Number of people that will get benefit
    minCartValue: { type: Number, required: true },
    maxDiscountAmt: { type: Number, required: true },
    validFrom: { type: Date, required: true },
    validUpto: { type: Date, required: true },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
}, { timestamps: true });

exports.CouponModel = mongoose.model('Coupons', CouponSchema);