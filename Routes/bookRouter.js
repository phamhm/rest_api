import express from 'express';

export default function (serviceLocator){
  const Book = serviceLocator('bookModel');

  const bookRouter = express.Router();

  bookRouter.route('/')
    .get((req, res) => Book.find({}, (err, books)=>res.json(books)))
    .post((req, res) => {
      console.log('testing body:', req.body);
      const book = new Book(req.body);
      book.save();
      res.status(201).send(book);
    })
    .delete((req, res)=>{
      console.log('deleting:', req.body);
      res.send({message:"successfull deletion"});
    });
  return bookRouter;
}
