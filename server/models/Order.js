const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema({

    BusinessNumber: {
        type: Number,
        maxlength: 20
    },
    Name : {
        type: String,
        maxlength: 200
    },
    no : {
        type: String,
        maxlength: 30  
    },
    status : {
        type: String,
        maxlength: 10,
        default:'A'
    },
    reviewStatus : {
        type: String,
        maxlength: 10,
        default:'N'
    },
    amount : {
        type: Number,
        maxlength: 30  
    },
    OrderList: {
        type: Array,
        default: []
    },
    buyer_addr: {
        type: String,
        maxlength: 200  
    },
    mail : {
        type: String,
        maxlength: 100,
        default:'anonymous'
    },
    userId : {
        type: String,
        maxlength: 100,
        default:'anonymous'
    },
    buyer_tel: {
        type: Number,
        maxlength: 20
    },


} ,{ timestamps: true })

function getCurrentDate(){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();
    return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
}


const Order = mongoose.model('Order', orderSchema);

module.exports = { Order }