const express = require('express');
const router = express.Router();
//const multer = require('multer');
//const { Product } = require("../models/Product");
const { Order } = require("../models/Order"); 
const { UserCeo } = require("../models/UserCeo"); 
const { User } = require("../models/User");  
const { Review } = require("../models/Review"); 

const crypto = require('crypto');
const randomstring = require('randomstring');
const request = require("request");

//온라인 입점신청 라우터
router.post('/newenroll', (req, res) => {
    const userCeo = new UserCeo(req.body)

    userCeo.save((err) =>{
        if (err) {
            return res.status(400).json({ success: false, err })
        }
        return res.status(200).json({ success: true })
    })

})

//사업자번호 중복검사 라우터
router.post('/dupBusinessNumberCk', (req, res) => {
    UserCeo.find({BusinessNumber : req.body.BusinessNumber})
    .exec((err, UserCeoInfo) => {
        if (err) return res.status(400).json({ success: false, err })
        if(UserCeoInfo.length > 0){
            return res.status(200).json({ success: false })
        }else{
            return res.status(200).json({ success: true })
        }
    })   
})

//사업장정보select 라우터
router.post('/getResInfo' , (req,res) =>{
    UserCeo.find({BusinessNumber : req.body.menuId})
    .exec((err, UserCeoInfo) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).send(UserCeoInfo)
    })   
})

//다날 sms api 문자발송 문자인증번호 라우터
router.post('/sms' , (req,res) =>{
    
    var api_key = "NCSZN1WS4RPTVTKY";
    var api_secret ="8INP7LBHELSAWPEC93D7A3RFCFAWDQUV";
    var timestamp = parseInt(new Date().getTime() / 1000);
    var salt = randomstring.generate(30);
    var signature = crypto.createHmac('md5', api_secret).update(timestamp + salt).digest('hex');
    let randomCertification = randomstring.generate(4);
    var extension = [{
        type: 'LMS',
        to: req.body.tell,
        from: '01024433735',
        subject: '문자 발송 테스트!',
        text : 'test 문자 인증번호\n' + randomCertification
    }];
    
    console.log("snms" , req.body , randomCertification)
    if (res.err) return res.status(400).json({ success: false, err })
    return res.status(200).send({success: true ,randomCertification: randomCertification})

    //본로직 건당20원사용되므로 상위 test로직사용

    // request.post(
    //     'https://api.coolsms.co.kr/sms/1.1/send',
    //     { 
    //       form: {
    //         api_key: api_key,
    //         timestamp: timestamp,
    //         salt: salt,
    //         signature: signature,
    //         extension: JSON.stringify(extension)
    //       }
    //     },
    //     function(err, res, body) {
    //       console.log(body);
    //       console.log("snms" , req.body , randomCertification)
    //       if (err) return res.status(400).json({ success: false, err })
    //       return res.status(200).send({success: true ,randomCertification: randomCertification})
    //     }
    // );
})
//다날 sms api 문자발송 주문완료 라우터
router.post('/smsOrderInfo' , (req,res) =>{
    var api_key = "NCSZN1WS4RPTVTKY";
    var api_secret ="8INP7LBHELSAWPEC93D7A3RFCFAWDQUV";
    var timestamp = parseInt(new Date().getTime() / 1000);
    var salt = randomstring.generate(30);
    var signature = crypto.createHmac('md5', api_secret).update(timestamp + salt).digest('hex');
    var extension = [{
        type: 'LMS',
        to: req.body.tell,
        from: '01024433735',
        subject: '주문완료 문자 테스트!',
        text : '(배달안내) 고객님이 주문하신 음식이 \n약40분 내에 도착할 예정입니다\n\n●주문일시 :'+req.body.date+'\n●주문번호 :'+req.body.orderNo+'\n●가게 :'+req.body.name+'\n●메뉴 :'+req.body.menu+'\n●배달주소 :'+req.body.addr
    }];

    console.log("snms" , req.body )
    if (res.err) return res.status(400).json({ success: false, err })
    return res.status(200).send({success: true ,extension: extension})

    //본로직 건당20원사용되므로 상위 test로직사용

    // request.post(
    //     'https://api.coolsms.co.kr/sms/1.1/send',
    //     { 
    //       form: {
    //         api_key: api_key,
    //         timestamp: timestamp,
    //         salt: salt,
    //         signature: signature,
    //         extension: JSON.stringify(extension)
    //       }
    //     },
    //     function(err, res, body) {
    //       console.log(body);
    //       console.log("snms" , req.body , randomCertification)
    //       if (err) return res.status(400).json({ success: false, err })
    //       return res.status(200).send({success: true ,extension: extension})
    //     }
    // );
})

//결제시 주문정보 insert 라우터
router.post('/orderInsert', (req, res) => {
    const order = new Order(req.body)
    order.save((err,order) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({            
             success: true , order : order 
        })
    })
})

//주문번호조회 라우터 (단건) 
router.get('/getOrderNo' , (req,res) =>{
    Order.findOne({no: req.query.no}, (err, order) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).send({
            success: true , order : order
        });                
    }); 
})

//유저 주문목록 조회 라우터
router.post('/getOrderList' , (req,res) =>{
    Order.find({userId: req.body.userId})
    .skip(req.body.skip)
    .limit(req.body.limit)
    .sort({createdAt : -1})
    .exec((err, orderList) => {
        if (err) return res.status(400).send({ success: false, err })
        return res.status(200).send({
            success: true, orderList :orderList,               
            postSize: orderList.length
        })
    })
})

