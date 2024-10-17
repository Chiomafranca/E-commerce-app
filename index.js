const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const productRoute = require('./routes/product');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/order');


dotenv.config();
const app = express();
app.use(express.json());

// Corrected route definitions
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/carts', cartRoute); 
app.use('/api/orders', orderRoute);

let DB;
if (process.env.NODE_ENV === 'development') {
    DB = process.env.DB_LOCAL;
} else if (process.env.NODE_ENV === 'production') {
    // DB = process.env.DATABASE_LOCAL;
    DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASS);
}

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successfully'))
.catch((error) => console.log(error))

// mongoose.connect('mongodb://localhost:27017/api')
// .then(() => { console.log('DB Connected successfully'); })
// .catch((err) => { console.log(err); });


app.listen(process.env.PORT || 5000, () => {
    console.log('Backend Server is running!');
});
