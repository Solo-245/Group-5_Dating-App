const mongoose = require('mongoose');
const dotenv = require ('dotenv');

dotenv.config();

const connectToDB = async () => {
   try{
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ Database Connected Succesfully")

   }catch (error){
      res.status(500).json({success: false, message: 'Server Error'});
   };
};



module.exports = connectToDB;

