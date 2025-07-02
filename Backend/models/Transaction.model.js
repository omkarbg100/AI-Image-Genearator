import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    id:{
        type: String,
        required:true
    },
    plan:{
        type:String,
        required:true,
    },
    amount:{
        type: Number,
        required:true
    },
    credits:{
        type:Number,
        default:5
    },
    payment:{
        type:Boolean,
        default:false
    },
    date:{type:Number}
})

const TransactionModel = mongoose.model('Transactions',TransactionSchema);

export default TransactionModel;