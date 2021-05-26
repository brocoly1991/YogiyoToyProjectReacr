import React, { useEffect,useState } from 'react'
import axios from "axios";
import { Col, Card, Row ,Rate } from 'antd';
import noImg from '../../../img/noOpenImg.png'

function StorePage(props) {

    const storeId = props.match.params.storeId
    const [List, setList] = useState([])
    const [ReviewListState, setReviewListState] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)

    /*==================페이지 최초 접근시 사업장 목록을가져오는 ========== */

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
    /*=============================================================================== */

    //더보기 함수
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
    
    //사업장 상세페이지이동
    const detailResInfo =(BusinessNumber,OpenYn)=>{
        if(OpenYn === 'N'){
            return alert("해당사업장은 현재 요기요 서비스가 제공되지 않습니다.")
        }
        props.history.push(`/clientMenuInfo/${BusinessNumber}`)
    }

     //사업장 목록 랜더링
    const renderCards = List.map((list, index) => {
        let strPrice = list.RestaurantPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return      <Col lg={12} xs={24}>
         <Card 
            style={{border:'3px solid #e8e8e8' ,cursor:'pointer'}} 
            onClick={()=> detailResInfo(list.BusinessNumber,list.OpenYn)} 
         >
             {list.OpenYn === 'Y' 
                ?
                <img style={{border:'1px solid' ,height:'100px' ,float:'left' ,maxWidth:'17%'}} src={`http://localhost:5000/${list.RestaurantTitleImg}`}  />
                :
                <img style={{border:'1px solid' ,height:'100px' ,float:'left' ,maxWidth:'17%'}} src={noImg}  />
             }



         <div style={{marginLeft:'20%'}}>
            <h2>{list.RestaurantName}</h2>
            <h3>최소주문금액:{strPrice}</h3>
            <h3>영업시간:{list.RestaurantStartTime}~{list.RestaurantEndTime}</h3>
         </div>
        </Card>
      </Col>
    })

    const pStyle = {
        fontSize: '18px',
        fontWeight: 'bold'
    }

    return (
        <div style={{ width: '95%', margin: '3rem auto' }}>
           
            <p style={pStyle}>요기요 등록 음식점 </p>   
            
            <Row gutter={16}>
                {renderCards}
            </Row>

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
