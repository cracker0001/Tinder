import express from 'express'
import connectDB from './config/database.js';
import User from './models/user.js';
import validateSignUpData from './utils/validation.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import userAuth from './middleware/auth.js';
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req,res)=>{
  try{
   validateSignUpData(req);
    const {firstName, lastName, email, password} = req.body;

    const hashpassword = await bcrypt.hash(password,10);

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
    const checkPassword = await user.validatePassword(password);
    if(checkPassword)
    {
      const token = await user.getJWT();
      res.cookie("token",token);
      res.send("login successful");
    }
    else{
      res.send("login unsuccess");
    }
  }
  catch(err){
    res.send("something is wrong");
  }
})
//check this code ------>
app.get('/profile', userAuth, async (req,res)=>{
  try{
   
    const user = req.user;
    res.send(user);
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