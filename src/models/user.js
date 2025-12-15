import mongoose from 'mongoose';
import validator from 'validator'
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
    },
      lastName:{
        type: String,
        minLength: 3,
        maxLength: 30,
    },
      email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
          if(! validator.isEmail(value)){
            throw new Error("email must be valid");
          }
        }
    },
    password:{
        type: String,
        required: true,
    },
    age:{
      type: Number,
    }
    
})
const User = mongoose.model("User",userSchema);
export default User;