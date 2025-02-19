const mongoose = require('mongoose');
const dotenv = require ('dotenv');

dotenv.config();

const connectToDB = async () => {
   try{
      await mongoose.connect(process.env.MONGO_URI);
      console.log("✅ Database Connected Succesfully")

   } catch (error) {
      console.error("❌ Database Connection Failed:", error.message);
      process.exit(1); 
   }
};



module.exports = connectToDB;

