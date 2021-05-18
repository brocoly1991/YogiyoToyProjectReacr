import React,{useState,useEffect}from 'react'
import { Modal,Input, Button } from 'antd';
import { useDispatch } from "react-redux";
import { saveMenuGroup } from '../../../_actions/menu_action';



const { TextArea } = Input;

function SaveMenuGroupModal(props) {

    const dispatch = useDispatch();

    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")

    let visible

    const handleOk = () => {
        visible = false
        props.onOk(visible)
    };

    const handleCancel = () => {
        visible = false
        props.onCancel(visible)
    };

    /* ==================메뉴그룹 등록시 이름 / 설명 changeHandler============== */
    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value)
    }

    const descriptionChangeHandler = (event) => {
        setDescription(event.currentTarget.value)
    }
    /*========================================================================= */

    /* ========================메뉴그룹 등록 함수 ============================= */
    const onClickHandler = ()=>{
       
        const body = {
            //로그인 된 사람의 ID 
            writer: props.props.user.userData._id,
            BusinessNumber : props.props.user.userData.BusinessNumber,
            MenuGropName: Title,
            MenuGropExp: Description,
        }

        dispatch(saveMenuGroup(body)).then(response => {
            if (response.payload.success) {
              alert('정보 저장에 성공 했습니다.')
            } else {
              alert(response.payload.err.errmsg)
            }
        })

        // Axios.post('/api/product', body)
        // .then(response => {
        //     if (response.data.success) {
        //         alert('상품 업로드에 성공 했습니다.')
        //         props.history.push('/')
        //     } else {
        //         alert('상품 업로드에 실패 했습니다.')
        //     }
        // })

    }
    /*================================================================== */

    return (
        <Modal
            title='메뉴그룹 등록'
            visible={props.visible}
            onOk={handleOk}
            onCancel={handleCancel}
        >   
            <label>이름</label>
            <Input onChange={titleChangeHandler} value={Title} />
            <br />
            <br />
            <label>설명</label>
            <TextArea onChange={descriptionChangeHandler} value={Description} />
            <br />
            <br />
            <Button 
                    style={{width:'100%', backgroundColor:'#fa0050' , color:'white'}}
                    onClick={onClickHandler}
            >등록</Button>        
        </Modal> 
    )
}

export default SaveMenuGroupModal
