//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//---------------------------------------------------------------------------------

const webbannerSchema = new Schema({
    banner_1: [{ type: String }],
    banner_1_right_top: { type: String },
    banner_1_right_bottom: { type: String },
    banner_2: { type: String },
    banner_3_image: { type: String },
    banner_3_header: { type: String },
    banner_3_body: { type: String },
    banner_3_link: { type: String },
    banner_3_buttonText: { type: String },
    partner_logo: [{ type: String }],
},
    { versionKey: false });

module.exports = mongoose.model('web_banner', webbannerSchema);