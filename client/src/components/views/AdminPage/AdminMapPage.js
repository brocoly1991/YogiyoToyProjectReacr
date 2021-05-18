
/*global kakao*/ 
import React, { useState , useEffect } from "react";
import {Button,Card,Col} from 'antd';
import json0 from './geojson/11.json'
import './Admin.css';
import { useDispatch,useSelector } from "react-redux";
import { modifyUserCeoInfo } from '../../../_actions/user_actions';
import { getUserInfo } from '../../../_actions/user_actions';
import { ConsoleSqlOutlined } from "@ant-design/icons";
// window.jQuery = $;
const { kakao } = window;

function AdminMapPage(props) {
    const _id = localStorage.getItem("userId")
    const [Flag, setFlag] = useState(false)
    const [State, setState] = useState(false)
    const [PolyArry, setPolyArry] = useState([])
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.getUserInfo)
    const BusinessNumber = localStorage.getItem("BusinessNumber")
    const [AreaList, setAreaList] = useState([])
    var polygons=[]; 
    let clickFlag = false
    let ArrayUserArea = []
    let loading = false

    /*==================== 최초정보 로드===================== */
    //이미등록된 배달가능지역이있는지검사 데이터존재할경우 ArrayUserArea 배열에 넣는다
    useEffect(() => { 
        if(user === undefined){
            dispatch(getUserInfo(_id)).then(response => {
                if (response.payload.success) {
                    ArrayUserArea.push(response.payload.userCeoInfo.RestaurantAreaInfo);
                    loading = true
                }else{
                    window.location.reload()
                } 
            })
        }else{
            ArrayUserArea.push(user.userCeoInfo.RestaurantAreaInfo);
            loading = true
        }
        if(loading){
            setAreaList(ArrayUserArea)
            loadMap()
        }
    }, [user])

    /* 
        kakao map api 연동  
        좌표정보는 geoJson 폴더 json파일 참조
        서울특별시 중심을 최초 중심좌표로 설정 LatLng(37.566826, 126.9786567)
        displayArea 를통해 서울특별시지역별 polygon 생성 
        최초로드시 배달가능지역에속한 지역은 빨간배경
        수정하기버튼클릭시 폴리곤 핸들링 가능
    */
    const loadMap =()=>{
        var data = json0.features;
        var coordinates = [];    //좌표 저장할 배열
        var name = '';            //행정 구 이름
        var code = '';
        var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
            mapOption = { 
                center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
                level: 9 // 지도의 확대 레벨
            };
        
        var map = new kakao.maps.Map(mapContainer, mapOption),
            customOverlay = new kakao.maps.CustomOverlay({}),
            infowindow = new kakao.maps.InfoWindow({removable: true});

            var polygonColor = '';
            data.forEach((list,index) =>{     
                coordinates = list.geometry.coordinates[0];
                name = list.properties.name;
                code = list.properties.code;
                polygonColor = '#fff';
                if(ArrayUserArea[0].length > 0){
                    ArrayUserArea[0].forEach((areaList,index) =>{
                        if(list.properties.code === areaList){
                            polygonColor = 'red' 
                        }
                    })
                }

                displayArea(coordinates,name,code,polygonColor);
            })

            function displayArea(coordinates, name,code,polygonColor) {
                var path = [];            //폴리곤 그려줄 path
                var points = [];        //중심좌표 구하기 위한 지역구 좌표들
                coordinates.forEach((coordinate,index) =>{    
                    var point = new Object(); 
                    point.x = coordinate[1];
                    point.y = coordinate[0];
                    points.push(point);
                    path.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]));
                })
                
                // 다각형을 생성합니다 
         
                    var polygon = new kakao.maps.Polygon({
                        map: map, // 다각형을 표시할 지도 객체
                        path: path,
                        strokeWeight: 2,
                        strokeColor: '#004c80',
                        strokeOpacity: 0.8,
                        fillColor: polygonColor,
                        fillOpacity: 0.7,
                    });
        
                let polygonFlag = false

                
        
                // 다각형에 mouseover 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 변경합니다 
                // 지역명을 표시하는 커스텀오버레이를 지도위에 표시합니다
                kakao.maps.event.addListener(polygon, 'mouseover', function(mouseEvent) {
                    if(!clickFlag){
                        customOverlay.setContent('<div class="area">' + name + '</div>');
                        customOverlay.setPosition(mouseEvent.latLng); 
                        customOverlay.setMap(map)
                        return false
                    }

                    if(polygon.Eb[0].fillColor === 'red'){
                        return false
                    }


                    polygon.setOptions({fillColor: '#09f'});
                    customOverlay.setContent('<div class="area">' + name + '</div>');
                    customOverlay.setPosition(mouseEvent.latLng); 
                    customOverlay.setMap(map);
                });
            
                // 다각형에 mousemove 이벤트를 등록하고 이벤트가 발생하면 커스텀 오버레이의 위치를 변경합니다 
                kakao.maps.event.addListener(polygon, 'mousemove', function(mouseEvent) {
                    if(!clickFlag){
                        return false
                    }
                    customOverlay.setPosition(mouseEvent.latLng); 
                });
            
                // 다각형에 mouseout 이벤트를 등록하고 이벤트가 발생하면 폴리곤의 채움색을 원래색으로 변경합니다
                // 커스텀 오버레이를 지도에서 제거합니다 
                kakao.maps.event.addListener(polygon, 'mouseout', function() {
                    if(!clickFlag){
                        return false
                    }


                    if(!polygonFlag){
                        polygon.setOptions({fillColor: '#fff'});
                        customOverlay.setMap(null);
                    }else{
        
                    }
        
                }); 
            
                // 다각형에 click 이벤트를 등록하고 이벤트가 발생하면 다각형의 이름과 면적을 인포윈도우에 표시합니다 
                kakao.maps.event.addListener(polygon, 'click', function(mouseEvent) {
                    debugger
                    if(!clickFlag){
                        return false
                    }

                        if(!polygonFlag){
                            polygonFlag = true
                            polygons.push(code);
                        }else{
                            polygonFlag = false
                            for(let i = 0; i < polygons.length; i++) {
                                if(polygons[i] === code)  {
                                    polygons.splice(i, 1);
                                  i--;
                                }
                            }
                        }

                        var content = '<div class="info">' + 
                                    '   <div class="title">' + name + '</div>' +
                                    '   <div class="size">총 면적 : 약 ' + Math.floor(polygon.getArea()) + ' m<sup>2</sup></area>' +
                                    '</div>';
                
                        infowindow.setContent(content); 
                        infowindow.setPosition(mouseEvent.latLng); 
                        infowindow.setMap(map);
                        setPolyArry(polygons)


                });
            }
    }
    /* ===============배달가능지역 저장함수 ======================== */
    const saveClickHandler =()=>{

        let body ={
            RestaurantAreaInfo  : PolyArry,
            BusinessNumber : BusinessNumber,
            type : 'area'
         }

         dispatch(modifyUserCeoInfo(body))
         .then(response => {
             if (response.payload.success) {
               alert('정보 저장에 성공 했습니다.')
               cancelHandler()
             }else{
                alert('정보 저장에 실패 했습니다.')
             } 
         })
    }
    /* =============================================================== */

    /* 좌측상단의 수정버튼 클릭시 기존의 배달가능지역(빨간배경색폴리곤) 제거후 지역 선택가능하도록 loadmap실행 */
    const modifyClickHandler =()=>{
        setState(true)
        clickFlag = true
        ArrayUserArea[0] = []
        loadMap()
    }
    /* ========================================================================= */

    /* ======================수정취소시 롤백 함수================== */
    const cancelHandler = ()=>{
        setState(false)
        clickFlag = false
        dispatch(getUserInfo(_id))
    }
    /* =========================================================== */

    /* ==================좌측상단의 배달가능지역 컨버젼후 랜더링함수 ================== */
    const renderAreaList = AreaList.map((list, index) => {
        let Arry = []
        list.forEach((arryList,index)=>{

            if(arryList === "11110"){
                Arry.push("종로구")
                
            }else if(arryList === "11200"){
                Arry.push("성동구")
                
            }else if(arryList === "11590"){
                Arry.push("동작구")
                
            }else if(arryList === "11170"){
                Arry.push("용산구")
                
            }else if(arryList === "11740"){
                Arry.push("강동구")
                
            }else if(arryList === "11320"){
                Arry.push("도봉구")
                
            }else if(arryList === "11545"){
                Arry.push("금천구")
                
            }else if(arryList === "11380"){
                Arry.push("은평구")
                
            }else if(arryList === "11260"){
                Arry.push("중랑구")
                
            }else if(arryList === "11680"){
                Arry.push("강남구")
                
            }else if(arryList === "11560"){
                Arry.push("영등포구")
                
            }else if(arryList === "11440"){
                Arry.push("마포구")
                
            }else if(arryList === "11215"){
                Arry.push("광진구")
                
            }else if(arryList === "11140"){
                Arry.push("중구")
                
            }else if(arryList === "11410"){
                Arry.push("서대문구")
                
            }else if(arryList === "11650"){
                Arry.push("서초구")
                
            }else if(arryList === "11230"){
                Arry.push("동대문구")
                
            }else if(arryList === "11530"){
                Arry.push("구로구")
                
            }else if(arryList === "11710"){
                Arry.push("송파구")
                
            }else if(arryList=== "11470"){
                Arry.push("양천구")
                
            }else if(arryList === "11350"){
                Arry.push("노원구")
                
            }else if(arryList === "11290"){
                Arry.push("성북구")
                
            }else if(arryList === "11500"){
                Arry.push("강서구")
                
            }else if(arryList === "11620"){
                Arry.push("관악구")
                
            }else if(arryList === "11305"){
                Arry.push("강북구")
                
            }

        })
        return Arry.toString()
    })
    /* ============================================================================== */

    return (
        <div style={{margin:'2rem'}}>
             <div id="map" style={{width:"100%", height:"800px" , position:'absolute'}}></div>
             <p class="getdata">
                {State === true &&
                <div>
                    <Button onClick={saveClickHandler} style={{height:'50px',backgroundColor:'red',color:'white',fontSize:'x-large'}}>저장하기</Button>
                    <Button onClick={cancelHandler} style={{height:'50px',backgroundColor:'red',color:'white',fontSize:'x-large'}}>취소</Button>
                </div>
                }
                
                {State === false &&
                    <div>

                        <Button onClick={modifyClickHandler} style={{height:'50px',backgroundColor:'red',color:'white',fontSize:'x-large'}}>수정하기</Button>                
                        <br></br>
                        <Col>
                        <Card style={{maxWidth: 'fit-content'}}>
                            <p>배달가능지역</p>
                            <hr />
                            {renderAreaList}
                        </Card>
                        </Col>
                    </div>
                }
             </p>

        </div>
    )
}

export default AdminMapPage
