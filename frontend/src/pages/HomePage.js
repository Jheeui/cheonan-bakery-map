import React, { useState, useEffect, useRef } from 'react';
import KakaoMap from '../components/KakaoMap';
import BakeryList from '../components/BakeryList';
import BakeryDetail from '../components/BakeryDetail';
import { getAllBakeries } from '../api/bakeryApi';
import './HomePage.css';

const HomePage = () => {
  const [bakeries, setBakeries] = useState([]);
  const [selectedBakery, setSelectedBakery] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  useEffect(() => {
    fetchBakeries();
  }, []);

  const fetchBakeries = async () => {
    try {
      setLoading(true);
      const data = await getAllBakeries();
      setBakeries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBakeryClick = (bakery) => {
    setSelectedBakery(bakery);
    setShowDetail(true);
  };

  const handleMarkerClick = (bakery) => {
    setSelectedBakery(bakery);
    setShowList(true);
    
    // 목록이 열리면 해당 빵집으로 스크롤
    setTimeout(() => {
      const element = document.getElementById(`bakery-${bakery._id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 300);
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  const toggleList = () => {
    setShowList(!showList);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>빵집 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
  <div className="home-page">
    <header className="header">
      <h1>🍞 천안 빵집 투어</h1>
      <p>천안의 맛있는 빵집을 찾아보세요!</p>
    </header>

    {/* 데스크톱/태블릿 레이아웃 */}
    <div className="content">
      <div className="map-section">
        <KakaoMap 
          bakeries={bakeries} 
          onMarkerClick={handleBakeryClick}
        />
      </div>
      <div className="list-section">
        <BakeryList 
          bakeries={bakeries}
          onBakeryClick={handleBakeryClick}
          selectedBakery={selectedBakery}
        />
      </div>
    </div>

    {/* 모바일 레이아웃 */}
    <div className="content-mobile">
      <div className="map-full">
        <KakaoMap 
          bakeries={bakeries} 
          onMarkerClick={handleMarkerClick}
        />
      </div>

      <button 
        className={`list-toggle-btn ${showList ? 'active' : ''}`}
        onClick={toggleList}
      >
        {showList ? '✕ 닫기' : `📋 빵집 목록 (${bakeries.length})`}
      </button>

      <div className={`slide-panel ${showList ? 'open' : ''}`} ref={listRef}>
        <div className="panel-handle" onClick={toggleList}>
          <div className="handle-bar"></div>
        </div>
        <BakeryList 
          bakeries={bakeries}
          onBakeryClick={handleBakeryClick}
          selectedBakery={selectedBakery}
        />
      </div>
    </div>

    {showDetail && (
      <BakeryDetail 
        bakery={selectedBakery}
        onClose={handleCloseDetail}
      />
    )}
  </div>
);
};

export default HomePage;