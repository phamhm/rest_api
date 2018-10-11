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

  describe('/POST Account', ()=>{
    it('should post an account with primename', (done)=>{
      let account ={
        primeName: {
          first: "Beethoven",
          last: "Beeth",
          ssn: "123-45-7890",
          type: "Prime"
        }
      };

      chai.request(server)
        .post('/account')
        .send(account)
        .end((err, res)=>{
          res.should.have.status(200);
          done();
        });
    });
  });
});
