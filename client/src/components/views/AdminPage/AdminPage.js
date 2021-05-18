import React, { useEffect, useState } from 'react'
import AdminCss from './Admin.css'
import AdminPageSideNavBar from './AdminPageSideNavBar'
import OrderConfirm from '../Admin/OrderConfirm'
import MenuInfoPage from '../MenuPage/MenuInfoPage'
import StoreRegisterModify from '../StoreRegisterPage/StoreRegisterModify'
import RegisterModifyPage from '../RegisterPage/RegisterModifyPage'
import OrderinfoListPage from '../OrderPage/OrderinfoListPage'
import AdminMapPage from '../AdminPage/AdminMapPage'
import AdminChartPage from './AdminChartPage'
import AdminChartIncome from './AdminChartIncome'

function AdminPage(props) {
    /* 
        AdminPageSideNavBar 컴포넌트 사이드메뉴바 에서받아온 값(val)으로 페이지랜더링
        최초 주문내역목록 페이지 로드
    */
    const [state, setstate] = useState('admin')
    const pathName = (val)=>{
        setstate(val)
    }
 
    return (
        <div style={{margin:'2rem'}}>
        <AdminPageSideNavBar refreshFunction={pathName}/>
        {state === 'admin' && <OrderConfirm />}
        {state === 'orderList' && <OrderConfirm />}
        {state === 'menuinfo' && <MenuInfoPage />}
        {state === 'storeinfo' && <StoreRegisterModify />}
        {state === 'adminMap' && <AdminMapPage />}
        {state === 'userinfo/modify' && <RegisterModifyPage />}
        {state === 'userinfo/orderList' && <OrderinfoListPage />}
        {state === 'charts/reviewchart' && <AdminChartPage />}
        {state === 'charts/incomechart' && <AdminChartIncome />}
        </div>
    )

}
export default AdminPage


