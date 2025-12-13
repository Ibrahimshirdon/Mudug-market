const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Ensure a user can only favorite a product once
favoriteSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
