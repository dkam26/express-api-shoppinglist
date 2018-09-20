process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
var mongoose = require("mongoose");
const  expect = chai.expect;


const app = require('../app').app;
const Users =  require('../models').User
const Shoppinglists =   require('../models').Shoppinglist
const user ={
    username: 'ii',
    firstname: 'deo',
    secondname: 'Kamara',
    password:'1234'
  }
chai.use(chaiHttp);

describe('Shoppinglistapp', () => {
    before((done) =>{
        Users.remove({}, (err) => { 
          Shoppinglists.remove({}, (err) =>{
             done();	
          })       	   	   
         });
   
    })
    describe('/POST signup and /POST login', () => {
        it('it should POST  signup', (done) => {
         
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

        it('it should validate POST  signup', (done) => {
            var invalidUserInfo={
                username: 'ii',
                firstname: '',
                secondname: 'Kamara',
                password:'1234'
              } 
            chai.request(app)
                .post('/shoppinglists/signup')
                .send(invalidUserInfo)
                .end((err, res) => {
                      expect(res.status).to.equal(200);
                      expect(res.body).to.be.an('object');
                      expect(res.body).to.have.own.property('message', 'Missing fields!' )
                  done();
                });
  
          });

        
      
    });
    describe('/POST login', () => {
        var token ='';
        it('it should POST  login', (done) => {
          chai.request(app)
              .post('/shoppinglists/login')
              .send({"username":user.username,"password":user.password})
              .end((err, res) =>{
                expect(res.status).to.equal(200);
                token = res.body.token
                
                done();
              })
              

        });
        it('it should validate POST  login', (done) => {
            chai.request(app)
                .post('/shoppinglists/login')
                .send({"username":user.username,"password":'123'})
                .end((err, res) =>{
                  expect(res.status).to.equal(200);
                  expect(res.body).to.have.own.property('Message', 'Wrong credentials' )
                  
                  
                  done();
                })
                
  
        });

        it('it should validate POST  login', (done) => {
            chai.request(app)
                .post('/shoppinglists/login')
                .send({"username":user.username,"password":''})
                .end((err, res) =>{
                  expect(res.status).to.equal(200);
                  expect(res.body).to.have.own.property('Message', 'Missing fields!' )
                  done();
                })
                
  
        });

        it('it should POST list', (done) =>{
            var list = 'shirt';
            chai.request(app)
                .post('/shoppinglists/auth/addlist/')
                .set('x-access-token',token)
                .send({'name':list})
                .end((err, res ) => {
                    expect(res.status).to.equal(201);
                    expect(res.body).to.be.an('object');
                    done();
                })               
        })

        it('it should POST list', (done) =>{
            chai.request(app)
                .post('/shoppinglists/auth/addlist/')
                .set('x-access-token',token)
                .send({'name':''})
                .end((err, res ) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.own.property('Message', 'Missing fields!' )
                    done();
                })   
        })

        it('it should GET lists', (done) =>{
            chai.request(app)
                .get('/shoppinglists/auth/lists/')
                .set('x-access-token',token)
                .end((err, res ) => {
                    expect(res.status).to.equal(201);
                    expect(res.body).to.be.an('array');
                    done();
                })
               
          })

          it('it should PUT lists', (done) =>{
            chai.request(app)
                .put('/shoppinglists/auth/update/')
                .set('x-access-token',token)
                .send({'name':'shirt','newName':'tousers'})
                .end((err, res ) => {
                    expect(res.status).to.equal(201);
                    expect(res.body).to.be.an('object');
                    done();
                })
               
          })

          it('it should DELETE lists', (done) =>{
            chai.request(app)
                .del('/shoppinglists/auth/delete')
                .set('x-access-token',token)
                .send({'name':'shirt'})
                .end((err, res ) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('object');
                    done();
                })
               
        })
    });
    after(async() =>{
        app.close(function () {
            console.log( "Closed out remaining connections.");
            // Close db connections, etc.
          });	
   
    })
  });
