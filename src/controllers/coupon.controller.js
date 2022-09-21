const { GOT_ERROR, DATA_NOT_FOUND_ERROR, DATA_SAVED_SUCCESSFULLY, DATA_UPDATED_SUCCESSFULLY, DATA_REMOVED_SUCCESSFULLY, SEND_DATA } = require("../../_global/global-request-responses");
const { CouponModel } = require("../models/coupon.model");

// todo -> Method to add new Coupon
exports.addCoupon = (req, res) => {
  let data = req.body;
  let coupon = new CouponModel();
  coupon.coupon_name = data.coupon_name;
  coupon.coupon_type = data.coupon_type;
  coupon.coupon_usage = data.coupon_usage;
  coupon.limited_value = data.limited_value;
  coupon.coupon_start_date = data.coupon_start_date;
  coupon.coupon_end_date = data.coupon_end_date;

  coupon.save((err, CouponSaved) => {
    if (err) {
      GOT_ERROR(res, "coupon");
    }

    if (!CouponSaved) {
      DATA_NOT_FOUND_ERROR(res, "coupon");
    }
    // send response of successfully saved data
    DATA_SAVED_SUCCESSFULLY(res, "coupon");
  });
};

// todo -> Method to update coupon
exports.updateCoupon = (req, res) => {
  let data = req.data;

  let updateObject = {
    coupon_name: data.coupon_name,
    coupon_type: data.coupon_type,
    coupon_usage: data.coupon_usage,
    limited_value: data.limited_value,
    coupon_start_date: data.coupon_start_date,
    coupon_end_date: data.coupon_end_date,
  };

  CouponModel.findOneAndUpdate(
    { _id: data._id },
    { updateObject },
    (err, UpdatedCoupon) => {
      if (err) {
        GOT_ERROR(res, "updating coupon");
      }

      if (!UpdatedCoupon) {
        DATA_NOT_FOUND_ERROR(res, "updated coupon");
      }

      // send response of successfully saved data
      DATA_UPDATED_SUCCESSFULLY(res, "coupon");
    }
  );
};

// todo -> Method to delete coupon
exports.removeCoupon = (req,res) =>{
    let id = req.body._id;

  CouponModel.findByIdAndDelete(id, (err, deleted) => {
    if (err) {
      GOT_ERROR(res, "removing category");
    } else {
      DATA_REMOVED_SUCCESSFULLY(res, "category");
    }
  });
}

// todo -> Method to get coupons
exports.getCoupon = (req,res) => {
    let coupon_id = req.body._id;

    if(coupon_id){
        CouponModel.findById({_id : coupon_id},(err,Coupon)=>{  
            if(err){
                GOT_ERROR(res, "coupon");
            }

            if(!Coupon){
                DATA_NOT_FOUND_ERROR(res, "coupon");
            }

            SEND_DATA(res,Coupon,"coupon");
          })
    }else{
        CouponModel.find().then(Coupons => {
            if(!Coupons){
                DATA_NOT_FOUND_ERROR(res, "coupons");
            }

            SEND_DATA(res,Coupons,"coupons");
        })
    }
}