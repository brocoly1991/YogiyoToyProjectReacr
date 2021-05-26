const express = require('express');
const router = express.Router();
const { User } = require("../models/User"); 
const { UserCeo } = require("../models/UserCeo");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment");

const { auth } = require("../middleware/auth");
const async = require('async');
const bcrypt = require('bcrypt');
const saltRounds = 10;
//=================================
//             User
//=================================

//각 라우터별 인증 체크 완료후 호출 라우터 
router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        hpNumner: req.user.hpNumner,
        role: req.user.role,
        image: req.user.image,
        BusinessNumber :  req.user.BusinessNumber
    });
});
//회원가입 라우터
router.post("/register", (req, res) => {

    const user = new User(req.body);
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});
//로그인 라우터
router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        //로그인 mail정보가 없을경우
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });
        // id 존재 후 비밀번호비교 (암호화된비밀번호정보 복호화비교)
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id ,role :user.role ,BusinessNumber:user.BusinessNumber
                    });
            });
        });
    });
});

//회원정보 조회 라우터
router.get("/getUserInfo" , (req, res) => {
    //먼저 일반회원 정보조회(User)
    User.findOne({ _id: req.query.id }, (err, user) => {
        if (err) return res.json({ success: false, err });
        //만약 사업자번호를 등록한 사업자 일경우 사업장정보조회(UserCeo)
        if(user.BusinessNumber != 0){
            UserCeo.findOne({BusinessNumber: user.BusinessNumber}, (err, userCeo) => {
                return res.status(200).send({
                    success: true , userInfo : user , userCeoInfo : userCeo 
                });                
            }); 
        //일반회원이지만 아직 사업장등록을 하지않았을경우 User정보만 조회
        }else{
            return res.status(200).send({
                success: true , userInfo : user 
            });
        }

    });
}) 

//사업자번호 등록시 조회 라우터
router.get("/selectBusinessNumber" , (req, res) => {
    UserCeo.findOne({BusinessNumber: req.query.id}, (err, userCeo) => {
        //사업자번호가 존재하지않을경우
        if(!userCeo){
            return res.json({
                success: false , msg : '등록된 사업자번호가 존재하지 않습니다.'
            });
        }else{
            User.findOne({BusinessNumber: req.query.id}, (err, user) => {
                //성공
                if(!user){
                    return res.json({
                        success: true ,userCeo : userCeo
                    });
                //사용하고자하는 사업자번호가 이미 등록된 사업자번호일 경우
                }else{
                    return res.json({
                        success: false , msg : '해당 사업자번호는 이미 사용중입니다.'
                    });
                }
            })
        }
    });   
}) 

//닉네임 중복검사 라우터
router.get("/nickNameCheck" , (req, res) => {

    User.findOne({name: req.query.id}, (err, user) => {
        if(!user){
            return res.json({
                success: true
            });
        }else{
            return res.json({
                success: false , msg : '해당 닉네임은 이미 사용중입니다.'
            });
        }
    })
})

//사업자번호를 사업장에 등록 라우터 
router.post("/updateBusinessNumber" , (req, res) => {
    //UserCeo 사업장테이블에 사업자번호가등록되었음을 알려줌
    UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, {$set: {LinkYn: 'Y'}}, {new: true}, (err, user) => {
        if (err) return res.json({ success: false, err });
    });
    //User유저 테이블에 제출한 사업자번호를 등록 
    User.findOneAndUpdate({ _id: req.body._id }, {$set: {BusinessNumber: req.body.BusinessNumber}}, {new: true}, (err, user) => {
        if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true , userInfo : user
            });
        });
}) 

    /*====각각의 값들을 수정하는 함수 props.type 을기준으로
     닉네임/휴대폰번호/비밀번호 변경 값들을 컨트롤한다.=====*/


