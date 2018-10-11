import mongoose from 'mongoose';
import ModelNames from './model-names';
import R from 'ramda';
const { Schema } = mongoose;

const accountSchema = new Schema({
  _id: {type: Schema.Types.ObjectId, auto:true, alias:'number'},
  openDate: {type:Date, default: Date.now},
  closeDate: {type:Date, default:null},
});

accountSchema.methods.handleValidate = async function(res){
  try{
    await this.validate();
  } catch(err){
    res.status(500).send(err);
  }
};

const AccountModel =  mongoose.model(ModelNames.account,
                                     accountSchema);

AccountModel.accountFactory =  (accountObj)=>new AccountModel(accountObj),

AccountModel.get = ()=>{
  return (req, res)=>{
    AccountModel.find({}, (err, accounts)=>res.json(accounts));
  };
};

AccountModel.post = (serviceLocator)=>{
  const NameModel = serviceLocator('nameModel');

  const primenameLens = R.lensProp('primeName');
  const getPrimeName = R.view(primenameLens);
  const removePrimeName = R.dissoc('primeName');

  const createAccount = R.compose(AccountModel.accountFactory,
                                  removePrimeName);

  const createPrimeName = R.compose(NameModel.nameFactory,
                                    getPrimeName);

  return async (req, res)=>{
    const account = createAccount(req.body);
    const name = createPrimeName(req.body);

    name.account = account.number;

    const save = (record)=>record.save();
    const validate = (record)=>record.validate();

    // trying to validate all records:
    try{
      await Promise.all(R.map(validate, [account, name]));
    } catch(err){
      res.status(500).send(err);
    }

    // trying to save all records:
    let result;
    try{
      result = await Promise.all(R.map(save, [account, name]));
    }catch(err){
      res.status(500).send(err);
    }

    res.status(200).send(result);
  };
};

export default ()=>AccountModel;
