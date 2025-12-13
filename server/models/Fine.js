const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema({
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reason: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending'
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('Fine', fineSchema);
