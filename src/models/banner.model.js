//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const { BannerTypeEnum, BannerTypeCategory, SchemaStatusPropertyEnum, StatusActive } = require('./common/shared-btw-models');
//---------------------------------------------------------------------------------

const BannerSchema = mongoose.Schema({
    image: { type: String, required: true },
    type: { type: String, enum: BannerTypeEnum, default: BannerTypeCategory },
    link: { type: String, required: true },
    position: { type: Number, default: 0 },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
}, { timestamps: true });

module.exports = mongoose.model('Banner', BannerSchema);