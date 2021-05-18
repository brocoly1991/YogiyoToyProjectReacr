const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userceoSchema = mongoose.Schema({
    BusinessNumber: {
        type: Number,
        maxlength: 20
    },
    BusinessHpNumber: {
        type: Number,
        maxlength: 20
    },
    BusinessName: {
        type: String,
        maxlength: 20
    },
    BusinessImg: {
        type: Array,
        default: []
    },
    BusinessImg2: {
        type: Array,
        default: []
    },
    RestaurantName: {
        type: String,
        maxlength: 50
    },
    RestaurantHp: {
        type: String,
        maxlength: 20
    },
    RestaurantPrice: {
        type: Number,
        default: 10000,
        maxlength: 50
    },
    RestaurantStartTime: {
        type: String,
        maxlength: 20
    },
    RestaurantEndTime: {
        type: String,
        maxlength: 20
    },
    RestaurantDelivery: {
        type: Number,
        default: 1
    },
    RestaurantCategory: {
        type: String,
        default: 100
    },
    // RestaurantPayment: {
    //     type: String,
    //     default: "10,20,30"
    // },
    RestaurantPayment: {
        type: Array,
        default: ['10','20','30']
    },
    isAddress: {
        type: String,
        maxlength: 100
    },
    isAddressDetail: {
        type: String,
        maxlength: 100
    },
    RestaurantDialog: {
        type: String,
        maxlength: 3000,
        default: "N"
    },
    Lat: {
        type: String,
        maxlength: 100
    },
    Lon: {
        type: String,
        maxlength: 100
    },
    RestaurantAreaInfo : {
        type: Array,
    },
    DelYn : {
        type: String,
        default: "N",
        maxlength: 10
    },
    LinkYn : {
        type: String,
        default: "N",
        maxlength: 10
    },


}, { timestamps: true })


const UserCeo = mongoose.model('UserCeo', userceoSchema);

module.exports = { UserCeo }