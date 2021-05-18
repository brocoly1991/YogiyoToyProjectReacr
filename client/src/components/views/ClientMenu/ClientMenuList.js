import React, { useEffect,useState } from 'react'
import { Input,Tabs,Rate,Button,Image, Card, Collapse ,Col,Row} from 'antd';
// import { withRouter } from 'react-router-dom';
import axios from 'axios';
import ImageSlider from '../../utils/ImageSlider';
import '../MenuPage/Menu.css';
import {useHistory} from "react-router";


function ClientMenuList(props) {
    
    const { Panel } = Collapse;
    const history = useHistory();
    const [state, setstate] = useState([])
    const [formatPrice, setformatPrice] = useState([])
    
    useEffect(() => {

        axios.get(`/api/menus/menu_by_id?id=${props.list}`)
        .then(response => {  
            setstate(response.data.menu)
            // setformatPrice(response.data.menu.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
        })
    }, [])

    const detailMenu =(id,title,price)=>{
        props.cbFunction(id,title,price)
    } 

    return (
        
        state.map((state, index) => {
            let comPrice = state.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            return <Card 
                    style={{marginTop:'1%' , height :'140px' , cursor : 'pointer' }}
                    key={index}
                    // onClick={detailMenu}
                    value='5'
                    onClick={() => 
                        detailMenu(state._id,state.title,state.price)
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
                
        })
            
    )
}

export default ClientMenuList
