const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menuSchema = mongoose.Schema({
    MenuGroup : {
        type: Schema.Types.ObjectId,
        ref: 'MenuGroup'
    },
    writer: {       
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        maxlength: 50
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        default: 0
    },
    images: {
        type: Array,
        default: []
    },
    sold: {
        type: Number,
        maxlength: 100,
        default: 0
    },
    DelYn : {
        type: String,
        default: 'N'
    },
    views: {
        type: Number,
        default: 0
    }

}, { timestamps: true })

const Menu = mongoose.model('Menu', menuSchema);

module.exports = { Menu }