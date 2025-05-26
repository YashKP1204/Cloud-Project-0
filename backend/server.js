require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
const app = express();
const authRoutes = require("./src/routes/authRoutes"); 
const userRoutes = require("./src/routes/userRoutes"); 
const productRoutes = require('./src/routes/productRoutes');
const shopRequestRoutes = require("./src/routes/shopRequestRoutes");
const shopAdminRoutes = require('./src/routes/shopAdminRoutes');




// middleware
app.use(cors());
app.use(express.json());

// test routes

app.get("/",(req,res)=>{
    console.log("testing api is getting called")
    res.status(200).send("E-commerce API is running....");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use('/shop/:shopId/products',productRoutes);
app.use('/shop', shopRequestRoutes);
app.use('/admin', shopAdminRoutes);

// app.use("/api/products", productRoutes);
const PORT = process.env.PORT || 5000;

const mongoConnect = async()=>{
    mongoose.connect(process.env.MONGO_URI);
}

mongoConnect().then(()=>{
    console.log("Successfully connected to the database");
}).catch((err)=>{
    console.log("Error detected to connect db: ", err);    
})

app.listen(PORT,()=>console.log(`server running on port ${PORT}`));