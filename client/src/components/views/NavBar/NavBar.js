import React, { useState,useEffect } from 'react';
import { useSelector ,useDispatch} from "react-redux";
import RightMenu from './Sections/RightMenu';
import { Drawer, Button, Icon ,Badge} from 'antd';
import {FireOutlined,SolutionOutlined } from '@ant-design/icons';
import { getOrderStroeList } from '../../../_actions/order_action'
import {useHistory} from "react-router";
import './Sections/Navbar.css';
const { kakao } = window;

function NavBar(props) {

  const [visible, setVisible] = useState(false)

  const geocoder = new kakao.maps.services.Geocoder();
  
  useEffect(() => {
  // HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
  if (navigator.geolocation) {
    
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        let areaName = [];
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도

        var coord = new kakao.maps.LatLng(lat , lon);
        var callback = function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                console.log("현위치" ,result[0].address.address_name);
                window.localStorage.setItem("userAreaInfo", result[0].address.address_name);
                geocoder.addressSearch(result[0].address.region_3depth_name, callback2);
              }
        };

        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);

        var callback2 = function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                
            }
        };
    });
    
  }
  }, [])


  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  return (
    <nav className="menu" style={{ position: 'fixed', zIndex: 5, width: '100%' }}>
      <div className="menu__container" >


        <div className="menu__logo">  
          <a href="/"><img  height='60' src="https://www.yogiyo.co.kr/mobile/image/logo-yogiyo.png?v=1347775ce50a1310c136688cfa910da461498098" /></a>  
        </div>


        <div className="menu_rigth">
          <RightMenu mode="horizontal"/>
        </div>


        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <Icon type="align-right" />
        </Button>

         <Drawer
          title="Basic Drawer"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  )
}

export default NavBar