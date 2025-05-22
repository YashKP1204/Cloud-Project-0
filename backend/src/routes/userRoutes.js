const express = require("express");
const { getUserProfile, updateUserProfile, deleteUserAccount } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile",protect,getUserProfile);
router.put("/profile/update",protect,updateUserProfile);
router.delete("/delete", protect,deleteUserAccount);

module.exports = router;
