import axios from "axios";
import UserModel from "../models/User.model.js";
import FormData from "form-data";


export const generateImage = async (req, res) => {
    try {
        const {prompt } = req.body;
        const {id}=req.user;

        const user = await UserModel.findById(id);

        if (!user || !prompt) {
            return res.json({
                success: false,
                message: "missing Details"
            })
        }
        if (user.creditBalance == 0 || UserModel.creditBalance < 0) {
            return res.json({
                success: false,
                message: 'No Credit Balance',
                creditBalance: user.creditBalance
            })
        }

        const formData = new FormData()
        formData.append('prompt', 'shot of vaporwave fashion dog in miami')

        const {data}=await axios.post('https://clipdrop-api.co/text-to-image/v1', formData , {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType:'arraybuffer'
        })
        
        const base64Image =Buffer.from(data,'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`
        await UserModel.findByIdAndUpdate(user._id,{
            creditBalance:user.creditBalance-1})
        
        res.json({success:true,message:"image Generated",creditBalance:user.creditBalance-1,resultImage})

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })
    }
}

export default generateImage;