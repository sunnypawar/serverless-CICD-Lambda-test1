const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()



router.post('/tasks', auth, async (req,res)=>{
    // const task = await new Task(req.body)
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

// app.get('/tasks',(req,res) => {
//     Task.find({}).then((tasks) => {
//         res.send(tasks)
//     }).catch((e) => {
//         res.status(500).send(e)
//     })
// })

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortby=createdAt:desc
// limit skip
router.get('/tasks', auth, async (req,res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    req.query.completed
    try {
        const user = req.user
        await user.populate({
            path: 'tasks',
            match,
            options: {
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
            
        }).execPopulate()

        // const tasks = await Task.find({})
        res.send(user.tasks)
    } catch(e){
        res.status(500).send(e)
    }
})

// app.get('/tasks/:id',(req,res) => {

//     // console.log(req.params)
//     const _id = req.params.id
//     Task.findById(_id).then((task) => {
//         if (!task){
//             return res.status(404).send()
//         }
//         res.send(task)
//     }).catch((e) => {
//         res.status(500).send(e)
//     })
// })

router.get('/tasks/:id', auth, async (req,res) => {

    // console.log(req.params)
    const _id = req.params.id

    try {
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner : req.user._id})

        if (!task){
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {

    }
})

router.patch('/tasks/:id', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['description', 'completed']
    const isValidOperation = updates.every((updates) => allowedUpdate.includes(updates))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Operations'})
    }
    try {
        const task = await Task.findOne({_id:req.params.id, owner:req.user._id})
        // const task = await Task.findById(req.params.id)
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
        if(!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    }
    catch(e) {
        return res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req,res) => {
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        
        res.send(task)
    } catch(e) {
        return res.status(400).send()
    }
})

module.exports = router