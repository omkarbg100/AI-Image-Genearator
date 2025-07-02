import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from "../models/User.model.js";
import razorpay from 'razorpay';
import TransactionModel from '../models/Transaction.model.js';

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "missing Details" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)
        const userData = {
            name,
            email,
            password: hashedpassword
        }

        const newuser = new UserModel(userData);
        const user = await newuser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ success: true, token, user: { name: user.name } })
    }
    catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "user does not exists" })
        }

        const isMatch = bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token, user: { name: user.name } })
        }
        else {
            return res.json({ success: false, message: "password not matched" })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }

}

const userCredits = async(req,res)=>{
    try {
        // const {userId} =req.body;
        const {id}=req.user;
        const user = await UserModel.findById(id)
        res.json({success:true,credits:user.creditBalance, user : {name:user.name}})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


const razorpayInstance = new razorpay({
    key_id:process.env.PAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRETE,
})

const  paymentRazorpay= async (req,res)=>{
    try {
         const {id}=req.user;
        const {planId}=req.body;

        const userData=await UserModel.findById(id);

        if(!id || !planId){
            return res.json({ success: false, message: "unvalid Credentials" })
        }

        let credits,plan,amount,date
        switch(planId){
            case 'Basic':
                plan='Basic'
                credits=100
                amount=10
                break;
            case 'Advanced':
                plan='Basic'
                credits=500
                amount=50
                break;
            case 'Bussiness':
                plan='Bussiness'
                credits=5000
                amount=250
                break;
            default:
                return res.json({success:false,message:'plan not found'})
        }

        date=Date.now();
        const transctionData={id,plan,amount,credits,date}

        const newTransaction = new TransactionModel.create(transctionData)

        const options={
            amount:amount*100,
            currency:process.env.CURRENCY,
            receipt:newTransaction._id,
        }

        await razorpayInstance.orders.create(options,(error,order)=>{
            if(error){
                console.log(error);
                return res.json({success:false,message:error})
            }
            res.json({success:true,order})
        })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

const verifyRazorpay = async (req,res)=>{
    try {
        const {razorpay_order_id}=req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if(orderInfo.status=='paid'){
            const transctionData=await TransactionModel.findById(orderInfo.receipt)
            if(transctionData.payment){
                return res.json({
                    success:false,
                    message:'payment Failed'
                })
            }
            const userData=await UserModel.findById(transctionData.id)

            const creditBalance=userData.creditBalance+ transctionData.credits;
            await UserModel.findByIdAndUpdate(userData._id,{creditBalance})
            await TransactionModel.findByIdAndUpdate(transctionData._id,{payment:true})

            res.json({success:true,message:"Credits Added"})
        }
        else{
            res.json({success:false,message:"Payment Failed"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Payment Failed"})
    }
}


export { registerUser , loginUser , userCredits , paymentRazorpay , verifyRazorpay}