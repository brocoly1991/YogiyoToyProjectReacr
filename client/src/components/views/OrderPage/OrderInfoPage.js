import React, { useEffect, useState } from 'react'
import { useDispatch ,useSelector} from 'react-redux';
import { Button,Progress, Card , Input} from 'antd';
import { getOrderNo } from '../../../_actions/order_action';
import menuNo1 from '../../../img/menuNo1.png'
import axios from "axios";
import moment from 'moment';
function OrderInfoPage(props) {
 
  const dispatch = useDispatch();
  const order = useSelector(state => state.order)
  const [percent, setpercent] = useState(0)
  const [Flag, setFlag] = useState(false)
  const [OrderNo, setOrderNo] = useState()
  const [OrderList, setOrderList] = useState([])
  const [ImgState, setImgState] = useState([])
  const [state, setstate] = useState({
      name:'',
      menuName:'',
      totalPrice : '',
      date : '',
      no : '',
      addr : '',
      tell : '',
      BusinessNumber : '',
      mail : '',
      status : 'A'
  })
  console.log( "s"  , ImgState)
  /*========주문번호 조회시 UI 핸들러함수===============*/
  const flagFuction = ()=>{

    let flag = Flag
    if(flag === true){
        flag = false
    }else{
      flag = true
    }
    setFlag(flag)
  }
  /* ============================================ */

  //주문번호 입력 핸들러
  const orderNoChangeHandler = (e)=>{
    setOrderNo(e.target.value)
  }

  //주문번호 조회버튼
  const orderInfoSerchHandler = ()=>{
    getOrderInfoAjax()
  }

  //DATE 포맷함수
  const formatTime = (value)=>{
    const format = "YYYY-MM-DD HH:mm"
    let date = new Date(value);
    let dateTime = moment(date).format(format);
    return dateTime
  }
  /* 주문상태 커스텀함수*/    
  const stausString = (value) =>{
    let str 
    if(value === 'A'){
      str = '접수중'
      setpercent(25)
    }else if(value === 'B'){
      str = '접수완료'
      setpercent(50)
    }else if(value === 'C'){
      str = '배달중'
      setpercent(75)
    }else if(value === 'D'){
      str = '배달완료'
      setpercent(100)
    }else{
      str = '주문취소'
    }

    return str
  }
  /* ======================== */

  /* =========================주문번호 조회 함수==========================*/
  const getOrderInfoAjax =()=>{
    dispatch(getOrderNo(OrderNo)).then(response => {

      if (response.payload.success) {        
          if(response.payload.order === null){        
          setstate({
            name:'',
            menuName:'',
            totalPrice : '',
            date : '',
            no : '',
            addr : '',
            tell : '',
            BusinessNumber : '',
            mail : '',
            status : 'A'
          })
          setFlag(false)

            alert("주문번호가 존재하지 않습니다 \n 주문번호를 확인후 다시 조회해 주세요")
            window.location.reload();
          }

          let body = {
            menuId :  response.payload.order.BusinessNumber,
          }
          axios.post('/api/business/getResInfo', body).then(response => {
            setImgState(response.data[0].RestaurantTitleImg)
          })

          let menuName

          if(response.payload.order.OrderList.length > 1){
            menuName = response.payload.order.OrderList[0].title + '외' + response.payload.order.OrderList.length
          }else{
            menuName = response.payload.order.OrderList[0].title
          }

          let returnTime = formatTime(response.payload.order.createdAt)
          let retunrStatus = stausString(response.payload.order.status)
          setOrderList([...response.payload.order.OrderList])

          setstate({
            name: response.payload.order.Name,
            menuName: menuName,
            totalPrice: response.payload.order.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
            date: returnTime,
            no: response.payload.order.no,
            addr: response.payload.order.buyer_addr,
            tell: response.payload.order.buyer_tel,
            BusinessNumber: response.payload.order.BusinessNumber,
            mail: response.payload.order.mail,
            status :retunrStatus
          })

          flagFuction()
      }else{
        alert("실패")
      }
    })
  }
  /* ===================================================================================================== */

  /* =============조회된 정보 랜더링함수 ======================*/
  const renderCards = OrderList.map((orderList, index) => {
    return (
      <Card key={index}>
      <h3 style={{float:'left' , marginRight:'1%',overflowWrap:'anywhere'}}>{orderList.title}</h3><h3>{orderList.cnt}개</h3>
      </Card>
    )
  })
  /* ======================================================== */

//가게보기
const goStoreClickHandler = () =>{
  props.history.push(`/clientMenuInfo/${state.BusinessNumber}`)
}


  return (
    // <div style={{display:'flex'}}>
    
      <div style={{ width: '85%', margin: '5rem auto' ,display:'block'}}>
        <div>
          <h1>주문정보 조회</h1>
          <div style={{display:'flex',minWidth:'1600px'}}>
            {/* <SearchOutlined style={{fontSize:'33px',marginRight:'1%',color:'red'}}/> */}
            <Input onChange={orderNoChangeHandler} value={OrderNo} style={{width : '20%'}} placeholder='주문번호를 입력하세요'></Input>
            <Button onClick={orderInfoSerchHandler} style={{color:'white',backgroundColor:'red'}}>조회</Button>
          </div>

          {Flag === true &&
          <div style={{minWidth:'450px',marginTop:'1%',width:'80%'}}>
            <Card style={{marginBottom:'1%'}}>
            {ImgState.length !== 0 ? 
              <img style={{border:'1px solid' ,height:'100px' ,float:'left',marginRight:'3%'}} src={`http://localhost:5000/${ImgState}`} />
             :
             <img style={{border:'1px solid' ,height:'100px' ,float:'left',marginRight:'3%'}} src={menuNo1} />
            }
            
            
                <h2>{state.name}</h2>
                <h3 style={{float:'left',marginRight:'2%'}}>{state.menuName}</h3><h3 >{state.totalPrice}원</h3>
                <Button>{state.status}</Button>
                <Button onClick={goStoreClickHandler}>가게보기</Button>
                {/* <Button>주문상세</Button> */}
                
                <div style={{marginTop:'1%'}}>
                  <Card>
                  <Progress style={{width:'50%'}} percent={percent} steps={4} strokeColor='red' />
                    <h1 style={{color:'red'}}>{state.status}</h1>
                    <h2>{state.name}</h2>
                    <span>{state.menuName}</span>
                    <br></br>
                    <span>주문일시 : {state.date}</span>
                    <br></br>
                    <span>주문번호 : {state.no}</span>
                  </Card>
                  <br></br>
                    {renderCards}
                  <Card><h2>총결제금액 : {state.totalPrice}원</h2></Card>
                  <br></br>
                  <Card>
                    <h3>배달주소 : {state.addr}</h3>
                    <hr></hr>
                    <h3>전화번호 : {state.tell}</h3>
                  </Card>
                </div>
            </Card>
          </div>
        }

        </div>

      </div>

  )
}

export default OrderInfoPage
