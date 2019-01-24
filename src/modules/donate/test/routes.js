'use strict';
var request = require('supertest'),
    assert = require('assert'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    jwt = require('jsonwebtoken'),
    mongoose = require('mongoose'),
    app = require('../../../config/express'),
    Donate = mongoose.model('Donate');

var credentials,
    token,
    mockup;

describe('Donate CRUD routes tests', function () {

    before(function (done) {
        mockup = {
            name: 'เสื้อยืดสีฟ้าลายการ์ตูนไซส์ S',
            size: 'S',
            detail: 'เสื้อยี่ห้อ 1 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่',
            image: [
                {
                    url: 'image1.png'
                },
                {
                    url: 'image1-1.png'
                }
            ],
            donator: 'pure' 
        };
        credentials = {
            username: 'username',
            password: 'password',
            firstname: 'first name',
            lastname: 'last name',
            email: 'test@email.com',
            roles: ['user']
        };
        token = jwt.sign(_.omit(credentials, 'password'), config.jwt.secret, {
            expiresIn: 2 * 60 * 60 * 1000
        });
        done();
    });

    it('should be Donate get use token', (done) => {
        request(app)
            .get('/api/donates')
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                done();
            });
    });

    it('should be Donate get by id', function (done) {

        request(app)
            .post('/api/donates')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/donates/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.name, mockup.name);
                        done();
                    });
            });

    });

    it('Pure : should post donate from mockup, use token', (done) => {
        request(app)
            .post('/api/donates')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                console.log(resp);
                assert.equal(resp.data.name, mockup.name);
                assert.equal(resp.data.size, mockup.size);
                assert.equal(resp.data.donator, mockup.donator);
                assert.equal(resp.data.detail, mockup.detail);
                assert.equal(resp.data.image[0].url, mockup.image[0].url);
                assert.equal(resp.data.image[1].url, mockup.image[1].url);
                done();
            });
    });

    it('should be donate put use token', function (done) {

        request(app)
            .post('/api/donates')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/donates/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.name, update.name);
                        done();
                    });
            });

    });

    it('should be donate delete use token', function (done) {

        request(app)
            .post('/api/donates')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/donates/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    xit('should be donate get not use token', (done) => {
        request(app)
            .get('/api/donates')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    xit('should be donate post not use token', function (done) {

        request(app)
            .post('/api/donates')
            .send(mockup)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    xit('should be donate put not use token', function (done) {

        request(app)
            .post('/api/donates')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/donates/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    xit('should be donate delete not use token', function (done) {

        request(app)
            .post('/api/donates')
            .set('Authorization', 'Bearer ' + token)
            .send(mockup)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/donates/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    // it('should be donate post and save use token', (done) => {
    //     var donate1 = new Donate({
    //         name: 'เสื้อยืดสีฟ้าลายการ์ตูนไซส์ S',
    //         size: 'S',
    //         detail: 'เสื้อยี่ห้อ 1 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่',
    //         image: [
    //             {
    //                 url: 'image1-1.png'
    //             },
    //             {
    //                 url: 'image1-2.png'
    //             }
    //         ],
    //         donator: 'pure'
    //     });

    //     var body = {
    //         name: 'เสื้อยืดสีฟ้าลายการ์ตูนไซส์ S',
    //         size: 'S',
    //         detail: 'เสื้อยี่ห้อ 1 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่',
    //         image: [
    //             {
    //                 url: 'image1-1.png'
    //             },
    //             {
    //                 url: 'image1-2.png'
    //             }
    //         ],
    //         donator: 'pure'
    //     }

    //     donate1.save((err, don1) => {
    //         if (err) {
    //             return done(err);
    //         }
    //         request(app)
    //             .post('/api/donates')
    //             // .set('Authorization', 'Bearer' + token)
    //             .send(body)
    //             .expect(200)
    //             .end((err, res) => {
    //                 if (err) {
    //                     return done(err);
    //                 }
    //                 var resp = res.body;
    //                 console.log(resp);
    //                 // assert.equal(resp.data.name, mockup.name);
    //                 done();
    //             });
    //     });


    // });

    afterEach(function (done) {
        Donate.remove().exec(done);
    });

});