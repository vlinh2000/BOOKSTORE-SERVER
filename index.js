const express = require('express')
const cors = require('cors')
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();


app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const port = process.env.PORT || 8000;

const bookRouter = require('./routes/book.route');
const feedBackRouter = require('./routes/feedBack.route');
const categoryRouter = require('./routes/category.route');
const filterRouter = require('./routes/filter.route');
const userRouter = require('./routes/user.route');
const billRouter = require('./routes/bill.route');

//connect db
mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connect succesfully")
}, error => {
    console.log("Connection failed ");
});

//middleware 
const authMiddleware = require('./middleware/authMiddleware');


app.use('/api', express.static('public'));
app.use('/api/user', userRouter);
app.use('/api/books', bookRouter);
app.use('/api/feedBack', feedBackRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/filter', filterRouter);
app.use('/api/bills', authMiddleware.isAuth, billRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})