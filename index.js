const express = require('express')
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors());

const port = process.env.PORT || 3000;

const bookRouter = require('./routers/book.route');
const categoryRouter = require('./routers/category.route');
const colorRouter = require('./routers/color.route');
const userRouter = require('./routers/user.route');

const authMiddleware = require('./middleware/authMiddleware');

//connect db
mongoose.connect("mongodb://localhost/bookstore");

app.use('/books', bookRouter);
app.use('/categories', categoryRouter);
app.use('/colors', colorRouter);

app.use(authMiddleware.isAuth);

app.use('/users', userRouter);
app.use('/bills', bookRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})