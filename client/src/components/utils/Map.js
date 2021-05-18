import React,{useEffect} from 'react'
const { kakao } = window;

function Map(props) {
  
    // 해당사업장의 위도,경도 좌표값의로 지도에 마커표시 
    useEffect(()=>{
        var container = document.getElementById('map');
        var options = {
          center: new kakao.maps.LatLng(props.Lat,props.Lon),
          level: 3
        };
    
        var map = new kakao.maps.Map(container, options);
        var markerPosition  = new kakao.maps.LatLng(props.Lat,props.Lon); 
        var marker = new kakao.maps.Marker({
          position: markerPosition
      });
      marker.setMap(map);
    
    }, [])
    

    return (
        <div>
            <div id="map" style={{width:"100%", height:"400px"}}></div> 
        </div>
    )
}

export default Map
