'use strict'

// *** For Schema Status Property Enum ***
const StatusInactive = 'Inactive';
const StatusActive = 'Active';
const SchemaStatusPropertyEnum = {
    values: [StatusActive, StatusInactive],
    message: '{VALUE} is not supported'
};

// *** Enum For AddressOf Property in Address ***
const AddressOfCompany = 'Company';
const AddressOfCustomer = 'Customer';
const AddressOfVendor = 'Vendor';
const SchemaAddressOfPropertyEnum = {
    values: [AddressOfCompany, AddressOfCustomer, AddressOfVendor],
    message: '{VALUE} is not supported'
};

// *** Enum For Discount type Property ***
const PercentDiscountType = 'percent';
const AmountDiscountType = 'amount';
const DiscountTypeEnum = {
    values: [PercentDiscountType, AmountDiscountType],
    message: '{VALUE} is not supported'
};

// *** Enum For Banner type Property ***
const BannerTypeCategory = 'Category';
const BannerTypeProduct = 'Product';
const BannerTypeEnum = {
    values: [BannerTypeCategory, BannerTypeProduct],
    message: '{VALUE} is not supported'
};

// *** Enum For Flash Banner type Property ***
const BannerTypeBrand = 'Brand';
const FlashBannerTypeEnum = {
    values: [BannerTypeCategory, BannerTypeProduct, BannerTypeBrand],
    message: '{VALUE} is not supported'
};

// *** Enum For Discount target type Property ***
const DiscountTargetTypeCustomer = 'Customer';
const DiscountTargetTypeVendor = 'Vendor';
const DiscountTargetTypeAll = 'All'
const DiscountTargetTypeEnum = {
    values: [DiscountTargetTypeCustomer, DiscountTargetTypeVendor, DiscountTargetTypeAll],
    message: '{VALUE} is not supported'
};

// *** Validations ***
const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
const EmailAddressValidation = {
    type: String, trim: true, lowercase: true, unique: true, required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
};

const MobileNumberValidation = {
    type: Number, validate: { validator: function (v) { return /d{10}/.test(v); }, message: '{VALUE} is not a valid 10 digit number!' }
};


module.exports = Object.freeze({
    StatusInactive,
    StatusActive,
    SchemaStatusPropertyEnum,

    AddressOfCompany,
    AddressOfCustomer,
    AddressOfVendor,
    SchemaAddressOfPropertyEnum,

    PercentDiscountType,
    AmountDiscountType,
    DiscountTypeEnum,

    BannerTypeCategory,
    BannerTypeProduct,
    BannerTypeEnum,

    BannerTypeBrand,
    FlashBannerTypeEnum,

    DiscountTargetTypeCustomer,
    DiscountTargetTypeVendor,
    DiscountTargetTypeAll,
    DiscountTargetTypeEnum,

    EmailAddressValidation,
    MobileNumberValidation
});