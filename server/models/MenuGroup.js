const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const menugroupSchema = mongoose.Schema({
    
    BusinessNumber: {
        type: Number,
        maxlength: 20
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    MenuGropName: {
        type: String,
        maxlength: 200
    },
    MenuGropExp: {
        type: String,
        maxlength: 1000
    },
    menu : {
        type: Array,
        default: []
    }

}, { timestamps: true })

const MenuGroup = mongoose.model('MenuGroup', menugroupSchema);

module.exports = { MenuGroup }