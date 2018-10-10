import 'babel-polyfill';
import path from 'path';
const dotenvPath = path.resolve('./.env');
require('dotenv').config({path: dotenvPath});
import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';

const should = chai.should();
chai.use(chaiHttp);

describe('Account', function(){
  let server;
  before(()=>server = require('../server').default);
  after(()=>{
    require('../server').server.close();

    // without this mongoose will complete that
    // model need to be rebuilt
    mongoose.models = {};
    mongoose.schemas = {};
  });

  describe('/GET Accounts', ()=>{
    it('should get all accounts', (done)=>{
      chai.request(server)
        .get('/account')
        .end((err, res)=>{
          res.should.have.status(200);
          done();
        });
    });
  });
});
