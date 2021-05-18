import React, { useEffect,useState } from 'react'
import { useDispatch ,useSelector } from 'react-redux';

import axios from 'axios';
import { Input,Tabs,Rate,Button,Image, Card, Collapse ,Carousel ,Modal} from 'antd';
import { getReviewList } from '../../../_actions/review_action';

import ImageSlider from '../../utils/ImageSlider';
import moment from 'moment';
const { TextArea } = Input;

function MenuTabReview(props) {

    // const review = useSelector(state => state.review.review ,[])
    const dispatch = useDispatch();
    const _id = localStorage.getItem("userId")
    const BusinessNumber = localStorage.getItem("BusinessNumber")
    const format = "YYYY-MM-DD"
    const [state, setstate] = useState([])
    const [ReviewId, setReviewId] = useState()
    const [visible, setVisible] = useState(false);
    const [VisibleModify, setVisibleModify] = useState(false)

    const [Modify, setModify] = useState({})
    const [Des, setDes] = useState()
    const [ModifyDes, setModifyDes] = useState()




    /* =======================등록한 답글을 모달창을 통해 수정하는 함수================================*/

    //모달창 호출시 기존 답글 정보설정 
    const modifyHandler =(val,val2)=>{
        console.log(val,val2)

        let body={
            reviewId : val,
            commentId : val2
        }

        setModify(body)

        setVisibleModify(true)
    }
    //수정내용 셋팅 
    const modifyDescriptionChangeHandler = (event) => {
        setModifyDes(event.currentTarget.value)
    }

    const onOkModifyHandler =()=>{

        let body = {
            reviewId :  Modify.reviewId,
            commentId : Modify.commentId,
            des : ModifyDes,
            userId : _id
        }

        axios.post('/api/business/reviewReplyModify', body)
        .then(response => {
            if (response.data.success) {
                alert("댓글내용을 수정하엿습니다.")
                let body = {
                    BusinessNumber : BusinessNumber
                }
                dispatch(getReviewList(body))
            }else{
                alert("실패")
            }
        })

        setVisibleModify(false)
    }
    /* =========================================================================== */

    /* ================================답글등록 함수======================================*/

    //모달창 호출함수
    const reviewClickHandler =(val)=>{
        setDes()
        setReviewId(val)
        setVisible(true)
    }
    //입력내용 셋팅 
    const descriptionChangeHandler = (event) => {
        setDes(event.currentTarget.value)
    }

    const onOkHandler =()=>{

        let body = {
            reviewId :  ReviewId,
            des : Des,
            userId : _id
        }

        axios.post('/api/business/reviewReplySave', body)
        .then(response => {
            if (response.data.success) {
                alert("댓글을 등록하엿습니다.")
                let body = {
                    BusinessNumber : BusinessNumber
                }
                dispatch(getReviewList(body))
            }else{
                alert("실패")
            }
        })
        setVisible(false)
    }
    /*=================================================================================*/

    /*============================ 답글 삭제 함수============================================ */
    const deleteHandler =(val,val2)=>{

        const confirm_test = window.confirm("삭제 하시겟습니까?");
        if ( confirm_test == false  ) {
            return false;
        } 

        let body={
            reviewId : val,
            commentId : val2,
            del : "Y"
        }

        axios.post('/api/business/reviewReplyModify', body)
        .then(response => {
            if (response.data.success) {
                alert("댓글을 삭제하엿습니다.")
                let body = {
                    BusinessNumber : BusinessNumber
                }
                dispatch(getReviewList(body))
            }else{
                alert("실패")
            }
        })

    }
    /*==========================================================================*/

    //상위컴퍼넌트(MenuHeadInfo)에서 해당사업자의 리뷰리스트를 받아서 랜더링
    const renderCards = props.state.map((state, index) => {

        let date = new Date(state.createdAt);
        let dateTime = moment(date).format(format);

        return  (   
            
                    <Card key={index}>
                        
                        <h3>{state.email} ({dateTime})</h3>
                        <Rate disabled defaultValue={state.rate} />
                        <br></br>
                        {state.images.length > 0 &&
                            <div>
                                {state.images.map((image, index) => (
                                    <div key={index}>
                                        <img style={{ border:'1px solid'}}
                                            src={`http://localhost:5000/${image}`} />
                                    <br></br><br></br>        
                                    </div>
                                    
                                ))}
                            </div>
                        }
                        <Card>
                            <span style={{fontWeight:'bold'}}>{state.description}</span>
                        
                        <br></br>
                        
                        
                        { state.comment.length > 0 &&
                        
                            <div>
                                <br></br>
                                {state.comment.map((comment, index) => (
                                    <Card key={index} style={{backgroundColor:'#e9e5e578'}}>

                                        { comment.reviewDelYn === 'Y' ? 
                                            <div>
                                                <h2>사장님</h2>
                                                <h2 style={{color:'#c6c3c3'}}>삭제된 댓글입니다.</h2>
                                            </div> 
                                            
                                            : 
                                        
                                            <div>
                                            <h2>사장님</h2>
                                            <span style={{color:'black'}}>{comment.reviewDescription}</span>
                                            <br></br>
                                            <div style={{textAlignLast :'end'}}>
                                                <Button onClick={()=> modifyHandler(state._id,comment._id)}>수정</Button>
                                                <Button onClick={()=> deleteHandler(state._id,comment._id)}>삭제</Button>
                                            </div>
                                            </div>
                                        }

                                    </Card>
                                    
                                ))}
                            </div>
                        }
                        </Card>
                        <br></br>
                    <Button onClick={()=>reviewClickHandler(state._id)} style={{float:'right' ,backgroundColor:'red' , color:'white'}}>댓글쓰기</Button>
                    </Card>


                )
    })

    return (
        <div>
            {renderCards}

            <Modal
                title="답글쓰기"
                centered
                visible={visible}
                onOk={() => onOkHandler()}
                onCancel={() => setVisible(false)}
                // width={1000}
                >
                <TextArea onChange={descriptionChangeHandler} value={Des}/> 
            </Modal>

            <Modal
                title="수정하기"
                centered
                visible={VisibleModify}
                onOk={() => onOkModifyHandler()}
                onCancel={() => setVisibleModify(false)}
                // width={1000}
                >
                <TextArea onChange={modifyDescriptionChangeHandler} value={ModifyDes}/> 
            </Modal>

        </div>
    )
}

export default MenuTabReview