//유저정보 수정 라우터
router.post("/modifyUserInfo" , (req, res) => {
    //닉네임변경
    if(req.body.type == 'A'){
        User.findOneAndUpdate({ _id: req.body._id }, {$set: {name: req.body.newName}}, {new: true}, (err, user) => {
            if (err) return res.json({ success: false, err });

            UserCeo.findOne({BusinessNumber: user.BusinessNumber}, (err, userCeo) => {
                return res.status(200).send({
                    success: true , userInfo : user , userCeoInfo : userCeo
                });                
            }); 
        });
    //휴대폰번호변경
    }else if(req.body.type == 'B'){
        User.findOneAndUpdate({ _id: req.body._id }, {$set: {hpNumner: req.body.NewHpNumner}}, {new: true}, (err, user) => {
            if (err) return res.json({ success: false, err });

            
            UserCeo.findOne({BusinessNumber: user.BusinessNumber}, (err, userCeo) => {
                return res.status(200).send({
                    success: true , userInfo : user , userCeoInfo : userCeo
                });                
            }); 
        });
    //비밀번호변경
    }else{
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {  
                // Store hash in your password DB.
                User.findOneAndUpdate({ _id: req.body._id }, {$set: {password: hash}}, {new: true}, (err, user) => {
                    if (err) return res.json({ success: false, err });

                    
                    UserCeo.findOne({BusinessNumber: user.BusinessNumber}, (err, userCeo) => {
                        return res.status(200).send({
                            success: true , userInfo : user , userCeoInfo : userCeo
                        });                
                    }); 

                });
            });
        });
               
    }   
}) 

//사업장정보 수정 라우터
router.post("/modifyUserCeoInfo" , (req, res) => {
    let type = req.body.type
    
    User.findOne({BusinessNumber: req.body.BusinessNumber }, (err, user) => {
        if (err) return res.json({ success: false, err });    
        //음식점이름변경
        if(type == 'name'){
            UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, {$set: {RestaurantName: req.body.RestaurantName}}, {new: true}, (err, userCeo) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , userCeoInfo : userCeo , userInfo : user
                });
            }); 
        //음식점전화번호변경    
        }else if(type == 'hp'){
            UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, {$set: {RestaurantHp: req.body.RestaurantHp}}, {new: true}, (err, userCeo) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , userCeoInfo : userCeo , userInfo : user
                });
            });
        //사장님알림 변경
        }else if(type == 'dialog'){
            UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, {$set: {RestaurantDialog: req.body.RestaurantDialog}}, {new: true}, (err, userCeo) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , userCeoInfo : userCeo , userInfo : user
                });
            });
        //최소주문금액변경
        }else if(type == 'price'){
            UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, {$set: {RestaurantPrice: req.body.RestaurantPrice}}, {new: true}, (err, userCeo) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , userCeoInfo : userCeo , userInfo : user
                });
            });
        //결제수단 변경
        }else if(type == 'pay'){
            UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, {$set: {RestaurantPayment: req.body.RestaurantPayment}}, {new: true}, (err, userCeo) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , userCeoInfo : userCeo , userInfo : user
                });
            });
        //영업시간변경
        }else if(type == 'time'){
            UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, 
                {$set: 
                    {
                        RestaurantStartTime: req.body.RestaurantStartTime,
                        RestaurantEndTime: req.body.RestaurantEndTime,
                    }
                }, 
                
                {new: true}, (err, userCeo) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , userCeoInfo : userCeo , userInfo : user
                });
            });
        //업종 카테고리변경
        }else if(type == 'category'){
            UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, {$set: {RestaurantCategory: req.body.RestaurantCategory}}, {new: true}, (err, userCeo) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , userCeoInfo : userCeo , userInfo : user
                });
            });
        //배달가능여부 변경
        }else if(type == 'delivery'){
            UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, {$set: {RestaurantDelivery: req.body.RestaurantDelivery}}, {new: true}, (err, userCeo) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , userCeoInfo : userCeo , userInfo : user
                });
            });
        //음식점주소 변경
        }else if(type == 'addr'){
            UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, 
                {$set: 
                    {
                        isAddress: req.body.isAddress,
                        isAddressDetail: req.body.isAddressDetail,
                        Lat: req.body.Lat,
                        Lon: req.body.Lon,
                    }
                }, 
                
                {new: true}, (err, userCeo) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , userCeoInfo : userCeo , userInfo : user
                });
            });
        //배달가능지역 변경
        }else if(type == 'area'){
            UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, {$set: {RestaurantAreaInfo: req.body.RestaurantAreaInfo}}, {new: true}, (err, userCeo) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , userCeoInfo : userCeo , userInfo : user
                });
            });
        //사업장 이미지 변경
        }else if(type == 'imgTitle'){
            UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, {$set: {RestaurantTitleImg: req.body.images}}, {new: true}, (err, userCeo) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , userCeoInfo : userCeo , userInfo : user
                });
            });
        }else if(type == 'open'){
            UserCeo.findOneAndUpdate({ BusinessNumber: req.body.BusinessNumber }, {$set: {OpenYn: req.body.open}}, {new: true}, (err, userCeo) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , userCeoInfo : userCeo , userInfo : user
                });
            });
        }
    });
}) 

