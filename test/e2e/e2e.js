const request = require('supertest');
const path = require('path');
const assert = require('assert');

// Import the actual app from main.js
const { app } = require('../../src/main');

describe('E2E Tests', () => {
    describe('GET /test (query parameter)', () => {
        it('should return default mock response when no query params are provided', (done) => {
            request(app)
                .get('/test')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.deepEqual(res.body, {
                        message: "you get default result. let's try http://localhost:8008/test?aa=123 or http://localhost:8008/test?bb=123 to see what's happen"
                    });
                    done();
                });
        });

        it('should return mock response with bb=123 query parameter', (done) => {
            request(app)
                .get('/test')
                .query({ bb: 123 })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.deepEqual(res.body, {
                        message: "you can see this because you used query 'bb=123' in your url",
                        bb: "bb : 123"
                    });
                    done();
                });
        });

        it('should return mock response with aa=123 query parameter', (done) => {
            request(app)
                .get('/test')
                .query({ aa: '123' })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.deepEqual(res.body, {
                        message: "you can see this because you used query parameter 'aa=123' in your url",
                        key: "aa : 123"
                    });
                    done();
                });
        });
    });

    describe('POST /test (POST method)', () => {
        it('should return post mock response', (done) => {
            request(app)
                .post('/test')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.deepEqual(res.body, {
                        message: "you can see this because you used post method",
                        key: "this is a post example"
                    });
                    done();
                });
        });
    });

    describe('GET /test with cookies', () => {
        it('should return cookie-matched response', (done) => {
            request(app)
                .get('/test')
                .set('Cookie', 'username=abc')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.deepEqual(res.body, {
                        message: "you can see this message only when you access with a cookie 'username' as 'abc'"
                    });
                    done();
                });
        });
    });

    describe('GET /html (HTML response)', () => {
        it('should return HTML response', (done) => {
            request(app)
                .get('/html')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.headers['content-type'], 'text/html; charset=utf-8');
                    assert.equal(res.text, '<html><body><h1>Hello world.</h1><p>You can see this message is in html format instead of json format</p></body></html>');
                    done();
                });
        });
    });

    describe('GET /moved (302 redirect)', () => {
        it('should return 302 redirect', (done) => {
            request(app)
                .get('/moved')
                .expect(302)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.headers['location'], 'http://www.google.com');
                    done();
                });
        });
    });

    describe('GET /testTest (another query example)', () => {
        it('should return mock response for testTest path', (done) => {
            request(app)
                .get('/testTest')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.deepEqual(res.body, {
                        message: "you can see this because you used the path 'testTest'"
                    });
                    done();
                });
        });
    });

    describe('GET /testDownload (file download)', () => {
        it('should return file download', (done) => {
            request(app)
                .get('/testDownload')
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.headers['content-disposition'], 'attachment; filename="test.pdf"');
                    done();
                });
        });
    });
});
