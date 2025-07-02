import jwt from 'jsonwebtoken'


const userAuth = async ( req,res,next)=>{
    const {token}=req.headers;
    if(!token){
        return res.json({success:false,message:'not Authorized. Login again'})
    }
    try {
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);

        if(tokenDecode.id){
            // console.log(req.body.userId)
            console.log(tokenDecode);
            req.user = { id: tokenDecode.id };
            // req.body.userId=tokenDecode.id;
        }
        else{
            return res.json({success:false,message:'not Authorized. Login again'})
        }
        next();
    } catch (error) {
        res.json({success:false,message:error.message,auth:true})
    }
}

export default userAuth;

