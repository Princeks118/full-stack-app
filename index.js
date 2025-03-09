
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";  // kahi baar .js likhna pdega

// import all routes
import userRoutes from "./routes/user.routes.js";
const app=express();
dotenv.config();  // path folder to write in this if it is inseide some filder

app.use(cors({
    origin: process.env.BASE_URL,
    credentials:true,
    methods: ['GET', 'POST', 'DELETE','OPTIONS'],
    allowedHeaders:['content-Type','Authorization']
}));

app.use(express.json());  // to accept json files
app.use(express.urlencoded({extended:true}));
const port=process.env.PORT || 4000;

// connect to db
db();

// app is now web server 
// req is request to server 
// res is respose from  server
app.get("/",(req,res)=>{
     res.send("cohort!");
     
});

// this callback is also called controller 
app.get("/prince",(req,res)=>{
   res.send("prince bro !");
});

app.use("/api/v1/users",userRoutes);


app.listen(port,()=>{
    console.log(`app is listening to ${port}`);
});