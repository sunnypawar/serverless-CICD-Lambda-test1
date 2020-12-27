const express = require('express')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')
const router = new express.Router()

// router.get('/test', (req,res) => {
//     res.send('This is from my other router')
// })


// app.post('/users',(req,res)=>{
//     const user = new User(req.body)

//     user.save().then(() => {
//         res.status(201).send(user)
//     }).catch((e) => {
//         res.status(400).send(e)
//     })
// })

const upload = multer({
    // dest: 'avatars',
    limits: {
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        // if(!file.originalname.endsWith('.pdf')) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('File must be jpg,jpeg or png'))
        }
        cb(undefined, true)

        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)
    }
})
router.post('/users/me/avatar',auth, upload.single('avatar'), async (req,res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()

    req.user.avatar =  buffer
    await req.user.save()
    res.send()
}, (error,req,res,next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req,res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()

        res.send()
    } catch(e) {
        return res.status(400).send()
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch(e) {
        res.status(404).send()
    }
})

router.post('/users', async (req,res)=>{
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()

        res.status(201).send({ user, token })
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/login', async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async(req,res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

// app.get('/users',(req,res) => {
//     User.find({}).then((users) => {
//         res.send(users)
//     }).catch((e) => {
//         res.status(500).send(e)
//     })
// })

router.get('/users/me', auth, async (req,res) => {
    // try {
    //     const users = await User.find({})
    //     res.send(users)
    // } catch(e) {
    //     res.status(500).send(e)
    // }
    res.send(req.user)
})


// app.get('/users/:id',(req,res) => {

//     // console.log(req.params)
//     const _id = req.params.id
//     User.findById(_id).then((user) => {
//         if (!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }).catch((e) => {
//         res.status(500).send(e)
//     })
// })

// router.get('/users/:id', async (req,res) => {
//     const _id = req.params.id
//     try {
//         const user = await User.findById(_id)
//         if (!user){
//             return res.status(404).send()
//         }
//         res.send(user)
//     }catch (e) {
//         res.status(500).send(e)
//     }
// })

router.patch('/users/me', auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((updates) => allowedUpdate.includes(updates))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid Operations'})
    }
    try {
        // const user = await User.findById(req.params.id)

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
        // if(!req.user) {
        //     return res.status(404).send()
        // }
        res.send(req.user)
    }
    catch(e) {
        return res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req,res) => {
    try{
        // const user = await User.findByIdAndDelete(req.user._id)
        // if(!user){
        //     return res.status(404).send()
        // }
        await  req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch(e) {
        return res.status(400).send()
    }
})

module.exports = router