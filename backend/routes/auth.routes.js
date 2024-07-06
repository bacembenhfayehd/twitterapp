import express from 'express'
import { login, logout, signup , checkMe } from '../controllers/auth.controller.js';
import {protectRoute} from '../middlewares/protectRoute.js'



const router = express.Router();

router.post('/signup', signup);
router.get('/me', protectRoute , checkMe);
router.post('/login', login);
router.post('/logout', logout);


export default router;