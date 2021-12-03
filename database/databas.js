const mongoose = require('mongoose');
const { mongodb } = require('./keys.js');

mongoose.connect(mongodb.URI, { useNewUrlParser: true })
    .then(db =>
        console.log('Database connected'))
    .catch(err => console.error(err));