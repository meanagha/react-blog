const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1 //true
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 30
    },
    role: {
        type: Number,
        default: 0 //normal user
    },
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {//When password is modified then only call this
        // console.log('password changed')
        // console.log(user)
        //This is nothing but before you go to register any person
        //OR store any person's info into database that whole info about that person which is
        //going to store into database that user's info we will get here in user variable.
        //Ji info registration fronend form kadun nukatich alie backend la store honyasati (I am talking about registration process)
        //Ti info sagli mla ya "user" variable mdhe disat ahe.Jar ithe kahi issue ala logic mdhe kiwa kutlahi error tr registration
        //Honar nahi
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);//cb means call back 
        cb(null, isMatch)
    })
}
//plainPassword : User given plain password which is just coming from login form which is plain input
//this.password : This is hashed password which actually stores in db in hash format So I am checking both password
//Basically using compare() I am checking whatever password I given in login form its respective hash password is present or not


userSchema.methods.generateToken = function (cb) {
    var user = this;
    //console.log('user', user)//Which user is trying to login means data like email and password coming from login UI 
    // console.log('userSchema', userSchema)
    var token = jwt.sign(user._id.toHexString(), 'secret')//jsonwebtoken pkg required to use jwt
    var oneHour = moment().add(1, 'hour').valueOf();

    user.tokenExp = oneHour;
    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user);
    })
}
//1 st implementation of findByToken() is here.Then it used in middleware to take info of
//loggedin user
userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    jwt.verify(token, 'secret', function (err, decode) {
        user.findOne({ "_id": decode, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        })
    })
}
const User = mongoose.model('User', userSchema)
module.exports = { User }
