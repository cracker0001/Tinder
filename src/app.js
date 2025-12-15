import express from 'express'
import connectDB from './config/database.js';
import User from './models/user.js';
import validateSignUpData from './utils/validation.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req,res)=>{
  try{
   validateSignUpData(req);
    const {firstName, lastName, email, password} = req.body;

    const hashpassword = await bcrypt.hash(password,10);
      console.log(hashpassword)

     const userDetail = new User({
      firstName,
      lastName,
      email,
      password: hashpassword,
     });
    await userDetail.save();
   res.send("data stored")
  }
  catch(err){
    res.send("something wrong" + err.message);
  }
})

app.post('/login', async (req,res)=>{
  const {email, password} = req.body;
  try{
    const user = await User.findOne({email: email});
    if(!user){
      throw new Error("invalid user")
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if(checkPassword)
    {
      const token = await jwt.sign({_id: user._id}, "secret_key");
      res.cookie("token",token);
      console.log(token)
      res.send("login successful")
    }
    else{
      res.send("login unsuccess")
    }
  }
  catch(err){
    res.send("something is wrong");
  }
})
//check this code ------>
app.get('/profile', async (req,res)=>{
  try{
    const cookies = req.cookies;

    const {token} = cookies;

    console.log("hello",token)
    if(!token){
      throw new Error("token is not present");
    }
    const decodeMessage = await jwt.verify(token, "secret_key")
     const {_id} = decodeMessage;

     const user = await User.findById(_id)
     if(!user)
      throw new Error("user does not exist")
    res.send(user)
  }
  catch(err){
    res.send("something get wrong");
  }
})
app.get('/user', async (req,res)=>{
   
  try{
      const user = await  User.find({});
    res.send(user)
  }
  catch(err){
    res.send("something went wrong");
  }
})
app.delete('/delete', async (req,res)=>{
      const userId = req.body._id;
     try{
         const user = await  User.findByIdAndDelete(userId);
      res.send("delete")
     }
     catch(err){
        res.send("error");
     }
})
app.patch('/user', async (req,res)=>{
  const userId = req.body.userId;
  const data  = req.body;
 try{
  const update_allow = [
    "firstName",
    "lastName",
    "age",
    "password",
    "userId"
  ]
    
  const isUpdateAllow = Object.keys(data).every((k)=>
  update_allow.includes(k))
  if(!isUpdateAllow)
    res.send("u cannot update this property")

   const user = await User.findByIdAndUpdate({_id: userId},data,{
    runValidators: true,
  })
  res.send("updated")
 }
 catch(err){
  res.send("error update")
 }
})

connectDB()
  .then(
    ()=>{
        console.log('db connected');
    }
  )
  .catch((err)=>{
    console.log('not connected');
  })

app.listen(PORT,()=>{
    console.log(`server is ruuning on ${PORT}`)
})