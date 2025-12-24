import express from 'express';
import connectionRequest from '../models/connectionRequest.js';
import userAuth from '../middleware/auth.js';
import User from '../models/user.js';
const requestRouter = express.Router();


requestRouter.post('/request/send/:status/:toUserId',userAuth, async (req,res)=>{
   try{
   const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const isAllowedStatus = ["interested","ignore"];
    if(!isAllowedStatus.includes(status)){
      return res.status(400).json({message: "invalid status"});
    }
    const isUser = await User.findById(toUserId);
    if(!isUser){
      return res.status(400).json({message: "user does not exist"});
    }
    const existingConnectionRequest = await connectionRequest.findOne({
      $or: [
        {fromUserId, toUserId},
        {fromUserId: toUserId, toUserId: fromUserId}
      ],
    });
    if(existingConnectionRequest){
      return res.status(400).json({message: "request already exists"});
    }
    const newRequest = new connectionRequest({
      fromUserId,
      toUserId,
      status,
    })
   const data = await newRequest.save();
    res.json(
      {message: "request sent successfully", data}
    )
   }catch(err){
    res.send("error in sending request");
   }

})

export default requestRouter;