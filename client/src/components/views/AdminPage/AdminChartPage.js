import React, { useEffect, useState } from 'react'
import {Bar,Doughnut} from 'react-chartjs-2';
import { Card} from 'antd';
import { useDispatch,useSelector} from "react-redux";
import { getReviewList } from '../../../_actions/review_action';
import moment from 'moment';
function AdminChartPage() {
  const BusinessNumber = localStorage.getItem("BusinessNumber")
  // const review = useSelector(state => state.review )
  const dispatch = useDispatch();
  const [ArryBarstate, setArryBarstate] = useState([])
  const [ArryBarMonthstate, setArryBarMonthstate] = useState([])
  const [SecBarLength, setSecBarLength] = useState(0)
  const [ReviewState, setReviewState] = useState([])
  const [Total, setTotal] = useState(0)
  const [TotalMonth, setTotalMonth] = useState(0)
  let arryBar = []
  let arryBarMonth = []
  let arryBarMonthLenght = 0;
  let total = 0;
  let totalMonth = 0;
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth()+1
  let day = date.getDate();

  /* ===================해당사업장에 등록된 리뷰정보 로드========= */
  useEffect(() => {   
      getReiveList(BusinessNumber)
  },[])

  const getReiveList = (val)=>{
    
      let cnt1 = 0
      let cnt2 = 0
      let cnt3 = 0
      let cnt4 = 0
      let cnt5 = 0

      let body = {
          BusinessNumber : val
      }
      
      dispatch(getReviewList(body)).then(response => {


          if (response.payload.success) {
              setReviewState(response.payload.review) //전체리뷰정보셋팅
              response.payload.review.forEach((list,index) => {
                total = total+list.rate
                // 로드한 리뷰정보들중 기준달(현재5월이라면 5월리뷰정보)리뷰정보만 arryBarMonth 배열에 담는다.)
                let returnTime = formatTime(list.createdAt)
                if(year.toString()+("00" + month.toString()).slice(-2) === returnTime.toString()){
                  arryBarMonth.push(list)
                }
                //리뷰점수계산
                if(list.rate === 1){
                  cnt1++
                }else if(list.rate === 2){
                  cnt2++
                }else if(list.rate === 3){
                  cnt3++
                }else if(list.rate === 4){
                  cnt4++
                }else if(list.rate === 5){
                  cnt5++
                }
              });
              setTotal((total/response.payload.review.length).toFixed(1))
              arryBar=[cnt1,cnt2,cnt3,cnt4,cnt5]
              setArryBarstate(arryBar) // 리뷰점수badge용
              renderSecondBar(arryBarMonth) // 이번달리뷰정보커스텀함수
              setSecBarLength(arryBarMonth.length)  //리뷰갯수를위한
          }else{
              window.location.reload()
          }
      })
  }
  /* ================================================================================ */
  
  /* ========================이번달 리뷰 커스텀함수============================== */
  const renderSecondBar = (arryBarMonth)=>{
    let secondBarcnt1 = 0
    let secondBarcnt2 = 0
    let secondBarcnt3 = 0
    let secondBarcnt4 = 0
    let secondBarcnt5 = 0

    arryBarMonth.forEach((list,index) => {
      totalMonth = totalMonth + list.rate
      //리뷰점수계산
      if(list.rate === 1){
        secondBarcnt1++
      }else if(list.rate === 2){
        secondBarcnt2++
      }else if(list.rate === 3){
        secondBarcnt3++
      }else if(list.rate === 4){
        secondBarcnt4++
      }else if(list.rate === 5){
        secondBarcnt5++
      }
    })

    setTotalMonth((totalMonth/arryBarMonth.length).toFixed(1))
    setArryBarMonthstate([secondBarcnt1,secondBarcnt2,secondBarcnt3,secondBarcnt4,secondBarcnt5])
  }

  /* =================날짜포멧함수================ */
  const formatTime = (value)=>{
    const format = "YYYYMM"
    let date = new Date(value);
    let dateTime = moment(date).format(format);
    return dateTime
  }
  /*===============================================*/

  //전체리뷰 chart.js bar data정보
  const data = {
    labels: ['1점', '2점', '3점', '4점', '5점'],
    datasets: [
      {
        label: '전체리뷰',
        backgroundColor: '#0030ffc9',
        borderColor: '#0030ffc9',
        borderWidth: 1,
        hoverBackgroundColor: 'red',
        hoverBorderColor: '#0030ffc9',
        data : ArryBarstate
      }
    ]
  };

  const dataDoughnut = {
    labels: [
      '1점',
      '2점',
      '3점',
      '4점',
      '5점',
    ],
    datasets: [{
      data: ArryBarstate,
      backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      'blue',
      'red'
      ],
      hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      'blue',
      'red'
      ]
    }]
  };

  // 이번달리뷰 chart.js bar data정보
  const dataMonth = {
    labels: ['1점', '2점', '3점', '4점', '5점'],
    datasets: [
      {
        label: '이번달리뷰',
        backgroundColor: '#0030ffc9',
        borderColor: '#0030ffc9',
        borderWidth: 1,
        hoverBackgroundColor: 'red',
        hoverBorderColor: '#0030ffc9',
        data : ArryBarMonthstate
      }
    ]
  };
  
  const dataDoughnutSecond = {
    labels: [
      '1점',
      '2점',
      '3점',
      '4점',
      '5점',
    ],
    datasets: [{
      data: ArryBarMonthstate,
      backgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      'blue',
      'red'
      ],
      hoverBackgroundColor: [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      'blue',
      'red'
      ]
    }]
  };

    return (
        <div style={{margin:'3rem',marginLeft:'6%'}}>
            <div style={{display:'flex',textAlign:'-webkit-center'}}>
              <div style={{width:'50%',marginLeft:'3%'}}>
              <h2>전체리뷰({ReviewState.length}) / 평균({Total}) </h2>
              <Bar
              data={data}
              width={100}
              height={50}
              // options={{
              //     maintainAspectRatio: false
              // }}
              />
              </div>
              
              <div style={{width:'20%',marginLeft:'6%',marginTop:'5%'}}>
              <Doughnut data={dataDoughnut}/>
              </div>


            </div>

            <br></br><hr></hr>
              
            <div style={{display:'flex',textAlign:'-webkit-center',marginTop:'2%'}}>
              <div style={{width:'50%',marginLeft:'3%'}}>
              <h2>이번달리뷰({SecBarLength}) / 평균({TotalMonth}) </h2>
              <Bar
              data={dataMonth}
              width={100}
              height={50}
              />
              </div>

              <div style={{width:'20%',marginLeft:'6%',marginTop:'5%'}}>
              <Doughnut data={dataDoughnutSecond}/>
              </div>
            </div>

        </div>
    )
}

export default AdminChartPage
