const express = require('express');
const router = express.Router();
const { MenuGroup } = require("../models/MenuGroup"); 
const { Menu } = require("../models/Menu"); 

//메뉴그룹등록 라우터
router.post('/saveMenuGroup', (req, res) => {

    //받아온 정보들을 DB에 넣어 준다.
    const menuGroup = new MenuGroup(req.body)
    menuGroup.save((err,menugroups) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({            
             success: true , menuGroup : menugroups 
        })
    })

})

//메뉴그룹삭제/복구 라우터
router.post('/delMenuGroup', (req, res) => {
    let resultDelYn = ''
    if(req.body.type === 'del'){
        resultDelYn = 'Y'
    }else if(req.body.type === 'restore'){
        resultDelYn = 'N'
    }
    MenuGroup.findOneAndUpdate({ _id: req.body.id }, {$set: {DelYn: resultDelYn}}, {new: true}, (err, menuGroup) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true , menuGroup : menuGroup 
        });
    }); 

})

//메뉴그룹 수정 라우터
router.post('/modifyMenuGroup', (req, res) => {
    if(req.body.desc === null || req.body.desc === '' || req.body.desc === undefined){
        MenuGroup.findOneAndUpdate({ _id: req.body.id }, {$set: {MenuGropName: req.body.title}}, {new: true}, (err, menuGroup) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true , menuGroup : menuGroup 
            });
        }); 
    }else{
        MenuGroup.findOneAndUpdate({ _id: req.body.id }, 
                                    {$set: {MenuGropName: req.body.title ,MenuGropExp: req.body.desc}}, 
                                    {new: true}, 
                                    (err, menuGroup) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true , menuGroup : menuGroup 
            });
        }); 
    }

    
})

//메뉴그룹조회 라우터
router.get('/getMenuGroup' , (req,res) =>{
    // MenuGroup.find({ BusinessNumber: req.query.id })
    MenuGroup.find({BusinessNumber: req.query.id}, (err, menugroups) => {
        return res.status(200).send({
            success: true , menuGroup : menugroups 
        });                
    }); 
})

//메뉴 등록 라우터
router.post('/insert', (req, res) => {
    //받아온 정보들을 DB에 넣어 준다.
    const menu = new Menu(req.body)

    menu.save((err) => { 
        if (err) return res.status(400).json({ success: false, err })

        return res.status(200).json({ success: true })
    })

})

//메뉴정보조회 라우터
router.get('/menu_by_id' , (req,res) =>{
    Menu.find({MenuGroup: req.query.id}, (err, menu) => {
        return res.status(200).send({
            menu : menu 
        });                
    }); 
})

//메뉴 상세정보조회 라우터
router.get('/menu_detail_id' , (req,res) =>{
    Menu.find({_id: req.query.id}, (err, menu) => {
        return res.status(200).send({
            menu : menu 
        });                
    }); 
})

//메뉴정보 수정 라우터  각각의 type별 price=메뉴가격,desc = 메뉴설명,title = 메뉴명 ,img = 메뉴이미지정보 , del=메뉴삭제
router.post("/modifyMenuInfo" , (req, res) => {
    let type = req.body.type
        if(type == 'price'){
            Menu.findOneAndUpdate({ _id: req.body._id }, {$set: {price: req.body.price}}, {new: true}, (err, menu) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , menu : menu 
                });
            });    
        }else if(type == 'desc'){
            Menu.findOneAndUpdate({ _id: req.body._id }, {$set: {description: req.body.description}}, {new: true}, (err, menu) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , menu : menu 
                });
            });    
        }else if(type == 'title'){
            Menu.findOneAndUpdate({ _id: req.body._id }, {$set: {title: req.body.title}}, {new: true}, (err, menu) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , menu : menu 
                });
            });    
        }else if(type == 'img'){
            Menu.findOneAndUpdate({ _id: req.body._id }, {$set: {images: req.body.images}}, {new: true}, (err, menu) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , menu : menu 
                });
            });    
        }else if(type == 'del'){
            Menu.findOneAndUpdate({ _id: req.body._id }, {$set: {DelYn: 'Y'}}, {new: true}, (err, menu) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , menu : menu 
                });
            });    
        }else if(type == 'restore'){
            Menu.findOneAndUpdate({ _id: req.body._id }, {$set: {DelYn: 'N'}}, {new: true}, (err, menu) => {
                if (err) return res.json({ success: false, err });
                return res.status(200).send({
                    success: true , menu : menu 
                });
            });    
        }
})

module.exports = router;