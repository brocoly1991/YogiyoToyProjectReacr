
import React ,{ useEffect,useState}from 'react';
import axios from 'axios';
import { Drawer, Button, Icon ,Badge} from 'antd';
import { USER_SERVER } from '../../../Config';
import { withRouter } from 'react-router-dom';
import { useSelector ,useDispatch} from "react-redux";
import { menuOrderStorage } from "../../../../_actions/menu_action";
import { getOrderStroeList } from '../../../../_actions/order_action'
import {FireOutlined,SolutionOutlined } from '@ant-design/icons';
import {useHistory} from "react-router";
import './Navbar.css';
function RightMenu(props) {

  const [Cnt, setCnt] = useState(0)
  const btnStyle = {
    background: "#ff8a00"
  }

  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.user)
  const menu = useSelector(state => state.menu)
  const order = useSelector(state => state.order)
  let BusinessNumber = localStorage.getItem("BusinessNumber")

  useEffect(() => {
      let body = {
        BusinessNumber : BusinessNumber,
      }
      // dispatch(getOrderStroeList(body)).then(response => {
        axios.post(`/api/business/getOrderStroeList` ,body).then(response => {  
        let cnt = 0
        response.data.orderList.forEach(item => {
            if(item.status === 'A'){
              cnt++
            }
            setCnt(cnt)
        })
      })
  }, [order])


//   useEffect(() => {
//     if(order.selectOrderStroeList !== undefined){
//       let cnt = 0
//       for(var i =0 ; i<order.selectOrderStroeList.length;i++){
//         if(order.selectOrderStroeList[i].status === 'A'){
//           cnt++
//         }
//         setCnt(cnt)
//       }
//     }
// }, [order])


  /*주문정보 관련 함수 주문정보가 있을경우 order localstorage에 저장 이를 redux로 관리하여 실시간으로
   확인가능하도록==================================================================================*/

  let orderExist = JSON.parse(window.localStorage.getItem("order")) ? JSON.parse(window.localStorage.getItem("order")) : ''

  //주문표에 주문정보가 있을경우에 클릭이 가능하도록 ,주문표에 주문정보가 있으면 클릭시 해당 store정보 페이지로 이동
  const orderClickHandler =()=>{

    let BusinessNumber = JSON.parse(window.localStorage.getItem("orderMenuId"))
    if(BusinessNumber === undefined || BusinessNumber === null || BusinessNumber ===""){
      return
    }
    window.location.replace(`/clientMenuInfo/${BusinessNumber}`)
  }
  /*=====================================================================================================================*/

  /*로그인 / 로그아웃 관련 함수========================================================================================*/
  const loginHandlerButton = () => {
    props.history.push("/login");
  }

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        localStorage.clear()
        props.history.push("/login");
        window.location.reload();
      } else {
        alert('Log Out Failed')
      }
    });
  };
  /*==================================================================================================================*/



  //로그인한 유저와 하지않은 유저에 따른 render 일반회원의 경우 role = 0 , 사업자의경우 role= 1, 
  //또한 사업자 회원가입후 사업장을 등록하지않을경우 BusinessNumber = 0 사업장을 등록한경우 사업자번호가 존재
  // role = 0 일경우 myPage호출 , role=1 이지만 사업자를 등록하지않았을경우 사업자등록을위한 myPage호출
  // role=1,BusinessNumber등록되어있을경우 사장님페이지호출
  // orderExist  == 주문표에 담겨있는 정보
  // Cnt 해당사업장으로 주문상태 (접수중) 에해당하는 정보갯수
  if (user.userData && !user.userData.isAuth) {
   
    return (

      <div>
        <button onClick={loginHandlerButton}
          className="menu__login-button"
          type="primary"
        >로그인
        <a href="/login"></a>
        </button>
        <button style={btnStyle}
          className="menu__login-button"
          type="primary"
          onClick={orderClickHandler}
        >주문표({orderExist.length})
        </button>
      </div>
    )
  } else {
    if(BusinessNumber > 0){
      return (
        <div>
        <button onClick={logoutHandler}
          className="menu__login-button"
          type="primary"
        >로그아웃
        </button>

       <button
        className="menu__login-button"
        type="primary"
        onClick={() => props.history.push('/AdminPage')}
      >사장님페이지       
      </button>

        <button style={btnStyle}
          className="menu__login-button"
          type="primary"
          onClick={orderClickHandler}
        >주문표({orderExist.length})
        </button>

        <div  style={{marginTop:'1.5rem',cursor:'pointer',float:'right'}}
          onClick={()=> history.push('/OrderConfirm')}
        >
          {Cnt > 0 &&
            <Badge className='neon' count={Cnt} overflowCount={10}>
            <SolutionOutlined  style={{fontSize:'50px' ,color:'white'}}/>
          </Badge>
          }

        </div>

        <div>
          <button           
            className="menu__login-button-r"
            type="primary"
            onClick={() => props.history.push('/OrderInfoPage')}>
            주문정보조회
          </button>
        </div>

        </div>    
        )
    }else{
      return (
          <div>
            <button onClick={logoutHandler}
              className="menu__login-button"
              type="primary"
            >로그아웃
            </button>

            <button
              className="menu__login-button"
              type="primary"
            > 
            <a style={{ color:'white' }} href="/mypage">mypage</a>       
            </button>

            <button style={btnStyle}
              className="menu__login-button"
              type="primary"
              onClick={orderClickHandler}
            >주문표({orderExist.length})
            </button>

            <div>
              <button           
                className="menu__login-button-r"
                type="primary"
                onClick={() => props.history.push('/OrderInfoPage')}>
                주문정보조회
              </button>
            </div>

            </div>        
        )
    }

  }
}

export default withRouter(RightMenu);
