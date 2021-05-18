import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useDispatch} from "react-redux";
import MenuImage from './Sections/MenuImage';
import { modifyMenuInfo } from '../../../_actions/menu_action';
import { Button,Input,Row,Col,Modal} from 'antd';
import FileModify from '../../utils/FileModify'

const { TextArea } = Input;

function MenuModifyPage(props) {
    const dispatch = useDispatch();
    const menuId = props.match.params.menuId
    const [State, setState] = useState({})
    const [Tag, setTag] = useState({
        nameTag : 'span',
        priceTag : 'span',
        TitleTag : 'span'
    })
    const [visible, setVisible] = useState(false);
    const [newPriceInfo, setnewPriceInfo] = useState()
    const [newDescInfo, setnewDescInfo] = useState()
    const [newTitleInfo, setnewTitleInfo] = useState()

    const spanStyle = {
        fontSize: 'xxx-large'
    }

    //메뉴key값으로 메뉴정보를 가져온다.
    useEffect(() => {
        axios.get(`/api/menus/menu_detail_id?id=${menuId}`)
        .then(response => {  
            setState(response.data.menu[0])
        })
    }, [])  

    /* 메뉴명/ 가격 / 설명 UI 핸들러 ,Tag가 span 일경우 정보확인 input일경우 수정할수있도록 */
    const modifyHandler = (e) =>{

        let buttonType = e.target.value
        if(buttonType == 1){
            if(Tag.nameTag == 'span'){
                setTag({...Tag, nameTag: "Input"})
            }else if(Tag.nameTag == 'Input'){
                setTag({...Tag, nameTag: "span"})
            }
        }else if(buttonType == 2){
            if(Tag.priceTag == 'span'){
                setTag({...Tag, priceTag: "Input"})
            }else if(Tag.priceTag == 'Input'){
                setTag({...Tag, priceTag: "span"})
            }
        }else if(buttonType == 3){
            if(Tag.TitleTag == 'span'){
                setTag({...Tag, TitleTag: "Input"})
            }else if(Tag.TitleTag == 'Input'){
                setTag({...Tag, TitleTag: "span"})
            }
        }
    }   
    /* ====================================================================== */

    /*===============메뉴 가격 변경 함수 =======================*/
    const priceChangeHnadler = (e) =>{
        setnewPriceInfo(e.target.value)
    }

    const updatePriceClickHandler = (e) =>{

        let body ={
            price  : newPriceInfo,
            _id : State._id,
            type : 'price'
         }

         dispatch(modifyMenuInfo(body))
         .then(response => {
            if (response.payload.success) {
                alert('정보 저장에 성공 했습니다.')
                setTag({...Tag, nameTag: "span"})
                setState(response.payload.menu)
            }else{
                alert('정보 저장에 실패 했습니다.')
            } 
        })
    }
    /*========================================================= */

    /*===============메뉴 설명 변경 함수 =======================*/
    const descChangeHnadler = (e) =>{
        setnewDescInfo(e.target.value)
    }

    const updateDescClickHandler = (e) =>{

        let body ={
            description  : newDescInfo,
            _id : State._id,
            type : 'desc'
         }
         dispatch(modifyMenuInfo(body))
         .then(response => {
            if (response.payload.success) {
                alert('정보 저장에 성공 했습니다.')
                setTag({...Tag, priceTag: "span"})
                setState(response.payload.menu)
            }else{
                alert('정보 저장에 실패 했습니다.')
            } 
        })
    }
    /*========================================================= */

    /*===============메뉴명 변경 함수 =======================*/
    const titleChangeHnadler = (e) =>{
        setnewTitleInfo(e.target.value)
    }

    const updateTitleClickHandler = (e) =>{

        let body ={
            title  : newTitleInfo,
            _id : State._id,
            type : 'title'
         }

         dispatch(modifyMenuInfo(body))
         .then(response => {
            if (response.payload.success) {
                alert('정보 저장에 성공 했습니다.')
                setTag({...Tag, TitleTag: "span"})
                setState(response.payload.menu)
            }else{
                alert('정보 저장에 실패 했습니다.')
            } 
        })
    }  
    /*========================================================= */
    
    /*===============이미지 변경 모달 =======================*/
    const imgModifyHandler = ()=>{
        setVisible(true)       
    }
    //FileModify 컴퍼넌트에서 image정보 가져와서 셋팅
    const newImg = (value)=>{
        setState(value)
    }
    /*====================================================== */

    return (
        <div style={{ width: '100%', padding: '3rem 4rem' }}>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={imgModifyHandler} style={{width:"100%" ,fontSize:'xx-large' , height:'60px'}}>이미지 수정하기</Button>
        </div>

        <br />

        <Row gutter={[16, 16]} >
            <Col lg={12} sm={24}>
                {/* ProductImage */}
                <MenuImage detail={State} />
            </Col>
            <Col lg={12} sm={24}>
                
                {Tag.TitleTag === 'span' &&
                    <div style={{border:'1px solid'}}>
                        <span style={spanStyle}>메뉴명</span>
                        <Button 
                            style={{float:'right', height: '72px' , fontSize : 'x-large'}}
                            onClick={modifyHandler} value='3'
                        >수정</Button>
                        <Input style={{height:'70px',fontSize: 'xxx-large'}}  value={State.title}></Input>
                    </div>
                }

                {Tag.TitleTag === 'Input'  &&
                <div>
                    <Input onChange={titleChangeHnadler} value={newTitleInfo} style={{height :'50px' , width:'70%' ,  fontSize : 'x-large'}} ></Input>
                    <Button onClick={modifyHandler} value='3' style={{height :'50px' , width:'12%' , fontSize : 'x-large'}}>취소</Button>
                    <Button onClick={updateTitleClickHandler} style={{height :'50px' , width:'18%',  fontSize : 'x-large'}}>수정완료</Button>
                </div>
                }
                <br></br>
                {Tag.nameTag === 'span' &&
                    <div style={{border:'1px solid'}}>
                        <span style={spanStyle}>가격 : {State.price}</span>
                        <Button 
                            style={{float:'right', height: '72px' , fontSize : 'x-large'}}
                            onClick={modifyHandler} value='1'
                        >수정</Button>      
                    </div>
                }

                {Tag.nameTag === 'Input'  &&
                <div>
                    <Input onChange={priceChangeHnadler} value={newPriceInfo} style={{height :'50px' , width:'70%' ,  fontSize : 'x-large'}} ></Input>
                    <Button onClick={modifyHandler} value='1' style={{height :'50px' , width:'12%' , fontSize : 'x-large'}}>취소</Button>
                    <Button onClick={updatePriceClickHandler} style={{height :'50px' , width:'18%',  fontSize : 'x-large'}}>수정완료</Button>
                </div>
                }

                <br></br>
                {Tag.priceTag === 'span' &&
                    <div style={{border:'1px solid'}}>
                        <span style={spanStyle}>설명</span>
                        <Button 
                            style={{float:'right', height: '72px' , fontSize : 'x-large'}}
                            onClick={modifyHandler} value='2'
                        >수정</Button>   
                        <Input style={{height:'70px',fontSize: 'xxx-large'}}  value={State.description}></Input>     
                    </div>
                }

                {Tag.priceTag === 'Input'  &&
                <div>
                    <Input onChange={descChangeHnadler} value={newDescInfo} style={{height :'50px' , width:'70%' ,  fontSize : 'x-large'}} ></Input>
                    <Button onClick={modifyHandler} value='2' style={{height :'50px' , width:'12%' , fontSize : 'x-large'}}>취소</Button>
                    <Button onClick={updateDescClickHandler} style={{height :'50px' , width:'18%',  fontSize : 'x-large'}}>수정완료</Button>
                </div>
                }
            </Col>
        </Row>

        <Modal
            title="이미지 수정하기"
            centered
            visible={visible}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            // width={1000}
            >
            <FileModify img={State.images} menuId={menuId} refreshFunction={newImg}/>
        </Modal>         


    </div>
    )
}

export default MenuModifyPage
