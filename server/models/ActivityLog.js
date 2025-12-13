const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    action: {
        type: String,
        required: true
    },
    details: {
        type: String
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
