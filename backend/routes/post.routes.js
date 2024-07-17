import express from 'express'

import { protectRoute } from '../middlewares/protectRoute.js';

import {createPost,deletePost,commentPost, likeUnlikePost} from '../controllers/post.controller.js'


const router = express.Router();


router.post('/create',protectRoute,createPost)
router.post('/like/:id',protectRoute,likeUnlikePost)
router.post('/comment/:id',protectRoute,commentPost)
router.delete('/:id',protectRoute,deletePost)




export default router ;