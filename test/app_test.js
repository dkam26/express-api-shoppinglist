process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

import Server from '../app';
import User from '../src/user.models';
import Shoppinglist from '../src/shoppinglist.models';
const user ={
  username: 'ii',
  firstname: 'deo',
  secondname: 'Kamara',
  password: '1234',
};
chai.use(chaiHttp);

describe('Shoppinglistapp', () => {
  before((done) =>{
    User.remove({}, (err) => {
      Shoppinglist.remove({}, (err) =>{
        done();
      });
    });
  });
  describe('/POST signup and /POST login', () => {
    it('it should POST  signup', (done) => {
      chai.request(Server)
          .post('/shoppinglists/signup')
          .send(user)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.own.property('message',
                'User successfully added!, ii');
            done();
          });
    });
    it('it should validate POST  signup', (done) => {
      const invalidUserInfo={
        username: 'ii',
        firstname: '',
        secondname: 'Kamara',
        password: '1234',
      };
      chai.request(Server)
          .post('/shoppinglists/signup')
          .send(invalidUserInfo)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.own.property('message',
                'Missing fields!' );
            done();
          });
    });
  });
  describe('/POST login', () => {
    let token ='';
    it('it should POST  login', (done) => {
      chai.request(Server)
          .post('/shoppinglists/login')
          .send({'username': user.username, 'password': user.password})
          .end((err, res) =>{
            expect(res.status).to.equal(200);
            token = res.body.token;

            done();
          });
    });
    it('it should validate POST  login', (done) => {
      chai.request(Server)
          .post('/shoppinglists/login')
          .send({'username': user.username, 'password': '123'})
          .end((err, res) =>{
            expect(res.status).to.equal(200);
            expect(res.body).to.have.own.property('Message',
                'Wrong credentials' );
            done();
          });
    });

    it('it should validate POST  login', (done) => {
      chai.request(Server)
          .post('/shoppinglists/login')
          .send({'username': user.username, 'password': ''})
          .end((err, res) =>{
            expect(res.status).to.equal(200);
            expect(res.body).to.have.own.property('Message',
                'Missing fields!' );
            done();
          });
    });

    it('it should POST list', (done) =>{
      let list = 'shirt';
      chai.request(Server)
          .post('/shoppinglists/auth/addlist/')
          .set('x-access-token', token)
          .send({'name': list})
          .end((err, res ) => {
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            done();
          });
    });

    it('it should validate POST list', (done) =>{
      chai.request(Server)
          .post('/shoppinglists/auth/addlist/')
          .set('x-access-token', token)
          .send({'name': ''})
          .end((err, res ) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.own.property('Message',
                'Missing fields!' );
            done();
          });
    });

    it('it should GET lists', (done) =>{
      chai.request(Server)
          .get('/shoppinglists/auth/lists/')
          .set('x-access-token', token)
          .end((err, res ) => {
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('array');
            done();
          });
    });

    it('it should PUT lists', (done) =>{
      chai.request(Server)
          .put('/shoppinglists/auth/update/')
          .set('x-access-token', token)
          .send({'name': 'shirt', 'newName': 'tousers'})
          .end((err, res ) => {
            expect(res.status).to.equal(201);
            expect(res.body).to.be.an('object');
            done();
          });
    });

    it('it should DELETE lists', (done) =>{
      chai.request(Server)
          .del('/shoppinglists/auth/delete')
          .set('x-access-token', token)
          .send({'name': 'shirt'})
          .end((err, res ) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            done();
          });
    });

    it('it should DELETE lists', (done) =>{
      chai.request(Server)
          .del('/shoppinglists/auth/delete')
          .set('x-access-token', token)
          .send({'name': ''})
          .end((err, res ) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.own.property('Message',
                'Missing fields!' );
            done();
          });
    });

    it('it should DELETE lists', (done) =>{
      chai.request(Server)
          .del('/shoppinglists/auth/delete')
          .set('x-access-token', token)
          .send({'name': 's'})
          .end((err, res ) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.own.property('Message',
                'List doesnt exist' );
            done();
          });
    });
  });
  after(() => {
    Server.close( () => {
      console.log( 'Closed out remaining connections.');
    //  Close db connections, etc.
    });
  });
});

