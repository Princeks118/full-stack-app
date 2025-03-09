import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
// export a function that connect to db

const db=()=>{
    mongoose.connect(process.env.MONGO_URL)
.then(()=>{
     console.log("database connected")
})
.catch((e)=>{
  
    console.log("failed to connect database");
})
};

export default db;