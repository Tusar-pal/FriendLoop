import express from 'express';
import { upload } from '../configs/multer.js';
import { protect } from '../middlewares/auth.js';
import {
    addPost,
    getFeedPosts,
    likePost,
    getLikedPosts
} from '../controller/postController.js';

const postRouter = express.Router();

postRouter.post('/add',upload.array('images',4), protect,addPost)
postRouter.get('/feed', protect,getFeedPosts)
postRouter.post('/like', protect,likePost)
postRouter.get('/liked/:profileId', protect, getLikedPosts);

export default postRouter