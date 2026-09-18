import jwt from "jsonwebtoken"

const userAuth= (req,res,next)=>{
    const token=req.cookies?.token;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Unauthorized access"
        })
    }
    try{
        const tokenDecoded=jwt.verify(token,process.env.JWT_SECRET);
        if(typeof tokenDecoded !== "object" || !tokenDecoded?.id){
            return res.status(401).json({
                success:false,
                message:"Invalid token"
            })
        }

        req.user=tokenDecoded;
        return next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Invalid token"
        })
    }}
    export default userAuth;
