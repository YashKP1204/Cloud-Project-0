const User = require("../models/User");

// @desc    Fetch user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        console.log("Fetching user profile..."); // Debugging line
        const user = await User.findById(req.user._id).select("-password");
        console.log("User found:", user); // Debugging line
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    console.log("Update user profile called"); // Debugging line
    try {
        console.log("Updating user profile..."); // Debugging line
        let user;
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        const { name, phone, address, profilePicture } = req.body;
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (profilePicture) user.profilePicture = profilePicture;
        const updatedUser = await User.findByIdAndUpdate(req.user.id, user, { new: true });
        await user.save();
        res.json({ success: true, message: "Profile updated successfully" ,user});
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// @desc    Delete user account
// @route   DELETE /api/user/delete
// @access  Private
const deleteUserAccount = async (req, res) => {
    console.log("Delete user account called"); // Debugging line
    try {
        console.log("USER: ",req.user)
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        await User.deleteOne({ _id: req.user.id });
        res.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { getUserProfile, updateUserProfile, deleteUserAccount };
