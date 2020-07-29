const express1 = require('express');
const app = express1();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { User } = require('./model/user');
const config = require("./config/keys");
const { auth } = require("./middleware/auth");

mongoose.connect(config.mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    //react-db is database name in which you can insert your data which will automatically create on mongo cloud
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) // parse application/json

app.get('/', (req, res) => {
    res.json({ "message": "Hello world1" })
})
app.post('/register', (req, res) => {//You have to give / before route name otherwise it gives 404 not found error
    const user = new User(req.body)
    user.save((err, data) => {//hashing of password applied before save()or register data
        if (err) {
            return res.json({
                success: false
            })
        }
        else {
            return res.status(200).json({
                success: true
            })
        }

    });

})
app.post('/login', (req, res) => {
    //find email whether that user exists or not
    User.findOne({ email: req.body.email }, (err, user1) => {
        if (!user1)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        //else Check user given plain password with hash password in db
        user1.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            //else If two above task checked then plz make login and create token
            user1.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res.cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    })
})


app.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});


app.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});
//req.user._id this is coming from auth middleware bcz I have used auth in route

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server Listening on ${port}`)
});