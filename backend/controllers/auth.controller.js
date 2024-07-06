import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookies } from '../lib/utils/genrateToken.js'
import User from '../models/userModel.js'

export const signup = async (req,res)=>{
    try {
        const {username,fullname,password,email} = req.body;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({error: 'Invalid email format'})
        }

        const existUser = await User.findOne({username});
        if (existUser){
            return res.status(400).json({error: 'username already taken by another user'})

        }

        const existEmail = await User.findOne({email});
        if (existEmail){
            return res.status(400).json({error: 'email is taken by another user'})

        }

        if ( password.length < 6) {
            return res.status(400).json({error : "Password should be at least 6 characters long"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);


        const newUser = new User({
            fullname,
            username,
            email,
            password:hashedPassword
           
        })

        if(newUser){
            generateTokenAndSetCookies(newUser._id,res)
            await newUser.save();
            res.status(201).json({
                _id:newUser.id,
                username:newUser.username,
                fullname:newUser.fullname,
                email:newUser.email,
                followers:newUser.followers,
                following:newUser.following,
                bio:newUser.bio,
                link:newUser.link,
                profileImg:newUser.profileImg,
                coverImg:newUser.coverImg,

            })
        }else{
            res.status(400).json({error:'invalid user data'})

        }

        
    } catch (error) {
        console.log('Error in signup controller')
        res.status(500).json('it was server error')
        
    }
    
    
}


export const login = async (req,res)=>{
    try {

        const {username , password} = req.body ;
        
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        const user = await User.findOne({username});
        const isPasswordValid = await bcrypt.compare(password , user?.password || "")

        if (!user || !isPasswordValid) {
            return res.status(400).json({error : "Invalid username or password"})
        }

        generateTokenAndSetCookies(user._id,res);
        res.status(201).json({
            _id:user.id,
            username:user.username,
            fullname:user.fullname,
            email:user.email,
            followers:user.followers,
            following:user.following,
            bio:user.bio,
            link:user.link,
            profileImg:user.profileImg,
            coverImg:user.coverImg,

        })
        
    } catch (error) {
        console.log('Error in login controller')
        res.status(500).json('it was server error')
        
    }
}


export const logout = async (req,res)=>{

    try {

        res.cookie("jwt" , "",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
        
    } catch (error) {

        console.log('Error in logout controller')
        res.status(500).json('it was server error')
        
    }
    
}


export const checkMe = async (req,res) => {
    try {

        const user = await User.findById(req.user._id).select('-password')
        res.status(200).json(user);

        
    } catch (error) {

        console.log('Error in checkMe controller')
        res.status(500).json('it was server error')
        
    }
}