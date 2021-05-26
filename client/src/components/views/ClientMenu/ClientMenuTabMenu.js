import React, { useEffect,useState } from 'react'
import { useDispatch ,useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import {useHistory} from "react-router";
import { Collapse } from 'antd';
import { getMenuGroupItems } from '../../../_actions/menu_action';
import Menulist from './ClientMenuList';


function ClientMenuTabMenu(props) {
    const menuId = props.match.params.menuId
    const { Panel } = Collapse;
    const dispatch = useDispatch();
    const [Continents, setContinents] = useState([])
    let contList = [] 
    let menuList  = []
    

    useEffect(() => {
        groupFuck(menuId)
    }, [])

    const groupFuck = (value) =>{
        dispatch(getMenuGroupItems(value)).then(response => {
            if (response.payload.success) {
                response.payload.menuGroup.map(item => {
                    contList.push({
                        key: item._id,
                        value: item.MenuGropName,
                        DelYn : item.DelYn,
                        menu : []
                    })
                })
                getMenuList()
            } else {
                alert('실패')
            }
        })
    }

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
                                DelYn : item.DelYn,
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
                    
    const renderCards = Continents.map((continents, index) => {
        if(continents.DelYn === 'N'){
            
        return  (
                <Panel header={continents.value} key={continents.key} menu = {continents.menu} key={index}>
                    <Menulist list={continents.key} cbFunction={props.cbFunction}/>
                </Panel>
                )
        }
    })

    return (

        
        <div style={{ width: '100%', margin: '1rem auto'}}>
            <Collapse defaultActiveKey={['0','1','2','3','4','5']}>
            {renderCards}
            </Collapse>          
        </div>
    )
}

export default withRouter(ClientMenuTabMenu)
