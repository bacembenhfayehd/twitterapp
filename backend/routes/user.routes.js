import express from 'express'
import { protectRoute } from '../middlewares/protectRoute.js';
import { getUserProfile , followUnfollowUser , getSuggestedUsers, updateUser } from '../controllers/user.controller.js';


const router = express.Router();

router.get('/profile/:username',protectRoute,getUserProfile)
router.post('/follow/:id',protectRoute,followUnfollowUser)
router.get('/suggested',protectRoute,getSuggestedUsers)
router.post('/update' , protectRoute,updateUser);

export default router ;


