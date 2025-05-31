// const User = require('../models/user');

// exports.logAgentContact = async (req, res) => {
//   try {
//     const { email } = req.body;
    
//     const user = await User.findOneAndUpdate(
//       { email },
//       { 
//         agentContacted: true,
//         lastAgentContact: Date.now(),
//         registrationStatus: 'verified'
//       },
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: user
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

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password'
      });
    }

    // 3) Check if payment is completed (if required)
    if (user.paymentStatus !== 'completed') {
      return res.status(403).json({
        success: false,
        message: 'Please complete your payment to access your account'
      });
    }

    // 4) If everything ok, send token to client
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.status(200).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          paymentStatus: user.paymentStatus
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