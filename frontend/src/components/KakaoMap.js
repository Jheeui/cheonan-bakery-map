import React, { useEffect, useRef } from 'react';

const KakaoMap = ({ bakeries, onMarkerClick }) => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    // 카카오맵 스크립트 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      console.log('✅ 카카오맵 스크립트 로드 성공!');
      window.kakao.maps.load(() => {
        console.log('✅ 카카오맵 API 로드 완료!');
        initMap();
      });
    };

    script.onerror = () => {
      console.error('❌ 카카오맵 스크립트 로드 실패');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current && bakeries.length > 0) {
      addMarkers();
    }
  }, [bakeries]);

  const initMap = () => {
    const container = mapContainer.current;
    const options = {
      center: new window.kakao.maps.LatLng(36.8151, 127.1139),
      level: 5,
    };

    const map = new window.kakao.maps.Map(container, options);
    mapInstance.current = map;
    console.log('✅ 지도 생성 완료!');

    if (bakeries.length > 0) {
      addMarkers();
    }
  };

  const addMarkers = () => {
    // 기존 마커 제거
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();

    bakeries.forEach((bakery) => {
      const position = new window.kakao.maps.LatLng(
        bakery.coordinates.lat,
        bakery.coordinates.lng
      );

      const marker = new window.kakao.maps.Marker({
        position: position,
        map: mapInstance.current,
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (onMarkerClick) {
          onMarkerClick(bakery);
        }
      });

      // 인포윈도우
      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="padding:5px;font-size:12px;">🍞 ${bakery.name}</div>`
      });

      window.kakao.maps.event.addListener(marker, 'mouseover', () => {
        infowindow.open(mapInstance.current, marker);
      });

      window.kakao.maps.event.addListener(marker, 'mouseout', () => {
        infowindow.close();
      });

      markers.current.push(marker);
      bounds.extend(position);
    });

    // 모든 마커가 보이도록 지도 범위 조정
    if (bakeries.length > 0) {
      mapInstance.current.setBounds(bounds);
    }
  };

  return (
    <div
      ref={mapContainer}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
      }}
    />
  );
};

export default KakaoMap;