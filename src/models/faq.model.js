//------------------------------------------IMPORTS--------------------------------
'use strict'
const mongoose = require('mongoose');
const { SchemaStatusPropertyEnum, StatusInactive } = require('./common/shared-btw-models');
//---------------------------------------------------------------------------------

// todo -> Faq category Schema
const FaqCategorySchema = mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusInactive }
}, { timestamps: true });

// todo -> Faq Schema
const FaqSchema = mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    faqCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'FaqCategories', requierd: true },
    status: { type: String, enum: SchemaStatusPropertyEnum, default: StatusInactive }
}, { timestamps: true });

exports.FaqModel = mongoose.model('Faqs', FaqSchema);
exports.FaqCategoryModel = mongoose.model('FaqCategories', FaqCategorySchema);