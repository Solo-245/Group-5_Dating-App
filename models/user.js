const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, "Name is required"]
   },
   dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"]
   },
   gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ['male', 'female', 'other']
   },
   interestedIn: [{
      type: String,
      enum: ['men', 'women', 'both', 'other'],
      required: true
   }],
   email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [isEmail, "Please enter a valid email"]
   },
   hobbies: [{
      type: String
   }],
   bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"]
   },
   password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"]
   },
   deleted: {
      type: Boolean,
      default:false,
   },
   deletedAt: {
      type: Date,
      default: null
   },
   reported: { 
      type: Boolean, 
      default: false 
   },
   loveRequests: { 
      type: [String], 
      default: [] 
   }
},
   {
      timestamps: true
   }
);


// fire a function each time a new document is created
userSchema.pre('save', async function (next) {
   const saltRound = 10
   const salt = await bcrypt.genSalt(saltRound);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});



const User = mongoose.model('User', userSchema);

module.exports = User;
