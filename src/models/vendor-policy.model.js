//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
//---------------------------------------------------------------------------------

const VendorPolicySchema = mongoose.Schema({ description: { type: String } });

module.exports = mongoose.model('VendorPolicy', VendorPolicySchema);
