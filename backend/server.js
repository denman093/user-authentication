const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err) => {
    if(err)
        return console.error(err);
    console.log("Connected to MongoDB");
})

app.use('/identity', require('./routers/userRouter'));