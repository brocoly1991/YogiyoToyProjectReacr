import React, { useEffect,useState } from 'react'
import { useDispatch ,useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import {useHistory} from "react-router";
import { Collapse } from 'antd';
import { getUserInfo } from '../../../_actions/user_actions';
import { getMenuGroupItems } from '../../../_actions/menu_action';
import Menulist from './Menulist';


function MenuTabMenu(props) {
    const { Panel } = Collapse;
    const _id = localStorage.getItem("userId")
    const history = useHistory();
    const dispatch = useDispatch();
    const [Continents, setContinents] = useState([])
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
    }, [])

    /* ===================메뉴그룹 정보가져오는 함수 메뉴는 메뉴그룹에 종속되어있다.============ */
    const groupFuck = (value) =>{
        dispatch(getMenuGroupItems(value)).then(response => {
            if (response.payload.success) {
                response.payload.menuGroup.map(item => {
                    contList.push({
                        key: item._id,
                        value: item.MenuGropName,
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
    // 메뉴그룹에 속한 메뉴들을 랜더링 하는 
    const renderCards = Continents.map((continents, index) => {
        return  (
            <Panel header={continents.value} key={continents.key} menu = {continents.menu} key={index}>
                <Menulist list={continents.key}/>
            </Panel>
            )
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
            메뉴등록하기
            </span> 
                <br></br><br></br>
            <Collapse defaultActiveKey={['0','1','2','3','4','5']}>
              {renderCards}
            </Collapse>
           
        </div>
    )
}

export default withRouter(MenuTabMenu)
