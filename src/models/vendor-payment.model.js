//------------------------------------------IMPORTS--------------------------------
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//---------------------------------------------------------------------------------

const options = { discriminatorKey: 'purpose', versionKey: false };
const paymentSchema = new Schema({
    recieptId: { type: String },
    rzpPaymentId: { type: String },
    rzpOrderId: { type: String, index: true },
    totalAmt: { type: Number },
    user: { type: Schema.Types.ObjectId, index: true, ref: 'user', required: true },
    verified: { type: Boolean, default: false },
    status: { type: String, default: 'Pending' },
    at: { type: Date, default: Date.now }

}, options);

const Payment = mongoose.model('vendor_payment', paymentSchema);
const BillPayment = Payment.discriminator('billPayment', new Schema({
    amountPaid: { type: Number },
    billId: { type: Schema.Types.ObjectId },
    // coupon: {
    //     code: { type: String },
    //     discountAmt: { type: Number }
    // },
}, options));
module.exports = {
    BillPayment,
    Payment,
    // WalletRecharge
}