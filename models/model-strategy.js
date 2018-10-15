import R from 'ramda';
import mongoose from 'mongoose';
import Future from 'fluture';

const flatten = R.compose(R.flatten, R.of);
const flattenData = (data)=>{
  const liftModelToValues =  (objValue, modelname) =>  {
    const values = flatten(objValue);//[[a], [a], [a]] => [a, a, a]

    const lift =  R.lift((k, v)=>({[k]:v}));

    return lift([modelname], values);
  };

  return  R.compose(flatten, R.values,
                    R.mapObjIndexed(liftModelToValues))(data);
};

class ModelStrategy {
  constructor(modelname){
    this.currentRecord = modelname;
  }

  get({body: query}, res){
    this.strategy.find(query,
                       (err, records)=>res.json(records));
  }

  post({body:data}, res) {
    const flatData = flattenData(data);

    const dataValidateAndSave =(data)=>{
      return Future.do(function*(){
        const [modelname, value] = flatten(R.toPairs(data));

        const Model = yield Future.try(()=>mongoose.model(modelname));
        const mObj = new Model(value);
        yield Future.tryP(()=>mObj.validate());
        yield Future.tryP(()=>mObj.save());
        return mObj;
      });
    };

    const futures = R.traverse(Future.of, dataValidateAndSave, flatData);
    futures.fork(
      (err)=>res.status(500).json(err),
      (data)=>res.status(201).json(data)
    );
  }
}
