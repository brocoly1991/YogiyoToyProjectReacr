import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useDispatch ,useSelector } from 'react-redux';
import { getUserInfo } from '../../../_actions/user_actions';
import { Button, Card ,Col , Row ,Modal ,Form,Input} from 'antd';
import Sms from '../../utils/Sms'

function MyPage(props) {

    const _id = localStorage.getItem("userId")
    const dispatch = useDispatch();
    const [UserInfo, setUserInfo] = useState({})
    const [UserCeoInfo, setUserCeoInfo] = useState({})
    const [isModalVisible, setIsModalVisible] = useState(false);   
    const [errBusinessNumber, seterrBusinessNumber] = useState(false)
    const [BusinessNumber, setBusinessNumber] = useState()   
    const [visible2, setVisible2] = useState(false);
    const [FalgAuth, setFalgAuth] = useState(false)
    const [BusinessHpNumber, setBusinessHpNumber] = useState()
    const user = useSelector(state => state.user);
    
    /*=======숫자만 입력 함수======*/
    const numberFormat= (e) =>{

        if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
        } 
    }
    /* =========================== */

    const buttonStyle= {
        width : '99%',
        height: "50px",
        backgroundColor : 'white' ,
        fontWeight : 'bolder',
        cursor: 'pointer'
    }

    /*
        최초 접근시 redux에 정보가 없기떄문에 dispatch(getUserInfo)를통해 정보를가져온다 
        정보수정 페이지에서 정보를 수정한다면 redux에 정보가 있기떄문에 redux값을 그대로 가져온다.
    */
    useEffect(() => {
        if(user.getUserInfo == undefined){
            dispatch(getUserInfo(_id))
            .then(response => {
                if (response.payload.success) {
                  setUserInfo(response.payload.userInfo)     
                  setUserCeoInfo(response.payload.userCeoInfo)
                }else{
                    alert("로딩실패")
                } 
            })
        }else{
            setUserInfo(user.getUserInfo.userInfo)
            setUserCeoInfo(user.getUserInfo.userCeoInfo) 
        }
    },[])

    /* 사업자 번호 등록 모달 함수========================================= */
    const showModal = () => {
        setFalgAuth(false)
        setBusinessHpNumber()
        seterrBusinessNumber(false)
        setBusinessNumber()
        setIsModalVisible(true);
    };
    //사업장등록 모달 cancel 함수 
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    //사업장등록 모달 ok 함수
    const handleOk = () => {        
        if(!BusinessNumber || !BusinessHpNumber){
            return alert("모든값을 입력하여 주세요")
        }

        if(!FalgAuth){
            return alert("휴대폰 인증을 완료하여 주세요")
        }
        
        if(!errBusinessNumber){
            return alert("중복검사를 완료하여 주세요")
        }
        
        onSubmit()
    };

    const onSubmit =() =>{

        const body ={
           BusinessNumber  : BusinessNumber,
           _id : _id
        }

        axios.post('/api/users/updateBusinessNumber', body)
        .then(response => {
            if (response.data.success) {
                alert('정보 저장에 성공 했습니다.')
                localStorage.removeItem('BusinessNumber');
                window.localStorage.setItem("BusinessNumber", BusinessNumber);
                window.location.reload()
            } else {
                alert('정보 저장에 실패 했습니다.')
            }
        })
         
     }
    /* ============================================================== */

    /* 휴대폰번호 인증 모달 함수========================================= */
    const updateFlag = (value)=>{
        setFalgAuth(value)
    }

    const onOk = (Flag)=>{
        if(!Flag){
            return alert("인증을 확인하여 주세요")
        }else{
          setVisible2(false)
        }
    }

    const authClickHandler = ()=>{

        if(!BusinessHpNumber){
          return alert("사업자 휴대폰 번호를 입력하여 주세요")
        }

        if(BusinessHpNumber.length < 11){
            return alert("사업자 휴대폰 번호를 올바르게 입력하여 주세요")
        }

        setVisible2(true)
    
    }
    /* ============================================================== */

    /* 사업자번호 중복확인 함수========================================= */
    const businessHpChangeHandler = (event) =>{
        setBusinessHpNumber(event.currentTarget.value)
    }

    const BusinessNumberOnchange =(e) =>{
       setBusinessNumber(e.target.value)
    }

    const BusinessNumberHandler =() =>{
        
        if(!BusinessNumber){
            return alert("사업자번호를 입력하세요")
        }

        let numberValue = BusinessNumber

        if(numberValue.length == 10){
            axios.get(`/api/users/selectBusinessNumber?id=${numberValue}`)
            .then(response => {
                if (response.data.success) {
                    alert('사용 가능')
                    seterrBusinessNumber(true)
                } else {
                    alert('사용 불가능\n' +  response.data.msg)
                    seterrBusinessNumber(false)
                }
            })
        }else{
            alert('사업자번호를 올바르게 입력하세요')
        }

     }
    /* ============================================================== */



    /* 
      랜더링시 일반 유저라면 role = 0 사장님일 경우 role = 1 로 1차적으로 구분한다
      이후 사장님일경우 BusinessNumber = 0 일경우 아직 온라인 입점신청을 통한 사업자 번호를 등록하지 않은 사용자로서 
      사업자 번호 등록 유도 , 사업자번호가 등록된 유저일경우 온라인 입점신청시 저장한 음식점 정보노출
    */ 

    if(UserInfo.role === 0){

        return (
                <div style={{ width: '85%', margin: '5rem auto' }}>
                    <Card lg={12} xs={24}>
                        <h1>회원정보</h1>
                        <p>메일 :{UserInfo.email}  </p>
                        <p>닉네임 :{UserInfo.name} </p>
                        <p>핸드폰 번호 :{UserInfo.hpNumner} </p> 

                        <Row>
                            <Col span={6}>
                            <button 
                                style={buttonStyle}
                                onClick={() => props.history.push('/OrderinfoListPage')}
                            >주문내역</button>                            
                            </Col>
                            <Col span={6}>
                            <button 
                                style={buttonStyle}
                                onClick={() => props.history.push('/register/modify')}
                            >수정하기</button>                            
                            </Col>
                        </Row>
                        
                    </Card>
                </div>
                )
    }else{

        if(UserInfo.BusinessNumber === 0){
            return (
                <div style={{ width: '85%', margin: '5rem auto' }}>
                    <Card lg={12} xs={24}>
                        <h1>회원정보</h1>
                        <p>메일 :{UserInfo.email}</p>
                        <p>닉네임 :{UserInfo.name}</p>
                        <p>핸드폰 번호 :{UserInfo.hpNumner}</p> 
                    </Card>
    
                    {
                            UserInfo.BusinessNumber === 0 && 
                            
                          <Button type="primary" onClick={showModal}>
                            사업자 번호 등록
                          </Button>              
                    }
                    
                    <Modal title="사업자 번호 등록" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                        <Input 
                            onChange={BusinessNumberOnchange} 
                            value={BusinessNumber} 
                            placeholder='사업자번호를 (-) 없이 입력하세요'
                            maxLength = {10}
                            onKeyPress = {numberFormat}
                        >               
                        </Input>
                        <Button onClick={BusinessNumberHandler} >중복검사</Button>
                        <br></br><br></br>
                        <Input 
                            onChange={businessHpChangeHandler} 
                            value={BusinessHpNumber} 
                            placeholder="사업자휴대폰번호를 ( - ) 업이 입력하세요"
                            onKeyPress = {numberFormat}
                            maxLength = {11}       
                        ></Input>
                        <Button  onClick={authClickHandler} >휴대폰 인증하기</Button>
                    </Modal>
                    
                    <Modal
                        title="휴대폰 인증"
                        centered
                        visible={visible2}
                        onOk = {() =>onOk(FalgAuth)}
                        onCancel={() => setVisible2(false)}
                        >
                        
                        < Sms refreshFunction={updateFlag} tell={BusinessHpNumber}/>
                    </Modal>
    
                </div>
    
                
            )
        }else{
            return (
                <div style={{ width: '85%', margin: '5rem auto' }}>
                    <Card lg={12} xs={24}>
                        <h1>회원정보</h1>
                        <p>메일 :{UserInfo.email}</p>
                        <p>닉네임 :{UserInfo.name}</p>
                        <p>핸드폰 번호 :{UserInfo.hpNumner}</p> 

                        <Row>
                            <Col span={6}>
                            <button 
                                style={buttonStyle}
                                onClick={() => props.history.push('/OrderinfoListPage')}
                            >주문내역</button>                            
                            </Col>
                            <Col span={6}>
                            <button 
                                style={buttonStyle}
                                onClick={() => props.history.push('/register/modify')}
                            >수정하기</button>                            
                            </Col>
                        </Row>                    
                    </Card>                    
                    < br/>
                    <Card lg={12} xs={24}>
                        <h1>음식점 정보</h1>
                        
                        <p>사업장번호 :{UserInfo.BusinessNumber}</p>
                        <p>상호명 :{UserCeoInfo.RestaurantName}</p>
                        <p>주소 :{UserCeoInfo.isAddress}</p>
                        <p>상세주소 : {UserCeoInfo.isAddressDetail}</p>  
                        <br></br>
                        <Row>
                            <Col span={6}>
                            <button 
                                onClick={()=> props.history.push('/OrderConfirm')}
                                style={buttonStyle}>
                            주문확인</button>                          
                            </Col>
                            <Col span={6}>
                            <button 
                                style={buttonStyle}
                                onClick={() => props.history.push('/menuinfo')}
                            >메뉴관리</button>                            
                            </Col>
                            <Col span={6}>
                            <button 
                                style={buttonStyle}
                                onClick={() => props.history.push('/menuinfo')}
                            >                                    
                            배달지역관리</button>                         
                            </Col>
                            <Col span={6}>
                            <button 
                                style={buttonStyle}
                                onClick={() => props.history.push('/register/ceoModify')}
                            >음식점정보관리</button>                                      
                            </Col>
                        </Row>
                    </Card>
                </div>        
            )
        }
    }  
}

export default MyPage
