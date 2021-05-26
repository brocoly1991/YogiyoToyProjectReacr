import React, { useState  } from 'react'
import Axios from 'axios';
import { Button,Input } from 'antd';
function Sms(props) {
    const [state, setstate] = useState()
    let onChangeHanderState =""

    /* =============인증메세지전송함수==============================*/
    const onClickSms =()=>{

        let body = {
            tell : props.tell
        }

        Axios.post('/api/business/sms', body)
        .then(response => {
            if (response.data.success) {
                setstate(response.data.randomCertification)
                console.log("인증번호:" , response.data.randomCertification )
            } else {
                alert('인증 메세지 전송에 실패하엿습니다 다시 시도하여주세요')
            }
        })
    }
    /* ============================================================ */

    /* ==========인증확인함수============================== */
    const certification = ()=>{
        if(onChangeHanderState === state){
            props.refreshFunction(true)
            alert("인증성공")
        }else{
            props.refreshFunction(false)
            alert("인증실패")
        }
    }

    const onChangeHander = (e)=>{
        onChangeHanderState = e.target.value
    }
    /*==================================================== */
    
    return (
        <div>
            <div>
                <Input value={props.tell}></Input>
                <Button onClick={onClickSms}>인증 요청</Button>
                <br></br><br></br>
                <Input maxLength='4' onChange={onChangeHander}></Input>
                <Button onClick={certification}>인증 확인</Button>
            </div>            
            
        </div>
    )
}

export default Sms
