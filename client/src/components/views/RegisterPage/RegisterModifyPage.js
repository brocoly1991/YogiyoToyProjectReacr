import React, { useEffect, useState } from 'react'
import RegisterModifyModal from "./RegisterModifyModal";
import { useDispatch ,useSelector } from 'react-redux';
import { getUserInfo } from '../../../_actions/user_actions';
import { Row,Col,Button } from 'antd';

function RegisterModifyPage(props) {
    const _id = localStorage.getItem("userId")
    const dispatch = useDispatch();
    let user = useSelector(state => state.user);
    
    const [UserInfo, setUserInfo] = useState({})
    const [visible, setVisible] = useState(false);
    const [Title, setTitle] = useState()
    const [Value, setValue] = useState()
    const [ModalType, setModalType] = useState(0)

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

    useEffect(() => {
        if (user.getUserInfo === undefined){
            dispatch(getUserInfo(_id)).then(response => {
                if (response.payload.success) {
                  setUserInfo(response.payload.userInfo)     
                }else{
                    alert("로딩실패")
                } 
            })
        }else{
            getUserInfos()
        }
    }, [user])

    
    const getUserInfos = () =>{
        setUserInfo(user.getUserInfo.userInfo)
    }

    /* =====닉네임 ,휴대폰번호,비밀번호 수정시 RegisterModifyModal 모달창호출 , 호출시 setModalType과 title로 type별 모달창 setting=====*/
    const nameOnclickHandler = (e) => {
        setTitle("닉네임 변경하기")
        setValue(UserInfo.name)
        setVisible(true)
        setModalType(1)
    }

    const hpOnclickHandler = (e) => {
        setTitle("휴대폰번호 변경하기")
        setValue(UserInfo.hpNumner)
        setVisible(true)
        setModalType(2)
    }

    const pasOnclickHandler = (e) => {
        setTitle("비밀번호 변경하기")
        // setValue(UserInfo.hpNumner)
        setVisible(true)
        setModalType(3)
    }

    const handleOk = () => {
        setVisible(false);
    };

    const handleCancel = () => {
        setVisible(false);
    };
    /* ========================================================================================================= */
    
    return (
        <div style={{ width: '55%', margin: '3rem auto' }}>
            
            <div>
                <h1 style={{whiteSpace : 'nowrap' }}>요기요 내정보</h1>
                <hr></hr>
            </div>

            <Row  style={{ borderTop: '1px solid #E0E0E0' , borderBottom: '1px solid #E0E0E0' }}>

                <Col span={18} push={6} style={colStyle}>
                    {UserInfo.email}
                </Col>
                <Col style={colStyleFront} span={6} pull={18}>
                 <span>이메일주소</span>
                </Col>

                <Col span={18} push={6} style={colStyle}>
                    {UserInfo.name}
                    <Button 
                        style={{float:'right'}}
                        onClick={nameOnclickHandler}
                    >수정</Button>
                </Col>
                <Col style={colStyleFront} span={6} pull={18}>
                 <span>닉네임</span>
                </Col>

                <Col span={18} push={6} style={colStyle}>
                    {UserInfo.hpNumner}
                    <Button 
                        style={{float:'right'}}
                        onClick={hpOnclickHandler}
                    >수정</Button>
                </Col>
                <Col style={colStyleFront} span={6} pull={18}>
                 <span>휴대폰번호</span>
                </Col>

                <Col span={18} push={6} style={colStyle}>
                   <Button
                    onClick={pasOnclickHandler}
                   >변경하기</Button>
                </Col>
                <Col style={colStyleFront} span={6} pull={18}>
                 <span>비밀번호</span>
                </Col>
            </Row>

            <RegisterModifyModal 
                type={ModalType}
                visible={visible} 
                onOk={handleOk} 
                onCancel={handleCancel}
                beValue={Value}
                title={Title}
                UserInfo= {UserInfo}
            />
        </div>
    )
}

export default RegisterModifyPage
