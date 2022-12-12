

const jwt=require("jsonwebtoken")
require("dotenv").config()
const secret_key = process.env.encoded_key


const authenticate=(req,res,next)=>{
const token=req.headers?.authorization?.split(" ")[1]
console.log('token:', token)
if(token){
    var loggedin=jwt.verify(token,secret_key,(err,loggedin)=>{
        if(err){
            console.log('err:', err)
            res.send("error in authenticate")
        }else if(loggedin){
            console.log('loggedin:', loggedin)
            const userId=loggedin.userId
            req.body.userId=userId
                next()
            
        }
    })
}else{
    res.secret_key("token not found")
}
}

module.exports={authenticate}