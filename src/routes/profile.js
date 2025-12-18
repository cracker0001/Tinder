import express from 'express';
import userAuth from '../middleware/auth.js';
const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req,res)=>{
  try{
   
    const user = req.user;
    res.send(user);
  }
  catch(err){
    res.send("something get wrong");
  }
})
export default profileRouter;