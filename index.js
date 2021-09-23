const express = require('express')
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();


app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const port = process.env.PORT || 8000;

const bookRouter = require('./routers/book.route');
const feedBackRouter = require('./routers/feedBack.route');
const categoryRouter = require('./routers/category.route');
const colorRouter = require('./routers/color.route');
const userRouter = require('./routers/user.route');
const billRouter = require('./routers/bill.route');

//connect db
mongoose.connect("mongodb://localhost/bookstore");

//middleware 
const authMiddleware = require('./middleware/authMiddleware');


app.use('/api', express.static('public'));
app.use('/api/user', userRouter);
app.use('/api/books', bookRouter);
app.use('/api/feedBack', feedBackRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/colors', colorRouter);
app.use('/api/bills', authMiddleware.isAuth, billRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})