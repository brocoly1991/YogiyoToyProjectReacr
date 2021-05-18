import React, { useEffect,useState } from 'react'
import { useDispatch ,useSelector } from 'react-redux';
import { getReviewList } from '../../../_actions/review_action';
import axios from 'axios';
import { Input,Rate,Button, Card ,Modal} from 'antd';
import moment from 'moment';
import FileUpdate from '../../utils/FileUpdate'
const { TextArea } = Input;
function ClientMenuTabReview(props) {
    const dispatch = useDispatch();
    const _id = localStorage.getItem("userId")
    const BusinessNumber = localStorage.getItem("BusinessNumber")
    const format = "YYYY-MM-DD"
    const [OriginImg, setOriginImg] = useState({})
    const [NewImg, setNewImg] = useState({})
    const [VisibleModify, setVisibleModify] = useState(false)
    const [Modify, setModify] = useState({})
    const [ModifyDes, setModifyDes] = useState()




    /* ========================댓글 삭제함수 =============================*/
    const deleteHandler =(val)=>{

        const confirm_test = window.confirm("삭제 하시겟습니까?");
        if ( confirm_test == false  ) {
            return false;
        } 

        let body={
            reviewId : val,
            del : "Y"
        }

        axios.post('/api/business/reviewReplyModifyClient', body)
        .then(response => {
            if (response.data.success) {
                let body = {
                    BusinessNumber : BusinessNumber
                }
                dispatch(getReviewList(body))
                alert("댓글을 삭제하엿습니다.")
            }else{
                alert("실패")
            }
        })

    }
    /* =================================================================== */

    /* ==========================댓글수정함수 ============================ */
    const modifyDescriptionChangeHandler = (event) => {
        setModifyDes(event.currentTarget.value)
    }

    //댓글수정모달창 핸들러
    const modifyHandler =(val,img)=>{
        setOriginImg(img)
        setNewImg()
        setModifyDes()
        let body={
            reviewId : val,
        }
        setModify(body)
        setVisibleModify(true)
    }

    const onOkModifyHandler =()=>{
        console.log("NewImg" , NewImg) 
        console.log("OriginImg" , OriginImg) 
        if(ModifyDes === undefined || ModifyDes === '' || ModifyDes === null  ){
            return alert("내용을 입력하여 주세요")
        }
        let resultImg = {}

        if(NewImg === undefined || NewImg === '' || NewImg === null  ){
            resultImg = OriginImg
        }else{
            resultImg = NewImg
        }

        let body = {
            reviewId :  Modify.reviewId,
            des : ModifyDes,
            img : resultImg,
            userId : _id
        }

        axios.post('/api/business/reviewReplyModifyClient', body)
        .then(response => {
            if (response.data.success) {
                let body = {
                    BusinessNumber : BusinessNumber
                }
                dispatch(getReviewList(body))
                alert("댓글내용을 수정하엿습니다.")
            }else{
                alert("실패")
            }
        })

        setVisibleModify(false)
    }
    /* ================================================================ */

    const newImg = (value)=>{
        setNewImg(value)
    }

    /* 
        로그인한 user정보와 리뷰를등록한 user정보가 동일시 리뷰정보를 수정및삭제 가능. 
        comment = user가 등록한 리뷰에 대댓글(사장님이등록)정보
    */
    const renderCards = props.state.map((state, index) => {

        let date = new Date(state.createdAt);
        let dateTime = moment(date).format(format);

        return  (
                    <Card key={index}>
                        <h3>{state.email} ({dateTime})</h3>
                        <Rate disabled defaultValue={state.rate} />

                          {state.writer === _id && state.delYn === "N" ? 
                            <div style={{float:'right'}}>
                             <Button onClick={()=> modifyHandler(state._id,state.images)}>수정</Button>
                             <Button onClick={()=> deleteHandler(state._id)}>삭제</Button>                         
                            </div>
                            : null}



                        <br></br>
                        {state.images.length > 0 && state.delYn === "N" &&
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

                            

                            {state.delYn === "Y" ? 
                                <span style={{fontWeight:'bold',color:'#c6c3c3'}}>삭제된 댓글입니다.</span>
                                :
                                <span style={{fontWeight:'bold'}}>{state.description}</span>
                            }
                        
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
                                                </div>
                                            </div>
                                        }

                                        
                                    </Card>
                                    
                                ))}
                            </div>
                        }
                        </Card>
                    </Card>


                )
    })

    return (
        <div>
            {renderCards}

            <Modal
                title="수정하기"
                centered
                visible={VisibleModify}
                onOk={() => onOkModifyHandler()}
                onCancel={() => setVisibleModify(false)}
                // width={1000}
                >
                <TextArea onChange={modifyDescriptionChangeHandler} value={ModifyDes}/> 

                {/* <FileUpdate img={OriginImg} refreshFunction={newImg}/> */}
                <FileUpdate img={OriginImg} refreshImg = {newImg}/> 

            </Modal>


        </div>
    )
}

export default ClientMenuTabReview
