import React, { useEffect, useState } from 'react'
import Sms from '../../utils/Sms'
import Axios from 'axios';
import { useDispatch,useSelector} from "react-redux";
import { Rate,Button,Image,Checkbox, Card ,Col ,Row ,Modal, Radio ,Form, Input} from 'antd';
import DaumPostcode from 'react-daum-postcode';
import {getOrderStroeList} from '../../../_actions/order_action'
const { TextArea } = Input;

function OrderPage(props) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user)
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const [Flag, setFlag] = useState(false)   
    const [isAddress, setIsAddress] = useState("");   
    const [isAddressDetail, setisAddressDetail] = useState()
    const [isZoneCode, setIsZoneCode] = useState();
    const [isPostOpen, setIsPostOpen] = useState()
    const [OrderList, setOrderList] = useState([])
    const [Name, setName] = useState()
    const [Tell, setTell] = useState()
    const [RequestOrder, setRequestOrder] = useState()
    const [BusinessNumber, setBusinessNumber] = useState()
    const [UserMail, setUserMail] = useState()  
    const [UserId, setUserId] = useState()
    
    let today = new Date();   
    let userAreaInfo = window.localStorage.getItem("userAreaInfo")
    // let BusinessNumber = window.localStorage.getItem("BusinessNumber")
    /* 페이지 최초접근시 user정보로드 만약 정상적인 접근경로가아닐시 메인화면호출 */
    useEffect(() => {
        
        if(props.location.state === undefined){
            props.history.push("/");
        }else{

            if (user.userData && user.userData.isAuth) {
                setUserMail(user.userData.email)
                setUserId(user.userData._id)
            }

            setOrderList([...props.location.state.OrderList])
            setName(props.location.state.name)  
            setBusinessNumber(props.location.state.number)  
            setIsAddress(userAreaInfo)
        }
    }, [])
    /* ============================================================== */

    //숫자만 입력 함수
    const numberFormat= (e) =>{
        
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault();
        } 
    }

     
    /* =================================주문리스트 랜더링함수============================= */
    let originalPrice = 0
    const renderOrderList = OrderList.map((list,index) =>{
        
        originalPrice = originalPrice  + list.price * list.cnt
        
        let comPrice = list.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return <Card style={{textAlign:'left',backgroundColor:'#fff8eb'}}>
                    <span style={{color:'black',fontSize:'large',overflowWrap:'anywhere'}}>{list.title} x {list.cnt}개</span>
                    <span style={{float:'right',fontSize:'large'}}>{comPrice}원</span>
               </Card>
    })

    let comTotalPrice = originalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    /*=================================================================================== */

    
    /* ============================주소검색 함수 ========================================*/
    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = "";

        if (data.addressType === "R") {
          if (data.bname !== "") {
            extraAddress += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddress +=
              extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
          }
          fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }


        setIsZoneCode(data.zonecode);
        setIsAddress(fullAddress);
        setIsPostOpen(false);
    };

    //상세주소
    const addrDetailHandler =(event) =>{
        setisAddressDetail(event.currentTarget.value)
    }

    /* =================================================================================== */


    //휴대전화번호
    const hpChangHandler =(e)=>{
        setTell(e.target.value)
    }
    //주문시요청사항
    const requestOrderChangeHndler = (e)=>{
        setRequestOrder(e.target.value)
    }

    /* ===주소와 휴대폰번호 입력완료후 결제하기 버튼클릭시 휴대폰인증확인을 위한 모달창 호출 ====*/
    const payOnclickHandler =()=>{

        if (!Tell || !isAddress || !isAddressDetail) {
            return alert("주소와 휴대전화번호를 입력하여 주세요")
        }

        if(Tell.length < 10){
            return alert("휴대전화 번호를 올바르게 입력하여 주세요")
        }
          
        setFlag(false)
        setVisible2(true)

    }
    /* ============================================================================ */

    //휴대폰인증 모달창 ok버튼
    const onOk = (Flag)=>{
        if(!Flag){
            return alert("인증을 확인하여 주세요")
        }else{
            // iamPort()
            //test용 간단히 할려고 iamport()로해야 결제로직 똑바로돔
            iamPort2()
        }

    }

    /* 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' 중 랜덤한 4자리숫자 생성함수<< 휴대폰 인증번호 */
    const makeRandomString = ()=> {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      
        for (let i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
    }
    /*================================================================================ */

    /* =================결제test용 간편하게하기위한 임시로직======================================= */
    const iamPort2 =()=>{

        let body = {
            BusinessNumber : BusinessNumber,
            Name : Name,
            OrderList : OrderList,
            amount : originalPrice,
            RequestOrder : RequestOrder,
            buyer_tel : Tell,
            no : 'imp_test18528570'+makeRandomString(),
            userId : UserId,
            mail: UserMail,
            buyer_addr : isAddress + '/' + isAddressDetail
        }

                Axios.post('/api/business/orderInsert', body)
                .then(response => {
                    if (response.data.success) {            
                        let menuListInfo
                        if(response.data.order.OrderList.length === 1){
                            menuListInfo = response.data.order.OrderList[0].id
                        }else{
                            menuListInfo = response.data.order.OrderList[0].id+'외'+response.data.order.OrderList.length
                        }

                        let body = {
                            tell : response.data.order.buyer_tel,
                            date : today.toLocaleString(),
                            orderNo : response.data.order.no,
                            name : response.data.order.Name,
                            menu : menuListInfo, 
                            addr : response.data.order.buyer_addr,
                        }
                        let body2 = {
                            BusinessNumber : BusinessNumber
                        }
                        dispatch(getOrderStroeList(body2))
                        clearLocallStorage()
                        var msg = '성공'
                        alert(msg);
                    } else {
                        alert('처리중 오류가 발생하엿습니다.')
                    }
                })
                
    }
    /* ================================================================================ */

    /* 
        결제로직함수
          인증절차를 완료하면 iamport함수호출(카카오페이api연계)  <== 정상적으로 카카오페이api가 진행되면  rsp.success  =true
          결제가 완료되면 주문번호를 문자로전송 orderImpUid<<값이 주문번호
          문자전송의경우 다날sms api 연동  < ==  /api/business/smsOrderInfo
          <Sms> 컴포넌트에서 인증확인로직실행
          주문 정보는 따로 db로 관리  < == /api/business/orderInsert
    */
    const iamPort = ()=>{

        var IMP = window.IMP; // 생략가능
	    IMP.init('imp88357129'); // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
	    IMP.request_pay({
	        pg : 'kakaopay',
	        pay_method : 'card',
	        name : 'PJS DEMO 요기요 결제',
	        amount : originalPrice,
	        buyer_email : 'pignecro4@naver.com',
	        merchant_uid: 'merchant_test'+new Date().getTime(),
	        buyer_name : 'test',
	        buyer_tel : Tell,
	        buyer_addr : isAddress + '/' + isAddressDetail,
	        //m_redirect_url : 'http://www.naver.com'
	    }, function(rsp) {
	        if ( rsp.success ) {
                let orderImpUid = rsp.imp_uid+makeRandomString()
                
                let body = {
                    BusinessNumber : BusinessNumber,
                    Name : Name,
                    OrderList : OrderList,
                    amount : originalPrice,
                    RequestOrder : RequestOrder,
                    buyer_tel : Tell,
                    no : orderImpUid,
                    userId : UserId,
                    mail: UserMail,
                    buyer_addr : isAddress + '/' + isAddressDetail
                }
        
                Axios.post('/api/business/orderInsert', body)
                .then(response => {
                    if (response.data.success) {            
                        let menuListInfo
                        if(response.data.order.OrderList.length === 1){
                            menuListInfo = response.data.order.OrderList[0].id
                        }else{
                            menuListInfo = response.data.order.OrderList[0].id+'외'+response.data.order.OrderList.length
                        }

                        let body = {
                            tell : response.data.order.buyer_tel,
                            date : today.toLocaleString(),
                            orderNo : response.data.order.no,
                            name : response.data.order.Name,
                            menu : menuListInfo, 
                            addr : response.data.order.buyer_addr,
                        }

                        Axios.post('/api/business/smsOrderInfo', body)
                        .then(response => {
                            if (response.data.success) {
                            } else {
                                alert('배달정보 문자메시지 전송에 실패하엿습니다.')
                            }
                        })
                    } else {
                        alert('처리중 오류가 발생하엿습니다.')
                    }
                })
                clearLocallStorage()
                //정상적으로 결제가 완료되면 기존 주문표정보 삭제

                let body2 = {
                    BusinessNumber : BusinessNumber
                }
                dispatch(getOrderStroeList(body2))
                
                var msg = '결제가 완료되었습니다.\n 전송된 주문번호를 확인하여 주세요\n 주문번호:' + orderImpUid;
                setVisible2(false)
	        } else {
	            var msg = '결제에 실패하였습니다.';
	            msg += '에러내용 : ' + rsp.error_msg;
	        }
            alert(msg);
	    });
    }

    /* ================주문표정보 삭제 함수============= */
    const clearLocallStorage =()=>{
        localStorage.removeItem('order');
        localStorage.removeItem('orderPrice');
        localStorage.removeItem('orderMinPrice');
        localStorage.removeItem('orderMenuId');
    }
    /* =============================================== */

    /* 휴대폰인증 인증번호 리턴함수 인증성공시 valie = true */
    const updateFlag = (value)=>{
        setFlag(value)
    }
    /* ================================================ */

    return (        
            <div>
                
                <div style={{width:'48%',marginTop:'5%' , minWidth:'450px',float:'left' ,marginLeft:'5%'}}>
                    <Card style={{backgroundColor:'black'}}><span style={{color:'white',fontSize:'large'}}>결제하기</span></Card>
                    <Card style={{backgroundColor:'#ddd'}}><span style={{color:'black',fontSize:'large'}}>배달정보</span></Card>
                    <Card style={{backgroundColor:'white',fontSize:'large'}}>
                    <span style={{marginRight:'10px',marginLeft:'77px'}}>주소</span>
                        <Input placeholder = "동,면,읍" value={isAddress} style={{inlineSize: 'auto' ,width:'60%',border:'1px solid'}}></Input>
                        <Button onClick={() =>{setVisible(true)} } style={{border:'outset',cursor:'pointer',marginLeft:'10px'}}>주소검색</Button>
                        <br></br><br></br>                    
                        <Input onChange = {addrDetailHandler} placeholder = "상세주소" value={isAddressDetail} style={{inlineSize: 'auto' ,width:'75%',marginLeft:'122px',border:'1px solid'}}></Input>
                    <br></br><br></br>   
                    <span style={{marginRight:'10px'}}>휴대전화 번호</span>
                    <Input maxLength='11' onChange={hpChangHandler} placeholder = "( ㅡ )없이 입력하여 주세요" onKeyPress = {numberFormat} style={{inlineSize: 'auto' ,width:'75%',border:'1px solid'}}></Input>
                    </Card>
                    <Card style={{backgroundColor:'#ddd'}}><span style={{color:'black',fontSize:'large'}}>주문시요청사항</span></Card>
                    <Card><TextArea onChange={requestOrderChangeHndler} rows={4} style={{border:'1px solid'}}/></Card>   
                </div>

                <div style={{width:'28%',float:'left',marginTop:'5%',marginLeft:'3%'}}>
                    <Card style={{height:'50px',textAlign:'center',backgroundColor:'#ddd'}}><span style={{color:'black',fontSize:'large'}}>주문내역</span></Card>
                    <Card style={{height:'50px',textAlign:'left',backgroundColor:'white'}}><span style={{color:'black',fontSize:'large'}}>{Name}</span></Card>
                    {renderOrderList}
                    <Card style={{height:'50px',textAlign:'center',backgroundColor:'#fff8eb'}}><span style={{color:'#fa0050',fontSize:'large'}}>총결제금액:{comTotalPrice}원</span></Card>
                    <br></br>
                    <button onClick={payOnclickHandler} style={{width:'100%',height:40,fontSize:'large',color:'white',backgroundColor:"#fa0050",cursor:'pointer'}}>결제하기</button>
                </div>

                <Modal
                    title="주소찾기"
                    centered
                    visible={visible}
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    // width={1000}
                    >
                    <DaumPostcode  onComplete={handleComplete} />
                </Modal>

                <Modal
                    title="휴대폰 인증"
                    centered
                    visible={visible2}
                    // onOk={() => setVisible2(false)}
                    onOk = {() =>onOk(Flag)}
                    onCancel={() => setVisible2(false)}
                    >
                    
                    < Sms refreshFunction={updateFlag} tell={Tell}/>
                </Modal>

            </div> 
    )
}

export default OrderPage
