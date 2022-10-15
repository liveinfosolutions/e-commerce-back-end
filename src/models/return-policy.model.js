//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
//---------------------------------------------------------------------------------

const ReturnPolicySchema = mongoose.Schema({ description: { type: String, required: true } });

module.exports = mongoose.model('ReturnPolicy', ReturnPolicySchema);
