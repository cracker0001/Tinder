import mongoose from 'mongoose'

const connectDB = async (req,res)=>{
    await mongoose.connect('mongodb+srv://pr20022008_db_user:aUYWhpufKWPo8DFu@tinder.edac6xy.mongodb.net/?retryWrites=true&w=majority&appName=Tinder/')
}

export default connectDB;