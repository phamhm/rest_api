import mongoose from 'mongoose';
const { Schema } = mongoose;

export default function (serviceLocator){
  const bookModel = new Schema({
    title: {type: String},
    author: {type: String}
  });

  return mongoose.model('books', bookModel);
}
