//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
//---------------------------------------------------------------------------------

const TermsAndConditionsSchema = mongoose.Schema({ description: { type: String, required: true } });

module.exports = mongoose.model('TermsAndConditions', TermsAndConditionsSchema);
