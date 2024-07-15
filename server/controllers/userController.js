const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const path = require("path");
const fs = require("fs");

const generateToken = (user) => {
  return jwt.sign({ userID: user.userID }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
};

// POST -> localhost:5000/api/v1/user/register
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user exists already
    const userExists = await User.findOne({ where: { email: email } });
    if (userExists) {
      res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profileImage: req.file ? req.file.filename : null,
    });

    res.status(201).json({
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST -> localhost:5000/api/v1/user/login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists already
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check credentials
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Please check your password credentials" });
    }
    const token = generateToken(user);
    res.cookie("Authorization", token, {
      expiresIn: "1d",
      httpOnly: true,
      sameSite: true,
    });
    res.status(200).json({
      message: "Admin login successfully",
      token: token,
      expiry: new Date(Date.now() + 3600000),
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST -> localhost:5000/api/v1/user/logout
exports.logOutUser = async (req, res) => {
  try {
    res.clearCookie("Authorization");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET -> localhost:5000/api/v1/user
exports.getUserDetails = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const splitedToken = token.split(" ")[1];

    if (!splitedToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(splitedToken, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.userID, {
      attributes: ["userID", "email", "username", "profileImage"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Fetch user details successfully",
      token: token,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT -> localhost:5000/api/v1/user
// exports.updateUserProfile = async (req, res) => {
//   try {
//     const token = req.headers.authorization;
//     console.log(req.headers);
//     const splitedToken = token && token.split(" ")[1];

//     if (!splitedToken) {
//       return res.status(401).json({ error: "Not authenticated" });
//     }

//     const decoded = jwt.verify(splitedToken, process.env.JWT_SECRET_KEY);
//     const user = await User.findByPk(decoded.userID);

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     if (req.file) {
//       console.log("New file updated:", req?.file);
//     }

//     if (user.imageUrl) {
//       const filePath = path.join(
//         __dirname,
//         "../public/profile",
//         user.profileImage
//       );
//       fs.access(filePath, fs.constants.F_OK, (err) => {
//         if (err) {
//           console.warn("File does not exist, cannot delete:", filePath);
//         } else {
//           fs.unlink(filePath, (err) => {
//             if (err) {
//               console.error("Error deleting file:", err);
//             } else {
//               console.log("File deleted successfully:", filePath);
//             }
//           });
//         }
//       });
//       await user.update({
//         username,
//         email,
//         profileImage: req?.file?.filename,
//       });
//     }

//     // const { username, email } = req.body;

//     // if (username) user.username = username;
//     // if (email) user.email = email;

//     // await user.save();

//     res.json({
//       message: "User profile updated successfully",
//       userInfo: {
//         userID: user.userID,
//         username: user.username,
//         email: user.email,
//         profileImage: user.profileImage,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     res.status(500).json({ error: error.message });
//   }
// };
exports.updateUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const splitedToken = token && token.split(" ")[1];

    if (!splitedToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(splitedToken, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { username, email } = req.body;

    if (req.file) {
      const newProfileImage = req.file.filename;

      if (user.profileImage) {
        const oldFilePath = path.join(
          __dirname,
          "../public/profile",
          user.profileImage
        );
        fs.access(oldFilePath, fs.constants.F_OK, (err) => {
          if (!err) {
            fs.unlink(oldFilePath, (err) => {
              if (err) {
                console.error("Error deleting old profile image:", err);
              } else {
                console.log(
                  "Old profile image deleted successfully:",
                  oldFilePath
                );
              }
            });
          }
        });
      }
      user.profileImage = newProfileImage;
    }

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: "User profile updated successfully",
      userInfo: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: error.message });
  }
};

// PUT -> localhost:5000/api/v1/user/change-password
exports.changePassword = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const splitedToken = token.split(" ")[1];

    if (!splitedToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(splitedToken, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { currentPassword, newPassword } = req.body;

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
