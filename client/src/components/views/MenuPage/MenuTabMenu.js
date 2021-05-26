import React, { useEffect,useState } from 'react'
import { useDispatch ,useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import {useHistory} from "react-router";
import { Collapse,Modal,Input} from 'antd';
import { getUserInfo } from '../../../_actions/user_actions';
import { getMenuGroupItems } from '../../../_actions/menu_action';
import Menulist from './Menulist';


function MenuTabMenu(props) {
    const { Panel } = Collapse;
    const _id = localStorage.getItem("userId")
    const history = useHistory();
    const dispatch = useDispatch();
    const [Title, setTitle] = useState()
    const [Desc, setDesc] = useState()
    const [GropuId, setGropuId] = useState()
    const [visible, setVisible] = useState(false);
    const [Continents, setContinents] = useState([])
    const [state, setstate] = useState(false)
    let contList = [] 
    let menuList  = []
    
    useEffect(() => {
        if(props.location.state  == undefined){
            dispatch(getUserInfo(_id)).then( response => 
                getUserFunk(response.payload.userInfo.BusinessNumber )
            )  
            const getUserFunk=(value)=>{
                groupFuck(value) 
            }
        }else{  
            groupFuck(props.location.state.BusinessNumber)          
        }
    }, [state])

 
    /* ===================메뉴그룹 정보가져오는 함수 메뉴는 메뉴그룹에 종속되어있다.============ */
    const groupFuck = (value) =>{
        dispatch(getMenuGroupItems(value)).then(response => {
            if (response.payload.success) {
                    response.payload.menuGroup.map(item => {
                        contList.push({
                            key: item._id,
                            value: item.MenuGropName,
                            delyn : item.DelYn,
                            menu : []
                        })
                    })
                getMenuList()
            } else {
                alert('실패')
            }
        })
    }
    /* ======================================================================================== */

    /* ====================================메뉴리스트를 가져오는 함수============================= */
    const getMenuList= ()=> {

        contList.map(item => {
            axios.get(`/api/menus/menu_by_id?id=${item.key}`)
            .then(response => {    
                    if(response.data.menu.length > 0){
                        response.data.menu.map(item => { 
                        
                            menuList.push({
                                key: item._id,
                                MenuGroup :item.MenuGroup,
                                title: item.title,
                                price: item.price
                            })

                            contList.map(contList =>{
                                if(contList.key === item.MenuGroup){
                                    contList.menu = menuList
                                }else{
                                    contList.menu = []
                                }

                                  
                            })    
                        })
                    }                                            
                })
        })
        setContinents(contList)
    }
    /* =========================메뉴그룹명 수정 함수 ====================== */
    //수정 모달 호출
    const modifyMenuGroupInfo =(e,val)=>{
        e.stopPropagation()
        setGropuId(val)
        setVisible(true)
    }
    //제목 핸들러
    const titleHandler = (e)=>{
        setTitle(e.target.value)
    }
    //설명 핸들러
    const descHandler = (e)=>{
        setDesc(e.target.value)
    }
    //수정 함수
    const modifyHandler = ()=>{
        if(!Title){
            return alert("제목을 입력하여주세요")
        }

        let body = {
            title : Title,
            desc : Desc,
            id : GropuId
        }

        axios.post(`/api/menus/modifyMenuGroup` ,body).then(response => { 
            if(response.data.success){
                if(state){
                    setstate(false)
                }else{
                    setstate(true)
                }
                alert("성공")
                setVisible(false)
            }else{
                alert("실패")
            }
        }) 
    }
    /*======================================================================== */

    /* ============================메뉴그룹 삭제/복구 함수 ==================== */
    //삭제시
    const genExtra =(val)=>{
        let type= 'del'
        return <div><button onClick={(e)=> modifyMenuGroupInfo(e,val)}>수정</button><button onClick={(e)=> deleteMenuGroupInfo(e,val,type)}>삭제</button></div>
    }
    //복구시
    const genExtraDel =(val)=>{
        let type= 'restore'
        return <div><button onClick={(e)=> deleteMenuGroupInfo(e,val,type)}>복구</button></div>
    }

    const deleteMenuGroupInfo =(e,val,type)=>{
        e.stopPropagation()
        let text = ''

        if(type === 'restore'){
            text = '복구'
        }else{
            text = '삭제'
        }

        const confirm_test = window.confirm(text + " 하시겟습니까?");
        if ( confirm_test == false  ) {
            return false;
        } 
        
        let body = {
            type : type,
            id : val
        }
        axios.post(`/api/menus/delMenuGroup` ,body).then(response => { 
            if(response.data.success){
                if(state){
                    setstate(false)
                }else{
                    setstate(true)
                }
                alert("성공")
            }else{
                alert("실패")
            }
        }) 
           
    }
    /* ========================================================================= */


    // 메뉴그룹에 속한 메뉴들을 랜더링 하는 
    const renderCards = Continents.map((continents, index) => {
        if(continents.delyn === 'N'){
            return  (
                <Panel header={continents.value} key={continents.key} menu = {continents.menu} key={index} extra={genExtra(continents.key)}>
                    <Menulist key={index}list={continents.key} />
                </Panel>
                )
        }else{
            return  (
                <Panel header={continents.value} key={continents.key} menu = {continents.menu} key={index} extra={genExtraDel(continents.key)}>
                    <spna>삭제된 정보입니다.</spna>
                </Panel>
                )
        }

    })

    /* ================================================================================================ */  
    return (

        <div style={{ width: '100%', margin: '1rem auto'}}>
            <span style={{fontSize:"larger",color: 'blue',cursor: 'pointer',marginLeft:'5%'}} 
                onClick={() => 
                    {history.push({
                            pathname: "/product/upload",
                            state: {BusinessNumber: props.BusinessNumber , test:'test'}
                        })
                    }
                }
            >               
            메뉴등록하기(메뉴그룹추가)
            </span> 
                <br></br><br></br>
            <Collapse defaultActiveKey={['0','1','2','3','4','5']}>
              {renderCards}
            </Collapse>

            <Modal
                title="수정하기"
                centered
                visible={visible}
                onOk={() => modifyHandler()}
                onCancel={() => setVisible(false)}
                // width={1000}
                >
                <p>제목</p> 
                <Input onChange = {titleHandler}></Input>
                <br></br><br></br><hr></hr>
                <p>설명</p>
                <Input onChange = {descHandler}></Input>
            </Modal>
           
        </div>
    )
}

export default withRouter(MenuTabMenu)
