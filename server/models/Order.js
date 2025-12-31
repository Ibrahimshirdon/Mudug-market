const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    name: String,
    image_url: String
});

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    items: [orderItemSchema],
    total_amount: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        default: 'cod'
    },
    payment_status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'completed', 'cancelled'],
        default: 'pending'
    },
    shipping_address: {
        type: Object,
        required: true
    },
    phone: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
