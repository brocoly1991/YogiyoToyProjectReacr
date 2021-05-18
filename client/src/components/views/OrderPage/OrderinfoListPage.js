import React, { useEffect, useState } from 'react'
import { useDispatch ,useSelector} from 'react-redux';
import FileUpload from '../../utils/FileUpload'
import { Modal,Button,Progress, Card , Input ,Rate } from 'antd';
import { getOrderList } from '../../../_actions/order_action';
import {getReviewList} from '../../../_actions/review_action'
import Axios from 'axios';
import moment from 'moment';
import { WindowsFilled } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
const { TextArea } = Input;
function OrderinfoListPage(props) {
    const dispatch = useDispatch();
    const order = useSelector(state => state.order)
    const _id = localStorage.getItem("userId")
    const [visible, setVisible] = useState(false);
    const [rate, setrate] = useState(0)
    const [Images, setImages] = useState([])
    const [Des, setDes] = useState()
    const [ReviewInfo, setReviewInfo] = useState({
        no : '',
        title : ''
    })   
    const [ReviewVisisble, setReviewVisisble] = useState(false)
    const userId = localStorage.getItem("userId")
    const [OrderList, setOrderList] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(4)
    const [PostSize, setPostSize] = useState(0)
    let [detailOrderInfoState, setdetailOrderInfoState] = useState({});
    let [detailOrderInfoListState, setdetailOrderInfoListState] = useState([]);
    let [hitBottom, sethitBottom] = useState(false);

   /* 화면이끝에닿을떄 버그발생 일단보류
    useEffect(() => {

          //화면이 끝에 닿으면 추가정보를 로드하기위해 htbottom을 true로 
        const onScroll = () => {
            if (
              window.scrollY + document.documentElement.clientHeight >
              document.documentElement.scrollHeight - 10
            ) {
                // sethitBottom(true);
            }
        };
        window.addEventListener("scroll", onScroll);
        // useEffect에서 addEvent를 한 경우 반드시 clean up을 해줍시다.
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);
     

    //화면이 끝에닿으면 추가정보를 가져온다.
    useEffect(() => {
        if(hitBottom){ 
            // let body = loadMoreHanlder() 
        let skip = Skip + Limit
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            userId : userId
        }
 
        setSkip(skip)
        getOrderListAjax(body)
        }  
    }, [hitBottom])
    */

    /*
        최초에 정보를 가져온다 (4개씩 ,추가정보는 더보기버튼클릭시 4개씩 로딩 스크롤페이징유사방식 )
        skip = 0 limit =4
    */

    useEffect(() => {
        let body = {
            skip: Skip,
            limit: Limit,
            userId : userId
        }
        getOrderListAjax(body)        
    }, [order])

    const getOrderListAjax= (body)=>{
       
        // dispatch(getOrderList(body)).then(response => {
            Axios.post(`/api/business/getOrderList` ,body).then(response => {
            if(response.data.orderList.length === 0){
            //    setOrderList([...OrderList])
            }else{
                if (body.loadMore) {
                    setOrderList([...OrderList,...response.data.orderList])
                }else{
                    setOrderList([...response.data.orderList])
                }
                setPostSize(response.data.postSize)
            }
        })
      
    }

    /* ================더보기버튼클릭함수============= */
    const loadMoreHanlder = () => {
        //최초로드시 가져온 4개데이터 이후 5번쨰데이터부터4가지데이터가져온다
        let skip = Skip + Limit
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true,
            userId : userId
        }
        getOrderListAjax(body)
        setSkip(skip)
    }
    /*================================================== */

    /* 주문상태가 배달완료일경우 리뷰쓰기 버튼활성화 */ 
    const reviewClickHandler = (no,title,id,statusReview)=>{
        if(statusReview === 'Y'){
            return alert("해당 주문은 이미리뷰를 작성하셧습니다. \n리뷰등록은 1회가능합니다.")
        }
        setReviewVisisble(true)
        setReviewInfo({
            no : no,
            title : title,
            id:id
        })
    }
    
    //리뷰점수
    const rateChange = (event)=>{
        console.log(event)
        setrate(event)
    }

    //리뷰등록시 이미지
    const updateImages = (newImages) => {
        setImages(newImages)
    }
    
    //리뷰등록시 리뷰내용
    const descriptionChangeHandler = (event) => {
        setDes(event.currentTarget.value)
    }

    /*=========================리뷰등록함수===================*/
    const reviewOnok = (ReviewInfo,rate)=>{

        let body = {
            BusinessNumber : ReviewInfo.no,
            description : Des,
            rate : rate,
            images : Images,
            writer: _id, 
            orderId: ReviewInfo.id
        }

        console.log(body)

        Axios.post('/api/business/reviewSave', body)
        .then(response => {
            if (response.data.success) {        
                let body = {
                    BusinessNumber : ReviewInfo.no
                }
                dispatch(getReviewList(body))
                alert("리뷰를 성공적으로 등록하엿습니다.")
                setReviewVisisble(false)
            } else {
                alert("댓글등록에 실패 하엿습니다.")
            }
        })
    }
    /* ============================================================== */

    /*=========== 배달주문상태 status 컨버젼후 주문리스트 랜더링함수======================= */
    const renderCards = OrderList.map((orderList, index) => {
        let statusInfo = {}
        if(orderList.status === 'A'){
             statusInfo = {
                percent : 25,
                format : '접수중'
            }
        }else if(orderList.status === 'B'){
             statusInfo = {
                percent : 50,
                format : '접수완료'
            }
        }else if(orderList.status === 'C'){
             statusInfo = {
                percent : 75,
                format : '배달중'
            }
        }else if(orderList.status === 'D'){
             statusInfo = {
                percent : 100,
                format : '배달완료'
            }
        }else{
             statusInfo = {
                percent : 0,
                format : '주문취소'
            }   
        }
        /* =========================================================== */

        return (
            
            <Card style={{marginBottom:'1%'}} key={index}>
                <Progress width='100px' type="circle" 
                    percent={statusInfo.percent} 
                    format={() => statusInfo.format} 
                />
            {/* <img style={{border:'1px solid' ,height:'60px' ,marginRight:'3%'}} src={menuNo1} /> */}
            <br></br>
                
                <h2>{orderList.Name}</h2>
                <h3 style={{float:'left',marginRight:'2%'}}>{orderList.OrderList[0].title} 외 {orderList.OrderList.length}개</h3><h3 >{orderList.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</h3>

                { orderList.status === 'D' &&
                    <Button onClick={()=>reviewClickHandler(orderList.BusinessNumber , orderList.Name , orderList._id , orderList.reviewStatus)}>리뷰쓰기</Button>
                }
                <Button onClick={() => props.history.push(`/clientMenuInfo/${orderList.BusinessNumber}`)}>가게보기</Button>
                <Button 
                    onClick={() => detailInfo(orderList)}>          
                주문상세</Button>
            </Card>
        )
    })

    /* =====================주문상세 정보를 가져오는 함수 =================*/
    const detailInfo =(orderList)=>{
        let format
        format = orderList.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        orderList.amount = format
        setdetailOrderInfoState(orderList)
        setdetailOrderInfoListState([...orderList.OrderList])
        setVisible(true)
    }
    /* ============================================================= */

    /* ================주문상세정보 메뉴리스트 랜더링함수================= */
    const renderModalCards = detailOrderInfoListState.map((info, index) => {
        return <Card style={{marginBottom:'1%'}} key={index}>
            {info.title}x{info.cnt}개
        </Card>
    })
    /* ============================================================= */

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>

          <div style={{minWidth:'450px',marginTop:'1%',width:'80%'}}>
              {renderCards}

              {PostSize >= Limit &&
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button style={{backgroundColor:'#ff0000a3' ,color:'white', width:'100%'}} onClick={loadMoreHanlder}>더보기</button>
                </div>
                }
          </div>

                <Modal
                    title="상세정보"
                    centered
                    visible={visible}
                    onOk={() => setVisible(false)}
                    onCancel={() => setVisible(false)}
                    // width={1000}
                    >
                    <h2>주문번호: {detailOrderInfoState.no}</h2>
                    {renderModalCards}
                    <Card>
                    <h2>총금액: {detailOrderInfoState.amount}원</h2>   
                    </Card>

                    <Card>
                    <h3>배달주소 : {detailOrderInfoState.buyer_addr}</h3>
                    <hr></hr>
                    <h3>전화번호 : {detailOrderInfoState.buyer_tel}</h3>
                    </Card>
                </Modal>

                <Modal
                    title="음식은 어떠셧나요?"
                    centered
                    visible={ReviewVisisble}
                    onOk={() => reviewOnok(ReviewInfo,rate)}
                    onCancel={() => setReviewVisisble(false)}   
                >   
                    {ReviewInfo.title}
                    <br></br><br></br>
                    <Rate onChange={rateChange} value={rate}/>      
                    <br></br><br></br>
                    <TextArea onChange={descriptionChangeHandler} value={Des}/>    
                    <br></br>

                    <FileUpload refreshFunction={updateImages} />       
                </Modal>

        </div>
    )
}

// export default OrderinfoListPage
export default withRouter(OrderinfoListPage)
