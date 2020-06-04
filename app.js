const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const parseurl = require('parseurl')
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const uri = "mongodb+srv://macieljonathan:Peanut90@cluster0-ehkbv.mongodb.net/userDB?retryWrites=true&w=majority";
const cors = require('cors');

//set up express app
const app = express();

//connect to mongodb
mongoose.connect(uri, {useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false});
mongoose.Promise = global.Promise;

var date = Date.now();
var secretString = date.toString();

app.use(session(
{
    secret: secretString, 
    saveUninitialized: false,
    resave: false,
    cookie: 
    {
        secure: false, //true is recommended, but not possible without https
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(function (req, res, next) 
{
    if (!req.session.views) {
      req.session.views = {}
    }
    
    // get the url pathname
    var pathname = parseurl(req).pathname

    // count the views
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
    
    next()
});

app.use(bodyParser.json());

app.use(express.static('public'));

app.use(cors());

//error handling middleware
app.use(function(err, req, res, next)
{
    res.status(422).send({error: err.message});
});

//initialize routes
app.use('/api', require('./routes/api'));

//listen for requests
app.listen(process.env.port || 3000, function()
{
    console.log('now listening for requests');
});

