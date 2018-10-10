import R from 'ramda';
import express from 'express';

export default function(serviceLocator){

  const accountRouter = express.Router();
  const primenameLens = R.lensProp('primeName', );
  const getPrimeName = R.view(primenameLens);

  const removePrimeName = R.dissoc('primeName');

  const Name = serviceLocator('nameModel');
  const newName = (nameObj)=> new Name(nameObj);
  const createPrimeName = R.compose(newName, getPrimeName);

  const Account = serviceLocator('accountModel');
  const newAccount = (acctObj) => new Account(acctObj);
  const createAccount = R.compose(newAccount, removePrimeName);

  accountRouter.route('/')
    .get((req, res)=>Account.find({}, (err, accounts)=>res.json(accounts)))
    .post(async (req, res) =>{
      const setIds = async (acct, primeName) =>{
        acct.primeName = primeName._id;
        primeName._account = acct._id;
        try{
          await primeName.save();
        } catch(err){
          return res.status(500).send(err);
        }

        try{
          await acct.save();
        } catch(err){
          return res.status(500).send(err);
        }

        res.status(200).send({acct, primeName});
      };

      const saveAccount = R.converge(setIds, [createAccount, createPrimeName]);
      saveAccount(req.body);
    });

  return accountRouter;
}
