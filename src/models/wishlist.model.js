//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
//---------------------------------------------------------------------------------

const WishlistSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', index: true, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products' }
}, { timestamps: true });

exports.WishlistModel = mongoose.model('Wishlist', WishlistSchema); 