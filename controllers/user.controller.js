const User = require ('../models/user.js');

//handle errors
const handleErrors = (error) => {
   //console.log(error.message, error.code);
   let errors = { email: '', password: '' };

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


const sign_up = async (req, res) => {
   const { email, password} = req.body;
   try {

      const user = await User.create({ email, password });
      res.status(201).json({ data: user, message: "User created successfully" });
   } catch(error) {
     const errors = handleErrors(error);
       res.status(400).json({ errors });
   }
}; 


const sign_in = async () => {
    //const { email, password} = req.body;
   try {

   } catch(error) {

   }
}; 



module.exports = { sign_up, sign_in, }