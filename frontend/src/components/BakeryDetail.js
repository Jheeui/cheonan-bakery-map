import React from 'react';
import './BakeryDetail.css';

const BakeryDetail = ({ bakery, onClose }) => {
  if (!bakery) return null;

  return (
    <div className="bakery-detail-overlay" onClick={onClose}>
      <div className="bakery-detail-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>✕</button>
        
        <div className="detail-content">
          <h1>{bakery.name}</h1>
          
          {bakery.images && bakery.images.length > 0 && (
            <div className="image-gallery">
              {bakery.images.map((image, index) => (
                <img key={index} src={image} alt={`${bakery.name} ${index + 1}`} />
              ))}
            </div>
          )}

          <div className="info-section">
            <div className="info-item">
              <span className="info-label">📍 주소</span>
              <span className="info-value">{bakery.address}</span>
            </div>

            {bakery.phone && (
              <div className="info-item">
                <span className="info-label">📞 전화번호</span>
                <span className="info-value">
                  <a href={`tel:${bakery.phone}`}>{bakery.phone}</a>
                </span>
              </div>
            )}

            {bakery.openingHours && (
              <div className="info-item">
                <span className="info-label">🕐 영업시간</span>
                <span className="info-value">{bakery.openingHours}</span>
              </div>
            )}

            {bakery.signature && bakery.signature.length > 0 && (
              <div className="info-item">
                <span className="info-label">🍰 대표메뉴</span>
                <div className="signature-list">
                  {bakery.signature.map((item, index) => (
                    <span key={index} className="signature-tag">{item}</span>
                  ))}
                </div>
              </div>
            )}

            {bakery.description && (
              <div className="info-item description">
                <span className="info-label">📝 소개</span>
                <p className="info-value">{bakery.description}</p>
              </div>
            )}

            {bakery.personalReview && (
              <div className="info-item review">
                <span className="info-label">✍️ 방문 후기</span>
                <p className="info-value">{bakery.personalReview}</p>
              </div>
            )}
          </div>

          <div className="action-buttons">
            <a 
              href={`https://map.naver.com/v5/search/${encodeURIComponent(bakery.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="action-button primary"
            >
              🗺️ 네이버 지도에서 보기
            </a>
            <a 
              href={`tel:${bakery.phone}`}
              className="action-button secondary"
            >
              📞 전화하기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BakeryDetail;