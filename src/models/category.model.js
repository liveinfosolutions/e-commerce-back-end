//------------------------------------------IMPORTS--------------------------------
'use strict'

const { SchemaStatusPropertyEnum, StatusActive } = require('./common/shared-btw-models');
const mongoose = require('mongoose');
//---------------------------------------------------------------------------------

// * Size for category products like s, m, l, xl, xxl
const UnitSchema = mongoose.Schema({
    unit: { type: String, required: true },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
}, { timestamps: true });

// * Brands available for sub category
const BrandSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
}, { timestamps: true });

// * Schema for sub-category
const SubCategorySchema = mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
    unit: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Units', default: [] }],
    brands: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brands', default: [] }],
    commission: { type: mongoose.Schema.Types.Number, min: 0, max: 100 },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
}, { timestamps: true });

// * Schema for category
const CategorySchema = mongoose.Schema({
    image: { type: String, required: true },
    name: { type: String, required: true },
    sub_category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sub_Categories', default: [] }],
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
}, { timestamps: true });

exports.CategoryModel = mongoose.model('Categories', CategorySchema);
exports.SubCategoryModel = mongoose.model('Sub_Categories', SubCategorySchema);
exports.BrandModel = mongoose.model('Brands', BrandSchema);
exports.UnitModel = mongoose.model('Units', UnitSchema);

module.exports = Object.freeze({
    CategorySchema,
    SubCategorySchema
});