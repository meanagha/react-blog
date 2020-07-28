const express1 = require('express');
const app = express1();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://anagha:123@cluster0.0rn60.mongodb.net/<dbname>?retryWrites=true&w=majority',
{useNewUrlParser:true,useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello world1')
})
app.listen(5000);//103.121.1.96