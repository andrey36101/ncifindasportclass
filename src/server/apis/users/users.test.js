'use strict';

var request = require('supertest');
var should = require('should');
var app = require('../../app.js');
var token = '';
var userId = '';

describe('POST /api/user', function () {
    it('should create trainer user and respond with json and 200 status', function (done) {
        var postData = {
            "email":"andrei@gmail.com",
            "name":"Andrei",
            "password":"admin",
            "gender":"male",
            "location":[150.644,-34.397],
            "type":"trainer",
            "profilePic":"mytest.png",
            "address": {
                "address1":"address street 1",
                "address2":"address street 2",
                "city":"Wales",
                "state":"New South Wales",
                "zipcode":"1234",
                "country":"Australia",
                "phone":"+412543322222"
            }
        }
        request(app)
            .post('/api/user')
            .set('Accept', 'application/json')
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should create customer user and respond with json and 200 status', function (done) {
        var postData = {email: 'andrei.customer@gmail.com', name: 'Andrei', password: 'admin', type: 'trainer'};
        request(app)
            .post('/api/user')
            .set('Accept', 'application/json')
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    done(err);
                }
                else {
                    userId =res.body.Data._id;
                    console.log('userId',userId);
                    done();
                }
            });

    });
    it('should not create user without password', function (done) {
        request(app)
            .post('/api/user')
            .set('Accept', 'application/json')
            .send()
            .expect('Content-Type', /json/)
            .expect(400)
            .end(done);
    });
});
describe('POST /api/login', function () {
    it('should login user and respond with 200 status', function (done) {
        var postData = {
            "email":"andrei@gmail.com",
            "password":"admin"
        }
        request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should not login user and respond with 400 status', function (done) {
        var postData = {
            "email":"andrei@gmail.com",
            "password":"admin1"
        }
        request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(400)
            .end(done);
    });

});
describe('GET /api/user', function () {
    it('should respond with json', function (done) {
        request(app)
            .get('/api/user')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('should respond with 200 status', function (done) {
        request(app)
            .get('/api/user/'+userId)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('should respond with 204, record not found', function (done) {
        request(app)
            .get('/api/user/15')
            .set('Accept', 'application/json')
            .expect(400, done);
    });
});
describe('PUT /api/user', function () {
    it('should update user and respond with json and 201 status', function (done) {
        var postData = {
            "name":"Andrei",
            "password":"admin",
            "gender":"male",
            "location":[150.644,-34.397],
            "type":"trainer"
        };
        request(app)
            .put('/api/user/'+userId)
            .set('Accept', 'application/json')
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });

    it('should update address of user and respond with json and 200 status', function (done) {
        var postData = {
            "name":"Andrei",
            "password":"admin",
            "gender":"male",
            "location":[150.644,-34.397],
            "type":"trainer"
        };
        request(app)
            .put('/api/user/'+userId)
            .set('Accept', 'application/json')
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });

    it('should update address of user and respond with json and 200 status', function (done) {
        var postData =  {
            "address1":"address line 1",
            "address2":"address street 2",
            "city":"Wales",
            "state":"New South Wales",
            "zipcode":"1234",
            "country":"Australia",
            "phone":"+412543322222"
        };
        request(app)
            .put('/api/user/'+userId+'/address')
            .set('Accept', 'application/json')
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });



    it('should return no user found', function (done) {
        request(app)
            .put('/api/user/100')
            .set('Accept', 'application/json')
            .send({name: 'pm1test'})
            .expect(400)
            .end(done);
    });

});
describe('DELETE /api/user', function () {
    it('should delete user and respond with json and 200 status', function (done) {
        request(app)
            .delete('/api/user/'+userId)
            .set('Accept', 'application/json')
            .send()
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });

    it('should return no user found', function (done) {
        request(app)
            .delete('/api/user/100')
            .set('Accept', 'application/json')
            .send()
            .expect(400)
            .end(done);
    });
});