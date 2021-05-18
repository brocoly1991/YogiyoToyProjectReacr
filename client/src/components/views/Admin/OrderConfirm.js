import React, { useEffect, useState } from 'react'
import { Table ,Card, Button ,Input ,Pagination } from 'antd';
import { useDispatch ,useSelector } from 'react-redux';
import axios from "axios";
import { getOrderStroeList } from '../../../_actions/order_action'
import { modifyOrderStroeList } from '../../../_actions/order_action'
import OrderConfirmTable from './Section/OrderConfirmTable'

import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
function OrderConfirm(props) {

    const { Search } = Input;
    const dispatch = useDispatch();
    const order = useSelector(state => state.order);
    const BusinessNumber = localStorage.getItem("BusinessNumber")
    const [Data, setData] = useState([])
    const [Flag, setFlag] = useState(true)
    const format = "YYYY-MM-DD HH:mm"
    const [test, settest] = useState(false)

    /* ========================최초 정보조회===================== */
    useEffect(() => {
        let body = {
            BusinessNumber : BusinessNumber,
        }
        getOrderInfoList(body)    
    }, [order])
    
    const getOrderInfoList =(body)=>{

        let data = []
        // dispatch(getOrderStroeList(body)).then(response => {
            axios.post(`/api/business/getOrderStroeList` ,body).then(response => {
            if (response.data.success) { 
                response.data.orderList.forEach(item => {

                    let customStatus
                    let backgroundColor
                    let color

                    if(item.status === 'A'){
                        customStatus = '접수중'
                        backgroundColor = '#4df402'
                        color = 'black'
                    }else if(item.status === 'B'){
                        customStatus = '접수완료'
                        backgroundColor = '#f1f128'
                        color = 'black'
                    }else if(item.status === 'C'){
                        customStatus = '배달중'
                        backgroundColor = '#2861f1'
                        color = 'white'
                    }else if(item.status === 'D'){
                        customStatus = '배달완료'
                        backgroundColor = 'red'
                        color = 'white'
                    }else{
                        customStatus = '주문취소'
                        backgroundColor = '#dddddd'
                        color = 'black'
                    }

                    let date = new Date(item.createdAt);
                    let dateTime = moment(date).format(format);
                    data.push({
                        key: item._id,
                        no: item.no,
                        tell: item.buyer_tel,
                        address: item.buyer_addr,
                        status : customStatus,
                        originStatus : item.status,
                        color : color,
                        backgroundColor: backgroundColor,
                        date : dateTime,
                        price : item.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                        list : item.OrderList 
                    })
                })
                setData(data)                     
            }else{
                alert("데이터 로딩에 실패하엿습니다.")
            }
        })

    }
    /*================================================================================== */


    /*=============================주문상태 변경 함수============================= */
    const modifyHandler = (val,key)=>{

        const confirm_test = window.confirm("주문 상태를 변경 하시겟습니까?");
         
        if ( confirm_test == false  ) {
            return false;
        } 

        if(val === 'A'){
            val = 'B'
        }else if(val === 'B'){
            val = 'C'
        }else if(val === 'C'){
            val = 'D'
        }

        let body = {
            BusinessNumber : BusinessNumber,
            key : key,
            status : val
        }

        dispatch(modifyOrderStroeList(body)).then(response => {
            if (response.payload.success) {
                alert("주문상태가 변경되엇습니다")
                let body = {
                    BusinessNumber : BusinessNumber,
                }
                dispatch(getOrderStroeList(body))
            } else {
                alert("실패 했습니다.")
            }
        })
    }
    /*================================================================================== */

    /*=============================antDesgin table 컬럼 설정============================= */
    const columns = [
        { title: '주문번호', dataIndex: 'no', key: 'no' ,width : 210},
        { title: '고객번호', dataIndex: 'tell', key: 'tell'  ,width : 120 },
        { title: 'Address', dataIndex: 'address', key: 'address',width : 650},
        { title: '주문시간', dataIndex: 'date', key: 'date',width : 155 ,sorter: true},
        { title: '주문상태', dataIndex: 'status', key: 'status' ,
        onCell: (record, rowIndex) => ({
            style: {
                backgroundColor: record.backgroundColor,
                color : record.color
                }
          }),
          filters: [
            { text: '접수중', value: 'A' },
            { text: '접수완료', value: 'B' },
            { text: '배달중', value: 'C' },
            { text: '배달완료', value: 'D' },
            { text: '주문취소', value: 'E' },
          ], 
        }
    ];
    /*================================================================================== */

    /*=============================주문번호 검색 함수============================= */
    const onSearch =(value)=>{
        // data = []
        let body = {}
        if(value.length === 0){
            body = {
                BusinessNumber : BusinessNumber,
            }
        }else{
            body = { 
                BusinessNumber : BusinessNumber,
                text : value,
                term : 'Y'
            }
        }
        getOrderInfoList(body)        
    }
    /*================================================================================== */

    /*=============================주문상태 필터 핸들러 함수============================= */
    const handleTableChange = (pagination, filters, sorter)=>{
        setFlag(false)

        if(Array.isArray(filters.status) && filters.status.length === 0 || filters.status === undefined)  {
            filters.status =['A','B','C','D','E']
        }

        // data = []
        let body = {
            BusinessNumber : BusinessNumber,
            pagination : pagination,
            filters : filters,
            sorter : sorter
        }
        getOrderInfoList(body)
    }
    /*================================================================================== */


    const rendering = (val)=>{
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
        
        <div style={{ width: '95%', margin: '5rem auto'}}>

            <div style={{marginBottom:'1%'}}>
                <h2>주문내역 목록 ({Data.length}) </h2>
                <Search style={{width:'20%'}} placeholder="주문번호를 입력하세요" allowClear onSearch={onSearch} />
            </div>

            <Table
            style={{width:'100%'}}
            rowKey={record => record.key}
            columns={columns}   
            expandedRowRender={
                record => 
                    <Card style={{ margin: 0 }}> 
                    <h2>주문번호: {record.no}</h2>

                        {rendering(record.list)}

                    <h2>총금액: {record.price}원</h2>  
                    <h3>배달주소 : {record.address}</h3>
                    <h3>전화번호 : {record.tell}</h3>

                    { record.originStatus === 'A' &&
                        <Button onClick={()=>modifyHandler(record.originStatus , record.key)} style={{backgroundColor:'#4df402',color:'black'}}>접수중</Button>
                    }
                    { record.originStatus === 'B' &&
                        <Button onClick={()=>modifyHandler(record.originStatus , record.key)} style={{width:'10%',backgroundColor:'#f1f128',color:'black'}}>접수완료</Button>
                    }
                    { record.originStatus === 'C' &&
                        <Button onClick={()=>modifyHandler(record.originStatus , record.key)} style={{width:'10%',backgroundColor:'#2861f1',color:'white'}}>배달중</Button>
                    }
                    { record.originStatus === 'D' &&
                        <Button style={{width:'10%',backgroundColor:'red',color:'white'}}>배달완료</Button>
                    }
                    { record.originStatus === 'E' &&
                        <Button style={{width:'10%',backgroundColor:'#dddddd',color:'black',cursor:'auto'}}>주문취소</Button>
                    }
                    
                    </Card>
            }
                pagination={{ pageSize: 10}}
                dataSource={Data}
                onChange={handleTableChange}
            />

            <OrderConfirmTable 
                dataSource={Data}     
                returnFuction = {modifyHandler}    
                flag = {Flag}
            />
        </div>
    )
}

export default OrderConfirm


