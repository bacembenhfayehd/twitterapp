import User from "../models/userModel.js";
export const getUserProfile = async ( req ,res) => {
    const {username} = req.params;

    try {
        const user = await User.findOne({username}).select('-password')
        if (!user){
            return res.status(404).json({message : 'user not found'})
        }

        res.status(200).json({ user });
        
    } catch (error) {
        console.log("error in getuserprofile" , error.message);
        res.status(500).json({error:error.message})
        
    }

}
export const followUnfollowUser = async (req, res) => {
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id)

        if (id === req.user._id.toString()){
            return res.status(400).json({error : 'You can not follow yourself'})
        }
        
        if (!userToModify || !currentUser) return res.status(400).json({error:'user not found'})

            const isfollowing = currentUser.following.includes(id);

            if (isfollowing){

                await User.findByIdAndUpdate(id, {$pull : {followers : req.user._id}})
                await User.findByIdAndUpdate(req.user._id, {$pull : {following : id}})
            } else {
               
                await User.findByIdAndUpdate(id, {$push : {followers : req.user._id}})
                await User.findByIdAndUpdate(req.user._id, {$push : {following : id}})
            }
    } catch (error) {
        console.log("error in followUnfollowUser" , error.message);
        res.status(500).json({error:error.message})
        
    }



}