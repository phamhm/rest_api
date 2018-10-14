import R from 'ramda';
import serviceLocator from 'service-locator';
import Result from 'folktale/result';
import mongoose from 'mongoose';
import Future from 'fluture';

class ModelStrategy {
  constructor(modelname){
    this.currentRecord = modelname;
  }

  get(req, res){
    this.strategy.find(req.body,
                       (err, records)=>res.json(records));
  }

  async post(req, res){
    /*
      DATA=
      {
      Account: {},
      Share: [{type: 1}, {type: 2}],
      Loan: [{type:100}, {type: 300}]
      };
    */

    const data = req.body;
    // {Account: value} => {Account: Future.Of(Model.create(value))};
    const createMongooseObj =  (value, modelname) =>  Future.tryP(mongoose.model(modelname).create(value));
    const createMongooseFuture = R.mapObjIndexed(createMongooseObj);

    const validate = (mongooseObj)=>Future.tryP(mongooseObj.validate());

    // let get a list of those futures
    const processRequest = R.compose(
      R.map(R.chain(validate)),
      R.values, // return a list of Future.of(values)
      createMongooseFuture// val => Future.of(val)
    );
    processRequest(data).fork(
      res.status(500).send,
      res.status(201).send
    );

  }
}
