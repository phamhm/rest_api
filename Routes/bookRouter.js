import R from 'ramda';
import express from 'express';

export default function (serviceLocator){
  const Book = serviceLocator('bookModel');

  const bookRouter = express.Router();

  bookRouter.route('/')
    .get((req, res) => Book.find({}, (err, books)=>res.json(books)))
    .post((req, res) => {
      const book = new Book(req.body);
      book.save();
      res.status(201).send(book);
    })
    .delete((req, res)=>{
      const idNotFound = R.compose(R.isEmpty, R.pick(['_id']));
      if(idNotFound(req.body))
        return res.status(400).send({message:'_id missing'});

      Book.deleteOne(req.body)
        .then(()=>res.sendStatus(204))
        .catch((err)=>res.status(404).send(err));
    })
    .put((req, res)=>{
      const id = R.pick(['_id'], req.body);
      const updateVal = R.dissoc('_id', req.body);

      if (R.isEmpty(id))
        return res.status(404).send('_id missing');

      Book.findOneAndUpdate(id, updateVal)
        .then(()=>res.send(req.body))
        .catch((err)=>status(404).send(err));
    });
  return bookRouter;
}
