import Notifcation from "../models/notificationsModel.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notifcation.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notifcation.updateMany({ to: userId }, { read: true });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log("error in getting notifications", error);
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notifcation.deleteMany({ to: userId });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
    console.log("error deleting notifications", error);
  }
};


export const deleteNotification = async (req,res) => {

try {

  const notificationId = req.params.id;
  const userId = req.user._id;
  const notification = await Notifcation.findById(notificationId);
if (!notification){
  return res.status(404).json({error:'notification not found'})
}

if(notification.to.toString() !== userId.toString()){
  return res.status(403).json({error:'you are not allowed to delete this notification'})
}

await Notifcation.findByIdAndDelete(notificationId);
res.status(200).json({message:'notification deleted successfully'})

} catch (error) {

  res.status(500).json({ error: "Server error" });
    console.log("error deleting this notification", error);
  
}


}
