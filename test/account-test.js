import path from 'path';
const dotenvPath = path.resolve('./.env');
require('dotenv').config({path: dotenvPath});
import R from 'ramda';
const mongoose = require('mongoose');
const chai = require('chai');
const { expect } = chai;
const accountModel =  require('../models/accountModel.js');

beforeEach((done)=>{
  mongoose.connect(process.env.MONGO_DB,
                   {useNewUrlParser:true,
                    autoIndex:false})
    .then(()=>done())
    .catch(console.log);
});

afterEach((done)=>{
  mongoose.connection.close(()=>done());
});

describe('Account Test', function(){
  it("should say hello", ()=>{
    expect('hell').to.equal('hell');
  });
});
