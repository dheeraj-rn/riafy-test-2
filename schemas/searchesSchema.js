'use strict';

const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    site: {
        type: String,
        required: true,
        trim: true
    },
    query: {
        type: String,
        required: true,
        trim: true
    },
    links: {
        type: Array,
        required: true,
        default: []
    }
});