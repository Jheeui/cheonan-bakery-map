import React, { useEffect, useRef } from 'react';

const KakaoMap = ({ bakeries, onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  console.log('====== 카카오맵 디버깅 ======');
  console.log('API KEY:', process.env.REACT_APP_KAKAO_API_KEY);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
  console.log('카카오맵 스크립트 로드 성공!');
  console.log('window.kakao:', window.kakao);
  
  window.kakao.maps.load(() => {
    console.log('카카오맵 API 로드 완료!');
    initializeMap();
  });
};

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && bakeries.length > 0) {
      updateMarkers();
    }
  }, [bakeries]);

  const initializeMap = () => {
    const { kakao } = window;
    if (!kakao || !kakao.maps) return;

    const container = mapRef.current;
    const options = {
      center: new kakao.maps.LatLng(36.8151, 127.1139),
      level: 5,
    };

    const map = new kakao.maps.Map(container, options);
    mapInstanceRef.current = map;

    if (bakeries.length > 0) {
      updateMarkers();
    }
  };

  const updateMarkers = () => {
    const { kakao } = window;
    if (!kakao || !kakao.maps || !mapInstanceRef.current) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const bounds = new kakao.maps.LatLngBounds();

    bakeries.forEach((bakery) => {
      const position = new kakao.maps.LatLng(
        bakery.coordinates.lat,
        bakery.coordinates.lng
      );

      const content = `
        <div style="
          background-color: #ff6b6b;
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 12px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
          text-align: center;
        ">
          🍞 ${bakery.name}
        </div>
      `;

      const customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 1.5,
      });

      customOverlay.setMap(mapInstanceRef.current);

      const overlayElement = customOverlay.a;
      if (overlayElement) {
        overlayElement.onclick = () => {
          if (onMarkerClick) {
            onMarkerClick(bakery);
          }
          mapInstanceRef.current.setCenter(position);
          mapInstanceRef.current.setLevel(3);
        };
      }

      markersRef.current.push(customOverlay);
      bounds.extend(position);
    });

    if (bakeries.length > 0) {
      mapInstanceRef.current.setBounds(bounds);
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

export default KakaoMap;