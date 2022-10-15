//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const { customAlphabet } = require('nanoid');
//---------------------------------------------------------------------------------

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 15);
const PurchaseOrderSchema = mongoose.Schema({
    orderId: { type: String, default: nanoid },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendors', required: true },
    placed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers', required: true },
    sourceOfSupply: { type: String, required: true },
    destinationOfSupply: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }],
    amount: { type: Number, required: true },
    billingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Addresses' },
    shippingAddress: { type: mongoose.Schema.Types.ObjectId, ref: 'Addresses' },
    order_date: { type: Date, default: Date.now },
    paymentStatus: { type: String },
    paymentMethod: { type: String, enum: ['COD', 'Online'] },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'payment' },
    deliveryCharge: { type: Number, default: 0 },
    coupon: { code: { type: String }, discountAmt: { type: Number } },
});

const ReplacementOrderSchema = mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchasedOrders' }
}, { timestamps: true });

exports.ReplaceOrderModel = mongoose.model('ReplacedOrders', ReplacementOrderSchema);
exports.PurchasedOrderModel = mongoose.model('PurchasedOrders', PurchaseOrderSchema);
