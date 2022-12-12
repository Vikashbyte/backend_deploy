const mongoose=require("mongoose")
const userSchema=mongoose.Schema({
    email:{type:String,required:true},
    password:{type:String,required:true},
})
const User_model=mongoose.model("user",userSchema)

module.exports={User_model,userSchema}