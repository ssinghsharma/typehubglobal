// const User = require('../models/user');
// const { generateToken } = require('../config/jwt');
// const sendEmail = require('../utils/emailService');

// // Register a new user
// exports.register = async (req, res, next) => {
//   try {
//     const { 
//       email, 
//       password, 
//       fullName, 
//       phoneNumber, 
//       dateOfBirth, 
//       gender, 
//       address,
//       education,
//       skills,
//       workExperience
//     } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: 'Email already in use'
//       });
//     }

//     // Create new user
//     const newUser = await User.create({
//       email,
//       password,
//       fullName,
//       phoneNumber,
//       dateOfBirth,
//       gender,
//       address,
//       education,
//       skills,
//       workExperience
//     });

//     // Generate JWT token
//     const token = generateToken(newUser._id);

//     // Send welcome email (optional)
//     try {
//       await sendEmail({
//         email: newUser.email,
//         subject: 'Welcome to TypeHub.in',
//         message: `Hi ${newUser.fullName}, thank you for registering with TypeHub.in!`
//       });
//     } catch (emailErr) {
//       console.error('Error sending welcome email:', emailErr);
//     }

//     res.status(201).json({
//       success: true,
//       token,
//       data: {
//         user: {
//           id: newUser._id,
//           email: newUser.email,
//           fullName: newUser.fullName
//         }
//       }
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

// // Login user
// exports.login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     // 1) Check if email and password exist
//     if (!email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Please provide email and password'
//       });
//     }

//     // 2) Check if user exists and password is correct
//     const user = await User.findOne({ email }).select('+password');

//     if (!user || !(await user.correctPassword(password, user.password))) {
//       return res.status(401).json({
//         success: false,
//         message: 'Incorrect email or password'
//       });
//     }

//     // 3) If everything ok, send token to client
//     const token = generateToken(user._id);

//     res.status(200).json({
//       success: true,
//       token,
//       data: {
//         user: {
//           id: user._id,
//           email: user.email,
//           fullName: user.fullName
//         }
//       }
//     });
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// };
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../config/jwt');
const sendEmail = require('../utils/emailService');

// Generate token inside controller (fallback if generateToken is not used)
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// 🔐 Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists'
      });
    }

    // Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Token is invalid or expired'
    });
  }
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      fullName,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      education,
      skills,
      workExperience
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }

    const newUser = await User.create({
      email,
      password,
      fullName,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      education,
      skills,
      workExperience
    });

    const token = signToken(newUser._id);

    // Optional: Send welcome email
    try {
      await sendEmail({
        email: newUser.email,
        subject: 'Welcome to TypeHub.in',
        message: `Hi ${newUser.fullName}, thank you for registering with TypeHub.in!`
      });
    } catch (emailErr) {
      console.error('Error sending welcome email:', emailErr);
    }

    res.status(201).json({
      success: true,
      token,
      data: {
        user: {
          id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName
        }
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName
        }
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
