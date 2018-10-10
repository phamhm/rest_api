import mongoose from 'mongoose';
import ModelNames from './model-names';

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const accountModel = new Schema({
  openDate: {type:Date, default: Date.now},
  closeDate: {type:Date, default:null},
  primeName: {type: ObjectId, ref: ModelNames.name,
              required:true},
  jointName: [{type: ObjectId, ref: ModelNames.name}],
});

export default mongoose.model(ModelNames.account,
                                      accountModel);
