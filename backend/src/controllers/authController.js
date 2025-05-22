const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const User = require("../models/User");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
  console.log("Google authentication request received:", req.body);
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    console.log("Google token verified:", ticket);

    const { email, name, picture } = ticket.getPayload();
    let user = await User.findOne({ email });
    console.log("User found in database:", user);

    if (!user) {
      console.log("User not found, creating new user...");
      user = await User.create({
        name,
        email,
        profile: picture,
        googleId: ticket.getPayload().sub,
      });
      console.log("New user created:", user);
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error("Google authentication failed:", error);
    res.status(400).json({ message: 'Google authentication failed', error });
  }
};





exports.register = async(req,res)=>{
    try {
      console.log("Registering user...")
        // Get user data from request body
        const {name,email,password,role,phone,address,storeName,storeDetails} = req.body;
        console.log("User data:", req.body);
        // Check if all required fields are provided
        //Validate required fields 
        if(!name || !email || !password ||  !phone){
            return res.status(400).send({
                message:"All required fields must be filled"
            });
        }

        // check if user already exists 
        const existingUser = await User.findOne({email});
        console.log("Existing user:", existingUser);
        if(existingUser){
            return res.status(400).send({
                message:"User already exists",
            });
        }

        //validate seller fields
        if (role === "seller" && (!address || !storeName || !storeDetails)) {
            return res.status(400).json({ message: "Sellers must provide store details." });
        }

        //Hash the password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        console.log("Hashed password:", hashedPassword);

        //create user 

        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            role:role||"customer",
            phone,
            address,
            storeName,
            storeDetails,
        });


        await newUser.save();
        console.log("New user created:", newUser);
        // Generate JWT Token
      const token = jwt.sign(
        { userId: newUser._id, role:newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      console.log("Generated token:", token);
        // Send response

        res.status(200).json({
            message:"User registered successfully",
            token,
            user:newUser
        });

    } catch (error) {
        res.status(500).send({message:"Internal server error."})
    }
}


exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log("Login attempt with email:", email);
      console.log("Login attempt with password:", password);
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
      }
  
      // Check user existence
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials." });
      }
  
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }
  
      // Generate JWT Token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
      res.status(200).json({ token, user });
    } catch (error) {
      res.status(500).json({ message: "Server error." });
    }
  };
  