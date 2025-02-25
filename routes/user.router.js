const express = require ('express');
const router = express.Router();
const authMiddleware = require ('../middlewares/authMiddleware.js');
const { sign_up, sign_in, get_users_by_hobby, get_all_users, reportProfile, sendLoveRequest, sendGift, delete_profile, soft_delete_profile, restore_profile} = require ('../controllers/user.controller.js');





//User SignUp
router.post('/sign_up', sign_up);

//User SignIn
router.post('/sign_in', sign_in);

router.delete('/delete_profile', delete_profile) // Delete user profile
router.delete('/soft_delete_profile', soft_delete_profile) // soft Delete user profile
router.post('/restore_profile', restore_profile)// Restore user profile

//Report Profile
router.post('/report/:id', authMiddleware, reportProfile);

//Send Love Request
router.post('/send-love-request/:id', authMiddleware, sendLoveRequest);

//Fetch users by hobby
router.get('/hobby', get_users_by_hobby);

//user list
router.get('/all_users', get_all_users);


//Send Gift
router.post('/gift/:id', authMiddleware, sendGift);


module.exports = router;