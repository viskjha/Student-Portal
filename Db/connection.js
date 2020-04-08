const mongoose = require('mongoose');

const URI='mongodb+srv://viskjha:viskjha@cluster0-mksdu.mongodb.net/test?retryWrites=true&w=majority';

const connectDB = async()=>
{
    await mongoose.connect(URI,
        {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    console.log('Database connected');
};

module.exports = connectDB;