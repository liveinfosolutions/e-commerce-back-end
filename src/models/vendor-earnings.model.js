//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
//---------------------------------------------------------------------------------

const VendorEarningSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, index: true, ref: 'Customers', required: true },
    amount: { type: Number },
    commission: { type: Number },
    paidAt: { type: Date },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendors', index: true, required: true },
    from: { type: Date, index: true },
    to: { type: Date, index: true },
    comment: { type: String },
    status: { type: String, default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('VendorEarning', VendorEarningSchema);