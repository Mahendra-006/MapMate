const express = require('express');
const { check } = require('express-validator')

const usersControllers = require('../Controllers/usersController');
const fileUpload = require('../middleware/fileUpload');

const router = express.Router();

router.get('/', usersControllers.getUsers)

router.post('/signup', fileUpload.single('image') ,[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min: 8})
],usersControllers.signup)

router.post('/login', usersControllers.login)

module.exports = router;