//사업장에등록된 주문목록 조회 라우터
router.post('/getOrderStroeList' , (req,res) =>{
    let filters = req.body.filters ? req.body.filters : "N"; //주무상태 필터 : 접수중,접수완료,배달중,배달완료
    let sorter = req.body.sorter ? req.body.sorter : "N";  //주문시간기준 소팅
    let term = req.body.term ? req.body.term : "N"; // 주문번호조회

    //기본값조회로직
    if(filters && sorter === "N" && term === 'N'){
        Order.find({
            BusinessNumber: req.body.BusinessNumber,
        })
        .sort({createdAt : -1})
        .exec((err, order) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true , orderList : order
            })
         })
    //주문정보로조회
    }else if(filters && sorter === "N" && term === 'Y'){
        Order.find({
            BusinessNumber: req.body.BusinessNumber,
            $and : [ 
                {
                    no: { $in: req.body.text }
                },
            ],
        })
        .sort({createdAt : -1})
        .exec((err, order) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true , orderList : order
            })
         })
    //주문시간소팅        
    }else{
        let sortVal =-1

        if(sorter.order === 'ascend'){
            sortVal = -1
        }else if(sorter.order === 'descend'){
            sortVal = 1
        }else{
            sortVal = -1
        }
        Order.find({
            $and : [ 
                {
                  status: { $in: filters.status }
                },
            ],
            BusinessNumber: req.body.BusinessNumber,
        })
        .sort({createdAt : sortVal})
        .exec((err, order) => {
            if (err) return res.status(400).json({ success: false, err })
            console.log("order" ,order.length )
            return res.status(200).json({
                success: true , orderList : order 
            })
         })
        
    }

})

//주문상태 변경 라우터
router.post('/modifyOrderStroeList', (req, res) => {
    Order.findOneAndUpdate({ _id: req.body.key }, {$set: {status: req.body.status}}, {new: true}, (err, order) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true , orderList : order 
        });
    });

})

//리뷰등록 라우터
router.post('/reviewSave', (req, res) => {
    User.findOne({_id : req.body.writer} , (err,user) => {
        if (err) return res.status(400).json({ success: false, err })
        req.body.email = user.email

        const review = new Review(req.body)

        review.save((err,review) => {
            if (err) return res.status(400).json({ success: false, err })

            Order.findOneAndUpdate({ _id: req.body.orderId }, {$set: {reviewStatus: 'Y'}}, {new: true}, (err, order) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).json({            
                    success: true , review : review 
                })
            });
        })
    })
})

//BusinessNumber 로 해당사업장의 리뷰정보를 가져온다 
router.post('/getReviewList' , (req,res) =>{
    Review.find({BusinessNumber : req.body.BusinessNumber})
    .sort({createdAt : -1})
    .exec((err, review) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({            
            success: true , review : review 
       })
    })   
})

//리뷰답글 등록 라우터
router.post('/reviewReplySave' , (req,res) =>{
    let comment = {
        reviewName : req.body.userId,
        reviewDescription : req.body.des
    }
    Review.findOneAndUpdate(
        { _id: req.body.reviewId },
        { $push: { comment: comment } },
        { new: true },
        (err, review) => {
            if (err) return res.json({ success: false, err })
            return res.status(200).json({            
                success: true , review : review 
           })
        }
    )
})

//리뷰답글수정라우터
router.post('/reviewReplyModify' , (req,res) =>{
    //삭제시로직
    if(req.body.del === 'Y'){
        Review.findOneAndUpdate(
            { _id: req.body.reviewId , "comment._id" : req.body.commentId},
            {$set: {"comment.$.reviewDelYn": 'Y'}}, 
            {new: true}, 
            (err, review) => {
            if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , review : review
                });
            }
        )
    //수정시로직
    }else{
        Review.findOneAndUpdate(
            { _id: req.body.reviewId , "comment._id" : req.body.commentId},
            {$set: {"comment.$.reviewDescription": req.body.des}}, 
            {new: true}, 
            (err, review) => {
            if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , review : review
                });
            }
        )
    }


})

//리뷰수정 라우터
router.post('/reviewReplyModifyClient' , (req,res) =>{
    //삭제시 로직
    if(req.body.del === 'Y'){
        Review.findOneAndUpdate(
            { _id: req.body.reviewId},
            {$set: {delYn: 'Y'}}, 
            {new: true}, 
            (err, review) => {
            if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , review : review
                });
            }
        )
    //수정시 로직
    }else{
        Review.findOneAndUpdate(
            { _id: req.body.reviewId},
            {$set: {description: req.body.des , images: req.body.img} }, 
            {new: true}, 
            (err, review) => {
            if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , review : review
                });
            }
        )
    }


})


router.post('/List', (req, res) => {

    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let storeId = req.body.storeId ? req.body.storeId : '1000';
    if(storeId === '1000'){
        UserCeo.find()
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err, UserCeoInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true, UserCeoInfo,                  
                postSize: UserCeoInfo.length
            })
        })
    }else{
        UserCeo.find({RestaurantCategory : storeId})
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err, UserCeoInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({
                success: true, UserCeoInfo,                  
                postSize: UserCeoInfo.length
            })
        })     
    }

})

module.exports = router;