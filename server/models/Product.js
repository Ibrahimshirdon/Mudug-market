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
        required: true,
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    model: {
        type: String,
        trim: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    discount_price: {
        type: Number,
        default: null
    },
    stock: {
        type: Number,
        default: 0
    },
    condition: {
        type: String,
        enum: ['new', 'used', 'refurbished'],
        default: 'new'
    },
    delivery_info: {
        type: String
    },
    delivery_fee: {
        type: Number,
        default: 0
    },
    is_black_friday: {
        type: Boolean,
        default: false
    },
    images: [{
        image_url: { type: String, required: true },
        display_order: { type: Number, default: 0 }
    }]
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for search
productSchema.index({ name: 'text', brand: 'text', model: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
