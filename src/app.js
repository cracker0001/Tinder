import express from 'express'
import connectDB from './config/database.js';
import User from './models/user.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import requestRouter from './routes/request.js';
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/',authRouter);
app.use('/',profileRouter);
app.use('/',requestRouter);
// app.get('/user', async (req,res)=>{
   
//   try{
//       const user = await  User.find({});
//     res.send(user)
//   }
//   catch(err){
//     res.send("something went wrong");
//   }
// })
// app.delete('/delete', async (req,res)=>{
//       const userId = req.body._id;
//      try{
//          const user = await  User.findByIdAndDelete(userId);
//       res.send("delete")
//      }
//      catch(err){
//         res.send("error");
//      }
// })
// app.patch('/user', async (req,res)=>{
//   const userId = req.body.userId;
//   const data  = req.body;
//  try{
//   const update_allow = [
//     "firstName",
//     "lastName",
//     "age",
//     "password",
//     "userId"
//   ]
    
//   const isUpdateAllow = Object.keys(data).every((k)=>
//   update_allow.includes(k))
//   if(!isUpdateAllow)
//     res.send("u cannot update this property")

//    const user = await User.findByIdAndUpdate({_id: userId},data,{
//     runValidators: true,
//   })
//   res.send("updated")
//  }
//  catch(err){
//   res.send("error update")
//  }
// })


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