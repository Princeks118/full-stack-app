import mongoose  from "mongoose";
import bcrypt from "bcrypt";
const userSchema=new mongoose.Schema({
     name:String,
     email:String,
     password:String,
     role:{
        type:String,
        enum:["user","admin"],
        default:"user",
     },
     isVerified:{
        type:Boolean,
        default:false
     },
     reserPasswordToken:{
          type:String,
     },
     verificationToken:{
        type:String,

     },
     reserPasswordExpires:{
        type:Date,
     },
    

},{
    timestamps:true,
});

userSchema.pre("save",async function(next){
     
   if(this.isModified("password")){
       this.password= await bcrypt.hash(this.password,10);
   }
   next();
})
const User=mongoose.model("User",userSchema);

export default User;