'use strict';
// use model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DonateSchema = new Schema({
    name: {
        type: String,
        required: 'Please fill a Donate name',
    },
    size: {
        type: String,
    },
    image: {
        type: [{
            url: {
                type: String,
            }
        }]
    },
    detail: {
        type: String
    },
    status: {
        type: Boolean,
        default: true
    },
    donator: {
        type: String,
    },
    receiver: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    createby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    },
    updateby: {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        displayname: {
            type: String
        }
    }
});

mongoose.model("Donate", DonateSchema);