import React, { useEffect, useState } from 'react'
import { Route, Link } from 'react-router-dom';
import { SearchOutlined } from '@ant-design/icons';
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import AdminCss from './Admin.css'
import OrderConfirm from '../Admin/OrderConfirm'
// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

function AdminPageSideNavBar(props) {
    return (
        <div>
            <SideNav style={{position:'fixed'}}
              onSelect={(selected) => {
                  props.refreshFunction(selected)
              }}
          >
              <SideNav.Toggle />
              <SideNav.Nav defaultSelected="orderList">
                  <NavItem eventKey="orderList">
                      <NavIcon>
                      O
                      </NavIcon>
                      <NavText>
                      주문확인
                      </NavText>
                  </NavItem>
                  <NavItem eventKey="menuinfo">
                      <NavIcon>
                      M
                      </NavIcon>
                      <NavText>
                      메뉴관리
                      </NavText>
                  </NavItem>
                  <NavItem eventKey="storeinfo">
                      <NavIcon>
                      I
                      </NavIcon>
                      <NavText>
                      음식점정보관리
                      </NavText>
                  </NavItem>
                  <NavItem eventKey="adminMap">
                      <NavIcon>
                      D
                      </NavIcon>
                      <NavText>
                      배달지역관리
                      </NavText>
                  </NavItem>
                  <NavItem eventKey="userinfo">
                      <NavIcon>
                      U
                      </NavIcon>
                      <NavText>
                      회원정보
                      </NavText>
                      <NavItem eventKey="userinfo/modify">
                          <NavText>
                              회원정보수정
                          </NavText>
                      </NavItem>
                      <NavItem eventKey="userinfo/orderList">
                          <NavText>
                              회원주문내역
                          </NavText>
                      </NavItem>
                  </NavItem>
                  <NavItem eventKey="charts">
                      <NavIcon>
                          C
                      </NavIcon>
                      <NavText>
                          Charts
                      </NavText>
                      <NavItem eventKey="charts/reviewchart">
                          <NavText>
                              리뷰통계
                          </NavText>
                      </NavItem>
                      <NavItem eventKey="charts/incomechart">
                          <NavText>
                              매출통계
                          </NavText>
                      </NavItem>
                  </NavItem>
              </SideNav.Nav>
          </SideNav>            
        </div>
    )
}

export default AdminPageSideNavBar
