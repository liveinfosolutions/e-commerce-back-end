//------------------------------------------IMPORTS--------------------------------
const mongoose = require('mongoose');
const { FlashBannerTypeEnum, BannerTypeCategory } = require('./common/shared-btw-models');
const Schema = mongoose.Schema;
//---------------------------------------------------------------------------------

const flashBanner = new Schema({
    image: { type: String, required: true },
    type: { type: String, enum: FlashBannerTypeEnum, default: BannerTypeCategory },
    link: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('flashBanner', flashBanner);
