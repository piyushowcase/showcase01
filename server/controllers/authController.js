import bcrypt from "bcryptjs"
import { userModel } from "../models/userModel.js"
import jwt from "jsonwebtoken"
import transporter from "../config/nodemailer.js" 
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplate.js'
export const register= (async(req,res)=>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            success:false,
            message:"Please provide all required details"
        });
    } try{
        const existingUser= await userModel.findOne({email})
        if(existingUser){
            return res.json({success:false, message:"User already exists"});
        }
        const hashedPassword= await bcrypt.hash(password,10);
        const user= new userModel({name,email,password:hashedPassword})
        await user.save();
        const token= jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
        res.cookie('token',token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === 'PRODUCTION',
            sameSite:process.env.NODE_ENV ==='PRODUCTION'?'none':'strict',
            maxAge:7*24*60*60*1000
        })
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Welcome to Aura Authentication",
            text: `Welcome to aura authentication website. Your account has been created with email id: ${email}`
        }
        await transporter.sendMail(mailOptions);
return res.json({success:true})
    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
})
export const login =async(req,res)=>{
    
    console.log("kkkk")
    const {email,password}=req.body;
    if(!email || !password){
        return res.json({success: false,message :'email and password are required'})
    }
    console.log("kkkk")
    try{
        const user= await userModel.findOne({email})
        
    console.log("kkkk")
        if(!user){
            
    console.log("kkkk")
            return res.json({success:false,message:"User not found"})
        }
        
    console.log("kkkk")
        const isMatch= await bcrypt.compare(password,user.password)
        if(!isMatch){
            
    console.log("kkkk")
            return res.json({success:false,message:"Invalid credentials"})
        }
        const token= jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
console.log("hhhh")
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
        res.cookie('token',token,cookieOptions)
        return res.json({success:true})
    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}
export const logout=async(req,res)=>{
    try{

const isProduction = process.env.NODE_ENV === "production";

        res.clearCookie('token',{
             httpOnly:true,
 secure: isProduction,
  sameSite: isProduction ? "none" : "lax",        

        })
        return res.json({success:true, message:"Logged out successfully"} )
    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        });
    }}
   
   
    export const sendVerifyOtp=async(req,res)=>{
    try{
const userId=req.user.id;
const user= await userModel.findById(userId);
if(!user){
    return res.json({success:false,message:"User not found"})
}
if(user.isAccountVerified){
    return res.json({success:false,message:"Account already verified"})
}
const otp= String(Math.floor(100000 + Math.random()*900000));
user.verifyOTP=otp;
user.verifyOTPExpireAt= Date.now() + 24*60*60*1000;
await user.save();
const mailOptions={
    from:process.env.SENDER_EMAIL,
    to:user.email,
    subject:"Verify your account",
    // text:`Your OTP for account verification is ${otp}. It will expire in 24 hours.`,
    html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
}
await transporter.sendMail(mailOptions);
return res.json({success:true,message:"OTP sent to your email"})
    }    catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        });
    
    }
}
export const verifyEmail=async(req,res)=>{
    const {otp}=req.body;
    const userId=req.user.id;
    if(!otp){
        return res.json({success:false,message:"OTP is required"})
    }
    try{
const user =await userModel.findById(userId);
if(!user){
    return res.json({success:false,message:"User not found"})
}
if(user.verifyOTP==='' || user.verifyOTP!==otp){
    return res.json({success:false,message:"Invalid OTP"})
}
if(user.verifyOTPExpireAt<Date.now()){
    return res.json({success:false,message:"OTP expired"})
}
user.isAccountVerified=true;
user.verifyOTP="";
user.verifyOTPExpireAt=0;
await user.save();
return res.json({success:true,message:"email verified successfully"})

    }catch(e){
        res.status(500).json({success:false,message:e.message})
    }

}
export const isAuthenticated= async(req,res)=> {
    const token= req.cookies?.token;
      if (!token) {
        return res.json({
            success: true,
            isAuthenticated: false,
            user: null
        });
    }
    try{
        if(!req.user?.id){
            return res.status(401).json({success:false,message:"Unauthorized access"})
        }

        const user=await userModel.findById(req.user.id).select("-password -verifyOTP -verifyOTPExpireAt -resetOTP -resetOTPExpired")
        if(!user){
            return res.status(401).json({success:false,message:"User not found"})
        }

        return res.json({success:true,user})
    }catch(e){
        return res.status(500).json({success:false,message:e.message})
    }
}
//send reset otp
export const sendResetOtp=async(req,res)=>{
    
        const {email}=req.body;
        if(!email){
            return res.json({success:false,message:"Email is required"})
        }
        try{
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        const otp=String(Math.floor(100000 + Math.random()*900000));
        user.resetOTP=otp;
        user.resetOTPExpired=Date.now() + 15*60*1000;
        await user.save();
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:"Reset your password",
            // text:`Your OTP for password reset is ${otp}. It will expire in 15 minutes.`
          html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)

        };
        await transporter.sendMail(mailOptions);
        return res.json({success:true,message:"OTP sent to your email"})
    }catch(error){
        res.status(500).json({
            success:false,
            message: error.message
        });
    }
}
//reset user passward
export const resetPassword=async(req,res)=>{
    const {email,otp,newPassword}=req.body; 
    if(!email || !otp || !newPassword){
        return res.json({success:false,message:"Email, OTP and new password are required"})
    }
try{
    const user=await userModel.findOne({email});
    if(!user){
        return res.json({success:false,message:"User not found"})
    }
    if(user.resetOTP ===""|| user.resetOTP !== otp){
        return res.json({success:false,message:"Invalid OTP"})
    }
    if(!user.resetOTPExpired || user.resetOTPExpired < Date.now()){
        return res.json({success:false,message:"OTP expired"})
    }
    user.password=await bcrypt.hash(newPassword,10);
    user.resetOTP="";
    user.resetOTPExpired=0;
    await user.save();
    return res.json({success:true,message:"Password reset successfully"})
}catch(error){
    res.status(500).json({
        success:false, message: error.message
    })
}   }