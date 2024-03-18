const http = require("http")
const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const Server=require("socket.io")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const userModel=require("./Models/userModel")
const messageModel=require('./Models/messageModel')
const { info } = require("console")

const app=express();
app.use(cors());
app.use(express.json());
const server=http.createServer(app)
const io=Server(server)

mongoose.connect("mongodb://localhost:27017/chat-app")
.then(()=>{
    console.log("Database connected successfully")
})
.catch((err)=>{
    console.log(err)
})

//endpoint for register
app.post("/register",(req,res)=>{
 
    let user=req.body;
    console.log(user)

    bcrypt.genSalt(10,(err,salt)=>{
        if(!err){
            bcrypt.hash(user.password,salt,async (err,hashPassword)=>{
                user.password=hashPassword;
                try
                {
                    let doc=await userModel.create(user)
                    res.status(201).send({message:"User Registered Successful"})
                }
                catch(err)
                {
                    console.log(err);
                    res.status(500).send({message:"Some Problem"})
                }
            })
        }
    })

})

//endpoint for login
app.post("/login", async(req,res)=>{
    let userCred=req.body;

    try
    {
        const user=await userModel.findOne({email:userCred.email})
        if(user!==null)
        {
            bcrypt.compare(userCred.password,user.password,(err,success)=>{
                if(success==true)
                {
                    //create token and send to the client
                    jwt.sign({email:userCred.email},"user-info1",(err,token)=>{
                        if(!err)
                        {
                            res.send({message:"Login Success",token:token,userid:user._id,name:user.name,avatarImage:user.avatarImage});
                        }
                        else
                        {
                            res.status(500).send({message:"Some issue while creating Token"})
                        }
                    })
                }
                else
                {
                    res.status(403).send({message:"Incorrect Password"})
                }
            })
        }
        else
        {
            res.status(404).send({message:"User Not Found"})
        }
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:"Some Problem!"})
    }

})

//endpoint to set avatar
app.post("/setAvatar/:id",(req,res)=>{
    let avatarImage=req.body.image;
    userModel.updateOne({_id:req.params.id},{avatarImage:avatarImage,isAvatarImageSet:true})
    .then((info)=>{
        res.send({message:"Updated Avatar"})
    })
    .catch((err)=>{
        console.log(err);
        res.send({message:"Some Problem"})
    })

})

//endpoint for get all user data
app.get("/allusers/:id",async(req,res)=>{
    try
    {
         let users=await userModel.find({/*_id:{$ne:req.params.id}*/}).select([
            "email",
            "name",
            "avatarImage",
            "_id"
        ])
        if(users.length!=0)
        {
            res.send(users)
        }
        else
        {
            res.status(404).send({message:"Users Not Found"})
        }
        // res.send(users)
        // console.log(users)
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({message:"Some problem to get users data"})
    }
})

// messages endpoint
app.post("/addmsg",(req,res)=>{
    try
    {
        const {from,to,message}=req.body;
        messageModel.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        })
        .then((data)=>{
            res.send({message:"message added successfully"})
        })
        .catch((err)=>{
            console.log(err)
            res.send({message:"Failed to add message"})
        })
    }
    catch(err)
    {
        console.log(err)
    }
    
})

app.post("/getmsg",(req,res)=>{
    
    try
    {
        const {from,to}=req.body;
        const messages=messageModel.find({users:{$all:[from,to]}})
        .sort({updatedAt:1})

        const projectedMessages=messages.map((msg)=>{
            return{
                fromSelf:msg.sender.toString()===from,
                message: msg.message.text,
            };
        });
        res.send(projectedMessages);
    }
    catch(err)
    {
        console.log(err)
    }
})


server.listen(8000,()=>{
    console.log("Server running at port:8000")
})