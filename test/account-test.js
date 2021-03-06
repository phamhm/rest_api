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


    mongoose.model('Account').remove({});
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
    it('should post an account with name(s)', (done)=>{
      let account ={
        Account: {},
        Name: [
          {first: "Beethoven",
           last: "Beeth",
           ssn: "123-45-7330",
           type: "Prime"},
          {
            first:'chopin',
            last: 'this is the live',
            ssn: '456-23-4333',
            type: "Joint",
          }
        ]
      };

      chai.request(server)
        .post('/account')
        .send(account)
        .end((err, res)=>{
          res.should.have.status(201);
          done();
        });
    });
  });

  describe('/POST Account', ()=>{
    it('should post an account with shares', (done)=>{
      let account ={
        Account: { Names: [
          {first: "Beethoven",
           last: "Beeth",
           ssn: "123-45-7890",
           type: "Prime"},
        ]},
        Share:[
          {type: 100, description:'checking'},
          {type: 300, description:'saving'},
          {type: 400, description:'certificate'}
        ]
      };

      chai.request(server)
        .post('/account')
        .send(account)
        .end((err, res)=>{
          if(res.error.text)
            console.log(res.error.text);
          res.should.have.status(201);

          done();
        });
    });
  });
});
