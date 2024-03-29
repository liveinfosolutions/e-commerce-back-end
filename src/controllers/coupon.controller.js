//------------------------------------------IMPORTS-------------------------------
const { GOT_ERROR, DATA_NOT_FOUND_ERROR, DATA_SAVED_SUCCESSFULLY, DATA_UPDATED_SUCCESSFULLY, DATA_REMOVED_SUCCESSFULLY, SEND_DATA } = require('../../_global/global-request-responses');
const { CouponModel } = require('../models/coupon.model');
//--------------------------------------------------------------------------------

// * Method to add new Coupon
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
      return GOT_ERROR(res, 'coupon');
    }

    if (!CouponSaved) {
      return DATA_NOT_FOUND_ERROR(res, 'coupon');
    }
    // send response of successfully saved data
    return DATA_SAVED_SUCCESSFULLY(res, 'coupon');
  });
};

// * Method to update coupon
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
        return GOT_ERROR(res, 'updating coupon');
      }

      if (!UpdatedCoupon) {
        return DATA_NOT_FOUND_ERROR(res, 'updated coupon');
      }

      // send response of successfully saved data
      return DATA_UPDATED_SUCCESSFULLY(res, 'coupon');
    }
  );
};

// * Method to delete coupon
exports.removeCoupon = (req, res) => {
  let id = req.body._id;

  CouponModel.findByIdAndDelete(id, (err, deleted) => {
    if (err) {
      return GOT_ERROR(res, 'removing category');
    } else {
      return DATA_REMOVED_SUCCESSFULLY(res, 'category');
    }
  });
}

// * Method to get coupons
exports.getCoupon = (req, res) => {
  let coupon_id = req.body._id;

  if (coupon_id) {
    CouponModel.findById({ _id: coupon_id }, (err, Coupon) => {
      if (err) {
        return GOT_ERROR(res, 'coupon');
      }

      if (!Coupon) {
        return DATA_NOT_FOUND_ERROR(res, 'coupon');
      }

      return SEND_DATA(res, Coupon, 'coupon');
    })
  } else {
    CouponModel.find().then(Coupons => {
      if (!Coupons) {
        return DATA_NOT_FOUND_ERROR(res, 'coupons');
      }

      return SEND_DATA(res, Coupons, 'coupons');
    })
  }
}