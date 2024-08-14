const express = require('express')
const { signUp,
    login,
    getCurrentUser,
    // restrictTo,
    logout } = require('../controllers/authController')
const { getApplicationStats, updateUser } = require('../controllers/userController')
// const upload = require('../middleware/multerMiddleware')
const protect = require('../middleware/authMiddleware')
const router = express.Router() // can be router or routes, up to preference

router.post('/signup', signUp);
router.route('/login').post(login);
router.get('/logout', logout);
router.get('/currentUser', protect, getCurrentUser)
router.get('/applicationStatus', protect, getApplicationStats)
// router.patch('/updateUser', protect, upload.single('avatar'), updateUser)


module.exports = router