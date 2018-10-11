import mongoose from 'mongoose';
import ModelNames from './model-names';

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const nameSchema = new Schema({
  account: {type:ObjectId, ref:ModelNames.account},
  first: String,
  middle: String,
  last: String,
  ssn: {type:String,
        maxLength:11,
        validate:{
          validator(v){
            return /\d{3}-\d{2}-\d{4}/.test(v);
          },
          message: p=>`${p.value} is not a valid SSN`
        },
        required: [true, 'SSN is required']
       },

  type: {type:String,
         enum: ['Prime', 'Joint', 'SSN Override',
                'Address Override'],
        }
});

nameSchema.methods.handleValidate = async function(res){
  try {
   await this.validate();
  } catch(err){
    res.status(500).send(err);
  }
};

const NameModel = mongoose.model(ModelNames.name,
                                 nameSchema);

NameModel.nameFactory = (nameObj)=>new NameModel(nameObj);

NameModel.saveName = (acctNumber, name)=>{
  name.account = acctNumber;
  return name.save();
};

export default ()=>NameModel;
