const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const placeRoutes = require("./Routes/placesRoute.js")
const userRoutes = require("./Routes/userRoute.js")
const HttpError = require('./Models/error.js')

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next()
})

app.use("/api/places", placeRoutes)
app.use("/api/users", userRoutes)

app.use((req, res, next) => {
    const error = new HttpError('Could not find this Route', 404);
    throw error;
})

app.use((error, req, res, next) => {
    if(req.file){
        fs.unlink(req.file.path, (err) => {
            console.log(err)
        })
    }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500)
    res.json({
        message: error.message || "An Unknow Error Occured!!"
    })
})

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mernlearning.nkrsv.mongodb.net/PlaceSharingApp`)
    .then(() => app.listen(3000))
    .catch(err => {
        console.log(err)
    })