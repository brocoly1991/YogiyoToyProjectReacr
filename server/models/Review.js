const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = mongoose.Schema({
    BusinessNumber: {
        type: Number,
        maxlength: 20,
    },
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String,
    },
    description: {
        type: String,
    },
    images: {
        type: Array,
        default: []
    },
    delYn : {
        type: String,
        default: 'N'
    },
    status : {
        type: String,        
        default: 'U'
    },
    rate :{
        type: Number,
        default: 0
    },
	comment: [
		{
			reviewName: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }, 
            reviewDescription: {
                type: String,
            },
            reviewStatus : {
                type: String,        
                default: 'A'
            },
            reviewDelYn : {
                type: String,
                default: 'N'
            },
            saveDate: { 
                type: Date, default: new Date() 
            }, // 작성 시간
            updateDate: { 
                type: Date, default: new Date() 
            }, //수정 시간
		},
	], // 댓글
}, { timestamps: true })



const Review = mongoose.model('Review', ReviewSchema);

module.exports = { Review }