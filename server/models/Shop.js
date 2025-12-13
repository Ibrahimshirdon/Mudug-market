const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'deactivated'],
        default: 'pending'
    },
    balance: {
        type: Number,
        default: 0.00
    },
    subscription_status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
    },
    subscription_expiry: {
        type: Date,
        default: null
    },
    logo_url: {
        type: String,
        default: null
    },
    location: {
        type: String
    },
    license: {
        type: String,
        default: null
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Shop', shopSchema);
