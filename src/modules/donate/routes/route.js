'use strict';
var controller = require('../controllers/controller'),
    policy = require('../policy/policy');
module.exports = function (app) {
    var url = '/api/donates';
    var urlWithParam = '/api/donates/:donateId';
    app.route(url).all(policy.isAllowed)
        .get(controller.getList)
        .post(controller.create);

    app.route(urlWithParam).all(policy.isAllowed)
        .get(controller.read)
        .put(controller.update)
        .delete(controller.delete);

    app.route('/api/donate-detail')
        .post(
            controller.findDonateDetailById,
            controller.returnDonateDetail
        )

    app.param('donateId', controller.getByID);
}