require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/authRoutes"); 
const userRoutes = require("./routes/userRoutes"); 
const productRoutes = require("./routes/productRoutes"); 

// middleware
app.use(cors());
app.use(express.json());

// test routes

app.get("/",(req,res)=>{
    console.log("testing api is getting called")
    res.status(200).send("E-commerce API is running....");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`server running on port ${PORT}`));