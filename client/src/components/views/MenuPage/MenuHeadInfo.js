import React, { useEffect, useState } from 'react'
import { useSelector} from "react-redux";
import { Tabs,Rate,Checkbox, Card  ,Row ,Input, Button,Modal} from 'antd';
import MenuTabMenu from './MenuTabMenu';
import MenuTabReview from './MenuTabReview';
import Map from '../../utils/Map'
import axios from "axios";
import './MenuHeadInfo.css';

const { TabPane } = Tabs;
const { TextArea } = Input;
function MenuHeadInfo(props) {
    const review = useSelector(state => state.review)
    const BusinessNumber = localStorage.getItem("BusinessNumber")
    const [VisibleModify, setVisibleModify] = useState(false)
    const [ModifyDialog, setModifyDialog] = useState()
    const [state, setstate] = useState([])
    const [ReviewRate, setReviewRate] = useState()
    const tabSize = 0
    /* =============================리뷰정보를 가져오는 로직================================ */
    useEffect(() => {   
        getReiveList()
    },[review])

    const getReiveList = ()=>{
        let reviewCnt = 0
        let body = {
            BusinessNumber : BusinessNumber
        }
        
        // dispatch(getReviewList(body)).then(response => {
        axios.post(`/api/business/getReviewList` ,body).then(response => {
            console.log("response" , response ,body)
            if (response.data.success) {
                setstate(response.data.review)
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
    /* ============================================================================================ */
    
    /* ==========================정보 tab 상장님 알림 수정함수 =======================================*/
    const onOkModifyHandler =()=>{
        let body ={
            RestaurantDialog  : ModifyDialog,
            BusinessNumber : props.UserCeoInfo.BusinessNumber,
            type : 'dialog'
        }

        axios.post('/api/users/modifyUserCeoInfo', body)
        .then(response => {
            if (response.data.success) {
                alert("사장님 알림을 수정하엿습니다.")
                window.location.reload()
            }else{
                alert("실패")
            }
        })
    }
    
    const modifyDialogChangeHandler =(e)=>{
        setModifyDialog(e.target.value)
    }

    /* ============================================================================================ */

    /* ==================================리뷰badge 설정함수========================================== */
    const renderCnt =(val)=>{
        if(val !== undefined && val > 0){
            return (
               <div style={{display:'flex'}}>
                 <Rate disabled defaultValue={Number(val)} /><span style={{padding:'4.5px'}}>({ReviewRate})</span>
               </div>
            )
        }
    }
    /* ============================================================================================ */

    return (
        <div style={{border: '4px solid #d9d9d9'}}>
                <Card lg={12} xs={24}>
                        <h2>{props.name}</h2>
                        <hr></hr>
                        <div style={{float:'left'}}>
                            <img style={{ minWidth: '200px', width: '200px', height: '180px' ,border : '1px solid'}}
                                    src={`http://localhost:5000/uploads/1613934805587_쉬림프피자.png`}
                            />
                        </div>
                        <div style={{ padding : '1%' , minWidth: '200px', width: '400px', height: '180px', float: 'left' ,marginLeft : '2%' ,fontSize :'large'}}>
                            {renderCnt(ReviewRate)}
                            <p>최소주문금액 : &nbsp;
                                { props.price && 
                                        props.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                }
                            원</p>
                            <p>결제 : &nbsp;

                            <Checkbox.Group disabled value={"10,20,30"} >
                                <Row>
                                    <Checkbox value="10">신용카드</Checkbox>
                                    <Checkbox value="20">현금</Checkbox>
                                    <Checkbox value="30">요기서결제</Checkbox>
                                </Row>
                            </Checkbox.Group>
                            </p>                       
                            <p>배달 가능 여부 : &nbsp;
                                { props.delivery === 1 &&
                                    '배달만 가능'
                                }
                                { props.delivery === 2 &&
                                    '배달+테이크아웃 가능'
                                }
                            </p> 
                        </div>
                
                </Card> 
                <Tabs defaultActiveKey="1" tabBarGutter={tabSize} style={{}}> 
                    <TabPane  tab="메뉴" key="1" >
                        <MenuTabMenu BusinessNumber = {props.BusinessNumber}/>
                    </TabPane>
                    <TabPane  tab="클린리뷰" key="2">
                        <MenuTabReview BusinessNumber = {props.UserCeoInfo.BusinessNumber} state = {state}/>
                    </TabPane>
                    <TabPane tab="정보" key="3">
                        <div>
                            <br></br>
                            <h2>사장님 알림 <Button onClick={() => {setVisibleModify(true)}}>수정</Button></h2>
                            <hr></hr>
                            { props.UserCeoInfo.RestaurantDialog === 'N' &&
                                <TextArea value='찾아주셔서 감사합니다^^'/>
                            }
                            { props.UserCeoInfo.RestaurantDialog !== 'N' &&
                                <TextArea value={props.UserCeoInfo.RestaurantDialog}/>
                            }
                            {/* <TextArea /> */}
                            <br></br><br></br>
                            <h2>업체정보</h2>
                            <hr></hr>
                            <h3>영업시간 :<span>{props.UserCeoInfo.RestaurantStartTime} ~ {props.UserCeoInfo.RestaurantEndTime}</span> </h3>
                            <h3>전화번호 :<span>{props.UserCeoInfo.RestaurantHp}</span></h3>
                            <h3>주소 :<span>{props.UserCeoInfo.isAddress} / {props.UserCeoInfo.isAddressDetail}</span></h3>
                            <br></br>
                            <h2>사업자정보</h2>
                            <hr></hr>
                            <h3>상호명 :<span>{props.UserCeoInfo.RestaurantName}</span></h3>
                            <h3>사업자등록번호 :<span>{props.UserCeoInfo.BusinessNumber}</span></h3>
                            <br></br>
                        </div>
                        <Map Lat={props.Lat} Lon={props.Lon}/>
                    </TabPane>
                </Tabs>

                

                
            <Modal
                title="수정하기"
                centered
                visible={VisibleModify}
                onOk={() => onOkModifyHandler()}
                onCancel={() => setVisibleModify(false)}
                // width={1000}
                >
                <TextArea onChange={modifyDialogChangeHandler} value={ModifyDialog}/> 


            </Modal>


        </div>
    )
}

export default MenuHeadInfo
