const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a shop name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    license: {
        type: String,
        default: null
    },
    logo_url: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected', 'suspended'],
        default: 'pending'
    },
    rejection_reason: {
        type: String,
        default: null
    },
    documents_url: {
        type: String,
        default: null
    },
    payment_method: {
        type: String,
        default: null
    },
    views: {
        type: Number,
        default: 0
    },
    balance: {
        type: Number,
        default: 0
    },
    is_active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for products
shopSchema.virtual('products', {
    ref: 'Product',
    localField: '_id',
    foreignField: 'shop_id',
    justOne: false
});

module.exports = mongoose.model('Shop', shopSchema);
