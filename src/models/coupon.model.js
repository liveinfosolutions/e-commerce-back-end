const mongoose = require('mongoose');

const CouponSchema = mongoose.Schema({
    coupon_name : {
        type : String,
        required : true
    },
    coupon_type : {
        type : String,
        enum: {
            values: ['discount_by_percentage','discount_by_amount'],
            message: '{VALUE} is not supported'
          },
        required : true
    },
    coupon_usage : {
        type : String,
        enum: {
            values: ['limited','unlimited'],
            message: '{VALUE} is not supported'
          },
        required : true
    },
    limited_value : {
        type : Number
    },
    coupon_start_date : {
        type : Date ,
        required : true
    },
    coupon_end_date : {
        type : Date ,
        required : true
    },
    status : {
        type : String,
        enum: {
            values: ['Active','Inactive'],
            message: '{VALUE} is not supported'
          },
        default : 'Active'
    }
})

exports.CouponModel = mongoose.model('Coupons',CouponSchema);