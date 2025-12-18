import express from 'express';
const reqrouter = express.Router();


reqrouter.post('/sendreq',userAuth,(req,res)=>{
  res.send("send request");
})
export default reqrouter;