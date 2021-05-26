import React,{useState,useEffect}from 'react'
import { Modal,Input, Button } from 'antd';
import { useDispatch } from "react-redux";
import { modifyUserInfo } from "../../../_actions/user_actions";
import axios from 'axios';

function RegisterModifyModal(props) {
    const dispatch = useDispatch();
    const [NewName, setNewName] = useState("")
    const [NewHp, setNewHp] = useState("")
    const [NewPassword, setNewPassword] = useState()
    const [ConfirmPass, setConfirmPass] = useState()
    const _id = localStorage.getItem("userId")
    
    //최초 모달값 초기화를 위해서
    useEffect(() => {
        reset()
    }, [])

    //숫자만입력
    const numberFormat= (e) =>{
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault();
        } 
    }

    /* ================모달 컨트롤 함수=======================*/
    const reset = () => {
        setNewHp("")
        setNewName("")
        setNewPassword("")
        setConfirmPass("")
    }

    const handleOk = () => {
        reset()
        onClickHandler()
    };

    const handleCancel = () => {
        reset()
        props.onCancel()
    };
    /* =======================================================*/
    
    /*====각각의 값들을 수정하는 함수 props.type 을기준으로
     닉네임/휴대폰번호/비밀번호 변경 값들을 컨트롤한다.=====*/
    let body ={} 
    const onClickHandler = ()=>{
        
        if(props.type === 1){
            if (!NewName) {
                return alert("값을 입력해주세요.")
            }
             body ={
                newName  : NewName,
                type : 'A',
                _id : _id
             }            
        }else if(props.type === 2){
            if (!NewHp) {
                return alert("값을 입력해주세요.")
            }
             body ={
                NewHpNumner  : NewHp,
                type : 'B',
                _id : _id
             }
        }else{
             if(NewPassword != ConfirmPass){  
                alert("비밀번호가 일치하지 않습니다.")
                return false
             }   
             body ={
                password  : NewPassword,
                type : 'C',
                _id : _id
             }
        }

        dispatch(modifyUserInfo(body)).then(response => {
            if (response.payload.success) {
              alert('정보 저장에 성공 했습니다.')
                props.onCancel()
            } else {
              alert(response.payload.err.errmsg)
            }
        })
    }
    /* =======================================================*/

    /*========================ChangeHandler=============================*/
    const onChangeHandler = (e)=>{
        if(props.type === 1){
            setNewName(e.target.value)
        }else if(props.type === 2){
            setNewHp(e.target.value)
        }
        
    }
    const onChangePassHandler = (e) =>{
        setNewPassword(e.target.value)
    }
 
    const onChangePassConfirmHandler = (e) =>{
        setConfirmPass(e.target.value)
    }
    /* ====================================================================*/

    /*========================닉네임 중복검사=============================*/
    const dupNameHandler =()=>{
        axios.get(`/api/users/nickNameCheck?id=${NewName}`).then(response => {
            if (response.data.success) {
                alert('사용 가능합니다.')
            } else {
                alert('사용 불가능\n' +  response.data.msg)
                setNewName("")
            }
        })
    }    
    /* ====================================================================*/

    if(props.type === 1){
        return (
            <div>
                <Modal
                    title={props.title}
                    centered
                    visible={props.visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <h3>사용중인닉네임 : {props.beValue}</h3>
                    <p>변경할 닉네임 : </p>
                    <Input onChange={onChangeHandler} value={NewName}></Input>
                    <Button onClick={dupNameHandler}>중복검사</Button>
                    <br></br>
                    <br></br>
                    <Button 
                        style={{width:'100%', backgroundColor:'#fa0050' , color:'white'}}
                        onClick={onClickHandler}
                    >수정</Button>
                </Modal>            
            </div>
        )
    }else if(props.type === 2) {
        return (
            <div>
                <Modal
                title={props.title}
                centered
                visible={props.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                >
           
                    <h3>사용중인휴대폰번호 : {props.beValue}</h3>
                    <p>변경할 휴대폰번호 : </p>
                    <Input onChange={onChangeHandler} value={NewHp} onKeyPress = {numberFormat}></Input>
                    <br></br>
                    <br></br>
                    <Button 
                        style={{width:'100%', backgroundColor:'#fa0050' , color:'white'}}
                        onClick={onClickHandler}
                    >수정</Button>
                </Modal> 
            </div>
        )
    } else {
        return (
            <div>
                <Modal
                title={props.title}
                centered
                visible={props.visible}
                onOk={handleOk}
                onCancel={handleCancel}
                >   
                새로운비밀번호:<Input onChange={onChangePassHandler} value={NewPassword} type="password" ></Input>
                비밀번호확인:<Input onChange={onChangePassConfirmHandler} value={ConfirmPass} type="password"></Input>
                <br></br>
                <br></br>
                <Button 
                    style={{width:'100%', backgroundColor:'#fa0050' , color:'white'}}
                    onClick={onClickHandler}
                >수정</Button>
                </Modal> 
            </div>
        )
    }

}

export default RegisterModifyModal
