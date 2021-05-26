import React, { useEffect,useState } from 'react'
import { useDispatch} from "react-redux";
import { Input,Tabs,Rate,Button,Image, Card, Collapse ,Col,Row} from 'antd';
import axios from 'axios';
import ImageSlider from '../../utils/ImageSlider';
import './Menu.css';
import { modifyMenuInfo } from '../../../_actions/menu_action';
import {useHistory} from "react-router";


function Menulist(props) {
    const dispatch = useDispatch();
    const { Panel } = Collapse;
    const history = useHistory();
    const [state, setstate] = useState([])
    const [Flag, setFlag] = useState(false)
    const [formatPrice, setformatPrice] = useState([])
    
    useEffect(() => {

        axios.get(`/api/menus/menu_by_id?id=${props.list}`)
        .then(response => {  
            setstate(response.data.menu)
            // setformatPrice(response.data.menu.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
        })
    }, [Flag])

    /* ==============복구함수============== */
    const restorClickHandler =(val)=>{

        let body ={
            _id : val,
            type : 'restore'
         }
         dispatch(modifyMenuInfo(body))
         .then(response => {
            if (response.payload.success) {
                if(Flag){
                    setFlag(false)
                }else{
                    setFlag(true)
                }
            }else{
                alert('정보 저장에 실패 했습니다.')
            } 
        })

    }
    /* ==================================== */

    return (
        
        state.map((state, index) => {
            let comPrice = state.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            if(state.DelYn === 'N'){
                return <Card 
                style={{marginTop:'1%' , height :'140px' , cursor : 'pointer' }}
                key={index}
                // onClick={detailMenu}
                value='5'
                onClick={() => 
                    {history.push({
                            pathname: `/menuModify/${state._id }`,
                            state: {menuId: state._id }
                        })
                    }
                }
               >


            
                
            <div className={'f'} style={{float : 'left' , fontSize:'x-large' ,  overflow: 'auto' , width:'85%' }}>
                <span>{state.title}</span>
                <br></br>
                <span style={{color:'#0000005c'}}>{state.description}</span>
                <br></br>
                <span>{comPrice}원</span>
            </div>
            <div>
                <ImageSlider images={state.images} />
            </div>

            </Card>
            }else{
                return <Card>
                    <div className={'f'} style={{float : 'left' , fontSize:'x-large' ,  overflow: 'auto' , width:'85%' ,backgroundColor:'#00000024'}}>
                        <span>삭제된 메뉴입니다.</span>
                        <br></br>
                        <span>{state.title}</span>
                        <span>{comPrice}원</span>
                    </div>
                    <div>
                        <Button onClick={()=>restorClickHandler(state._id)} style={{width:'15%',height:'72px',backgroundColor:'red',color:'white'}}>복구</Button>
                    </div>
                </Card>
            }
            

                
        })
            
        
    )
}

export default Menulist
