const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home')
const authController = require('../controllers/auth')

const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main routes
router.get('/', homeController.getIndex) 
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);


//Profile

router.get("/profile", ensureAuth, homeController.getProfile);

//router.get('/getPrompt', homeController.getPrompt)
router.post('/postPrompt', ensureAuth, homeController.postPrompt)
router.post('/postNote', ensureAuth, homeController.postNote)


module.exports = router