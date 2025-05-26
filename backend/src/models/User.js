const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        profile: {
            type: String
        },
        password: {
            type: String,
        },
        googleId: { type: String }, // Store Google OAuth ID
        phone: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user", "admin", "seller"],
            default: "user",
        },
        address: {
            type: String,
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop',
            default: null,
            validate: {
                validator: function (value) {
                    // If role is 'seller', shop must not be null
                    if (this.role === 'seller') {
                        return value !== null;
                    }
                    return true;
                },
                message: 'Sellers must have an associated shop.'
            }
        },
        orderHistory:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            }
        ],
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            }
        ],

    },
    {
        timestamps: true
    }
);
module.exports = mongoose.model("User", UserSchema);