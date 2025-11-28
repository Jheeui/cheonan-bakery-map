import React, { useEffect, useRef } from 'react';
console.log('Client ID:', process.env.REACT_APP_NAVER_CLIENT_ID);

const NaverMap = ({ bakeries, onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // 네이버 지도 스크립트 로드
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_NAVER_CLIENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      initializeMap();
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && bakeries.length > 0) {
      updateMarkers();
    }
  }, [bakeries]);

  const initializeMap = () => {
    const { naver } = window;
    if (!naver) return;

    // 천안시 중심 좌표
    const mapOptions = {
      center: new naver.maps.LatLng(36.8151, 127.1139),
      zoom: 13,
      minZoom: 10,
      maxZoom: 18,
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    // 빵집 데이터가 있으면 마커 추가
    if (bakeries.length > 0) {
      updateMarkers();
    }
  };

  const updateMarkers = () => {
    const { naver } = window;
    if (!naver || !mapInstanceRef.current) return;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 새 마커 추가
    bakeries.forEach((bakery) => {
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(bakery.coordinates.lat, bakery.coordinates.lng),
        map: mapInstanceRef.current,
        title: bakery.name,
        icon: {
          content: `<div style="
            background-color: #ff6b6b;
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 12px;
            white-space: nowrap;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">🍞 ${bakery.name}</div>`,
          anchor: new naver.maps.Point(50, 50),
        },
      });

      // 마커 클릭 이벤트
      naver.maps.Event.addListener(marker, 'click', () => {
        if (onMarkerClick) {
          onMarkerClick(bakery);
        }
        // 지도 중심을 클릭한 마커로 이동
        mapInstanceRef.current.setCenter(new naver.maps.LatLng(bakery.coordinates.lat, bakery.coordinates.lng));
        mapInstanceRef.current.setZoom(15);
      });

      markersRef.current.push(marker);
    });

    // 모든 마커가 보이도록 지도 영역 조정
    if (bakeries.length > 0) {
      const bounds = new naver.maps.LatLngBounds();
      bakeries.forEach((bakery) => {
        bounds.extend(new naver.maps.LatLng(bakery.coordinates.lat, bakery.coordinates.lng));
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
      }}
    />
  );
};

export default NaverMap;