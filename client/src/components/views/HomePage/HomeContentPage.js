import React from 'react'
import { Col,Row } from 'antd';
import { withRouter } from 'react-router-dom';
import menuNo1 from '../../../img/menuNo1.png'
import menuNo2 from '../../../img/menuNo2.png'
import menuNo3 from '../../../img/menuNo3.png'
import menuNo4 from '../../../img/menuNo4.png'
import menuNo5 from '../../../img/menuNo5.png'
import menuNo6 from '../../../img/menuNo6.png'
import menuNo7 from '../../../img/menuNo7.png'
import menuNo8 from '../../../img/menuNo8.png'
function HomeContentPage(props) {
    
    const tempStyle = {
        border: "2px solid black",  
        width: '95%',
        cursor: 'pointer'
    }

    return (
        <div>
            <Row gutter={[16, 16]} >
            <Col lg={6} md={8} xs={24} key='1000'>
            <span onClick={() => props.history.push('/storePage/1000')}> <img style={tempStyle} src={menuNo1} /></span>  
            </Col>
            <Col lg={6} md={8} xs={24} key='2000'>
            <span onClick={() => props.history.push('/storePage/134')}> <img style={tempStyle} src={menuNo2} /></span>  
            </Col>
            <Col lg={6} md={8} xs={24} key='3000'>
            <span onClick={() => props.history.push('/storePage/4')}> <img style={tempStyle} src={menuNo3} /></span>  
            </Col>
            <Col lg={6} md={8} xs={24} key='4000'>
            <span onClick={() => props.history.push('/storePage/1')}> <img style={tempStyle} src={menuNo4} /></span>  
            </Col>
            <Col lg={6} md={8} xs={24} key='5000'>
            <span onClick={() => props.history.push('/storePage/14')}> <img style={tempStyle} src={menuNo5} /></span>  
            </Col>
            <Col lg={6} md={8} xs={24} key='6000'>
            <span onClick={() => props.history.push('/storePage/2')}> <img style={tempStyle} src={menuNo6} /></span>  
            </Col>
            <Col lg={6} md={8} xs={24} key='7000'>
            <span onClick={() => props.history.push('/storePage/18')}> <img style={tempStyle} src={menuNo7} /></span>  
            </Col>  
            <Col lg={6} md={8} xs={24} key='8000'>
            <span onClick={() => props.history.push('/storePage/17')}> <img style={tempStyle} src={menuNo8} /></span>  
            </Col>          
            </Row>
        </div>
        )
    }

export default withRouter(HomeContentPage)
