const mongoose =  require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        profile:{
            type:String
        },        
        password:{
            type:String,
        },
        googleId: { type: String }, // Store Google OAuth ID
        phone:{
            type:String,
        },
        role:{
            type:String,
            enum:["customer","admin","seller"],
            default:"customer",
        },
        address:{
            type:String,    
        },       
    },
    {
        timestamps:true
    }
);
module.exports = mongoose.model("User",UserSchema);