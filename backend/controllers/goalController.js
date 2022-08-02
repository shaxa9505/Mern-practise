const asyncHandler = require("express-async-handler")


const Goal = require("../models/goalModel")
const User = require("../models/userModel")

const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({user: req.user.id})

    res.status(200).json(goals)
})

const postGoal = asyncHandler(async (req, res) => {
    if(!req.body.text) {
        res.status(400).json({
            message: "Please add a text field"
        })
    }

    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })

    res.status(200).json(goal)
})

const putGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id)

    if(!goal) {
        res.status(400)
        throw new Error("Goal not found")
    }

    // const user = await User.findById(req.user.id);


    // Check for user 
    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    // Make sure the logged in user matches the goal user
    if(goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {new: true})
    
    res.status(200).json(updatedGoal)
})

const deleteGoal = asyncHandler(async (req, res) => {

    const goal = await Goal.findById(req.params.id);

    if(!goal) {
        res.status(400)
        throw new Error("Goal not found")
    }

    // const user = await User.findById(req.user.id);


    // Check for user 
    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    // Make sure the logged in user matches the goal user
    if(goal.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error("User not authorized")
    }

    // 1-yuli
    await goal.remove()

    // 2-yuli 
    const deleteGoal = await Goal.findByIdAndDelete(req.params.id)

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getGoals,
    postGoal,
    putGoal,
    deleteGoal
}