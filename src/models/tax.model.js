//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//---------------------------------------------------------------------------------

const taxSchema = new Schema({
    name: { type: String, required: true },
    value: { type: Number }
},
    { versionKey: false }
);
module.exports = mongoose.model('Tax', taxSchema);