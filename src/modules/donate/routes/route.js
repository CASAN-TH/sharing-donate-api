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

    app.route('/api/donate-detail').all(policy.isAllowed)
        .post(
            controller.findDonateDetailById,
            controller.returnDonateDetail
        )

    app.route('/api/accept-donate').all(policy.isAllowed)
        .post(
            controller.findAndUpdateDonate,
            controller.returnAcceptData
        )

    app.route('/api/get-donate-by-size')
        .post(
            controller.fineDonateBySize,
            controller.returnSize
        )

    app.route('/api/all-donates')
        .get(controller.getList)

    app.param('donateId', controller.getByID);
}