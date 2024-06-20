const User = require("../models/user");

// exports.setFcmToken = async (req, res) => {
//   const { userID, fcmToken } = req.body;

//   try {
//     const user = await User.findByPk(userID);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.fcmToken = fcmToken;
//     await user.save();

//     res.status(200).json({ message: "FCM token updated successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error updating FCM token", error: error.message });
//   }
// };
