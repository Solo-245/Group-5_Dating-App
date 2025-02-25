const mongoose = require ('mongoose');
const User = require ('../models/user.js');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const dotenv = require ('dotenv');

dotenv.config();

//handle errors
const handleErrors = (error) => {
   //console.log(error.message, error.code);
   let errors = { email: '', password: '' };

   //Incorrect email
   if(error.message === "Invalid email address") {
      errors.email = "that email is not registered"
   }

   //Incorrect password
   if(error.message === "Invalid password") {
      errors.password = "that password is incorrect"
   }

   //duplicate error code
   if (error.code === 11000) {
      errors.email = "email already exist";
      return errors;
   }

   //validation errors
   if (error.message.includes('User validation failed'))
   Object.values(error.errors).forEach(({properties}) => {
         errors[properties.path] = properties.message;
   })
   return errors;
};
const maxAge = 2 * 24 *60 * 60;
//create token
const createToken = (id) => {
   return jwt.sign ({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

const sign_up = async (req, res) => {
    const {
        name,
        dateOfBirth,
        gender,
        interestedIn,
        hobbies,
        bio,
        email,
        password
    } = req.body; 

    try {
        const user = await User.create({
            name,
            dateOfBirth,
            gender,
            interestedIn,
            hobbies,
            bio,
            email,
            password
        });

        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        res.status(201).json({ data: ({user: user._id}), message: "User created successfully" });
    } catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
};

const sign_in = async (req, res) => {
    const { email, password} = req.body;
   try {
         const user = await User.findOne({email});
         if (!user) {
            // return res.status(500).json({message: "Invalid email address"});
           throw new Error("Invalid email address");
         }
         const isValid = await bcrypt.compare (password, user.password);
         if (!isValid) {
             //return res.status(500).json({message: "Invalid password"});
            throw new Error("Invalid password");
         }
         const token = createToken(user._id);
         res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
         res.status(201).json({user: user._id, message: "Login Successful"})
   } catch(error) {
      const errors = handleErrors(error)
        res.status(400).json({errors});
   }
}; 

// Get Users by Hobby
const get_users_by_hobby = async (req, res) => {
    try {
        let { hobby } = req.query;

        if (!hobby) {
            return res.status(400).json({ success: false, message: "Please provide at least one hobby to filter users" });
        }

        const hobbiesArray = Array.isArray(hobby) ? hobby : hobby.split(",");

        const users = await User.find({
            hobbies: { $in: hobbiesArray.map(h => new RegExp(h.trim(), "i")) }
        });

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found with these hobbies" });
        }

        res.status(200).json({
            success: true,
            count: users.length,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
};

// Get All Users with Pagination (15 per page)
const get_all_users = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

        const users = await User.find().skip(skip).limit(limit);
        const totalUsers = await User.countDocuments();

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "No users found" });
        }

        res.status(200).json({
            success: true,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            usersPerPage: limit,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }

    //Delete request to delete  a user profile
    const delete_profile = async (req, res) => {
        try{
            const UserId = req.user.id;
            const User = await User.findById(UserId)
            if (!UserId){
                res.status(401).json({success:false, message:"User not found"}) }
                res.status(200).json({success:true, message:"User deleted Successfully"})
        } catch (error){
            res.status(500).json({success:false, message:"something went wrong"})
        }
    }


    // soft delete of user profile

    const soft_delete_profile = async (req, res) => {
        try {
            const UserId = req.user.id;
            if (!UserId) {
                res.status(401).json({sucess:false , message: "User not found"})
            }

            // Mark user as deleted but keep the record in the database
            User.deleted = true;
            User.deletedAt = new Date();
            await User.save();

            res.status(200).json({success:true, message: "profile deleted successfully"})
        }
        catch (error) {
            res.status(500).json({sucess:false, message: "server error"})
        }
    }

    //Restore user profile
    const restore_profile = async (req, res) => {
        try{
            const UserId = req.user.id;
            if (!UserId ||User.deleted){
                res.status(401).json({sucess:false, message:"User not found"})
            }
            // re-activate user
            User.deleted = false;
            User.deletedAt = null;
            await User.save();
            res.status(200).json({sucess:true, message:"profile restored successfully"})
        } catch (error){
            res.status(500).json({success:false, message:"server error"})
        }
    }
};

module.exports = { sign_up, sign_in, get_users_by_hobby, get_all_users, delete_profile, soft_delete_profile, restore_profile}