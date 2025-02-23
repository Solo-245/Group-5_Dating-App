const express = require ('express');
const router = express.Router();
const { sign_up, sign_in, get_users_by_hobby, get_all_users,} = require ('../controllers/user.controller.js');


router.post('/sign_up', sign_up);

router.post('/sign_in', sign_in);

router.get('/hobby', get_users_by_hobby);  // Fetch users by hobby
router.get('/all_users', get_all_users);   // user list


module.exports = router;