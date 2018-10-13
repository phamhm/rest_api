import mongoose from 'mongoose';
import ModelNames from './model-names';

const shareSchema = new mongoose.Schema({
  type: {type: Number, required:true},
  description: {type: String, required: true}
});

const ShareModel = mongoose.model(ModelNames.share, shareSchema);

export default ()=>ShareModel;
