import React, { useState ,useEffect}  from 'react'
import { Row,Col,Checkbox,Input,InputNumber,Radio,Select,TimePicker, Button ,Modal,Upload, message } from 'antd';
import DaumPostcode from 'react-daum-postcode';
import axios from "axios";
import { getUserInfo } from '../../../_actions/user_actions';
import { useDispatch,useSelector } from "react-redux";
import { modifyUserCeoInfo } from '../../../_actions/user_actions';
import './StoreRegister.css';
const { daum } = window;
function StoreRegisterModify(props) {
    let user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { Option } = Select;
    const _id = localStorage.getItem("userId")
    const [UserInfo, setUserInfo] = useState({})
    const [UserCeoInfo, setUserCeoInfo] = useState({})
    const [formatPrice, setformatPrice] = useState()
    const [visible, setVisible] = useState(false);

    //수정시 state 설정
    const [newNameInfo, setnewNameInfo] = useState()
    const [newHpInfo, setnewHpInfo] = useState()
    const [newPriceInfo, setnewPriceInfo] = useState()
    const [newPaymentInfo, setnewPaymentInfo] = useState([])
    const [newStartTime, setnewStartTime] = useState()
    const [newEndTime, setnewEndTime] = useState()
    const [newCategory, setnewCategory] = useState()
    const [newDelivery, setnewDelivery] = useState()

    const [isAddress, setIsAddress] = useState("");
    const [isZoneCode, setIsZoneCode] = useState();
    const [isPostOpen, setIsPostOpen] = useState()
    const [isAddressDetail, setisAddressDetail] = useState()
    const [Lat, setLat] = useState()
    const [Lon, setLon] = useState()
    
    const colStyle = {
        borderTop: "1px solid #E0E0E0",
        padding: "22px"
    }
    
    const colStyleFront = { 
        backgroundColor : '#E0E0E0' ,
        padding: "30px" , 
        borderBottom: '1px solid #0000001f'
    }

    const colButton = {
        float : "right"
    }


    /* ============================최초 데이터 로딩============================ */
    useEffect(() => {
        if (user.getUserInfo === undefined){
            dispatch(getUserInfo(_id))
            .then(response => {
                if (response.payload.success) {
                    setUserInfo(response.payload.userInfo)     
                    setUserCeoInfo(response.payload.userCeoInfo)
                    setformatPrice(response.payload.userCeoInfo.RestaurantPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
                }else{
                    alert("로딩실패")
                } 
            })
        }else{
            getUserCeoInfo()
        }       
    }, [user])

    const getUserCeoInfo = () =>{
        setUserCeoInfo(user.getUserInfo.userCeoInfo)
        setformatPrice(user.getUserInfo.userCeoInfo.RestaurantPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))  
    }


    /* ======================================================================= */

    /* ============================주소찾기를 위한 함수=========================================== */
    const addrDetailHandler =(event) =>{
        setisAddressDetail(event.currentTarget.value)
    }
    
    const handleComplete = (data) => {
        console.log("data" , data)
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

        Promise.resolve(data).then(o => {
            const { address } = data;

            return new Promise((resolve, reject) => {
                const geocoder = new daum.maps.services.Geocoder();

                geocoder.addressSearch(address, (result, status) =>{
                    if(status === daum.maps.services.Status.OK){
                        const { x, y } = result[0];

                        resolve({ lat: y, lon: x })
                    }else{
                        reject();
                    }
                });
            })
        }).then(result => {
            setLat(result.lat) 
            setLon(result.lon)
        });



        setIsZoneCode(data.zonecode);
        setIsAddress(fullAddress);
        setIsPostOpen(false);
      };
    
      /* ============================================================================================ */

    /* 수정버튼 클릭시 기존정보를대신해 정보를 수정할수있는 input태그를 활성화하기위한 flag 설정 */
    const [Tag, setTag] = useState({
        nameTag : 'span',
        hpTag : 'span',
        priceTag : 'span',
        paymentTag : 'span',
        timeTag : 'span',
        categoryTag : 'span',
        deliveryTag:'span',
        addreTag:'span',
    })
    /* ============================================================================================ */


    /* ================================수정 버튼클릭시 ui 핸들러==============================*/
    const modifyHandler = (e) =>{
        let buttonType = e.target.value
        
        if(buttonType == 1){
            if(Tag.nameTag == 'span'){
                setTag({...Tag, nameTag: "Input"})
            }else if(Tag.nameTag == 'Input'){
                setTag({...Tag, nameTag: "span"})
            }
        }else if(buttonType == 3){
            if(Tag.priceTag == 'span'){
                setTag({...Tag, priceTag: "Input"})
            }else if(Tag.priceTag == 'Input'){
                setTag({...Tag, priceTag: "span"})
            }
        }else if(buttonType == 2){
            if(Tag.hpTag == 'span'){
                setTag({...Tag, hpTag: "Input"})
            }else if(Tag.hpTag == 'Input'){
                setTag({...Tag, hpTag: "span"})
            }
        }else if(buttonType == 4){
            if(Tag.paymentTag == 'span'){
                setTag({...Tag, paymentTag: "Input"})
            }else if(Tag.paymentTag == 'Input'){
                setTag({...Tag, paymentTag: "span"})
            }
        }else if(buttonType == 5){
            if(Tag.timeTag == 'span'){
                setTag({...Tag, timeTag: "Input"})
            }else if(Tag.timeTag == 'Input'){
                setTag({...Tag, timeTag: "span"})
            }
        }else if(buttonType == 6){
            if(Tag.categoryTag == 'span'){
                setTag({...Tag, categoryTag: "Input"})
            }else if(Tag.categoryTag == 'Input'){
                setTag({...Tag, categoryTag: "span"})
            }
        }else if(buttonType == 7){
            if(Tag.deliveryTag == 'span'){
                setTag({...Tag, deliveryTag: "Input"})
            }else if(Tag.deliveryTag == 'Input'){
                setTag({...Tag, deliveryTag: "span"})
            }
        }else if(buttonType == 8){
            if(Tag.addreTag == 'span'){
                setTag({...Tag, addreTag: "Input"})
            }else if(Tag.addreTag == 'Input'){
                setTag({...Tag, addreTag: "span"})
            }
        }
 
    }
    /* ============================================================================================ */


    /*===========음식점 이름 변경============================*/ 
    const nameChangeHnadler = (e) =>{
        setnewNameInfo(e.target.value)
    }

    const nameOnclickHandler = (e) =>{
        let body ={
            RestaurantName  : e.target.value,
            BusinessNumber : UserCeoInfo.BusinessNumber,
            type : 'name'
         }

         dispatch(modifyUserCeoInfo(body))
         .then(response => {
             if (response.payload.success) {
               setUserInfo(response.payload.userInfo)     
               setUserCeoInfo(response.payload.userCeoInfo)
               alert('정보 저장에 성공 했습니다.')
               setTag({...Tag, nameTag: "span"})
             }else{
                alert('정보 저장에 실패 했습니다.')
             } 
         })

    }
    /*========================================================== */

    /*=======================음식점 전화번호 변경=============================*/
    const hpChangeHnadler = (e)=>{
        setnewHpInfo(e.target.value)
    }

    const hpOnclickHandler = (e) =>{

        let body ={
            RestaurantHp  : e.target.value,
            BusinessNumber : UserCeoInfo.BusinessNumber,
            type : 'hp'
         }

         dispatch(modifyUserCeoInfo(body))
         .then(response => {
             if (response.payload.success) {
               setUserInfo(response.payload.userInfo)     
               setUserCeoInfo(response.payload.userCeoInfo)
               alert('정보 저장에 성공 했습니다.')
               setTag({...Tag, hpTag: "span"})
             }else{
                alert('정보 저장에 실패 했습니다.')
             } 
         })
    }

    /*========================================================================*/


    /*=======================최수주문금액 변경=============================*/
    function priceChangeHnadler(value) {
        setnewPriceInfo(value)
    }

    const priceOnclickHandler = (e) =>{
        let body ={
            RestaurantPrice  : e.target.value,
            BusinessNumber : UserCeoInfo.BusinessNumber,
            type : 'price'
         }

         dispatch(modifyUserCeoInfo(body))
         .then(response => {
             if (response.payload.success) {
               setUserInfo(response.payload.userInfo)     
               setUserCeoInfo(response.payload.userCeoInfo)
               alert('정보 저장에 성공 했습니다.')
               setTag({...Tag, priceTag: "span"})
             }else{
                alert('정보 저장에 실패 했습니다.')
             } 
         })
    }
    /*========================================================================*/

    /*=======================결제수단 변경=============================*/
    function paymentChangeHnadler(value) {
        setnewPaymentInfo(value)
    }

    const paymentOnclickHandler = (e) =>{
        let body ={
                RestaurantPayment  : e.target.value,
                BusinessNumber : UserCeoInfo.BusinessNumber,
                type : 'pay'
            }


        dispatch(modifyUserCeoInfo(body))
        .then(response => {
            if (response.payload.success) {
                setUserInfo(response.payload.userInfo)     
                setUserCeoInfo(response.payload.userCeoInfo)
                alert('정보 저장에 성공 했습니다.')
                setTag({...Tag, paymentTag: "span"})
            }else{
                alert('정보 저장에 실패 했습니다.')
            } 
        })

    }
    /*===================================================================*/

    /*=======================영업시간 변경=============================*/ 
    function startTimeChangeHnadler(e) {
        setnewStartTime(e.target.value)
    }

    function endTimeChangeHnadler(e) {
        setnewEndTime(e.target.value)
    }


    const timeOnclickHandler = () => {

        let body ={
            RestaurantStartTime  : newStartTime,
            RestaurantEndTime : newEndTime,
            BusinessNumber : UserCeoInfo.BusinessNumber,
            type : 'time'
        }


        dispatch(modifyUserCeoInfo(body))
        .then(response => {
            if (response.payload.success) {
                setUserInfo(response.payload.userInfo)     
                setUserCeoInfo(response.payload.userCeoInfo)
                alert('정보 저장에 성공 했습니다.')
                setTag({...Tag, timeTag: "span"})
            }else{
                alert('정보 저장에 실패 했습니다.')
            } 
        })

    }
    /*===================================================================*/


    /*=======================업종 카테고리 변경=============================*/ 
    const onChangeCategory = (value) =>{
        setnewCategory(value)      
    }

    const categoryOnclickHandler = () =>{
        let body ={
            RestaurantCategory  : newCategory,
            BusinessNumber : UserCeoInfo.BusinessNumber,
            type : 'category'
        }


        dispatch(modifyUserCeoInfo(body))
        .then(response => {
            if (response.payload.success) {
                setUserInfo(response.payload.userInfo)     
                setUserCeoInfo(response.payload.userCeoInfo)
                alert('정보 저장에 성공 했습니다.')
                setTag({...Tag, categoryTag: "span"})
            }else{
                alert('정보 저장에 실패 했습니다.')
            } 
        })
    }
    /*===================================================================*/

    /*=======================배달가능 여부 변경=============================*/ 
    const onRadioChange = e => {
        setnewDelivery(e.target.value);
    };

    const deliveryOnclickHandler = () =>{
        let body ={
            RestaurantDelivery  : newDelivery,
            BusinessNumber : UserCeoInfo.BusinessNumber,
            type : 'delivery'
        }


        dispatch(modifyUserCeoInfo(body))
        .then(response => {
            if (response.payload.success) {
                setUserInfo(response.payload.userInfo)     
                setUserCeoInfo(response.payload.userCeoInfo)
                alert('정보 저장에 성공 했습니다.')
                setTag({...Tag, deliveryTag: "span"})
            }else{
                alert('정보 저장에 실패 했습니다.')
            } 
        })        
    }
    /*===================================================================*/

    /*=======================주소지 변경=============================*/ 
    const addrOnclickHandler = () =>{
        let body ={
            isAddress  : isAddress,
            isAddressDetail : isAddressDetail,
            BusinessNumber : UserCeoInfo.BusinessNumber,
            Lat : Lat,
            Lon : Lon,
            type : 'addr'
        }


        dispatch(modifyUserCeoInfo(body))
        .then(response => {
            if (response.payload.success) {
                setUserInfo(response.payload.userInfo)     
                setUserCeoInfo(response.payload.userCeoInfo)
                alert('정보 저장에 성공 했습니다.')
                setTag({...Tag, addreTag: "span"})
            }else{
                alert('정보 저장에 실패 했습니다.')
            } 
        }) 
    }
    /*===================================================================*/
    

    return (
        <div style={{ width: '55%', margin: '3rem auto' }}>
            <div>
                <h1 style={{whiteSpace : 'nowrap' }}>음식점정보 상세페이지</h1>
                <hr></hr>
            </div>
        
            <Row  style={{ borderTop: '1px solid #E0E0E0' , borderBottom: '1px solid #E0E0E0' }}>
                
                {/* 음식정 이름 */}
                {
                    Tag.nameTag === 'span' &&
                    <Col span={18} push={6} style={colStyle}>
                    <span style={{lineHeight :'2.3'}}>{UserCeoInfo.RestaurantName}</span>    
                    <Button style={colButton} onClick={modifyHandler} value='1'>수정</Button>    
                    </Col>               
                }
               
               {
                    Tag.nameTag === 'Input'  &&
                    <Col span={18} push={6} style={colStyle}>
                    <Input style={{lineHeight :'2.3' , width:'70%'}} onChange={nameChangeHnadler} value={newNameInfo}></Input>    
                    <Button style={colButton} onClick={modifyHandler} value='1'>취소</Button>
                    <Button style={colButton} value={newNameInfo} onClick={nameOnclickHandler}>수정완료</Button>
                    </Col>
                }


                <Col style={colStyleFront} span={6} pull={18}>
                <span>음식점 이름</span>
                </Col>

                {/* 음식점 전화번호     */}
                {
                    Tag.hpTag === 'span' &&
                    <Col span={18} push={6} style={colStyle}>
                    <span style={{lineHeight :'2.3'}}>{UserCeoInfo.RestaurantHp}</span>
                        <Button style={colButton} onClick={modifyHandler} value='2'>수정</Button>
                    </Col>
                }
                
                {
                    Tag.hpTag === 'Input' &&
                    <Col span={18} push={6} style={colStyle}>
                    <Input value={newHpInfo} onChange={hpChangeHnadler} style={{lineHeight :'2.3' , width:'70%'}}></Input>    
                    <Button style={colButton} onClick={modifyHandler} value='2'>취소</Button>
                    <Button style={colButton} onClick={hpOnclickHandler} value={newHpInfo}>수정완료</Button>
                    </Col>
                }

                <Col style={colStyleFront} span={6} pull={18}>
                <span>음식점 전화번호</span>
                </Col>

                {/* 음식점 최소주문금액 */}
                {
                    Tag.priceTag === 'span' &&
                    <Col span={18} push={6} style={colStyle} >
                        <span style={{lineHeight :'2.3'}}  >
                            {formatPrice}
                        </span>
                        <Button style={colButton} onClick={modifyHandler} value='3'>수정</Button>
                    </Col>
                }

                {
                    Tag.priceTag === 'Input' &&
                    <Col span={18} push={6} style={colStyle}>
                    <InputNumber
                      style={{border:'1px solid' , width:'30%'}}
                      formatter={value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      onChange={priceChangeHnadler}
                    />
                    <Button style={colButton} onClick={modifyHandler} value='3'>취소</Button>
                    <Button style={colButton} onClick={priceOnclickHandler} value={newPriceInfo} >수정완료</Button>
                  </Col>
                }

                <Col style={colStyleFront} span={6} pull={18}>
                <span>최수주문금액</span>
                </Col>

                {
                    Tag.paymentTag === 'span' &&
                    <Col span={18} push={6} style={colStyle}>
                    <Checkbox.Group disabled style={{ width: '100%',lineHeight :'2.3'}} value={UserCeoInfo.RestaurantPayment}>
                        <Row>
                        <Col span={5}>
                            <Checkbox value="10">신용카드</Checkbox>
                        </Col>
                        <Col span={5}>
                            <Checkbox value="20">현금</Checkbox>
                        </Col>
                        <Col span={5}>
                            <Checkbox value="30">요기서결제</Checkbox>
                        </Col>
                        <Button style={colButton} onClick={modifyHandler} value='4'>수정</Button>
                        </Row>
                    </Checkbox.Group>
                    </Col>
                }

                {
                    Tag.paymentTag === 'Input' &&
                    <Col span={18} push={6} style={colStyle}>
                    <Checkbox.Group  onChange={paymentChangeHnadler} style={{ width: '100%',lineHeight :'2.3'}} value={newPaymentInfo}>
                        <Row>
                        <Col span={5}>
                            <Checkbox value="10">신용카드</Checkbox>
                        </Col>
                        <Col span={5}>
                            <Checkbox value="20">현금</Checkbox>
                        </Col>
                        <Col span={5}>
                            <Checkbox value="30">요기서결제</Checkbox>
                        </Col>
                        <Button style={colButton} onClick={modifyHandler} value='4'>취소</Button>
                        <Button style={colButton} onClick={paymentOnclickHandler} value={newPaymentInfo}>수정완료</Button>
                        </Row>
                    </Checkbox.Group>
                    </Col>
                }

                <Col style={colStyleFront} span={6} pull={18}>
                <span>결제수단</span>
                </Col>

                {
                    Tag.timeTag === 'span' &&  
                    <Col span={18} push={6} style={colStyle}>
                    <span style={{lineHeight :'2.3'}}>{UserCeoInfo.RestaurantStartTime}</span>
                    ~ 
                    <span style={{lineHeight :'2.3'}}>{UserCeoInfo.RestaurantEndTime}</span>
                    <Button style={colButton} onClick={modifyHandler} value='5'>수정</Button>
                    </Col>                    
                }

                {
                    Tag.timeTag === 'Input' &&
                    <Col span={18} push={6} style={colStyle}>
                        <Input 
                        style={{border:'1px solid' , width:'25%'}} type='time' 
                        onChange={startTimeChangeHnadler}
                        value={newStartTime}
                        />
                        ~
                        <Input 
                        style={{border:'1px solid' , width:'25%'}} type='time' 
                        onChange={endTimeChangeHnadler}
                        value={newEndTime}
                        />
                    <Button style={colButton} onClick={modifyHandler} value='5'>취소</Button>
                    <Button style={colButton} onClick={timeOnclickHandler} >수정완료</Button>
                    </Col> 
                }

                <Col style={colStyleFront} span={6} pull={18}>
                <span>영업시간</span>
                </Col>
                
                {
                    Tag.addreTag === 'span' &&
                    <Col span={18} push={6} style={colStyle}>
                        <span style={{lineHeight :'1.5'}}>{UserCeoInfo.isAddress}</span>
                        <br />
                        <span style={{lineHeight :'1.5'}}>{UserCeoInfo.isAddressDetail}</span>
                        <Button style={{marginTop:'-12px' , float:'right'}} onClick={modifyHandler} value='8'>수정</Button>
                    </Col>
                }

                {
                    Tag.addreTag === 'Input' &&
                    <Col span={18} push={6} style={colStyle}>
                        <Input 
                        style={{border:'1px solid' , width:'60%'}} type='text' 
                        value={isAddress}
                        placeholder = "동,면,읍"
                        />
                        <Button style={colButton} onClick={modifyHandler} value='8'>취소</Button>
                        <Button style={colButton} onClick={() =>{setVisible(true)}} >주소찾기</Button>

                        <Input 
                            style={{border:'1px solid' , width:'60%'}} type='text' 
                            value={isAddressDetail}
                            onChange = {addrDetailHandler}              
                            placeholder = "상세주소"
                        />
                        <Button style={{float : 'right'}} onClick={addrOnclickHandler}>수정완료</Button>
                    </Col>
                }



                <Col style={{height:'110px',backgroundColor : '#E0E0E0',padding: "35px" , borderBottom: '1px solid #0000001f'}}span={6} pull={18}>
                <span>음식점 주소</span>
                </Col>

                {
                    Tag.categoryTag === 'span' && 
                    <Col span={18} push={6} style={colStyle}>
                        <Select
                        disabled
                            showSearch
                            style={{ width: 200 }}
                            placeholder="선택해주세요"
                            optionFilterProp="children"
                            value={UserCeoInfo.RestaurantCategory}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            >
                            <Option value="13">분식</Option>
                            <Option value="14">중식</Option>
                            <Option value="4">치킨</Option>    
                            <Option value="2">한식</Option>   
                            <Option value="17">족발보쌈</Option>    
                            <Option value="1">피자양식</Option>        
                            <Option value="18">일식돈까스</Option>   
                            <Option value="368">카페디저트</Option>
                            <Option value="134">프랜차이즈</Option>
                        </Select>                   
                        <Button style={colButton} onClick={modifyHandler} value='6'>수정</Button>
                    </Col>
                }

                {
                    Tag.categoryTag === 'Input' &&  
                    <Col span={18} push={6} style={colStyle}>
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="선택해주세요"
                            optionFilterProp="children"
                            onChange={onChangeCategory}
                            value={newCategory}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            >
                            <Option value="13">분식</Option>
                            <Option value="14">중식</Option>
                            <Option value="4">치킨</Option>    
                            <Option value="2">한식</Option>   
                            <Option value="17">족발보쌈</Option>    
                            <Option value="1">피자양식</Option>        
                            <Option value="18">일식돈까스</Option>   
                            <Option value="368">카페디저트</Option>
                            <Option value="134">프랜차이즈</Option>
                        </Select>                   
                        <Button style={colButton} onClick={modifyHandler} value='6'>취소</Button>
                        <Button style={colButton} onClick={categoryOnclickHandler}>수정완료</Button>
                    </Col>
                }

                <Col style={colStyleFront} span={6} pull={18}>
                <span>업종 카테고리</span>
                </Col>

                {
                    Tag.deliveryTag === 'span' &&  
                        <Col span={18} push={6} style={colStyle}>
                            <Radio.Group  value={UserCeoInfo.RestaurantDelivery} disabled>
                                <Radio value={1}>배달+테이크아웃 가능</Radio>
                                <Radio value={2}>배달만 가능</Radio>           
                            </Radio.Group>
                            <Button style={colButton} onClick={modifyHandler} value='7'>수정</Button>
                        </Col>
                }

                {
                    Tag.deliveryTag === 'Input' &&  
                        <Col span={18} push={6} style={colStyle}>
                            <Radio.Group onChange={onRadioChange} value={newDelivery}>
                                <Radio value={1}>배달+테이크아웃 가능</Radio>
                                <Radio value={2}>배달만 가능</Radio>           
                            </Radio.Group>
                            <Button style={colButton} onClick={modifyHandler} value='7'>취소</Button>
                            <Button style={colButton} onClick={deliveryOnclickHandler}>수정완료</Button>
                        </Col>
                }

                

                <Col style={colStyleFront} span={6} pull={18}>
                <span>배달 가능 여부</span>
                </Col>

            </Row>

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
        </div>
    )
}

export default StoreRegisterModify
