import React, { useEffect,useState } from 'react'
import axios from "axios";
import { Icon, Col, Card, Row, Divider  } from 'antd';
import menuNo1 from '../../../img/menuNo1.png'
function StorePage(props) {

    const storeId = props.match.params.storeId

    const [List, setList] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)

    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit,
            storeId : storeId
        }
        getResList(body)
    }, [])

    const getResList = (body)=>{
        
            axios.post('/api/business/List', body)
            .then(response => {
                if (response.data.success) {
                    if (body.loadMore) {
                        setList([...List, ...response.data.UserCeoInfo])
                    } else {
                        setList(response.data.UserCeoInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert(" 목록을 가져오는데 실패 했습니다.")
                }
            })
    }

    const loadMoreHanlder = () => {

        let skip = Skip + Limit
        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getResList(body)
        setSkip(skip)
    }

    const detailResInfo =(BusinessNumber)=>{
        props.history.push(`/clientMenuInfo/${BusinessNumber}`)
    }

    const renderCards = List.map((list, index) => {
        return      <Col lg={12} xs={24}>
         {/* <Card bordered={'5px solid #e8e8e8'}> */}
         <Card 
            style={{border:'3px solid #e8e8e8' ,cursor:'pointer'}} 
            onClick={()=> detailResInfo(list.BusinessNumber)} 
            // onClick={()=> detailResInfo(list.BusinessNumber,list.RestaurantName,list.RestaurantPrice,list.RestaurantDelivery,list.RestaurantCategory)}      
         >
         <img style={{border:'1px solid' ,height:'100px' ,float:'left'}} src={menuNo1} />
         <div style={{marginLeft:'20%'}}>
            <span style={{fontSize:'x-large'}}>{list.RestaurantName}</span>
            <br></br>
            <span>{list.RestaurantPrice}</span>
            <br></br>
            <span>{list.BusinessNumber}</span>
         </div>
        </Card>
      </Col>
        
    })

    const tempStyle = {
        border: "2px solid black",  
       // width: '18%',
       // float: 'left',
       // margin:'1%'
    }

    const colPStyle = {
        display: 'display: table-row-group;'
        // float: 'right',
       // marginRight: '52%'  
    }

    const pStyle = {
        fontSize: '18px',
        fontWeight: 'bold'
    }

    const divStyle = {
        display : 'inline-block'
    }



/*

 <Divider orientation="left">sub-element align full</Divider>
            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24} style={{border: '1px solid'}}>
                    <div>
                        <a href="/"><img style={tempStyle} src={menuNo1} /></a>
                        <p style={colPStyle}>asdasd</p>
                    </div>
                    
                </Col>  
                <Col lg={12} xs={24} style={{border: '1px solid'}}>
                    <div>
                        <a href="/"><img style={tempStyle} src={menuNo1} /></a>
                        <p style={colPStyle}>asdasd</p>
                    </div>
                </Col>
                <Col lg={12} xs={24} style={{border: '1px solid'}}>
                    <div>
                        <a href="/"><img style={tempStyle} src={menuNo1} /></a>
                        <p style={colPStyle}>asdasd</p>
                    </div>
                    
                </Col>  
                <Col lg={12} xs={24} style={{border: '1px solid'}}>
                    <div>
                        <a href="/"><img style={tempStyle} src={menuNo1} /></a>
                        <p style={colPStyle}>asdasd</p>
                    </div>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24} style={tempStyle} >asd</Col>
                <Col lg={12} xs={24} style={tempStyle} >asd</Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24} style={tempStyle} >asd</Col>
                <Col lg={12} xs={24} style={tempStyle} >asd</Col>
            </Row>

*/

//const style = { background: 'white', padding: '8px 0' ,border: '1px solid'  ,height: '145px'};
const style = { background: 'white', padding: '8px 0' ,border: '1px solid' };

    return (
        <div style={{ width: '95%', margin: '3rem auto' }}>
           
            <p style={pStyle}>요기요 등록 음식점 </p>   
            
            <Row gutter={16}>
                {renderCards}
            </Row>
            {/* <Row gutter={[16, 16]}>
                <Col lg={12} xs={24}>
                    <div style={style}>
                        <a href="/"><img style={tempStyle} src={menuNo1} /></a>
                        <div style={divStyle}>
                            <p style={colPStyle}>asdasd</p>
                            <p style={colPStyle}>asdasd</p>
                            <p style={colPStyle}>asdasd</p>
                        </div> 


                    </div>
                </Col>
                <Col lg={12} xs={24}>
                    <div style={style}>
                        <a href="/"><img style={tempStyle} src={menuNo1} /></a>
                        <div style={divStyle}>                           
                            <p style={colPStyle}>asdasd</p>

                        </div>
                    </div>
                </Col>
            </Row> */}

        <br />

        {PostSize >= Limit &&
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={loadMoreHanlder}>더보기</button>
            </div>
        }

        </div>
    )
}

export default StorePage
