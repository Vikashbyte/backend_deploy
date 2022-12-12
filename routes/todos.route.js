const express = require("express")
const { Todo_Model } = require("../models/todos.model")

const todoRouter = express.Router()

todoRouter.get("/", async (req, res) => {
    try {
        let notes = await Todo_Model.find()
        notes ? res.status({ "status": 200, "message": "Request successful" }).send(notes) : res.status({ "status": 404, "message": "Collection not found" }).send("error while fetching all todos")
    } catch (error) {
        console.log('error:', error)
        res.status({ "status": 404, "message": "Collection not found" }).send("error while fetching all todos")
    }
})
todoRouter.post("/create", async (req, res) => {
    const payload = req.body
    console.log('payload:', payload)
    try {
        const todo = new Todo_Model(payload)
        await todo.save()
        res.send("todo created")
    } catch (error) {
        console.log('error:', error)
        res.status(406).send("opertion not allowed")
    }
})

todoRouter.patch("/update/:todoID", async (req, res) => {
const todoID=req.query.todoID
const payload=req.body
try{
    const updated_data=await Todo_Model.findByIdAndUpdate({_id:todoID},payload)
    res.send("data updated")
    
}catch(err){
    console.log('err:', err)
    res.send("err in update")
}
})

todoRouter.delete("/delete/:todoID",async(req,res)=>{
    const todoID=req.query.todoID
    try{
        await Todo_Model.findByIdAndDelete({_id:todoID})
        res.send("data deleted")
        
    }catch(err){
        console.log('err:', err)
        res.send("err in delete")
    }
})

module.exports = { todoRouter }