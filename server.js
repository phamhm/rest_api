import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import serviceLocator from './service-locator';

if (process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const app = express();
const port = process.env.PORT || 5656;

const db = mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/book', serviceLocator.bookRouter());

app.listen(port, ()=>console.log(`listening to port ${port}`));
