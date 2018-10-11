import express from 'express';

export default function(serviceLocator){
  const AccountModel = serviceLocator('accountModel');
  const accountRouter = express.Router();

  accountRouter.route('/')
    .get(AccountModel.get(serviceLocator))
    .post(AccountModel.post(serviceLocator));

  return accountRouter;
}
