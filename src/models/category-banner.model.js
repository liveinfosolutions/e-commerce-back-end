//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const { SchemaStatusPropertyEnum, StatusActive } = require('./common/shared-btw-models');
//---------------------------------------------------------------------------------

const CategoryBannerSchema = mongoose.Schema({
    image: { type: String, required: true },
    position: { type: Number, default: 0 },
    link: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
}, { timestamps: true });

exports.CategoryBannerModel = mongoose.model('CategoryBanners', CategoryBannerSchema);