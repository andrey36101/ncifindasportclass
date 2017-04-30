'use strict';

var request = require('supertest');
var should = require('should');
var app = require('../../app.js');
var token = '';
var userId = '';
var feedbackId = '';
describe('POST /api/feedback', function () {
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
    it('should create feedback and respond 200 status', function (done) {
        var postData = {
            "content": "Nice trainer",
            "ratting": 5,
            "trainerId": "58caa3238664432062aea426",
            "userId": userId
        }
        request(app)
            .post('/api/feedback')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                feedbackId = res.body.Data._id;
                done();
            });
    });
});

describe('GET /api/feedback', function () {
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
            .get('/api/feedback')
            .set('Accept', 'application/json')
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('should respond with 200 status', function (done) {
        request(app)
            .get('/api/feedback/' + feedbackId)
            .set('Accept', 'application/json')
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('should respond with 400, record not found', function (done) {
        request(app)
            .get('/api/feedback/111')
            .set('Accept', 'application/json')
            .set('token', token)
            .expect(400, done);
    });
});

describe('PUT /api/feedback', function () {
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
    it('should update feedback and respond with 200 status', function (done) {
        var postData = {
            "content": "Nice trainer",
            "ratting": 5,
            "trainerId": userId,
            "userId": userId
        }
        request(app)
            .put('/api/feedback/' + feedbackId)
            .set('Accept', 'application/json')
            .set('token', token)
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should return no user found', function (done) {

        request(app)
            .put('/api/feedback/100')
            .set('Accept', 'application/json')
            .set('token', token)
            .send({content: 'pm1test'})
            .expect(400)
            .end(done);
    });

});
describe('DELETE /api/feedback', function () {
    it('login',function (done) {
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
    it('should delete feedback and respond with 200 status', function (done) {
        request(app)
            .delete('/api/feedback/' + feedbackId)
            .set('Accept', 'application/json')
            .set('token', token)
            .send()
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should return no feedback found', function (done) {
        request(app)
            .delete('/api/feedback/100')
            .set('Accept', 'application/json')
            .set('token', token)
            .send()
            .expect(400)
            .end(done);
    });
});