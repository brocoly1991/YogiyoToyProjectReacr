import React, { useEffect, useState } from 'react'
import { useDispatch ,useSelector } from 'react-redux';
import { Table ,Card, Button ,Input } from 'antd';

function OrderConfirmTable(props) {
    const BusinessNumber = localStorage.getItem("BusinessNumber")
    const dispatch = useDispatch();
    const [Data, setData] = useState([])
    const [OrderListData, setOrderListData] = useState([])
    const [DataSecond, setDataSecond] = useState([])
    const [OrderListDataSecond, setOrderListDataSecond] = useState([])
    let order = useSelector(state => state.order);

    useEffect(() => {

        if(!props.flag){

        }else{
            data = []
            props.dataSource.forEach(item => {            
                if(item.status === '접수중'){
                    setOrderListData(item.list)
                    data.push({
                        key: item.key,
                        no: item.no,
                        tell: item.tell,
                        address: item.address,
                        status : item.status,
                        originStatus : item.originStatus,
                        color : item.color,
                        backgroundColor: item.backgroundColor,
                        date : item.date,
                        price : item.price,
                        list : item.list 
                    })                
                }
            })
            setData(data)
        }

        
    }, [props])

    useEffect(() => {

        if(!props.flag){

        }else{
            dataSecond = []
            props.dataSource.forEach(item => {
                if(item.status === '배달중'){
                    setOrderListDataSecond(item.list)
                    dataSecond.push({
                        key: item.key,
                        no: item.no,
                        tell: item.tell,
                        address: item.address,
                        status : item.status,
                        originStatus : item.originStatus,
                        color : item.color,
                        backgroundColor: item.backgroundColor,
                        date : item.date,
                        price : item.price,
                        list : item.list 
                    })                
                }
            })
            setDataSecond(dataSecond)
        }


    }, [props])

    let data = [...Data]
    let dataSecond = [...DataSecond]


    // props.dataSource.forEach(item => {
    //     console.log("AS",item.status)
    // })

    const columns = [
        { title: '주문번호', dataIndex: 'no', key: 'no' ,width : 210},
        // { title: '고객번호', dataIndex: 'tell', key: 'tell'  ,width : 120 },
        // { title: 'Address', dataIndex: 'address', key: 'address',width : 650},
        { title: '주문시간', dataIndex: 'date', key: 'date',width : 155 ,sorter: true},
        { title: '주문상태', dataIndex: 'status', key: 'status',}
    ];

    

    const modifyHnadler =(val,key)=>{
        props.returnFuction(val,key)
    }   
    
    const rendering =(val) =>{
        console.log("val" , val)
        let result =[]
        val.forEach((info, index) => {
        console.log("Ad" , info)
        result.push(
             <Card style={{marginBottom:'1%'}} key={index}>
                {info.title} <span style={{marginLeft : '1%'}}>({info.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원)</span>
                <span style={{marginRight:'1%' , marginLeft : '1%'}}>x</span>          
                {info.cnt}개
            </Card>
        )
        })
        return result  
    }
    const renderingSecond = (val)=>{
        console.log("val" , val)
        let result =[]
        val.forEach((info, index) => {
        console.log("Ad" , info)
        result.push(
             <Card style={{marginBottom:'1%'}} key={index}>
                {info.title} <span style={{marginLeft : '1%'}}>({info.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원)</span>
                <span style={{marginRight:'1%' , marginLeft : '1%'}}>x</span>          
                {info.cnt}개
            </Card>
        )
        })
        return result
    };

    return (
        <div>
            <div style={{display:'flex',justifyContent: 'space-around' }}>
                <h2>접수중 목록({Data.length})</h2>
                <h2>배달중 목록({DataSecond.length})</h2>
            </div>


            <div style={{display:'flex',justifyContent: 'space-between',width:'100%'}}>
                <Table
                    style={{width:'48%'}}
                    columns={columns}       
                    pagination={{ pageSize: 5}}
                    // scroll={{ y: 300 }}
                    dataSource={data}
                    expandedRowRender={
                        record => 
                            <Card style={{ margin: 0 }}> 
                            <h2>주문번호: {record.no}</h2>
        
                            {/* {renderCards} */}
                            {rendering(record.list)}
                            <h2>총금액: {record.price}원</h2>  
                            <h3>배달주소 : {record.address}</h3>
                            <h3>전화번호 : {record.tell}</h3>
        
                            { record.originStatus === 'A' &&
                                <Button  onClick={()=>modifyHnadler(record.originStatus , record.key)} style={{backgroundColor:'#4df402',color:'black'}}>접수중</Button>
                            }
                            { record.originStatus === 'B' &&
                                <Button  onClick={()=>modifyHnadler(record.originStatus , record.key)} style={{width:'10%',backgroundColor:'#f1f128',color:'black'}}>접수완료</Button>
                            }
                            { record.originStatus === 'C' &&
                                <Button onClick={()=>modifyHnadler(record.originStatus , record.key)} style={{width:'10%',backgroundColor:'#2861f1',color:'white'}}>배달중</Button>
                            }
                            { record.originStatus === 'D' &&
                                <Button style={{width:'10%',backgroundColor:'red',color:'white'}}>배달완료</Button>
                            }
                            { record.originStatus === 'E' &&
                                <Button style={{width:'10%',backgroundColor:'#dddddd',color:'black',cursor:'auto'}}>주문취소</Button>
                            }
                            
                            </Card>
                    }
                />
                <Table
                    style={{width:'48%'}}
                    columns={columns}       
                    pagination={{ pageSize: 5}}
                    // scroll={{ y: 300 }}
                    dataSource={dataSecond}
                    expandedRowRender={
                        record => 
                            <Card style={{ margin: 0 }}> 
                            <h2>주문번호: {record.no}</h2>
        
                            {/* {renderCardsSecond} */}
                            {renderingSecond(record.list)}
                            <h2>총금액: {record.price}원</h2>  
                            <h3>배달주소 : {record.address}</h3>
                            <h3>전화번호 : {record.tell}</h3>
        
                            { record.originStatus === 'A' &&
                                <Button  onClick={()=>modifyHnadler(record.originStatus , record.key)} style={{backgroundColor:'#4df402',color:'black'}}>접수중</Button>
                            }
                            { record.originStatus === 'B' &&
                                <Button  onClick={()=>modifyHnadler(record.originStatus , record.key)} style={{backgroundColor:'#f1f128',color:'black'}}>접수완료</Button>
                            }
                            { record.originStatus === 'C' &&
                                <Button onClick={()=>modifyHnadler(record.originStatus , record.key)} style={{backgroundColor:'#2861f1',color:'white'}}>배달중</Button>
                            }
                            { record.originStatus === 'D' &&
                                <Button style={{backgroundColor:'red',color:'white'}}>배달완료</Button>
                            }
                            { record.originStatus === 'E' &&
                                <Button style={{backgroundColor:'#dddddd',color:'black',cursor:'auto'}}>주문취소</Button>
                            }
                            
                            </Card>
                    }
                />
            </div>
        </div>
    )
}

export default OrderConfirmTable
