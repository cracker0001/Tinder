import express from 'express';
const authRouter = express.Router();
import validateSignUpData from '../utils/validation.js'
import bcrypt from 'bcrypt'
import User from '../models/user.js';

authRouter.post('/signup', async (req,res)=>{
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
authRouter.post('/login', async (req,res)=>{
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
export default authRouter;