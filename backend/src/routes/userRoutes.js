const express = require("express");
const { getUserProfile, updateUserProfile, deleteUserAccount } = require("../controllers/profileController");
const { protect , authorizeRoles} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile",protect,authorizeRoles('user','seller'),getUserProfile);
router.put("/profile/update",protect,authorizeRoles('user','seller'),updateUserProfile);
router.delete("/delete", protect,authorizeRoles('user','seller'),deleteUserAccount);

module.exports = router;
