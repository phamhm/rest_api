import express from 'express';
import Book from '../models/bookModel';

const bookRouter = express.Router();

bookRouter.route('/')
  .get((req, res) => Book.find({}, (err, books)=>res.json(books)))
  .post((req, res) => {
    const book = new Book(req.body);
    book.save();
    res.status(201).send(book);
  });

export default bookRouter;
