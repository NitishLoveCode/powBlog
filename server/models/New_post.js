const mongoose= require("mongoose")

const newPost_schema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
    },
    description:{
        type:String,
        trim:true,
    },
    content:{
        type:String,
        trim:true,
    },
    thumbnail:{
        type:String,
        trim:true,
    },
    postedBy:{
        type:String,
        trim:true
    },
    user_name:{
        type:String,
        trim:true
    },
    created :{ type : Date,
         default: Date.now 
        }
})

const new_post=new mongoose.model("AllPost",newPost_schema)

module.exports =new_post
