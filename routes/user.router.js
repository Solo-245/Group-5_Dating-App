const express = require ('express');
const router = express.Router();
const { sign_up, sign_in, reportProfile, sendLoveRequest, sendGift} = require ('../controllers/user.controller.js');
const authMiddleware = require ('../middlewares/authMiddleware.js');

//User SignUp
router.post('/sign_up', sign_up);

//User SignIn
router.post('/sign_in', sign_in);

//Report Profile
router.post('/report/:id', authMiddleware, reportProfile);

//Send Love Request
router.post('/send-love-request/:id', authMiddleware, sendLoveRequest);

//Send Gift
router.post('/gift/:id', authMiddleware, sendGift);

module.exports = router;