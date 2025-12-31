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
    reason: String,
    status: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Fine', fineSchema);
