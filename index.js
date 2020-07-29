const express1 = require('express');
const app = express1();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const { User } = require('./model/user');
const config = require("./config/keys");

mongoose.connect(config.mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    //react-db is database name in which you can insert your data which will automatically create on mongo cloud
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) // parse application/json
app.get('/', (req, res) => {
    res.send('Hello world1')
})
app.post('/register', (req, res) => {//You have to give / before route name otherwise it gives 404 not found error
    const user = new User(req.body)
    user.save((err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(data)
        }
        return res.status(200).json({
            success: true
        })
    });

})
// {
//     "email" : "test@gmail.com",
//         "password" : "123",
//             "name" : "anagha",
//                 "lastname" : "patil"
// }

app.listen(5000);//103.121.1.96