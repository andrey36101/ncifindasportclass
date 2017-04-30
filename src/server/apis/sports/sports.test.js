'use strict';

var request = require('supertest');
var should = require('should');
var app = require('../../app.js');
var token = '';
var userId = '';
var sportId = '';
describe('POST /api/sports', function () {
    before(function (done) {
        var postData = {
            "email": "andrei@gmail.com",
            "password": "admin"
        }
        request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (error, response) {
                token = response.body.Data.token;
                userId = response.body.Data.user._id;
                done();
            });

    });
    it('should create sport and respond 200 status', function (done) {
        var postData = {
            "gender": "male",
            "location": [150.644, -34.397],
            "name": "Baseball",
            "description": "baseball description",
            "ownerId": "58caa3238664432062aea426",
            "age": 18,
            "price": 100,
            "tags": ["baseball"],
            "prompPicture": "mytest.jpg",
            "address": {
                "address1": "address street 1",
                "address2": "address street 2",
                "city": "Wales",
                "state": "New South Wales",
                "zipcode": "1234",
                "country": "Australia",
                "phone": "+412543322222"
            }
        };
        request(app)
            .post('/api/sports')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                sportId = res.body.Data._id;
                done();
            });
    });
});

describe('GET /api/sports', function () {
    before(function (done) {
        var postData = {
            "email": "andrei@gmail.com",
            "password": "admin"
        }
        request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (error, response) {
                token = response.body.Data.token;
                userId = response.body.Data.user._id;
                done();
            });

    });
    it('should respond with json', function (done) {
        request(app)
            .get('/api/sports')
            .set('Accept', 'application/json')
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('should respond with 200 status', function (done) {
        request(app)
            .get('/api/sports/' + sportId)
            .set('Accept', 'application/json')
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('should respond with 400, record not found', function (done) {
        request(app)
            .get('/api/sports/111')
            .set('Accept', 'application/json')
            .set('token', token)
            .expect(400, done);
    });
});

describe('PUT /api/sports', function () {
    before(function (done) {
        var postData = {
            "email": "andrei@gmail.com",
            "password": "admin"
        }
        request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (error, response) {
                token = response.body.Data.token;
                userId = response.body.Data.user._id;
                done();
            });

    });
    it('should update sport and respond with 200 status', function (done) {
        var postData = {
            "gender": "male",
            "location": [150.644, -34.397],
            "name": "Baseball",
            "description": "baseball description",
            "ownerId": "58caa3238664432062aea426",
            "age": 18,
            "price": 100,
            "tags": ["baseball"],
            "prompPicture": "mytest.jpg"
        };
        request(app)
            .put('/api/sports/' + sportId)
            .set('Accept', 'application/json')
            .set('token', token)
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should update address of sport and respond with 200 status', function (done) {
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
            .put('/api/sports/'+sportId+'/address')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should return no user found', function (done) {

        request(app)
            .put('/api/sports/100')
            .set('Accept', 'application/json')
            .set('token', token)
            .send({content: 'pm1test'})
            .expect(400)
            .end(done);
    });

});
describe('DELETE /api/sports', function () {
    it('login', function (done) {
        var postData = {
            "email": "andrei@gmail.com",
            "password": "admin"
        }
        request(app)
            .post('/api/login')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (error, response) {
                token = response.body.Data.token;
                userId = response.body.Data.user._id;
                done();
            });

    });
    it('should delete sport and respond with 200 status', function (done) {
        request(app)
            .delete('/api/sports/' + sportId)
            .set('Accept', 'application/json')
            .set('token', token)
            .send()
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should return no sport found', function (done) {
        request(app)
            .delete('/api/sports/100')
            .set('Accept', 'application/json')
            .set('token', token)
            .send()
            .expect(400)
            .end(done);
    });
});