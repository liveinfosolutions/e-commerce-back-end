//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const {
    SchemaStatusPropertyEnum,
    StatusActive,
    SchemaAddressOfPropertyEnum,
    MobileNumberValidation
} = require('./common/shared-btw-models');
//---------------------------------------------------------------------------------

// todo -> Location Co-ordinates Schema
const CoOrdinatesSchema = Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
}, { _id: false });

// todo -> Country Schema
const CountrySchema = mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
});

// todo -> State Schema
const StateSchema = mongoose.Schema({
    name: { type: String, required: true },
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Countries', required: true },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusActive }
});

// todo -> Address Schema
export const AddressSchema = mongoose.Schema({
    country: { type: mongoose.Schema.Types.ObjectId, ref: 'Countries', required: true },
    fullName: { type: String, required: true },
    mobileNumber: MobileNumberValidation,
    pincode: { type: String, required: true }, //! Need to add validator for pincode
    address: { type: String, required: true }, // Flat, House no., Building, Company, Apartment
    street: { type: String, required: true }, // Area, Street, Sector, Village
    landmark: { type: String, required: true }, // E.g. near government hospital
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'States', required: true },
    city: { type: String, required: true },
    isDefaultAddress: { type: Boolean, required: true, default: false },
    addressType: { type: String, required: true }, // E.g. Home(7am - 9pm) or Office(10am - 6pm)
    addressOf: { type: String, enum: SchemaAddressOfPropertyEnum, required: true },
    location: CoOrdinatesSchema,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', index: true }
}, { timestamps: true });

exports.AddressModel = mongoose.model('Addresses', AddressSchema);
exports.CountryModel = mongoose.model('Countries', CountrySchema);
exports.StateModel = mongoose.model('States', StateSchema);
