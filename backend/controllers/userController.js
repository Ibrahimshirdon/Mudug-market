const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;

        // Check if file was uploaded
        if (req.file) {
            // Convert buffer to Base64
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const mimeType = req.file.mimetype;
            user.profilePicture = `data:${mimeType};base64,${b64}`;
        } else if (req.body.profilePicture) {
            // Fallback to URL string if provied manually (though UI will use file)
            user.profilePicture = req.body.profilePicture;
        }

        await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid current password' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Update password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