//로그아웃 라우터
router.get("/logout", auth, (req, res) => {
    
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});




router.post("/addToCart", auth, (req, res) => {

    //먼저  User Collection에 해당 유저의 정보를 가져오기 
    User.findOne({ _id: req.user._id },
        (err, userInfo) => {

            // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인 

            let duplicate = false;
            userInfo.cart.forEach((item) => {
                if (item.id === req.body.productId) {
                    duplicate = true;
                }
            })

            //상품이 이미 있을때
            if (duplicate) {
                User.findOneAndUpdate(
                    { _id: req.user._id, "cart.id": req.body.productId },
                    { $inc: { "cart.$.quantity": 1 } },
                    { new: true },
                    (err, userInfo) => {
                        if (err) return res.status(200).json({ success: false, err })
                        res.status(200).send(userInfo.cart)
                    }
                )
            }
            //상품이 이미 있지 않을때 
            else {
                User.findOneAndUpdate(
                    { _id: req.user._id },
                    {
                        $push: {
                            cart: {
                                id: req.body.productId,
                                quantity: 1,
                                date: Date.now()
                            }
                        }
                    },
                    { new: true },
                    (err, userInfo) => {
                        if (err) return res.status(400).json({ success: false, err })
                        res.status(200).send(userInfo.cart)
                    }
                )
            }
        })
});


router.get('/removeFromCart', auth, (req, res) => {

    //먼저 cart안에 내가 지우려고 한 상품을 지워주기 
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
                { "cart": { "id": req.query.id } }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

            //product collection에서  현재 남아있는 상품들의 정보를 가져오기 

            //productIds = ['5e8961794be6d81ce2b94752', '5e8960d721e2ca1cb3e30de4'] 이런식으로 바꿔주기
            Product.find({ _id: { $in: array } })
                .populate('writer')
                .exec((err, productInfo) => {
                    return res.status(200).json({
                        productInfo,
                        cart
                    })
                })
        }
    )
})



router.post('/successBuy', auth, (req, res) => {


    //1. User Collection 안에  History 필드 안에  간단한 결제 정보 넣어주기
    let history = [];
    let transactionData = {};

    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })

    //2. Payment Collection 안에  자세한 결제 정보들 넣어주기 
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    transactionData.data = req.body.paymentData
    transactionData.product = history

    //history 정보 저장 
    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history }, $set: { cart: [] } },
        { new: true },
        (err, user) => {
            if (err) return res.json({ success: false, err })


            //payment에다가  transactionData정보 저장 
            const payment = new Payment(transactionData)
            payment.save((err, doc) => {
                if (err) return res.json({ success: false, err })


                //3. Product Collection 안에 있는 sold 필드 정보 업데이트 시켜주기 


                //상품 당 몇개의 quantity를 샀는지 

                let products = [];
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })


                async.eachSeries(products, (item, callback) => {

                    Product.update(
                        { _id: item.id },
                        {
                            $inc: {
                                "sold": item.quantity
                            }
                        },
                        { new: false },
                        callback
                    )
                }, (err) => {
                    if (err) return res.status(400).json({ success: false, err })
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []
                    })
                }
                )
            })
        }
    )
})



module.exports = router;
