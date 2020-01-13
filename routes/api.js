const express = require('express');
const router = express.Router();
const User = require('../models/user');
// var bkfd2Password = require("pbkdf2-password");
// var hasher = bkfd2Password();
// var assert = require("assert");

//get index
router.get('/', function(req, res, next)
{
    res.redirect('../public/index.html');
});

router.get('/userProfiles/ingredients', function(req, res, next)
{
    res.send(req.session);
});

//get user profile from database
router.get('/userProfiles/login', function(req, res, next)
{
    let userSearch = req.query.username;
    let passwordSearch = req.query.password;

    User.findOne({username: userSearch}).then(function(user)
    {
        if(user.password == passwordSearch)
        {   
            req.session.userID = user._id;
            
            res.send(user._id);
        }
        else{console.log('wrong password');}
    });
});

// hasher(req.body, function (err, pass, salt, hash) 
// {
//     req.body.salt = salt;

//     hasher(req.body, function(err, pass, salt, hash2) 
//     {
//         assert.deepEqual(hash2, hash);
//     }); 
// });

router.get('/userProfiles/:id', function(req, res, next)
{
    User.findById({_id: req.params.id.toString()}).then(function(user)
    {
        res.send(user);
    });
});

//add new user profile to database
router.post('/userProfiles', function(req, res, next)
{
    User.create(req.body).then(function(user)
        {
            res.send(user);
        }).catch(next);
});

//update profile in database
router.put('/userProfiles/:id', function(req, res, next)
{
    User.findByIdAndUpdate({_id: req.params.id}, req.body).then(function()
    {
        User.findOne({_id: req.params.id}).then(function(user)
        {
            res.send(user);
        });
    });
});

//delete profile from database
router.delete('/userProfiles/:id', function(req, res, next)
{
    User.findByIdAndRemove({_id: req.params.id}).then(function(user)
    {
        res.send(user);
    });
});

module.exports = router;