import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookModel = new Schema({
  title: {type: String},
  author: {type: String}
});

export default mongoose.model('books', bookModel);
