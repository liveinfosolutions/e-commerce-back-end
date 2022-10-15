//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//---------------------------------------------------------------------------------

const PrivacyPolicySchema = new Schema({
    description: { type: String, required: true }
});
module.exports = mongoose.model('PrivacyPolicy', PrivacyPolicySchema);