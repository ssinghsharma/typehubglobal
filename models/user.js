// // const mongoose = require('mongoose');
// // const validator = require('validator');
// // const bcrypt = require('bcryptjs');

// // const educationSchema = new mongoose.Schema({
// //   institution: { type: String, required: true },
// //   degree: { type: String, required: true },
// //   fieldOfStudy: { type: String },
// //   startYear: { type: Number, required: true },
// //   endYear: { type: Number, required: true },
// // });

// // const workExperienceSchema = new mongoose.Schema({
// //   company: { type: String, required: true },
// //   position: { type: String, required: true },
// //   startDate: { type: Date, required: true },
// //   endDate: { type: Date },
// //   description: { type: String },
// // });

// // const userSchema = new mongoose.Schema({
// //   email: {
// //     type: String,
// //     required: [true, 'Please provide an email'],
// //     unique: true,
// //     lowercase: true,
// //     validate: [validator.isEmail, 'Please provide a valid email'],
// //   },
// //   password: {
// //     type: String,
// //     required: [true, 'Please provide a password'],
// //     minlength: 8,
// //     select: false,
// //   },
// //   fullName: {
// //     type: String,
// //     required: [true, 'Please provide your full name'],
// //   },
// //   phoneNumber: {
// //     type: String,
// //     validate: {
// //       validator: function(v) {
// //         return /^\+?[\d\s-]{10,15}$/.test(v);
// //       },
// //       message: props => `${props.value} is not a valid phone number!`
// //     }
// //   },
// //   dateOfBirth: {
// //     type: Date,
// //     required: [true, 'Please provide your date of birth'],
// //   },
// //   gender: {
// //     type: String,
// //     enum: ['male', 'female', 'other', 'prefer-not-to-say'],
// //   },
// //   address: {
// //     type: String,
// //   },
// //   education: [educationSchema],
// //   skills: [String],
// //   workExperience: [workExperienceSchema],
// //   isVerified: {
// //     type: Boolean,
// //     default: false,
// //   },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now,
// //   },
// // });

// // // Hash password before saving
// // userSchema.pre('save', async function(next) {
// //   if (!this.isModified('password')) return next();
// //   this.password = await bcrypt.hash(this.password, 12);
// //   next();
// // });

// // // Method to compare passwords
// // userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
// //   return await bcrypt.compare(candidatePassword, userPassword);
// // };

// // const User = mongoose.model('User', userSchema);

// // module.exports = User;
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: [true, 'Please provide an email'],
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
//   },
//   password: {
//     type: String,
//     required: [true, 'Please provide a password'],
//     minlength: 8,
//     select: false
//   },
//   fullName: {
//     type: String,
//     required: [true, 'Please provide your full name'],
//     trim: true
//   },
//   phoneNumber: {
//     type: String,
//     trim: true
//   },
//   dateOfBirth: {
//     type: Date,
//     required: [true, 'Please provide your date of birth']
//   },
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'other']
//   },
//   address: {
//     type: String,
//     trim: true
//   },
//   education: [{
//     institution: {
//       type: String,
//       required: [true, 'Please provide institution name']
//     },
//     degree: {
//       type: String,
//       required: [true, 'Please provide degree']
//     },
//     fieldOfStudy: String,
//     startYear: {
//       type: String,
//       required: [true, 'Please provide start year']
//     },
//     endYear: {
//       type: String,
//       required: [true, 'Please provide end year']
//     }
//   }],
//   skills: [String],
//   workExperience: [{
//     company: String,
//     position: String,
//     startDate: Date,
//     endDate: Date,
//     description: String
//   }],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// // Method to compare passwords
// userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    required: [true, 'Please provide your phone number']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Please provide your date of birth']
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  address: {
    type: String,
    trim: true
  },
  education: [{
    institution: {
      type: String,
      required: [true, 'Please provide institution name']
    },
    degree: {
      type: String,
      required: [true, 'Please provide degree']
    },
    fieldOfStudy: String,
    startYear: {
      type: String,
      required: [true, 'Please provide start year']
    },
    endYear: {
      type: String,
      required: [true, 'Please provide end year']
    }
  }],
  skills: {
    type: [String],
    default: [],
    validate: {
      validator: function(v) {
        return v.length > 0; // At least one skill required
      },
      message: 'Please add at least one skill'
    }
  },
  workExperience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  // Payment and Registration Status Fields
  registrationStatus: {
    type: String,
    enum: ['pending', 'verified', 'payment-completed', 'active'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'pending', 'completed', 'failed'],
    default: 'unpaid'
  },
  paymentDate: {
    type: Date
  },
  paymentAmount: {
    type: Number,
    default: 549.82 // Default registration fee amount
  },
  agentContact: {
    contacted: {
      type: Boolean,
      default: false
    },
    contactDate: {
      type: Date
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// // Add this to your User model
// userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };
// Update timestamp before any update
userSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;