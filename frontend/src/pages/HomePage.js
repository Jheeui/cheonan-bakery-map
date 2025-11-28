import React, { useState, useEffect } from 'react';
import NaverMap from '../components/KakaoMap';
import BakeryList from '../components/BakeryList';
import BakeryDetail from '../components/BakeryDetail';
import { getAllBakeries } from '../api/bakeryApi';
import './HomePage.css';
import KakaoMap from '../components/KakaoMap';

const HomePage = () => {
  const [bakeries, setBakeries] = useState([]);
  const [selectedBakery, setSelectedBakery] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBakeries();
  }, []);

  const fetchBakeries = async () => {
    try {
      setLoading(true);
      const data = await getAllBakeries();
      setBakeries(data);
      setError(null);
    } catch (err) {
      setError('빵집 데이터를 불러오는데 실패했습니다.');
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
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>빵집 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={fetchBakeries}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="header">
        <h1>🍞 천안 빵집 투어 지도</h1>
        <p>천안의 맛있는 빵집을 찾아보세요!</p>
      </header>

      <div className="content">
        <div className="map-section">
          <KakaoMap
            bakeries={bakeries} 
            onMarkerClick={handleMarkerClick}
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