const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper function to generate a JWT token for a user
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10h", // Token expires in 10 hours
  });
};

//    POST /api/register
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if a user with the provided email or username already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res
        .status(400)
        .json({ message: "User with that email or username already exists" });
    }

    // Create a new user document (password will be hashed by Mongoose pre-save hook)
    user = await User.create({
      username,
      email,
      password,
    });

    // If user created successfully, send user data and a JWT token
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//    POST /api/login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email and explicitly select the password for comparison
    const user = await User.findOne({ email }).select("+password");

    // If user not found, return invalid credentials
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await user.matchPassword(password);

    // If passwords do not match, return invalid credentials
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If authentication is successful, send user data and a JWT token
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
