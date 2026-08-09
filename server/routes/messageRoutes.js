import express from 'express'
import { getChatMessage, sendMessage, sseController } from '../controller/messageController.js';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';

const messageRouter = express.Router();

messageRouter.get('/:userId' , sseController)
messageRouter.get('/send',upload.single('image'),protect , sendMessage)
messageRouter.get('/get',protect,getChatMessage)


export default messageRouter;
