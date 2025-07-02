import express from 'express'
import  generateImage  from '../Controller/Image.Controller.js'
import userAuth from '../MiddleWare/auth.js';

const ImageRouter =express.Router();

ImageRouter.post('/generate-image',userAuth,generateImage);

export default ImageRouter;