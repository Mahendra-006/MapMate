const express = require('express');
const { check } = require('express-validator')

const placesControllers = require('../Controllers/placesController')
const fileUpload = require('../middleware/fileUpload.js')
const authCheck = require('../middleware/auth.js')
const router = express.Router();

router.get('/:placeId', placesControllers.getPlaceById)

router.get('/user/:userId', placesControllers.getPlacesByUserId)

router.use(authCheck);

router.post('/', fileUpload.single('image') ,[
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}),
    check('address').not().isEmpty()
] ,placesControllers.createPlace)

router.patch('/:placeId', [
    check('title').not().isEmpty(),
    check('description').isLength({min: 5}),
],placesControllers.updatePlace)

router.delete('/:placeId', placesControllers.deletePlace)

module.exports = router;