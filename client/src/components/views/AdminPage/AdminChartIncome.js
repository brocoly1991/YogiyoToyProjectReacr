import React , { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {useSelector,useDispatch} from "react-redux";
import { Row,Col,Card} from 'antd';
import moment from 'moment';
import axios from 'axios';
import {getOrderStroeList} from '../../../_actions/order_action'

function AdminChartIncome() {
  const dispatch = useDispatch();
  const BusinessNumber = localStorage.getItem("BusinessNumber")
  const format = "YYYY-MM-DD"
  const order = useSelector(state => state.order)
  const [TodayArrt, setTodayArrt] = useState([])
  const [Todate, setTodate] = useState()
  const [TodayState, setTodayState] = useState({
    income : 0,
    cnt : 0,
    stepA : 0,
    stepB : 0,
    stepC : 0,
    stepD : 0,
  })
  const [TotalState, setTotalState] = useState({
    TotalIncome : 0,
    TotalCnt : 0,
    TotalStepA : 0,
    TotalStepB : 0,
    TotalStepC : 0,
    TotalStepD : 0,
  })
  const [ArrtState, setArrtState] = useState([])
  const [WeekState, setWeekState] = useState([])
  const [WeekStateArry, setWeekStateArry] = useState([])
  const [WeekCntStateArry, setWeekCntStateArry] = useState([])
  const [WeekTotal, setWeekTotal] = useState({
    income : 0,
    cnt : 0
  })

  useEffect(() => {
    let body = {
      BusinessNumber : BusinessNumber
    }
    dispatch(getOrderStroeList(body))
  }, [])

  /*==========================최초 사업자 주문정보로드함수======================= */
  useEffect(() => {

    var currentDay = new Date();  
    var theYear = currentDay.getFullYear();
    var theMonth = currentDay.getMonth()+1;
    var theDate  = currentDay.getDate();
    var theDayOfWeek = currentDay.getDay();
    var thisWeek = [];
    let toDayDate ='';
    
    //오늘 날짜를기준으로 이번주 날짜계산 thisWeek에담는다 ex)만약 오늘이 둘쨰주 수요일이라면 둘쨰주 날짜들을 계산 둘쨰주 일,월,화,수,목,금,토
    for(var i=0; i<7; i++) {
      var resultDay = new Date(theYear, theMonth, theDate + (i - theDayOfWeek));
      var yyyy = resultDay.getFullYear();
      var mm = Number(resultDay.getMonth());
      var dd = resultDay.getDate();
    
      mm = String(mm).length === 1 ? '0' + mm : mm;
      dd = String(dd).length === 1 ? '0' + dd : dd;
    
      thisWeek[i] = yyyy + '-' + mm + '-' + dd;
    }
    
    setWeekState(thisWeek)
    setTodate(theYear.toString()+'-'+("00" + theMonth.toString()).slice(-2)+'-'+("00" + theDate.toString()).slice(-2))
    toDayDate = theYear.toString()+'-'+("00" + theMonth.toString()).slice(-2)+'-'+("00" + theDate.toString()).slice(-2)

    let Arry = []
    let todayArry = []

    if(order.selectOrderStroeList !== undefined){
      order.selectOrderStroeList.forEach((list,index) => {
        let date = new Date(list.createdAt);
        let dateTime = moment(date).format(format);
        // 주문정보중 배달완료된 정보는 Arry 에 담는다.
        if(list.status === 'D'){
          list.createdAt = dateTime
          Arry.push(list)
        }
        // 주문정보중 오늘날짜 정보는  todayArry에담는다.
        if(dateTime === toDayDate){
          todayArry.push(list)
        }
        
      });
      setArrtState(Arry)
      setTodayArrt(todayArry)
    }else{
      // window.location.reload()
    }

  }, [order])
  /* ================================================== */

  /* ===========주문정보를 날짜기준으로 커스텀 (전체,주간,당일)================== */
  useEffect(() => {
    //총매출정보(매출액,주문건수,요청처리현황)를 커스텀
    let totalIncome = 0
    let totalCnt = ArrtState.length
    let totalStepA =0
    let totalStepB =0
    let totalStepC =0
    let totalStepD =0

    ArrtState.forEach((list,index) => {
      totalIncome = totalIncome + list.amount

      //A:접수중 , B:점수완료 , C:배달중 , D:배달완료
      if(list.status === 'A'){
        totalStepA = totalStepA +1
      }else if(list.status === 'B'){
        totalStepB = totalStepB +1
      }else if(list.status === 'C'){
        totalStepC = totalStepC +1
      }else if(list.status === 'D'){
        totalStepD = totalStepD +1
      }

    })

    // TotalIncome 총매출액정보, TotalCnt 총주문건수정보 , TotalStepA~D 요청처리현황정보
    setTotalState({
      TotalIncome : totalIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      TotalCnt : totalCnt,
      TotalStepA : totalStepA,
      TotalStepB : totalStepB,
      TotalStepC : totalStepC,
      TotalStepD : totalStepD,
    })


     //주간 매출정보(매출액,주문건수,요청처리현황)를 커스텀
     // income 매출정보 income0 :일요일 , income1 : 월요일 , income2 : 화요일 , income3 :수요일 income4 :목요일, income5 : 금요일 ,income6 : 토요일
     // cnt 주문건수정보 cnt0 :일요일 , cnt1 : 월요일 , cnt2 : 화요일 , cnt3 :수요일 cnt4 :목요일, cnt5 : 금요일 ,cnt6 : 토요일
    let weekIncome = []
    let weekCnt = []
    let income0 = 0
    let income1 = 0
    let income2 = 0
    let income3 = 0
    let income4 = 0
    let income5 = 0
    let income6 = 0
    let cnt0 = 0
    let cnt1 = 0
    let cnt2 = 0
    let cnt3 = 0
    let cnt4 = 0
    let cnt5 = 0
    let cnt6 = 0

    //전체주문정보중 이번주정보만 따로축출 후 매출정보(매출액,주문건수,요청처리현황)를 커스텀
    WeekState.forEach((list,index) => {
      ArrtState.forEach((listArr,indexArr) => {
        if(list === listArr.createdAt.substring(0,10)){
          if(index === 0){
            income0 = income0 + listArr.amount
            cnt0 = cnt0+1
          }else if(index === 1){
            income1 = income1 + listArr.amount
            cnt1 = cnt1+1
          }else if(index === 2){
            income2 = income2 + listArr.amount
            cnt2 = cnt2+1
          }else if(index === 3){
            income3 = income3 + listArr.amount
            cnt3 = cnt3+1
          }else if(index === 4){
            income4 = income4 + listArr.amount
            cnt4 = cnt4+1
          }else if(index === 5){
            income5 = income5 + listArr.amount
            cnt5 = cnt5+1
          }else if(index === 6){
            income6 = income6 + listArr.amount
            cnt6 = cnt6+1   
          }
        }
      });
    });

    weekIncome[0]=income0
    weekIncome[1]=income1
    weekIncome[2]=income2
    weekIncome[3]=income3
    weekIncome[4]=income4
    weekIncome[5]=income5
    weekIncome[6]=income6
    let totalWeekIncome = income0+income1+income2+income3+income4+income5+income6
    weekCnt[0]=cnt0
    weekCnt[1]=cnt1
    weekCnt[2]=cnt2
    weekCnt[3]=cnt3
    weekCnt[4]=cnt4
    weekCnt[5]=cnt5
    weekCnt[6]=cnt6
    let totalWeekCnt = cnt0+cnt1+cnt2+cnt3+cnt4+cnt5+cnt6
    setWeekStateArry(weekIncome)
    setWeekCntStateArry(weekCnt)
    setWeekTotal({...WeekTotal, income : totalWeekIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') , cnt : totalWeekCnt})

    //전체주문정보중 당일정보만 따로축출 후 매출정보(매출액,주문건수,요청처리현황)를 커스텀
    let todayIncome = 0  //당일 매출액
    let todayCnt = TodayArrt.length //당일주문건수
    let stepA =0  //요청처리현황 A:접수중 , B:점수완료 , C:배달중 , D:배달완료
    let stepB =0
    let stepC =0
    let stepD =0

    TodayArrt.forEach((list,index) => {
      todayIncome = todayIncome + list.amount

      if(list.status === 'A'){
        stepA = stepA +1
      }else if(list.status === 'B'){
        stepB = stepA +1
      }else if(list.status === 'C'){
        stepC = stepA +1
      }else if(list.status === 'D'){
        stepD = stepA +1
      }
    });

    setTodayState({
      income : todayIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      cnt : todayCnt,
      stepA : stepA,
      stepB : stepB,
      stepC : stepC,
      stepD : stepD,
    })
    
    
  }, [ArrtState])
  /*===================================================================================== */

  //주간 매출 chart.js Line 데이터
  const dataWeek = {
    labels: [ '일' ,'월', '화', '수', '목', '금', '토'],
    datasets: [
      {
        label: '주간매출',
        data: WeekStateArry,
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'red',
        borderColor: 'red',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'red',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'red',
        pointHoverBorderColor: 'red',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };

  //주간 주문건수 chart.js Line 데이터
  const dataWeekCnt = {
    labels: ['일' ,'월', '화', '수', '목', '금', '토'],
    datasets: [
      {
        label: '주간주문수',
        data: WeekCntStateArry,  
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'red',
        borderColor: 'red',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'red',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'red',
        pointHoverBorderColor: 'red',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
      },
    ],
  };

    return (
        <div style={{margin:'3rem',marginLeft:'4%'}}>
            <div style={{display:'flex',textAlign:'-webkit-center'}}>
              <div style={{width:'40%',marginLeft:'4%'}}>
                <Card style={{textAlign:'justify'}}>
                  <h2>당일매출</h2>
                  <h3>매출액:{TodayState.income}원</h3>
                  <h3>주문건수:{TodayState.cnt}건</h3>
                  <hr></hr>
                  <h2>요청처리현황</h2>
                  <h3>접수중({TodayState.stepA}) 접수완료({TodayState.stepB}) 배달중({TodayState.stepC}) 배달완료({TodayState.stepD})</h3>
                </Card> 
              </div>
              <div style={{width:'40%',marginLeft:'4%'}}>
                <Card style={{textAlign:'justify'}}>
                  <h2>총매출</h2>
                  <h3>매출액:{TotalState.TotalIncome}원</h3>
                  <h3>주문건수:{TotalState.TotalCnt}건</h3>
                </Card> 
              </div>
            </div>

            <br></br><hr></hr><br></br>

            <div style={{display:'flex',textAlign:'-webkit-center'}}>
              <div style={{width:'40%',marginLeft:'3%'}}>
              <h2>주간매출 ({WeekTotal.income}원)</h2>
              <Line data={dataWeek}  />
              
              </div>
              <div style={{width:'40%',marginLeft:'5%'}}>
              <h2>주간주문수({WeekTotal.cnt}건)</h2>
              <Line data={dataWeekCnt} />
              </div>
            </div>
        </div>
    )
}



export default AdminChartIncome