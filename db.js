const mongoose = require('mongoose');
const dotenv = require ('dotenv');

dotenv.config();

const connectToDB = async () => {
   try{
      await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Wait 5s before timing out
            socketTimeoutMS: 45000, // Close sockets after 45s inactivity
            family: 4, // Force IPv4 to avoid IPv6 connection issues
        });
      console.log("✅ Database Connected Succesfully")

   } catch (error) {
      console.error("❌ Database Connection Failed:", error.message);
      process.exit(1); 
   }
};


// Handle MongoDB disconnection when the app stops
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔌 MongoDB Disconnected. Exiting process...");
    process.exit(0);
});

module.exports = connectToDB;

