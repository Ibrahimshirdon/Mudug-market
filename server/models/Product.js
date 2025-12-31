const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    shop_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    brand: String,
    model: String,
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    discount_price: Number,
    stock: {
        type: Number,
        default: 0
    },
    condition: {
        type: String,
        enum: ['new', 'used', 'refurbished'],
        default: 'new'
    },
    delivery_info: String,
    delivery_fee: {
        type: Number,
        default: 0
    },
    is_black_friday: {
        type: Boolean,
        default: false
    },
    is_out_of_stock: {
        type: Boolean,
        default: false
    },
    images: [{
        image_url: String,
        display_order: {
            type: Number,
            default: 0
        }
    }],
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

module.exports = mongoose.model('Product', productSchema);
