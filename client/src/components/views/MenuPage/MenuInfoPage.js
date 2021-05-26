import React, { useEffect, useState } from 'react'
import MenuHeadInfo from './MenuHeadInfo';
import { useDispatch ,useSelector } from 'react-redux';
import { getUserInfo } from '../../../_actions/user_actions';

function MenuInfoPage(props) {
    /* 메뉴등록및관리페이지 최상위컴포넌트 */
    let user = useSelector(state => state.user);
    const _id = localStorage.getItem("userId")
    const dispatch = useDispatch();
    const [UserInfo, setUserInfo] = useState({})
    const [UserCeoInfo, setUserCeoInfo] = useState({})
    
    useEffect(() => {
        if(user.getUserInfo == undefined){
            dispatch(getUserInfo(_id)).then(response => {
                if (response.payload.success) {
                  setUserInfo(response.payload.userInfo)     
                  setUserCeoInfo(response.payload.userCeoInfo)
                }else{
                    alert("로딩실패")
                } 
            })
        }else{
            setUserInfo(user.getUserInfo.userInfo)
            setUserCeoInfo(user.getUserInfo.userCeoInfo) 
        }
    }, [user])

    return (
        <div style={{ width: '90%', margin: '3rem auto' ,marginLeft:'5%'}}>
            <h2>메뉴 등록 및 사업장 관리</h2>
            <MenuHeadInfo 
                name ={UserCeoInfo.RestaurantName} 
                payment ={UserCeoInfo.RestaurantPayment}
                delivery = {UserCeoInfo.RestaurantDelivery}
                price = {UserCeoInfo.RestaurantPrice}
                BusinessNumber = {UserCeoInfo.BusinessNumber}
                Lat = {UserCeoInfo.Lat}
                Lon = {UserCeoInfo.Lon}
                UserCeoInfo = {UserCeoInfo}
            />
        </div>
    )
}

export default MenuInfoPage
