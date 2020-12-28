const mongoose = require('mongoose')
const envs = require('../env');
// const validator = require('validator')

// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
mongoose.connect(process.env.MONGODB_URL,{    
// mongoose.connect(secrets.MONGODB_URL,{  
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true
})

// const User = mongoose.model('User',{
//     name:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     email:{
//         type:String,
//         required:true,
//         trim:true,
//         lowercase:true,
//         validate(value){
//             if (!validator.isEmail(value)) {
//                 throw new Error('Email is Invalid')
//             }
//         }
//     },
//     password:{
//         type:String,
//         required:true,
//         trim:true,
//         validate(value) {
//             if(!validator.isLength(value,{min:7,max: undefined})){
//                 throw new Error('Password lengh must be > 6!!!')
//             }

//             if(value.toLowerCase() === 'password') {
//                 throw new Error('Bad Password!!!')
//             }
//         }
//     },
//     age:{
//         type:Number,
//         default:0,
//         validate(value){
//             if(value < 0){
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     }
// })

// const me = new User({
//     name:'   Sunny Pawar#3       ',
//     email:'Sunny.s.Pawaer@gmail.com',
//     password:'Password'
//     // age:30
// })

// me.save().then(() =>{
//     console.log(me)
// }).catch((error) => {
//     console.log("error" , error)
// })

// const Task = mongoose.model('Tasks',{
//     description: {
//                 type:String, 
//                 required:true,
//                 trim:true
//     },
//     completed:{
//                 type:Boolean,
//                 default:false
//     }
// })

// const mytask = new Task({
//     description:'  Third Task   ',
//     completed:true
// })

// mytask.save().then(() => {
//     console.log(mytask)
// }).catch((error) => {
//     console.log("Error" , error)
// })