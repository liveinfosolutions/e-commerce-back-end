//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
//---------------------------------------------------------------------------------

const Product = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    quantity: { type: Number, required: true, default: 1 }
}, { _id: false });

const CartSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', required: true },
    product: [Product],
    lastUpatedOn: { type: Date, default: Date.now }
});

exports.CartModel = mongoose.model('Cart', CartSchema);