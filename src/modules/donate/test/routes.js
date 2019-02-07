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
            name: "เสื้อยืดสีฟ้าลายการ์ตูนไซส์ S",
            size: "S",
            detail: "เสื้อยี่ห้อ 1 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่",
            image: [
                {
                    url: "image1.png"
                },
                {
                    url: "image1-1.png"
                }
            ],
            donator: "pure"
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
                // console.log(resp);
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
                // console.log(resp);
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

    it('should be donate get not use token', (done) => {
        request(app)
            .get('/api/donates')
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);
    });

    it('should be donate post not use token', function (done) {

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

    it('should be donate put not use token', function (done) {

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

    it('should be donate delete not use token', function (done) {

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

    it('should be get Donate-Detail By id', function (done) {

        var Donate1 = new Donate({
            name: "เสื้อยืด D.Va",
            size: "L",
            detail: "ลิมิเต็ด เฉพาะคนซื้อคนแรกที่ได้ลิมิเต็ดจะต้องชำระค่าบริการหลังการขาย",
            image: [
                {
                    url: "Dva1.png"
                },
                {
                    url: "Dva2.png"
                }
            ],
            donator: "nutnut"
        })
        var Donate2 = new Donate({
            name: "เสื้อลายทหาร",
            size: "M",
            detail: "กินได้ ขายอร่อย ฝากก็งาม",
            image: [
                {
                    url: "militaryProt.png"
                },
                {
                    url: "Conan.png"
                }
            ],
            donator: "purity"
        })

        Donate2.save(function (err, do2) {
            if (err) {
                return done(err)
            }
            Donate1.save(function (err, do1) {
                if (err) {
                    return done(err)
                }

                var donate_id = {
                    id: do1._id
                }
                request(app)
                    .post('/api/donate-detail')
                    .set('Authorization', 'Bearer ' + token)
                    .send(donate_id)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp)
                        assert.equal(resp.data.name, 'เสื้อยืด D.Va')
                        assert.equal(resp.data.size, 'L')
                        assert.equal(resp.data.detail, 'ลิมิเต็ด เฉพาะคนซื้อคนแรกที่ได้ลิมิเต็ดจะต้องชำระค่าบริการหลังการขาย')
                        assert.equal(resp.data.donator, 'nutnut')
                        done()
                    });
            })
        })

    });

    it('Update That!!! Accept Donate', function (done) {

        var Donate1 = new Donate({
            name: "เสื้อยืด D.Va",
            size: "L",
            detail: "ลิมิเต็ด เฉพาะคนซื้อคนแรกที่ได้ลิมิเต็ดจะต้องชำระค่าบริการหลังการขาย",
            image: [
                {
                    url: "Dva1.png"
                },
                {
                    url: "Dva2.png"
                }
            ],
            donator: "nutnut"
        })
        var Donate2 = new Donate({
            name: "เสื้อลายทหาร",
            size: "M",
            detail: "กินได้ ขายอร่อย ฝากก็งาม",
            image: [
                {
                    url: "militaryProt.png"
                },
                {
                    url: "Conan.png"
                }
            ],
            donator: "purity"
        })

        Donate2.save(function (err, do2) {
            if (err) {
                return done(err)
            }
            Donate1.save(function (err, do1) {
                if (err) {
                    return done(err)
                }

                var id = {
                    product_id: do1._id,
                    user_id: '1111'
                }
                request(app)
                    .post('/api/accept-donate')
                    .set('Authorization', 'Bearer ' + token)
                    .send(id)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.data.status, false)
                        assert.equal(resp.data.receiver, id.user_id)
                        done()
                    });
            })
        })

    });

    it('should be get Donates not use token', function (done) {

        var Donate1 = new Donate({
            name: "เสื้อยืด D.Va",
            size: "L",
            detail: "ลิมิเต็ด เฉพาะคนซื้อคนแรกที่ได้ลิมิเต็ดจะต้องชำระค่าบริการหลังการขาย",
            image: [
                {
                    url: "Dva1.png"
                },
                {
                    url: "Dva2.png"
                }
            ],
            donator: "nutnut",
            status: false
        })
        var Donate2 = new Donate({
            name: "เสื้อลายทหาร",
            size: "M",
            detail: "กินได้ ขายอร่อย ฝากก็งาม",
            image: [
                {
                    url: "militaryProt.png"
                },
                {
                    url: "Conan.png"
                }
            ],
            donator: "purity"
        })

        Donate2.save(function (err, do2) {
            if (err) {
                return done(err)
            }
            Donate1.save(function (err, do1) {
                if (err) {
                    return done(err)
                }
                request(app)
                    .get('/api/all-donates')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp);
                        assert.equal(resp.data[0].name, 'เสื้อลายทหาร')
                        done()
                    });
            })
        })

    });

    it('This is get Donate By size', function (done) {

        var Donate1 = new Donate({
            name: "เสื้อยืด D.Va",
            size: "L",
            detail: "ลิมิเต็ด เฉพาะคนซื้อคนแรกที่ได้ลิมิเต็ดจะต้องชำระค่าบริการหลังการขาย",
            image: [
                {
                    url: "Dva1.png"
                },
                {
                    url: "Dva2.png"
                }
            ],
            donator: "nutnut"
        })
        var Donate2 = new Donate({
            name: "เสื้อลายทหาร",
            size: "L",
            detail: "กินได้ ขายอร่อย ฝากก็งาม",
            image: [
                {
                    url: "militaryProt.png"
                },
                {
                    url: "Conan.png"
                }
            ],
            donator: "purity",
            status: false
        })

        Donate2.save(function (err, do2) {
            if (err) {
                return done(err)
            }
            Donate1.save(function (err, do1) {
                if (err) {
                    return done(err)
                }

                var getSize = {
                    size: 'L'
                }
                request(app)
                    .post('/api/get-donate-by-size')
                    .set('Authorization', 'Bearer ' + token)
                    .send(getSize)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        // console.log(resp);
                        assert.equal(resp.data[0].size, 'L')
                        done()
                    });
            })
        })

    });

    it('should be donate history get by user', (done) => {
        var donate1 = new Donate({
            name: 'เสื้อยืดสีฟ้าลายการ์ตูนไซส์ S',
            size: 'S',
            detail: 'เสื้อยี่ห้อ 1 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่',
            image: [
                {
                    url: 'image1-1.png'
                },
                {
                    url: 'image1-2.png'
                }
            ],
            donator: '001',
            receiver: ''
        });

        var donate2 = new Donate({
            name: 'เสื้อยืดสีฟ้าลายการ์ตูนไซส์ M',
            size: 'M',
            detail: 'เสื้อยี่ห้อ 2 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่',
            image: [
                {
                    url: 'image2-1.png'
                },
                {
                    url: 'image2-2.png'
                }
            ],
            donator: '002',
            receiver: ''
        });

        var donate3 = new Donate({
            name: 'เสื้อยืดสีฟ้าลายการ์ตูนไซส์ L',
            size: 'L',
            detail: 'เสื้อยี่ห้อ 3 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่',
            image: [
                {
                    url: 'image3-1.png'
                },
                {
                    url: 'image3-2.png'
                }
            ],
            donator: '003',
            receiver: '001'
        });

        var body = {
            donator: '001',
            receiver: '001'
        }

        donate1.save((err, don3) => {
            if (err) {
                return done(err);
            } else {
                donate2.save((err, don1) => {
                    if (err) {
                        return done(err);
                    } else {
                        donate3.save((err, don2) => {
                            if (err) {
                                return done(err);
                            } else {
                                request(app)
                                    .post('/api/donates-history-all')
                                    .set('Authorization', 'Bearer ' + token)
                                    .send(body)
                                    .expect(200)
                                    .end((err, res) => {
                                        if (err) {
                                            return done(err);
                                        }
                                        var resp = res.body;
                                        console.log(resp);
                                        assert.equal(resp.data[0].name, donate1.name);
                                        assert.equal(resp.data[0].size, donate1.size);
                                        assert.equal(resp.data[0].detail, donate1.detail);
                                        assert.equal(resp.data[0].image[0].url, donate1.image[0].url);
                                        assert.equal(resp.data[0].image[1].url, donate1.image[1].url);
                                        assert.equal(resp.data[0].donator, donate1.donator);
                                        assert.equal(resp.data[0].receiver, donate1.receiver);

                                        assert.equal(resp.data[1].name, donate3.name);
                                        assert.equal(resp.data[1].size, donate3.size);
                                        assert.equal(resp.data[1].detail, donate3.detail);
                                        assert.equal(resp.data[1].image[0].url, donate3.image[0].url);
                                        assert.equal(resp.data[1].image[1].url, donate3.image[1].url);
                                        assert.equal(resp.data[1].donator, donate3.donator);
                                        assert.equal(resp.data[1].receiver, donate3.receiver);
                                        done();
                                    });
                            } 
                        });
                    }
                });
            }
        });
    });

    it('should be donate history get by donator', (done) => {
        var donate1 = new Donate({
            name: 'เสื้อยืดสีฟ้าลายการ์ตูนไซส์ S',
            size: 'S',
            detail: 'เสื้อยี่ห้อ 1 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่',
            image: [
                {
                    url: 'image1-1.png'
                },
                {
                    url: 'image1-2.png'
                }
            ],
            donator: '001',
            receiver: ''
        });

        var donate2 = new Donate({
            name: 'เสื้อยืดสีฟ้าลายการ์ตูนไซส์ M',
            size: 'M',
            detail: 'เสื้อยี่ห้อ 2 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่',
            image: [
                {
                    url: 'image2-1.png'
                },
                {
                    url: 'image2-2.png'
                }
            ],
            donator: '002',
            receiver: ''
        });

        var donate3 = new Donate({
            name: 'เสื้อยืดสีฟ้าลายการ์ตูนไซส์ L',
            size: 'L',
            detail: 'เสื้อยี่ห้อ 3 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่',
            image: [
                {
                    url: 'image3-1.png'
                },
                {
                    url: 'image3-2.png'
                }
            ],
            donator: '003',
            receiver: '001'
        });

        var body = {
            donator: '001',
        }

        donate1.save((err, don3) => {
            if (err) {
                return done(err);
            } else {
                donate2.save((err, don1) => {
                    if (err) {
                        return done(err);
                    } else {
                        donate3.save((err, don2) => {
                            if (err) {
                                return done(err);
                            } else {
                                request(app)
                                    .post('/api/donates-history-donator')
                                    .set('Authorization', 'Bearer ' + token)
                                    .send(body)
                                    .expect(200)
                                    .end((err, res) => {
                                        if (err) {
                                            return done(err);
                                        }
                                        var resp = res.body;
                                        console.log(resp);
                                        assert.equal(resp.data[0].name, donate1.name);
                                        assert.equal(resp.data[0].size, donate1.size);
                                        assert.equal(resp.data[0].detail, donate1.detail);
                                        assert.equal(resp.data[0].image[0].url, donate1.image[0].url);
                                        assert.equal(resp.data[0].image[1].url, donate1.image[1].url);
                                        assert.equal(resp.data[0].donator, donate1.donator);
                                        assert.equal(resp.data[0].receiver, donate1.receiver);
                                        done();
                                    });
                            }
                        });
                    }
                });
            }
        });
    });

    it('should be donate history get by receiver', (done) => {
        var donate1 = new Donate({
            name: 'เสื้อยืดสีฟ้าลายการ์ตูนไซส์ S',
            size: 'S',
            detail: 'เสื้อยี่ห้อ 1 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่',
            image: [
                {
                    url: 'image1-1.png'
                },
                {
                    url: 'image1-2.png'
                }
            ],
            donator: '001',
            receiver: ''
        });

        var donate2 = new Donate({
            name: 'เสื้อยืดสีฟ้าลายการ์ตูนไซส์ M',
            size: 'M',
            detail: 'เสื้อยี่ห้อ 2 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่',
            image: [
                {
                    url: 'image2-1.png'
                },
                {
                    url: 'image2-2.png'
                }
            ],
            donator: '002',
            receiver: ''
        });

        var donate3 = new Donate({
            name: 'เสื้อยืดสีฟ้าลายการ์ตูนไซส์ L',
            size: 'L',
            detail: 'เสื้อยี่ห้อ 3 ซื้อมาเมื่อปีที่เเล้ว แต่ไม่ได้ใส่',
            image: [
                {
                    url: 'image3-1.png'
                },
                {
                    url: 'image3-2.png'
                }
            ],
            donator: '003',
            receiver: '001'
        });

        var body = {
            receiver: '001',
        }

        donate1.save((err, don3) => {
            if (err) {
                return done(err);
            } else {
                donate2.save((err, don1) => {
                    if (err) {
                        return done(err);
                    } else {
                        donate3.save((err, don2) => {
                            if (err) {
                                return done(err);
                            } else {
                                request(app)
                                    .post('/api/donates-history-receiver')
                                    .set('Authorization', 'Bearer ' + token)
                                    .send(body)
                                    .expect(200)
                                    .end((err, res) => {
                                        if (err) {
                                            return done(err);
                                        }
                                        var resp = res.body;
                                        console.log(resp);
                                        assert.equal(resp.data[0].name, donate3.name);
                                        assert.equal(resp.data[0].size, donate3.size);
                                        assert.equal(resp.data[0].detail, donate3.detail);
                                        assert.equal(resp.data[0].image[0].url, donate3.image[0].url);
                                        assert.equal(resp.data[0].image[1].url, donate3.image[1].url);
                                        assert.equal(resp.data[0].donator, donate3.donator);
                                        assert.equal(resp.data[0].receiver, donate3.receiver);
                                        done();
                                    });
                            }
                        });
                    }
                });
            }
        });
    });


    afterEach(function (done) {
        Donate.remove().exec(done);
    });

});