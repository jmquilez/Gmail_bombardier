const express = require('express');
const app = express();
const expbs = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');


const session = require('express-session');
const routes = require('./routes/handlers');

require('./database/databas');
app.use(express.static('public'));
app.use(passport.initialize());

const hbs = expbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/mainLayout'), // change layout folder name
    partialsDir: path.join(__dirname, 'views/pieces'), // change partials folder name

    // create custom express handlebars helpers
    helpers: require('./config/handlebars/helpers'),

});


// Express Handlebars Configuration
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//Morgan & middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
//app.use(flash());
/*app.use(passport.initialize());
app.use(passport.session());*/
app.use(session({
    secret: 'secretsess',
    resave: true,
    saveUninitialized: false
}));
app.use(flash());

app.use((req, res, next) => {
    app.locals.registered = req.flash('registered');
    app.locals.alreadyRegistered = req.flash('alrreg');
    next();
});

app.use('/', routes);

//Morgan

const puert = process.env.PORT || 3001;



app.listen(puert, () => {
    console.log('Server is starting at port ', 3001);
});