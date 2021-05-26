import React, { useEffect, useState } from 'react'
import { Tabs,Rate,Checkbox, Card  ,Row ,Input} from 'antd';
import { PlusOutlined,MinusOutlined,CloseOutlined } from '@ant-design/icons';
import MenuTabMenu from '../ClientMenu/ClientMenuTabMenu';
import { menuOrderStorage } from "../../../_actions/menu_action";
import { useDispatch,useSelector} from "react-redux";
import ClientMenuTabReview from './ClientMenuTabReview';
import Map from '../../utils/Map'
import './ClientMenuInfoPageCss.css';
import axios from "axios";
import { DeleteOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { TextArea } = Input;
function ClientMenuInfoPage(props) {
    const review = useSelector(state => state.review)
    const dispatch = useDispatch();
    const tabSize = 0
    const menuId = props.match.params.menuId
    const [ReviewRate, setReviewRate] = useState()
    const [Flag, setFlag] = useState(false)
    const [ImgState, setImgState] = useState([])
    const [ReviewState, setReviewState] = useState()
    const [state, setstate] = useState({})
    const [PayMent, setPayMent] = useState([])
    const [ComPrice, setComPrice] = useState()
    const [OrderList, setOrderList] = useState([])
    const [NewOrderList, setNewOrderList] = useState([])
    const [TotalPirce, setTotalPirce] = useState(0)
    const [NewPush, setNewPush] = useState(false)
    const [AreaList, setAreaList] = useState([])
    let updateOrderList = []
    let totalPrice = 0
    let orderExist = JSON.parse(window.localStorage.getItem("order")) ? JSON.parse(window.localStorage.getItem("order")) : ''

    /*================== 해당사업장에 등록되어진 리뷰 정보를 가져오는 함수 ================== */
    useEffect(() => {   
        getReiveList(menuId)
    },[review])

    const getReiveList = (val)=>{
        let reviewCnt = 0
        let body = {
            BusinessNumber : val
        }
        
        // dispatch(getReviewList(body)).then(response => {
        axios.post(`/api/business/getReviewList` ,body).then(response => {
            if (response.data.success) {
                setReviewState(response.data.review)
                response.data.review.forEach((list,index) =>{         
                    reviewCnt = reviewCnt + list.rate
                })
                if(reviewCnt > 0){
                    setReviewRate((reviewCnt /response.data.review.length).toFixed(1))
                }else{
                    setReviewRate(0)
                }
            }else{
                window.location.reload()
            }
        })
    }
    /*============================================================================ */

    /*================= 리뷰 badge 설정함수======================================================== */
    const renderCnt =(val)=>{
        // return Number(ReviewRate)
        if(val !== undefined){
            return (
                <div style={{display:'flex'}}>
                    <Rate disabled defaultValue={Number(val)} /><span style={{padding:'4.5px'}}>({ReviewRate})</span>
                </div>
            )
        }
    }
    /*=============================================================================================== */

    /* 페이지 최초 접근시 만약 주문표에 정보가 담겨있었다면 기존정보를 가져오기위한 로직 */
    useEffect(() => {

        //사업장 정보및 배달지역 을 가져오기위한 함수 getResInfo()
        getResInfo(menuId)
        if(orderExist.length > 0){
         
            orderExist.forEach((list,index) =>{
                updateOrderList.push({
                    id : list.id,
                    title : list.title,
                    price : list.price,
                    cnt : list.cnt , 
                    BusinessNumber : list.BusinessNumber
                })
                setOrderList([...OrderList ,...updateOrderList]) 
            })
             setTotalPirce(window.localStorage.getItem("orderPrice")) 
             setComPrice(JSON.parse(window.localStorage.getItem("orderMinPrice")))
             setFlag(true)
        }
    }, [])

    const getResInfo = (menuId)=>{

        let body = {
            menuId : menuId,
        }
        axios.post('/api/business/getResInfo', body)
        .then(response => {
            setstate(response.data[0])
            setImgState(response.data[0].RestaurantTitleImg)
            setAreaList(response.data[0].RestaurantAreaInfo)
            if(JSON.parse(window.localStorage.getItem("order")).length > 0){
                setComPrice(JSON.parse(window.localStorage.getItem("orderMinPrice")))
            }else{
                let statePrice = response.data[0].RestaurantPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                setComPrice(statePrice)
            }
            setPayMent(response.data[0].RestaurantPayment[0])
        })
        // .catch(err => alert(err))
        .catch(err => getResInfo(menuId))        
    }

    /*================================================================================ */

    useEffect(() => {
        window.localStorage.setItem("order", JSON.stringify(OrderList));
        dispatch(menuOrderStorage(JSON.parse(window.localStorage.getItem("order")).length))
    }, [OrderList])

    useEffect(() => {
        window.localStorage.setItem("orderPrice", JSON.stringify(Number(TotalPirce))); 
    }, [TotalPirce])

    useEffect(() => {
        window.localStorage.setItem("orderMinPrice", JSON.stringify(ComPrice)); 
    }, [ComPrice])

    /* 
         주문표에 메뉴를 등록하는 함수 
         주문표에는 다른 사업장의 메뉴를 동시에 등록할수없다 .ex) a피자사업장에서 메뉴를 주문표에 등록한후 b치킨집사업장의 메뉴를동시에 등록할수없다
         주문표에는 동일한 사업장의 메뉴만 등록할 수 있다.      
    */
    const updateOrder = (id,title,price)=>{

        //기존 주문표 정보가있는지확인
        if(orderExist.length >0){

            window.localStorage.setItem("orderMenuId", JSON.stringify(Number(orderExist[0].BusinessNumber)));
            // 기존 주문표의 사업장  = orderExist[0].BusinessNumber , 현제 페이지의 사업장 = menuId
            if(orderExist[0].BusinessNumber != menuId){
                return alert("다른 음식점에서 이미 담은 메뉴가 있습니다.  \n담긴 메뉴를 취소하고 메뉴를 담아주세요")
            }

        }else{
            window.localStorage.setItem("orderMenuId", JSON.stringify(Number(menuId)));
        }

        setFlag(true)
        let flag = false;
        totalPrice = Number(TotalPirce) + price
        setTotalPirce(totalPrice)

        //동일한 메뉴를 주문표에 등록시 갯수를 올려준다 ex> 양념치킨이 등록되어있는대 또다시 등록시 리스트 추가가아닌 기존리스트의 양념치킨+1
        OrderList.forEach((list,index)=>{
            if(list.id === id){
                list.cnt++
                flag = true
                setOrderList([...OrderList])
            }
        })

        //새로운 메뉴 주문표에 등록
        if(!flag){
            updateOrderList.push({
                id : id,
                title : title,
                price : price,
                BusinessNumber : state.BusinessNumber,
                cnt : 1
            })
            setOrderList([...OrderList ,...updateOrderList])          
        }
    }

    /* 주문표 내의 +,-,x 각각의 icon을통해 주문표의 합계 주문금액을 계산 계산된 값은 setTotalPirce() 에 셋팅*/
 
    //주문표의 + 버튼 함수
    const plusButton=(id,price,cnt)=>{
        OrderList.forEach((list,index)=>{ 
            if(list.id === id){               
                list.cnt++
                setOrderList([...OrderList])
            }
        })

        totalPrice = Number(TotalPirce) + price
        setTotalPirce(totalPrice)
    } 

    //주문표의 - 버튼함수
    const minusButton=(id,price,cnt)=>{

        if(cnt == 1){
           return 
        }
        OrderList.forEach((list,index)=>{            
            if(list.id === id){
                list.cnt--
                setOrderList([...OrderList])
            }
        })
        totalPrice = Number(TotalPirce) - price
        setTotalPirce(totalPrice)
    } 

    //주문표의 x 삭제버튼 함수 
    const deleteButton=(id,price,cnt,index)=>{
        totalPrice = Number(TotalPirce) - price*cnt
        setTotalPirce(totalPrice)
        let newOrderList = [...OrderList]
        newOrderList.splice(index, 1)
        setOrderList([...newOrderList])

        if(OrderList.length === 1){
            localStorage.removeItem('order');
            localStorage.removeItem('orderPrice');
            localStorage.removeItem('orderMinPrice');
            localStorage.removeItem('orderMenuId');
            // getResInfo(menuId)
            setFlag(false)
        }
    } 

    //주문표 전체정보 삭제 함수
    const clearHander = ()=>{
        localStorage.removeItem('order');
        localStorage.removeItem('orderPrice');
        localStorage.removeItem('orderMinPrice');
        localStorage.removeItem('orderMenuId');
        setOrderList([])
        setTotalPirce(0)
        setFlag(false)
    }

    /* ========================================================================= */

    /* 주문하기 버튼클릭시 결제페이지로 이동하는 함수 만약 유저가 결제페이지로 url찍고 강제이동하는걸 방지하기위해 state설정*/
    const orderClickHandler =()=>{

        if(Number(TotalPirce) <  state.RestaurantPrice){
            return alert("이 음식점의 최소 주문 금액은 " +ComPrice+"원 입니다.")
        }
        
        props.history.push({
            pathname : "/orderPage",
            state : {
                OrderList : OrderList,
                name: state.RestaurantName,
                number : state.BusinessNumber       
            }
        })
    }
    /* ======================================================================== */

    /* =====================정보텝의 배달가능지역 정보 커스텀함수========================*/
    const renderAreaList = AreaList.map((arryList, index) => {
        let Arry = [] 
            if(arryList === "11110"){
                Arry.push("종로구,")
            }else if(arryList === "11200"){
                Arry.push("성동구,")
                
            }else if(arryList === "11590"){
                Arry.push("동작구,")
                
            }else if(arryList === "11170"){
                Arry.push("용산구,")
                
            }else if(arryList === "11740"){
                Arry.push("강동구,")
                
            }else if(arryList === "11320"){
                Arry.push("도봉구,")
                
            }else if(arryList === "11545"){
                Arry.push("금천구,")
                
            }else if(arryList === "11380"){
                Arry.push("은평구,")
                
            }else if(arryList === "11260"){
                Arry.push("중랑구,")
                
            }else if(arryList === "11680"){
                Arry.push("강남구,")
                
            }else if(arryList === "11560"){
                Arry.push("영등포구,")
                
            }else if(arryList === "11440"){
                Arry.push("마포구,")
                
            }else if(arryList === "11215"){
                Arry.push("광진구,")
                
            }else if(arryList === "11140"){
                Arry.push("중구,")
                
            }else if(arryList === "11410"){
                Arry.push("서대문구,")
                
            }else if(arryList === "11650"){
                Arry.push("서초구,")
                
            }else if(arryList === "11230"){
                Arry.push("동대문구,")
                
            }else if(arryList === "11530"){
                Arry.push("구로구,")
                
            }else if(arryList === "11710"){
                Arry.push("송파구,")
                
            }else if(arryList=== "11470"){
                Arry.push("양천구,")
                
            }else if(arryList === "11350"){
                Arry.push("노원구,")
                
            }else if(arryList === "11290"){
                Arry.push("성북구,")
                
            }else if(arryList === "11500"){
                Arry.push("강서구,")
                
            }else if(arryList === "11620"){
                Arry.push("관악구,")
                
            }else if(arryList === "11305"){
                Arry.push("강북구,")
            }
            return Arry
    })
     /* ================================================================================================= */
    
    /* =====================================주문표 메뉴리스트 랜더링 함수==================================== */
    const renderOrderList = OrderList.map((list,index) =>{
        let comPrice = list.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return <Card style={{textAlign:'left'}} >
                <span style={{color:'black',fontSize:'large',overflowWrap:'anywhere'}}>{list.title} </span>
                <br></br><br></br>
                <CloseOutlined style={{border:'1px solid',fontSize:'large',cursor:'pointer'}}
                    onClick={()=>{deleteButton(list.id,list.price,list.cnt,index)}}
                />
                &nbsp;<span style={{fontSize:'large'}}>{comPrice}원</span>
                <div style={{float:'right',fontSize:'large'}}>
                <PlusOutlined style={{border:'1px solid',color:'red',cursor:'pointer'}}
                    onClick={()=>{plusButton(list.id,list.price,list.cnt)}}
                />
                <span>&nbsp;{list.cnt}&nbsp;</span>
                <MinusOutlined style={{border:'1px solid',color:'red',cursor:'pointer'}}
                    onClick={()=>{minusButton(list.id,list.price,list.cnt)}}
                />
                </div>
               </Card>
    })
    /* ================================================================================================= */

    return (
        <div>
            {Flag === false &&
                <div className="orderTableDiv" style={{ float:'right',width:'30%',marginRight:'5%',marginTop:'1%'}}>
                    <Card style={{backgroundColor:'black'}}><span style={{color:'white',fontSize:'x-large'}}>주문표</span></Card>
                    <Card style={{height:'150px',padding:'10%',textAlign:'center'}}><span style={{color:'black',fontSize:'large'}}>주문표에 담긴 메뉴가 없습니다.</span></Card>
                    <br></br>
                    <button style={{width:'100%',height:40,fontSize:'large',color:'white',backgroundColor:"#ccc"}}>주문하기</button>
                </div>
            }

            {Flag === true && 
                <div className="orderTableDiv" style={{ float:'right',width:'30%',marginRight:'5%',marginTop:'1%'}}>
                    <Card style={{backgroundColor:'black'}}><DeleteOutlined style={{fontSize:'30px' ,color:'white',float:'right'}}onClick={clearHander}/><span style={{color:'white',fontSize:'x-large'}}>주문표</span></Card>
                    <div style={{overflowY:'scroll',maxHeight:'350px'}}>
                    {renderOrderList}
                    </div>
                    
                    <Card style={{height:'50px',textAlign:'right',backgroundColor:'#f3f3f3'}}><span style={{color:'black',fontSize:'large'}}>최소주문금액:{ComPrice} 원</span></Card>
                    <Card style={{height:'50px',textAlign:'right',backgroundColor:'#fff8eb'}}><span style={{color:'#fa0050',fontSize:'large'}}>합계:{TotalPirce.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</span></Card>
                    {/* <Card style={{height:'50px',textAlign:'right',backgroundColor:'#f3f3f3'}}><span style={{color:'black',fontSize:'large'}}>최소주문금액:{state.RestaurantPrice}원</span></Card> */}
                    {/* <Card style={{height:'50px',textAlign:'right',backgroundColor:'#fff8eb'}}><span style={{color:'#fa0050',fontSize:'large'}}>합계:{TotalPirce}원</span></Card> */}
                    <br></br>
                    <button onClick={orderClickHandler} style={{width:'100%',height:40,fontSize:'large',color:'white',backgroundColor:"#fa0050",cursor:'pointer'}}>주문하기</button>
                </div> 
            }
   
            <div style={{ width: '55%', margin: '3rem auto' ,marginLeft:'5%'}}>
                <div style={{border: '4px solid #d9d9d9'}}>
                    <Card lg={12} xs={24} style={{overflow: 'auto'}}>
                            <h2 style={{fontWeight:'bold'}}>{state.RestaurantName}</h2>
                            <hr></hr>
                            <div style={{float:'left'}}>
                            {state.RestaurantTitleImg === undefined ? 
                            <h1>Loading...</h1>
                            : 
                            <img style={{ minWidth: '200px', width: '200px', height: '180px' ,border : '1px solid'}}
                            src={`http://localhost:5000/${state.RestaurantTitleImg}`}  
                            /> 
                            
                            }
                            </div>

                            <div style={{ padding : '1%' , minWidth: '200px', width: '400px', height: '180px', float: 'left' ,marginLeft : '2%' ,fontSize :'large'}}>
                                {renderCnt(ReviewRate)}
                                <p>최소주문금액 : &nbsp;
                                    { state.RestaurantPrice && 
                                            state.RestaurantPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    }
                                원</p>
                                <p>결제 : &nbsp;
                                <Checkbox.Group disabled value={PayMent} >
                                    <Row>
                                        <Checkbox value="10">신용카드</Checkbox>
                                        <Checkbox value="20">현금</Checkbox>
                                        <Checkbox value="30">요기서결제</Checkbox>
                                    </Row>
                                </Checkbox.Group>
                                </p>                       
                                <p>배달 가능 여부 : &nbsp;
                                    { state.RestaurantDelivery === 1 &&
                                        '배달만 가능'
                                    }
                                    { state.RestaurantDelivery === 2 &&
                                        '배달+테이크아웃 가능'
                                    }
                                </p> 
                            </div>
                    
                    </Card> 

                    <Tabs defaultActiveKey="1" tabBarGutter={tabSize} style={{}}> 
                        <TabPane  tab="메뉴" key="1" >
                            <MenuTabMenu cbFunction={updateOrder} BusinessNumber = {state.BusinessNumber}/>
                        </TabPane>
                        <TabPane  tab="클린리뷰" key="2">
                            <ClientMenuTabReview BusinessNumber = {state.BusinessNumber} state = {ReviewState}/>
                        </TabPane>
                        <TabPane tab="정보" key="3">
                        <div>
                            <br></br>
                            <h2>사장님 알림</h2>
                            <hr></hr>
                            { state.RestaurantDialog === 'N' &&
                                <TextArea value='찾아주셔서 감사합니다^^'/>
                            }
                            { state.RestaurantDialog !== 'N' &&
                                <TextArea value={state.RestaurantDialog}/>
                            }
                            <br></br><br></br>
                            
                            <h2>업체정보</h2>
                            <hr></hr>
                            <h3>영업시간 :<span>{state.RestaurantStartTime} ~ {state.RestaurantEndTime}</span> </h3>
                            <h3>전화번호 :<span>{state.RestaurantHp}</span></h3>
                            <h3>주소 :<span>{state.isAddress} / {state.isAddressDetail}</span></h3>
                            <h3>배달가능지역 : {renderAreaList}</h3>
                            <br></br>
                            <h2>사업자정보</h2>
                            <hr></hr>
                            <h3>상호명 :<span>{state.RestaurantName}</span></h3>
                            <h3>사업자등록번호 :<span>{state.BusinessNumber}</span></h3>
                            <br></br>
                        </div>
                        {/* 정보탭 지도 정보 */}
                        <Map Lat={state.Lat} Lon={state.Lon}/>
                        </TabPane>
                    </Tabs>
                </div>            
            </div>

        </div>
    )
}
export default ClientMenuInfoPage
