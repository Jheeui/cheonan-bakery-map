import React, { useState, useEffect } from 'react';
import { getAllBakeries, createBakery, deleteBakery } from '../api/bakeryApi';
import './AdminPage.css';

const AdminPage = () => {
  const [bakeries, setBakeries] = useState([]);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    phone: '',
    openingHours: '',
    signature: '',
    description: '',
    personalReview: ''
  });

  useEffect(() => {
    fetchBakeries();
  }, []);

  useEffect(() => {
    // 카카오맵 스크립트 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log('✅ 카카오맵 API 로드 완료 (관리자 페이지)');
        setIsKakaoLoaded(true);
      });
    };

    script.onerror = () => {
      console.error('❌ 카카오맵 스크립트 로드 실패');
    };

    // 이미 로드되어 있는지 확인
    if (!document.querySelector(`script[src*="dapi.kakao.com"]`)) {
      document.head.appendChild(script);
    } else if (window.kakao && window.kakao.maps) {
      setIsKakaoLoaded(true);
    }
  }, []);

  const fetchBakeries = async () => {
    try {
      const data = await getAllBakeries();
      setBakeries(data);
    } catch (error) {
      console.error('빵집 조회 실패:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 카카오 지도 API로 주소 → 좌표 변환
  const handleAddressSearch = () => {
    if (!isKakaoLoaded) {
      alert('카카오맵이 로딩 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    if (!formData.address) {
      alert('주소를 입력해주세요');
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    
    geocoder.addressSearch(formData.address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setFormData(prev => ({
          ...prev,
          lat: result[0].y,
          lng: result[0].x
        }));
        alert('좌표 변환 완료!');
      } else {
        alert('주소를 찾을 수 없습니다. 정확한 주소를 입력해주세요.');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.lat || !formData.lng) {
      alert('필수 항목(이름, 주소, 좌표)을 입력해주세요');
      return;
    }

    try {
      const bakeryData = {
        name: formData.name,
        address: formData.address,
        coordinates: {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        },
        phone: formData.phone,
        openingHours: formData.openingHours,
        signature: formData.signature ? formData.signature.split(',').map(s => s.trim()) : [],
        description: formData.description,
        personalReview: formData.personalReview
      };

      await createBakery(bakeryData);
      alert('빵집이 추가되었습니다!');
      
      // 폼 초기화
      setFormData({
        name: '',
        address: '',
        lat: '',
        lng: '',
        phone: '',
        openingHours: '',
        signature: '',
        description: '',
        personalReview: ''
      });

      // 목록 새로고침
      fetchBakeries();
    } catch (error) {
      console.error('빵집 추가 실패:', error);
      alert('빵집 추가에 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteBakery(id);
      alert('삭제되었습니다.');
      fetchBakeries();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>🍞 빵집 관리자 페이지</h1>
        <a href="/" className="back-button">← 메인으로</a>
      </header>

      <div className="admin-content">
        <div className="admin-form-section">
          <h2>빵집 추가</h2>
          <form onSubmit={handleSubmit} className="bakery-form">
            <div className="form-group">
              <label>빵집 이름 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="예: 성심당"
                required
              />
            </div>

            <div className="form-group">
              <label>주소 *</label>
              <div className="address-group">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="예: 충청남도 천안시 동남구 만남로 25"
                  required
                />
                <button 
                  type="button" 
                  onClick={handleAddressSearch} 
                  className="search-btn"
                  disabled={!isKakaoLoaded}
                >
                  {isKakaoLoaded ? '좌표 찾기' : '로딩 중...'}
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>위도 (lat) *</label>
                <input
                  type="text"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  placeholder="자동 입력됨"
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>경도 (lng) *</label>
                <input
                  type="text"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  placeholder="자동 입력됨"
                  readOnly
                />
              </div>
            </div>

            <div className="form-group">
              <label>전화번호</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="예: 041-123-4567"
              />
            </div>

            <div className="form-group">
              <label>영업시간</label>
              <input
                type="text"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                placeholder="예: 평일 08:00-20:00, 주말 09:00-18:00"
              />
            </div>

            <div className="form-group">
              <label>대표메뉴 (쉼표로 구분)</label>
              <input
                type="text"
                name="signature"
                value={formData.signature}
                onChange={handleChange}
                placeholder="예: 소보루빵, 크림빵, 단팥빵"
              />
            </div>

            <div className="form-group">
              <label>설명</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="빵집 소개를 입력하세요"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>개인 리뷰</label>
              <textarea
                name="personalReview"
                value={formData.personalReview}
                onChange={handleChange}
                placeholder="방문 후기를 입력하세요"
                rows="3"
              />
            </div>

            <button type="submit" className="submit-btn">빵집 추가</button>
          </form>
        </div>

        <div className="admin-list-section">
          <h2>등록된 빵집 ({bakeries.length}개)</h2>
          <div className="bakery-list">
            {bakeries.length === 0 ? (
              <p className="empty-message">등록된 빵집이 없습니다.</p>
            ) : (
              bakeries.map(bakery => (
                <div key={bakery._id} className="bakery-item">
                  <div className="bakery-info">
                    <h3>{bakery.name}</h3>
                    <p>{bakery.address}</p>
                    {bakery.signature && bakery.signature.length > 0 && (
                      <p className="signature">🍰 {bakery.signature.join(', ')}</p>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(bakery._id)}
                    className="delete-btn"
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;