//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const { EmailAddressValidation, MobileNumberValidation } = require('./common/shared-btw-models');
//---------------------------------------------------------------------------------

// * About Us Schema 
const AboutUsSchema = mongoose.Schema({
    companyName: { type: String, required: true },
    logo: { type: String, required: true },
    description: { type: String, required: true },
    contactNumber: MobileNumberValidation,
    whatsappNumber: MobileNumberValidation, 
    tollFreeNumber: MobileNumberValidation,
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Addresses', required: true },
    email: EmailAddressValidation,
    facebookLink: { type: String },
    instagramLink: { type: String },
    youtubeLink: { type: String },
    twitterLink: { type: String },
    linkedInLink: { type: String },
    playStoreLink: { type: String },
    appleStoreLink: { type: String },
    deliveryChargeMessage: { type: String, required: true },
    deliveryFee: { type: Number, required: true },
    copyRightText: { type: String, required: true },
    comissionFeeInPercentage: { type: Number, required: true }
});

exports.AboutUsModel = mongoose.model('AboutUs', AboutUsSchema);