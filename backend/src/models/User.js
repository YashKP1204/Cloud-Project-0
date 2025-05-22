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
        googleId:{
            type:String,
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
        storeName:{
            type:String,
            required:function (){
                return this.role === "seller";
            },
        },
        storeDetails:{
            type:String,
            required:function(){
                return this.role === "seller";
            }
        }
    },
    {
        timestamps:true
    }
);
module.exports = mongoose.model("User",UserSchema);