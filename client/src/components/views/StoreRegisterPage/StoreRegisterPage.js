import React, { useState }  from 'react'
import { Row,Col,Checkbox,Input,InputNumber,Radio,Select, Button ,Modal } from 'antd';
import DaumPostcode from 'react-daum-postcode';
import Axios from 'axios';
import Sms from '../../utils/Sms'
const { daum } = window;
function StoreRegisterPage(props) {

  const [BusinessNumber, setBusinessNumber] = useState("")
  const [BusinessHpNumber, setBusinessHpNumber] = useState("")
  const [BusinessName, setBusinessName] = useState("")
  const [RestaurantName, setRestaurantName] = useState("")
  const [RestaurantHp, setRestaurantHp] = useState("")
  const [RestaurantPrice, setRestaurantPrice] = useState(1000)
  const [RestaurantStartTime, setRestaurantStartTime] = useState()
  const [RestaurantEndTime, setRestaurantEndTime] = useState()
  const [RestaurantDelivery, setRestaurantDelivery] = useState(1)
  const [RestaurantCategory, setRestaurantCategory] = useState()
  const [RestaurantPayment, setRestaurantPayment] = useState([])
  const [RestaurantImg, setRestaurantImg] = useState([])
  const [RestaurantImg2, setRestaurantImg2] = useState([])
  const [FlagAgr, setFlagAgr] = useState(false)
  const [FlagDup, setFlagDup] = useState(false)
  const [FalgAuth, setFalgAuth] = useState(false)
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [isAddress, setIsAddress] = useState("");
  const [isZoneCode, setIsZoneCode] = useState();
  const [isPostOpen, setIsPostOpen] = useState()
  const [isAddressDetail, setisAddressDetail] = useState()
  const [Lat, setLat] = useState()
  const [Lon, setLon] = useState()
  const { Option } = Select;

  const colStyle = {
    borderTop: "1px solid #E0E0E0",
    height: "52px",
    padding: "2.5%"
  }

  const colStyleFront = {
    backgroundColor : '#E0E0E0' ,
    padding: "3%" , 
    borderBottom: '1px solid #0000001f'
  }
  const postCodeStyle = {
    // display: "block",
    // position: "absolute",
    // top: "50%",
    // width: "400px",
    // height: "500px",
    // padding: "7px",
  };


  //숫자만 입력
  const numberFormat= (e) =>{

    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    } 
  }


  /*주소찾기 관련 함수=========================================================================*/ 
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
        console.log("result" , result)
        setLat(result.lat) 
        setLon(result.lon)
    });

      setIsZoneCode(data.zonecode);
      setIsAddress(fullAddress);
      setIsPostOpen(false);
  };


  const addrDetailHandler =(event) =>{
    setisAddressDetail(event.currentTarget.value)
  }
  /*========================================================================================*/

  /*사업자번호 관련 함수======================================================================*/
  const businessNumberChangeHandler = (event) =>{
    setFlagDup(false)
    setBusinessNumber(event.currentTarget.value)
    // setBusinessNumber(event.currentTarget.value)
    //   if(checkCorporateRegiNumber(event.currentTarget.value)){
    //     setBusinessNumber(event.currentTarget.value)
    //   }else{
        
    //   }
  }
  
  //사업자 번호 유효성검사 함수
  function checkCorporateRegiNumber(number){
      
    var numberMap = number.replace(/-/gi, '').split('').map(function (d){
      return parseInt(d, 10);
    });
    
    if(numberMap.length == 10){
      var keyArr = [1, 3, 7, 1, 3, 7, 1, 3, 5];
      var chk = 0;
      var result =0;
      keyArr.forEach(function(d, i){
        chk += d * numberMap[i];
      });
      
      chk += parseInt((keyArr[8] * numberMap[8])/ 10, 10);

      result = Math.floor(numberMap[9]) === ( (10 - (chk % 10) ) % 10);    

      if(!result){
        alert("유효하지 않은 사업자번호입니다.")
        return false;
      }
      //return Math.floor(numberMap[9]) === ( (10 - (chk % 10) ) % 10);    
      return true
    }
    
    return false;
  }

    //사업자 번호 중복검사
    const dupClickHandler =()=>{
      if(BusinessNumber.length < 10){
        return alert("사업자번호는 10글자입니다.")
      }
  
      let body = {
        BusinessNumber : BusinessNumber
      }
      Axios.post('/api/business/dupBusinessNumberCk', body)
      .then(response => {
        if (response.data.success) {
            setFlagDup(true)
            alert("가능")
        } else {
          setFlagDup(false)
          alert("불가능")
        }
      })
    }
  /*========================================================================================*/

  /*onChange handler =======================================================================*/
  const businessHpChangeHandler = (event) =>{
    setBusinessHpNumber(event.currentTarget.value)
  }

  const businessNameChangeHandler = (event) =>{
    setBusinessName(event.currentTarget.value)
  }

  const restaurantNameChangeHandler =(event) =>{
    setRestaurantName(event.currentTarget.value)
  }

  const restaurantHpChangeHandler =(event) =>{
    setRestaurantHp(event.currentTarget.value)
  }

  function onChangePrice(value) {
    setRestaurantPrice(value)
  }

  function onChangeCheckBox(value) {
    setRestaurantPayment(value)
  }
  
  function onChangeCategory(value) {
    setRestaurantCategory(value)
  }

  
  const startTimeHandler= (value) => {
    setRestaurantStartTime(value.currentTarget.value)
  }

  const endTimeHandler= (value) => {
    setRestaurantEndTime(value.currentTarget.value)
  }
  
  const onRadioChange = e => {
    setRestaurantDelivery(e.target.value);
  };

  const updateFlag = (value)=>{
    setFalgAuth(value)
  }
  /*========================================================================================*/

  //개인정보 수집 및 동의완료
  function onChange(e) {
    if(e.target.checked){
      setFlagAgr(true)
    }else{
      setFlagAgr(false)
    }
  }

  /*휴대폰 번호 인증 관련함수=================================================================*/
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
    setVisible2(true)

  }
  /*========================================================================================*/

  /*submitClickHandler 입점 신청 완료시 함수===========================================================================*/ 
  const submitClickHandler =() =>{

    if (!FlagAgr) {
      return alert("개인정보 수집 및 이용에 동의해주세요")
    }

    if (!FlagDup) {
      return alert("사업자번호 중목검사를 진행해주세요")
    }

    if (!FalgAuth) {
      return alert("사업자휴대폰번호 인증을 완료하여 주세요")
    }
    
    if (!BusinessNumber || !BusinessName || !BusinessHpNumber || !RestaurantName || 
        !RestaurantHp || !RestaurantPrice || !RestaurantStartTime || !RestaurantEndTime || !isAddress || !isAddressDetail || !RestaurantCategory ||RestaurantPayment.length === 0) {
      return alert("모든 값을 넣어주셔야 합니다.")
    }

    if (RestaurantCategory === undefined || RestaurantCategory === 'undefined' || RestaurantCategory === null) {
      return alert("모든 값을 넣어주셔야 합니다.")
    }
  
    const body = {
      BusinessNumber : BusinessNumber,
      BusinessHpNumber : BusinessHpNumber,
      BusinessName : BusinessName,
      BusinessImg : RestaurantImg,
      BusinessImg2 : RestaurantImg2,
      RestaurantName : RestaurantName,
      RestaurantHp : RestaurantHp,
      RestaurantPrice : RestaurantPrice,
      RestaurantStartTime : RestaurantStartTime,
      RestaurantEndTime : RestaurantEndTime,
      RestaurantDelivery : RestaurantDelivery,
      RestaurantCategory : RestaurantCategory,
      RestaurantPayment : RestaurantPayment,
      isAddress : isAddress,
      isAddressDetail : isAddressDetail,
      Lat : Lat,
      Lon : Lon
    }

    Axios.post('/api/business/newenroll', body)
    .then(response => {
        if (response.data.success) {
          
            alert('정보 저장에 성공 했습니다.')
            props.history.push('/')
        } else {
            alert('정보 저장에 실패 했습니다.')
        }
    })

  }
  /*========================================================================================*/

  return (
    <div style={{ width: '55%', margin: '3rem auto' }}>

      <div>
        <h1 style={{whiteSpace : 'nowrap' }}>온라인 입점신청</h1>
        <p>운영중인 음식점을 요기요에 신청하세요. 온라인 입점신청 중 어려움이 있으시면 고객센터(1661-5270)로 연락주세요</p>
        <hr></hr>
      </div>

      <div style={{ margin: '1rem auto' ,whiteSpace : 'nowrap' }}>
        <h2 style={{display: 'contents'}}>사업자 정보</h2>
        <span style={{marginLeft: '5px',marginTop: '7px'}}>
          <em style={{color : 'red' ,marginRight: '5px'}}>*</em>필수 입력 정보
        </span>
      </div>

      
      <Row  style={{ borderTop: '1px solid #E0E0E0' , borderBottom: '1px solid #E0E0E0' }}>

          <Col span={18} push={6} style={colStyle}>
            <Input 
              id="businessNumber"
              style={{border:'1px solid' , width:'60%'}} type='text'
              placeholder="사업자번호를 ( - ) 업이 입력하세요"
              onChange={businessNumberChangeHandler} 
              maxLength = {10}           
              onKeyPress = {numberFormat}
              value = {BusinessNumber}              
            >
            </Input>
            <Button onClick={dupClickHandler}>중복검사</Button>                        
          </Col>
          <Col style={colStyleFront} span={6} pull={18}>
            <span>사업자 번호</span>
          </Col>

          <Col span={18} push={6} style={colStyle}>
            <Input style={{border:'1px solid' , width:'60%'}} type='text'
                    value={BusinessName}
                    onChange={businessNameChangeHandler} 
              />
          
          </Col>
          <Col style={colStyleFront} span={6} pull={18}>
            <span>사업주명</span>
          </Col>

          <Col span={18} push={6} style={colStyle}>
            <Input 
              style={{border:'1px solid' , width:'60%'}} type='text'
              onChange={businessHpChangeHandler} 
              value={BusinessHpNumber} 
              placeholder="사업자휴대폰번호를 ( - ) 업이 입력하세요"
              onKeyPress = {numberFormat}
              maxLength = {11}           
            ></Input>
          </Col>
          <Col style={colStyleFront} span={6} pull={18}>
            <span>사업자 휴대폰 번호</span>
          </Col>

          <Col span={18} push={6} style={colStyle}>
          {/* <Input  style={{border:'1px solid' , width:'60%'}} type='text'
              value={Certification}
              onChange={certificationChangeHandler} 
              onKeyPress = {numberFormat}
            /> */}
            <Button onClick={authClickHandler}>휴대폰인증하기</Button>
          </Col>
          <Col style={colStyleFront} span={6} pull={18}>
            <span>인증번호</span>
          </Col>

      </Row>

      <div style={{ margin: '1rem auto' ,whiteSpace : 'nowrap' }}>
        <h2 style={{display: 'contents'}}>음식점 정보</h2>
        <span style={{marginLeft: '5px',marginTop: '7px'}}>
          <em style={{color : 'red' ,marginRight: '5px'}}>*</em>필수 입력 정보
        </span>
      </div>

      <Row  style={{ borderTop: '1px solid #E0E0E0' , borderBottom: '1px solid #E0E0E0' }}>

          <Col span={18} push={6} style={colStyle}>
          <Input  style={{border:'1px solid' , width:'60%'}} type='text'
                   value={RestaurantName}
                   onChange={restaurantNameChangeHandler}
            />
          </Col>
          <Col style={colStyleFront} span={6} pull={18}>
            <span>음식점 이름</span>
          </Col>

          <Col span={18} push={6} style={colStyle}>
            <Input  style={{border:'1px solid' , width:'60%'}} type='text'
                   value={RestaurantHp}
                   onChange={restaurantHpChangeHandler} 
                   onKeyPress = {numberFormat}
            />
          </Col>
          <Col style={colStyleFront} span={6} pull={18}>
            <span>음식점 전화번호</span>
          </Col>

          <Col span={18} push={6} style={colStyle}>
            <InputNumber
              style={{border:'1px solid' , width:'30%'}}
              defaultValue={RestaurantPrice}
              formatter={value => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onChange={onChangePrice}
            />
          </Col>
          <Col style={colStyleFront} span={6} pull={18}>
            <span>최수주문금액</span>
          </Col>

          <Col span={18} push={6} style={colStyle}>
          <Checkbox.Group style={{ width: '100%' }} onChange={onChangeCheckBox} value={RestaurantPayment}>
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
            </Row>
          </Checkbox.Group>
          </Col>
          <Col style={colStyleFront} span={6} pull={18}>
            <span>결제수단</span>
          </Col>

          <Col span={18} push={6} style={colStyle}>
            <Input 
              style={{border:'1px solid' , width:'25%'}} type='time' 
              onChange = {startTimeHandler}
            />
            ~
            <Input 
              style={{border:'1px solid' , width:'25%'}} type='time' 
              onChange = {endTimeHandler}
            />
          </Col>
          <Col style={colStyleFront} span={6} pull={18}>
            <span>영업시간</span>
          </Col>

         <Col span={18} push={6} style={colStyle}>
            <Input 
              style={{border:'1px solid' , width:'60%'}} type='text' 
              value={isAddress}
              placeholder = "동,면,읍"
            />   
            <Button type="primary" onClick={() =>{setVisible(true)} }>
              주소찾기
            </Button> 
            <Input 
              style={{border:'1px solid' , width:'60%'}} type='text' 
              value={isAddressDetail}
              onChange = {addrDetailHandler}              
              placeholder = "상세주소"
            />  
          </Col>
          <Col style={{height:'100px',backgroundColor : '#E0E0E0',padding: "3%" , borderBottom: '1px solid #0000001f'}}span={6} pull={18}>
            <span>음식점 주소</span>
          </Col>

          <Col span={18} push={6} style={colStyle}>
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="선택해주세요"
              optionFilterProp="children"
              onChange={onChangeCategory}
              value={RestaurantCategory}
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
          </Col>
          <Col style={colStyleFront} span={6} pull={18}>
            <span>업종 카테고리</span>
          </Col>

          <Col span={18} push={6} style={colStyle}>
          <Radio.Group onChange={onRadioChange} value={RestaurantDelivery}>
            <Radio value={1}>배달+테이크아웃 가능</Radio>
            <Radio value={2}>배달만 가능</Radio>           
          </Radio.Group>
          </Col>
          <Col style={colStyleFront} span={6} pull={18}>
            <span>배달 가능 여부</span>
          </Col>

        </Row>
        <br />
        <Checkbox onChange={onChange}>개인정보 수집 및 이용에 동의합니다.(필수)</Checkbox>
        <br /><br />
        <Button 
          type="primary"
          onClick={submitClickHandler}

        >입점 신청 완료
        </Button>
        <Modal
          title="주소찾기"
          centered
          visible={visible}
          onOk={() => setVisible(false)}
          onCancel={() => setVisible(false)}
        >
          <DaumPostcode style={postCodeStyle} onComplete={handleComplete} />
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
}

export default StoreRegisterPage
