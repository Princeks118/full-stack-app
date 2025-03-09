
import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const registerUser=async(req,res)=>{
    // get data feom req body
    // validate
    // check if user already exist
    // if not create usern in db
    // generate a verification token
    // save toekn in db
    // send token as email to user 
    // send sucess stqatus to user 
    
    const {name ,email,password}=req.body;
    if(!name || !email || !password){
         return res.status(400).json({
            message:"All fields are reuired",
         })
    
    }

    try {
       const existingUser= await User.findOne({email});
       if(existingUser){
         
         res.status(400).json({
            message:"User alreay exists",
         })

       }
      const newUser= await User.create({
           name,
           email,
           password
       });
       console.log(newUser);
       if(!newUser){
        res.status(400).json({
            message:"User not registered",
         })
       };

      const token= crypto.randomBytes(30).toString("hex");
      console.log(token);
      newUser.verificationToken=token;  // check in user schema
      await newUser.save();
      
      // send email
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_TRAP_HOST,
        port: process.env.MAIL_TRAP_HOST,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.MAIL_TRAP_USERNAME,
          pass: process.env.MAIL_TRAP_PASS,
        },
      });
      
      const mailoption={
        from: process.env.MAIL_TRAP_SENDEREMAIL,
        to: newUser.email,
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
        TEXT: `PLEASE CLICK ON THE FOLLOWING LINK
        ${process.env.BASE_URL}/api/v1/users/verify/${token}
        `
         
      };
      await transporter.sendMail(mailoption);

      res.status(200).json({
         message:"user registered sucessfully",
         sucess:true,
      })
    
       
    } catch (error) {

        res.status(400).json({
            message:"user not registered sucessfully",
            error,
            sucess:false,
         })
        
    }
    
   
};

const verifyUser=async(req,res)=>{
    // get token from url
    // validate token
    // find user based on token
    // if not
    // set isverfied to true
    // remove verifiecation token got verified
    // save 
    // return respose 
    const {token}=req.params;  // oruter.get wale colmn se aaya h req.param
    console.log(token);
    if(!token){
        res.status(400).json({
            message:"INVALID TOKEN",
        })
    }
    const existuser=await User.findOne({verificationToekn:token});
    if(!existuser){
        res.status(400).json({
            message:"INVALID TOKEN",
        })
    };

    existuser.isVerified=true;
    existuser.verificationToekn=undefined;
    await existuser.save();
    



};

const login=async(req,res)=>{
     
    const {email,passowrd}=req.body;
    if(!email || !passowrd){
        return  res.status(400).json({
            message:"All fileds are required",
         })
    }

    try {
        
     const isUser= await User.findOne({email});
     if(!isUser){
        return  res.status(400).json({
            message:"User not found",
         })
     };
     // ab password ko hash krke check
     const isMatch=await bcrypt.compare(passowrd,isUser.password);
     console.log(isMatch);
     if(!isMatch){
        return  res.status(400).json({
            message:"User not found maybe wrong passowrd",
         })
     }

    const token = jwt.sign({id:isUser._id}, "shhhhh",{
        expiresIn:'24h'
    });
    

    const cookieoption={
      httpOnly:true,
      secure:true,
      maxAge:24*60*60^1000,

    };

    res.cookie("token",token,{cookieoption});
    
    // user ke pass token chala gya
    res.status(200).json({
     message:"login sucessfull",
     token,
     user:{
       id:existuser._id,
       name:existuser.name,
       role:existuser.role,
     }
    });



    } catch (error) {
        res.status(200).json({
         
         message:"INVALID",
        
        })
        
        
     }
}

export {registerUser,verifyUser,login};
