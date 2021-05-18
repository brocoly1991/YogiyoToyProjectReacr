import React from 'react'

function HomeNavBarPage(props) {

    return (  
        
            <ul style={{display: 'table',marginLeft: 'auto',marginRight: 'auto'}}>
                <li><a href="/storePage/1000">전체보기</a></li>
                <li><a href="/storePage/134">프렌차이즈</a></li>
                <li><a href="/storePage/4">치킨</a></li>
                <li><a href="/storePage/1">피자/양식</a></li>
                <li><a href="/storePage/14">중국집</a></li>
                <li><a href="/storePage/2">한식</a></li>
                <li><a href="/storePage/18">일식/돈까스</a></li>
                <li><a href="/storePage/17">족발/보쌈</a></li>
                <li><a href="/OrderInfoPage">주문정보 조회</a></li>
                <li><a href="/storeRegister">업점문의</a></li>
            </ul>
   
    )
}

export default HomeNavBarPage
