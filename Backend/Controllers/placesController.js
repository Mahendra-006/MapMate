const fs = require('fs')

const { validationResult } = require('express-validator');
const mongoose = require('mongoose')

const HttpError = require('../Models/error.js')
const getCoordinatesFromAddress = require('../Utils/location.js');
const Place = require('../Models/place.js')
const User = require('../Models/user.js')

const getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId 

    let place;
    try{
        place = await Place.findById(placeId)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, Could not find a place',
            500
        )
        return next(error)
    }
    

    if(!place){
       const error = new HttpError('could not find a place', 404)
       return next(error)
    }
    res.json({place: place.toObject({getters: true}) })
}

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.userId;

    let places;
    try {
        places = await Place.find({creator: userId})
    } catch (err) {
        const error = new HttpError(
            'Fetching places failed, please try again later',
            500
        )
        return next(error)
    }

    res.json({places: places.map(place => place.toObject({getters: true}))})
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid Inputs passed, Please check your data', 422));
    }
    const {title, description, address} = req.body;
    let coordinates
    try {
        coordinates = await getCoordinatesFromAddress(address)
    } catch(error) {
        return next(error)
    }
    
    const createdPlace = new Place({
        title,
        description,
        location: coordinates,
        image: req.file.path,
        address,
        creator: req.userData.userId
    })

    let user;
    try {
        user = await User.findById(req.userData.userId)
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        )
        return next(error);
    }

    if(!user){
        const error = new HttpError(
            'Could not find user for provided Id.',
            500
        )
        return next(error);
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction();
        await createdPlace.save({ session: sess })
        user.places.push(createdPlace)
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        )
        return next(error);
    }

    res.status(201).json({place: createdPlace})
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid Inputs passed, Please check your data', 422))
    }

    const {title, description} = req.body;
    const placeId = req.params.placeId;

    let place;
    try{
        place = await Place.findById(placeId)
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, Could not update a place',
            500
        )
        return next(error)
    }

    if(place.creator.toString() !== req.userData.userId){
        const error = new HttpError(
            'You are not allowed to edit this place',
            401
        )
        return next(error)
    }
    
    place.title = title;
    place.description = description;

    try {
        await place.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, Could not update a place',
            500
        )
        return next(error)
    }

    res.status(200).json({place: place.toObject({getters: true}) })
    
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.placeId;
    
    let place;
    try {
        place = await Place.findById(placeId).populate('creator')
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete the place',
            500
        )
        return next(error);
    }

    if (!place) {
        return next(new HttpError('Could not find a place for that id.', 404));
    }

    if(place.creator.id !== req.userData.userId){
        const error = new HttpError(
            'You are not allowed to delete this place',
            401
        )
        return next(error)
    }

    const imagePath = place.image;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session: sess})
        place.creator.places.pull(place);
        await place.creator.save({ session: sess})
        await sess.commitTransaction()
    } catch (err) {
        const error = new HttpError(
            'Something went wrong',
            500
        )
        return next(error);
    }

    fs.unlink(imagePath, err => {
        console.log(err)
    })
    
    res.status(200).json({message: "Place Successfully Deleted"})
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;