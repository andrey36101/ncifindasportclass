'use strict';

var request = require('supertest');
var should = require('should');
var app = require('../../app.js');
var token = '';
var userId = '';
var messageId = '';
describe('POST /api/messages', function () {
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
    it('should create message and respond 200 status', function (done) {
        var postData = {
            "title":"Test Message",
            "description":"how are you?",
            "senderId":"58caa3238664432062aea426",
            "recipientId":"58ca54b437a8ac1437d1cd5f"
        }
        request(app)
            .post('/api/messages')
            .set('Accept', 'application/json')
            .set('token', token)
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                messageId = res.body.Data._id;
                done();
            });
    });
});

describe('GET /api/messages', function () {
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
            .get('/api/messages')
            .set('Accept', 'application/json')
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('should respond with 200 status', function (done) {
        request(app)
            .get('/api/messages/' + messageId)
            .set('Accept', 'application/json')
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('should respond with 400, record not found', function (done) {
        request(app)
            .get('/api/messages/111')
            .set('Accept', 'application/json')
            .set('token', token)
            .expect(400, done);
    });
});

describe('PUT /api/messages', function () {
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
    it('should update message and respond with 200 status', function (done) {
        var postData = {
            "title":"Test Message",
            "description":"how are you?",
            "senderId":"58caa3238664432062aea426",
            "recipientId":"58ca54b437a8ac1437d1cd5f"
        }
        request(app)
            .put('/api/messages/' + messageId)
            .set('Accept', 'application/json')
            .set('token', token)
            .send(postData)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should return no user found', function (done) {

        request(app)
            .put('/api/messages/100')
            .set('Accept', 'application/json')
            .set('token', token)
            .send({content: 'pm1test'})
            .expect(400)
            .end(done);
    });

});
describe('DELETE /api/messages', function () {
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
    it('should delete message and respond with 200 status', function (done) {
        request(app)
            .delete('/api/messages/' + messageId)
            .set('Accept', 'application/json')
            .set('token', token)
            .send()
            .expect('Content-Type', /json/)
            .expect(200)
            .end(done);
    });
    it('should return no message found', function (done) {
        request(app)
            .delete('/api/messages/100')
            .set('Accept', 'application/json')
            .set('token', token)
            .send()
            .expect(400)
            .end(done);
    });
});