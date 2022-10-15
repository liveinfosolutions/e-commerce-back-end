'use strict'

import { validateEmail } from '../customer.model';

// *** For Schema Status Property Enum ***
export const StatusInactive = 'Inactive';
export const StatusActive = 'Active';
export const SchemaStatusPropertyEnum = {
    values: [StatusActive, StatusInactive],
    message: '{VALUE} is not supported'
};

// *** Enum For AddressOf Property in Address ***
export const AddressOfCompany = 'Company';
export const AddressOfCustomer = 'Customer';
export const AddressOfVendor = 'Vendor';
export const SchemaAddressOfPropertyEnum = {
    values: [AddressOfCompany, AddressOfCustomer, AddressOfVendor],
    message: '{VALUE} is not supported'
};

// *** Enum For Discount type Property ***
export const PercentDiscountType = 'percent';
export const AmountDiscountType = 'amount';
export const DiscountTypeEnum = {
    values: [PercentDiscountType, AmountDiscountType],
    message: '{VALUE} is not supported'
};

// *** Enum For Banner type Property ***
export const BannerTypeCategory = 'Category';
export const BannerTypeProduct = 'Product';
export const BannerTypeEnum = {
    values: [BannerTypeCategory, BannerTypeProduct],
    message: '{VALUE} is not supported'
};

// *** Enum For Flash Banner type Property ***
export const BannerTypeBrand = 'Brand';
export const FlashBannerTypeEnum = {
    values: [BannerTypeCategory, BannerTypeProduct, BannerTypeBrand],
    message: '{VALUE} is not supported'
};

// *** Enum For Discount target type Property ***
export const DiscountTargetTypeCustomer = 'Customer';
export const DiscountTargetTypeVendor = 'Vendor';
export const DiscountTargetTypeAll = 'All'
export const DiscountTargetTypeEnum = {
    values: [DiscountTargetTypeCustomer, DiscountTargetTypeVendor, DiscountTargetTypeAll],
    message: '{VALUE} is not supported'
};

// *** Email Address Validation ***
const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
export const EmailAddressValidation = {
    type: String, trim: true, lowercase: true, unique: true, required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
};

// *** Mobile Number Validation ***
export const MobileNumberValidation = {
    type: Number, validate: { validator: function (v) { return /d{10}/.test(v); }, message: '{VALUE} is not a valid 10 digit number!' }
};