'use strict';
var mongoose = require('mongoose'),
    model = require('../models/model'),
    Donate = mongoose.model('Donate'),
    errorHandler = require('../../core/controllers/errors.server.controller'),
    _ = require('lodash');

exports.getList = function (req, res) {
    Donate.find({ status: true }, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: datas
            });
        };
    });
};

exports.create = function (req, res) {
    var newDonate = new Donate(req.body);
    newDonate.createby = req.user;
    newDonate.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.getByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            status: 400,
            message: 'Id is invalid'
        });
    }

    Donate.findById(id, function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.data = data ? data : {};
            next();
        };
    });
};

exports.read = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.data ? req.data : []
    });
};

exports.update = function (req, res) {
    var updDonate = _.extend(req.data, req.body);
    updDonate.updated = new Date();
    updDonate.updateby = req.user;
    updDonate.save(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.delete = function (req, res) {
    req.data.remove(function (err, data) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp({
                status: 200,
                data: data
            });
        };
    });
};

exports.findDonateDetailById = function (req, res, next) {
    // console.log(req.body.id);
    var id = req.body.id
    Donate.findById(id, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            // console.log(datas);
            req.donateDetailData = datas
            next()
        }
    })

}

exports.returnDonateDetail = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.donateDetailData
    })
}

exports.findAndUpdateDonate = function (req, res, next) {
    var product_id = req.body.product_id
    var user_id = req.body.user_id
    Donate.findByIdAndUpdate(product_id, { status: false, revicer: user_id }, { new: true }, function (err, datas) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.acceptData = datas
            // console.log(req.AcceptData)
            next()
        }
    })

}

exports.returnAcceptData = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.acceptData
    })
}

exports.fineDonateBySize = function (req, res, next) {
    var getSize = req.body.size
    Donate.find({ size: getSize, status: true }, function (err, do1) {
        if (err) {
            return res.status(400).send({
                status: 400,
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            req.getDonateBySize = do1
            next()
        }
    })

}

exports.returnSize = function (req, res) {
    res.jsonp({
        status: 200,
        data: req.getDonateBySize
    })
}