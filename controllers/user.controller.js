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



module.exports = { sign_up, sign_in, }