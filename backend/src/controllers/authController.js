const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const User = require("../models/User");


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = async (req, res) => {
    try {
      const { token } = req.body;
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const { email, name, picture } = ticket.getPayload();
      let user = await User.findOne({ email });
  
      if (!user) {
        user = await User.create({
          name,
          email,
          profilePicture: picture,
        });
      }
  
      const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
  
      res.json({ token: jwtToken, user });
    } catch (error) {
      res.status(400).json({ message: 'Google authentication failed', error });
    }
};

exports.register = async(req,res)=>{
    try {
        const {name,email,password,role,phone,address,storeName,storeDetails} = req.body;

        //Validate required fields 
        if(!name || !email || !password ||  !phone){
            return res.status(400).send({
                message:"All required fields must be filled"
            });
        }

        // check if user already exists 
        const existingUser = await User.findOne({email});
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

        res.status(200).send({
            message:"User registered successfully",
        });

    } catch (error) {
        res.status(500).send({message:"Internal server error."})
    }
}


exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
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
  
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ message: "Server error." });
    }
  };
  