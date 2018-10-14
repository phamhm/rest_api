import mongoose from 'mongoose';
import ModelNames from './model-names';
import R from 'ramda';
const { Schema } = mongoose;
import NameModel from './nameModel';
import Future from 'fluture';
import S from 'sanctuary';
import Result from 'folktale/result';


const accountSchema = new Schema({
  _id: {type: Schema.Types.ObjectId, auto:true, alias:'number'},
  openDate: {type:Date, default: Date.now},
  closeDate: {type:Date, default:null},
  Names: [NameModel().schema],
  Shares: [{type: Schema.Types.ObjectId, ref:ModelNames.share}]
});

accountSchema.statics.getSubRecords = ()=>[
  ModelNames.share,
  ModelNames.loan,
].map(name=>name+'s');

accountSchema.statics.createWithRefs = async function(data){

  const subrecords = AccountModel.getSubRecords();

  const subObjs = R.pick(subrecords, data);

  const mainObj = R.omit(subrecords, data);
};

const AccountModel =  mongoose.model(ModelNames.account,
                                     accountSchema);
AccountModel.get = ()=>{
  return (req, res)=>{
    AccountModel.find({}, (err, accounts)=>res.json(accounts));
  };
};

AccountModel.post = (serviceLocator)=>{
  return (req, res) => {
    const data = req.body;

    const flatten = R.compose(R.flatten, R.of);

    // {Account: value} => {Account: Future.Of(Model.create(value))};
    const liftModelToValues =  (objValue, modelname) =>  {
      const values = flatten(objValue);//[[a], [a], [a]] => [a, a, a]

      const lift =  R.lift((k, v)=>({[k]:v}));

      return lift([modelname], values);
    };

    const flatData = R.compose(flatten,
                               R.values,
                               R.mapObjIndexed(liftModelToValues));
    const parsedData = flatData(data);

    Future.do(function* (){
      const mObjs = [];
      for(let data of parsedData){
        const [modelname, value] = flatten(R.toPairs(data));

        const Model = yield Future.try(()=>mongoose.model(modelname));
        const mObj = new Model(value);
        yield Future.tryP(()=>mObj.validate());
        mObjs.push(mObj);
      }

      for (let mObj of mObjs){
        yield Future.tryP(()=>mObj.save());
      }
    }).fork(err=>res.status(500).send(err),
            data=>res.status(201).send(data));

    console.log('after future');
  };

};

export default ()=>AccountModel;
