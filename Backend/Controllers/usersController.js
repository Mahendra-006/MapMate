const { validationResult } = require('express-validator');
const User = require('../Models/user.js')
const HttpError = require('../Models/error.js')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const getUsers = async (req, res, next) => {
    let users
    try{
        users = await User.find({}, '-password')
    } catch (err){
        const error = new HttpError(
            'fetching users failed, Please try again later', 500
        )
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({ getters: true})) })
}

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }
  
    const { name, email, password } = req.body;
  
    let existingUser;
    try {
      existingUser = await User.findOne({ email }); 
    } catch (err) {
      return next(new HttpError('Signing up failed, please try again later.', 500));
    }
  
    if (existingUser) {
      return next(new HttpError('User already exists, please login instead.', 422));
    }
    
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      const error = new HttpError('Could not create user, please try again.', 500)
      return next(error)
    }
    const createdUser = new User({
      name,
      email,
      image: req.file.path,
      password: hashedPassword,
      places: []
    });
  
    try {
      await createdUser.save();
    } catch (err) {
      return next(new HttpError('Signing up failed, please try again later.', 500));
    }
    
    let token;
    try {
      token = jwt.sign(
        { userId: createdUser.id, email: createdUser.email },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );
    } catch (error) {
      return next(new HttpError('Signing up failed, please try again later.', 500));
    }
  
    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
  };
  

const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email }); 
    } catch (err) {
      return next(new HttpError('Signing up failed, please try again later.', 500));
    }

    if(!existingUser){
      return next(new HttpError('Invalid credentials', 403));
    }

    let isValidPassword = false;
    try {
      isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
      const error = new HttpError('Could not log you in. Check your credentials.', 500);
      return next(error)
    }

    if(!isValidPassword){
      const error = new HttpError('Could not log you in. Check your credentials.', 500);
      return next(error)
    }

    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email }, 
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      userId: existingUser.id,
      email: existingUser.email,
      token
    });


}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;