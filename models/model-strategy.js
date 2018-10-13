import R from 'ramda';
import serviceLocator from 'service-locator';
import Result from 'folktale/result';
import mongoose from 'mongoose';

class ModelStrategy {
  constructor(modelname){
    this.model = mongoose.model(modelname);
  }

  get(req, res){
    this.strategy.find(req.body,
                       (err, records)=>res.json(records));
  }

  async post(req, res){

  }

  async createWithRefs(data){
    const subNames = this.model.getSubRecords();
    const subObjs = R.pick(subNames, data);
    const mainObj = R.omit(subNames, data);
    const data = R.assoc('Account', [mainObj], subObjs);

    for (let [recordName, records] of R.toPairs(data)){
      const modelname = R.replace(/s$/, '', recordName);
      const subrecModel = mongoose.model(modelname);

      const result;
      try{
        result = Result.Ok(await subrecModel.create(records));
      } catch(err){
        result = Result.Error(err);
      }

      const validatingSubs = subs.map(sub=>sub.validate());

      try{
        await Promise.all(validatingSubs);
      } catch(err){
        result = Result.Error(err);
      }


    }
  }
}
