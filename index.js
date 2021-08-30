const express = require('express')
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors());

const port = process.env.PORT || 3000;

const bookRouter = require('./routers/book.route');

//connect db
mongoose.connect("mongodb://localhost/bookstore");

app.use('/books', bookRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})