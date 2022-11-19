//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const { SchemaStatusPropertyEnum, StatusInactive, StatusActive } = require('./common/shared-btw-models');
//---------------------------------------------------------------------------------

// * Variations of product like small, medium, large
const ProductVariationSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    unit: { type: String, required: true }, // ! Need to add unit type in subCategory Model like small, medium, large, xl
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
}, { timestamps: true });

// * Product Review Schema
const ProductReviewSchema = mongoose.Schema({
    comment: { type: String, required: true, trim: true, },
    customer: { type: Schema.Types.ObjectId, ref: 'Customers' },
    status: { type: String, default: 'Pending', enum: ['Pending', 'Approved', 'Rejected'] },
    rating: { type: Number, max: 5, min: 1, required: true },
    product: { type: Schema.Types.ObjectId, index: true, ref: 'Products' },
    varient: { type: Schema.Types.ObjectId, index: true, ref: 'ProductVariations' },
}, { timestamps: true });

// * Multiple Images Schema
const ImagesSchema = Schema({
    primary: String,
    secondary: String,
    image1: String,
    image2: String,
    image3: String,
    image4: String,
    image5: String,
}, { versionKey: false, _id: false });

// * Product Schema
const ProductSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true }, // ! need to add brands schema
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Sub_Categories', required: true },
    images: ImagesSchema,
    featured: { type: Boolean, default: false },
    variations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariations', default: [] }],
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusInactive },
    new_arrival: { type: Boolean, default: false },
    slug: { type: String, index: true },
    hsn: { type: String },
    sku: { type: String },
    video: { type: String },
    tax: { type: mongoose.Schema.Types.ObjectId, ref: 'Tax' },
    tags: [{ type: String, trim: true, default: [] }],
    recommended: { type: Boolean, default: false },
    availableFrom: { type: Date },
    expireOn: { type: Date },
    returnable: { type: Boolean, default: false },
    cod: { type: Boolean, default: false },
    review: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductReviews', default: [] }]
}, { timestamps: true });

exports.ProductModel = mongoose.model('Products', ProductSchema);
exports.ProductVariationModel = mongoose.model('ProductVariations', ProductVariationSchema);
exports.ProductReviewModel = mongoose.model('ProductReviews', ProductReviewSchema);