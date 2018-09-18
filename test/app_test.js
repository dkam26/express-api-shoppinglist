process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
var mongoose = require("mongoose");
const  expect = chai.expect;

const app = require('../app').app;
const Users =  require('../models').User
const Shoppinglists =   require('../models').Shoppinglist

chai.use(chaiHttp);

describe('Shoppinglistapp', () => {
    before((done) =>{
        Users.remove({}, (err) => { 
                done();		   	   
         });
    })
    describe('/POST signup', () => {
        it('it should POST  signup', (done) => {
          var user ={
            username: 'ii',
            firstname: 'deo',
            secondname: 'Kamara',
            password:'1234'
          }
          chai.request(app)
              .post('/shoppinglists/signup')
              .send(user)
              .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.own.property('message', 'User successfully added!, ii' )
                done();
              });
        });
    });

    
  });
