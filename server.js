const express = require ('express');
const PORT = process.env.PORT || 3456;
const router = require ('./routes/user.router.js')
const connectToDB = require ('./db.js');


const app = express();

connectToDB(). then(() => {
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 app.use('/api/user', router);
 
 
   app.get('/', (req, res) => {
   res.send('Hello World!')
 });


   app.listen (PORT, () => {
      console.log("🚀 Server is listening on PORT: http://localhost:" + PORT)
   });
});

