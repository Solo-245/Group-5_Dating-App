const express = require ('express');
const router = express.Router();
const { sign_up, sign_in, } = require ('../controllers/user.controller.js');


router.post('/sign_up', sign_up);

router.post('/sign_in', sign_in);



module.exports = router;