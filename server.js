const express = require("express")
const { connection } = require("./config/db")
const { User_model } = require("./models/users.model")
const { todoRouter } = require("./routes/todos.route")
require("dotenv").config()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { authenticate } = require("./middleware/authenticate")
const app = express()
app.use(express.json())

const secret_key = process.env.encoded_key
const salt_Rounds = Number(process.env.salt_rounds)
app.get("/", async (req, res) => {
    res.send("hello")
})

app.post("/signup", async (req, res) => {
    let payload = req.body
    console.log('payload:', payload)
    const { email, password } = payload
    const user_exists = await User_model.findOne({ email })
    console.log('user_exists:', user_exists)
    if (user_exists) {
        res.send("User already exists. try another email")
    }
    try {
        bcrypt.hash(password, salt_Rounds, async function (err, encrytion_password) {
            if (err) {

                console.log('err:', err)
                res.send("err in bcrypt")
            } else {
                let new_user = new User_model({ email, password: encrytion_password })
                console.log('new_user:', new_user)
                await new_user.save()
                res.send("user sign up successful")
            }
        });
    } catch (error) {
        console.log('error:', error)
        res.send("err in sign up")
    }

})

app.post("/login",async(req,res)=>{
    const payload=req.body
    const {email,password}=payload
    console.log('payload:', payload)
    try {
        const user=await User_model.find({email})
        console.log('user:', user)
        if(user.length>0){
            const encrypted_password=user[0].password
            console.log('encrypted_password:', encrypted_password)
            bcrypt.compare(password,encrypted_password, async(err,result)=>{
                if(err){
                    console.log('err:', err)
                    console.log("err in login bcrypt")
                    res.send("error occured")
                }else{
                    if(result){
                        let token=jwt.sign({"userId":user[0]._id},secret_key)
                        res.send({"message":"login successful","token":token})
                    }else{
                        console.log("login failed")
                        res.send("login failed")
                    }
                }
            })
            // res.send(encrypted_password)
        }
    // res.send("hi")
        
    } catch (error) {
        console.log('error:', error)
        res.send("err in login catch")
    }
})
app.use(authenticate)
app.use("/todos", todoRouter)

const PORT=process.env.PORT||8080
app.listen(PORT, async () => {
    try {
        await connection
        console.log(`listening on http://localhost:${process.env.port}`)
    } catch (err) {
        console.log('err:', err)
    }
})