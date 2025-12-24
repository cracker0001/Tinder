import mongoose from 'mongoose';

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,

    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        require: true,
    },
    status:{
        type: String,
        enum:{
            values: [
                "interested","ignore","accepted","rejected",
            ],
            message: `{VALUE} is not a valid status`,
        },
    },

},
{timestamps: true}
);

connectionRequestSchema.index({fromUserId: 1, toUserId:1});
connectionRequestSchema.pre("save", function(next){
    const connectionReq = this;
    if(connectionReq.fromUserId.equals(connectionReq.toUserId))
    {
        throw new Error("cannot send request to yourself");
    }
    next();

})

const connectionRequest = mongoose.model("connectionRequest",connectionRequestSchema);
export default connectionRequest;