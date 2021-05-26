import React, { Suspense , useState ,useEffect} from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import RegisterModifyPage from "./views/RegisterPage/RegisterModifyPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
// import UploadProductPage from "./views/UploadProductPage/UploadProductPage.js";
import SaveMenuPage from "./views/SaveMenuPage/SaveMenuPage.js";

import DetailProductPage from "./views/DetailProductPage/DetailProductPage";
import CartPage from './views/CartPage/CartPage';
import HistoryPage from './views/HistoryPage/HistoryPage';
import HomePage from "./views/HomePage/HomePage.js";
import StorePage from "./views/StorePage/StorePage.js";
import MyPage from "./views/MyPage/MyPage.js";
import StoreRegisterPage from "./views/StoreRegisterPage/StoreRegisterPage.js";
import StoreRegisterModify from "./views/StoreRegisterPage/StoreRegisterModify.js";
import MenuInfoPage from "./views/MenuPage/MenuInfoPage.js";
import MenuModifyPage from "./views/MenuPage/MenuModifyPage.js";
import ClientMenuInfoPage from "./views/ClientMenu/ClientMenuInfoPage.js";
import OrderPage from "./views/OrderPage/OrderPage.js";
import OrderInfoPage from "./views/OrderPage/OrderInfoPage.js";
import OrderinfoListPage from "./views/OrderPage/OrderinfoListPage.js";
import OrderConfirm from "./views/Admin/OrderConfirm.js";
import AdminPage from "./views/AdminPage/AdminPage.js";
import AdminMapPage from "./views/AdminPage/AdminMapPage.js";
//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside


function App() {


  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      {/* 화면우측상단의 정보표시 */}
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(HomePage, null)} />
          {/* 메인화면 */}
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          {/* 로그인 페이지 라우터 */}
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
           {/* 회원가입 페이지 라우터 */}
          <Route exact path="/register/modify" component={Auth(RegisterModifyPage, true)} />
          {/* mypage 내정보 수정 페이지 라우터 */}
          <Route exact path="/menuinfo" component={Auth(MenuInfoPage, true)} />
          {/* 메뉴 / 리뷰 / 정보 가져오는 상위컴포넌트 라우터*/}
          <Route exact path="/storePage/:storeId" component={Auth(StorePage, null)} />
          {/* 음식점리스트 가져오는 페이지 라우터 */}
          <Route exact path="/register/ceoModify" component={Auth(StoreRegisterModify, true)} />
          {/* 업장 정보수정페이지 라우터*/}
          <Route exact path="/mypage" component={Auth(MyPage, true)} />
          {/* myPage 라우터*/}
          <Route exact path="/storeRegister" component={Auth(StoreRegisterPage, null)} />
          {/* 업점문의 온라인 입점신청 라우터 */}
          <Route exact path="/product/upload" component={Auth(SaveMenuPage, true)} />
          {/* 메뉴및메뉴그룹등록 페이지 라우터*/}
          <Route exact path="/menuModify/:menuId" component={Auth(MenuModifyPage, null)} />
          {/* 메뉴 수정 페이지 라우터*/}
          <Route exact path="/clientMenuInfo/:menuId" component={Auth(ClientMenuInfoPage, null)} />
          {/* 메뉴정보 페이지 (고객용) 라우터 */}
          <Route exact path="/orderPage" component={Auth(OrderPage, null)} />
          {/* 결제페이지 라우터 */}
          <Route exact path="/OrderInfoPage" component={Auth(OrderInfoPage, null)} />
          {/* 주문정보조회(단건) 페이지 라우터 */}
          <Route exact path="/OrderinfoListPage" component={Auth(OrderinfoListPage, true)} />
          {/* 주문정보조회 페이지 라우터 */}
          <Route exact path="/OrderConfirm" component={Auth(OrderConfirm, true)} />
          {/* 주문내역 목록 라우터 */}
          <Route exact path="/AdminPage" component={Auth(AdminPage, true)} />
          {/* 사장님페이지 라우터 */}
          <Route exact path="/AdminMapPage" component={Auth(AdminMapPage, true)} />
          {/* 배달지역관리페이지 라우터 */}
          
          {/* 데모페이지라우터모음 */}
          <Route exact path="/product/:productId" component={Auth(DetailProductPage, null)} />
          <Route exact path="/LandingPage" component={Auth(LandingPage, null)} />
          <Route exact path="/user/cart" component={Auth(CartPage, true)} />
          <Route exact path="/history" component={Auth(HistoryPage, true)} />
          
          
        </Switch>
      </div>
      
      <Footer />
    </Suspense>
  );
}

export default App;
