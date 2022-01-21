const Clarifai = require('clarifai');
const dotenv = require('dotenv').config('../.env');

const app = new Clarifai.App({
    apiKey: process.env.API_KEY
});

const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => {
            res.json(data);
        })
        .catch(err => {res.status(400).json('unable to work with Clarifai API')})
}

const handleImage = (req, res, postgres) => {
    const { id }  = req.body;
    postgres('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('error grabbing the entries'))
}



module.exports = {
    handleImage,
    handleApiCall
}