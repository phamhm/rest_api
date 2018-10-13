import mongoose from 'mongoose';
import ModelNames from './model-names';
import R from 'ramda';
const { Schema } = mongoose;
import NameModel from './nameModel';

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
  return async (req, res)=>{
    const subrecords = AccountModel.getSubRecords();

    const subrecObjs = R.pick(subrecords, req.body);

    const accountObj = R.omit(subrecords, req.body);

    const account = new AccountModel(accountObj);

    for (let [recordName, records] of R.toPairs(subrecObjs)){
      const modelname = R.init(recordName);
      const subrecModel = mongoose.model(modelname);

      let subs;
      try{
        subs = await subrecModel.create(records);
      } catch(err){
        return void res.status(500).send(err);
      }

      const validatingSubs = subs.map(sub=>sub.validate());

      try{
        await Promise.all(validatingSubs);
      } catch(err){
        return void res.status(500).send(err);
      }
    }

    try{
      await account.validate();
    } catch(err){
      return void res.status(500).send(err);
    }

    try {
      const result = await account.save();
      res.status(201).send(result);
    }catch(err){
      return void res.status(500).send(err);
    }
  };
};

export default ()=>AccountModel;
