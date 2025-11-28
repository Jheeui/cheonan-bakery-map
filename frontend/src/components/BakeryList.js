import React from 'react';
import './BakeryList.css';

const BakeryList = ({ bakeries, onBakeryClick, selectedBakery }) => {
  return (
    <div className="bakery-list">
      <h2>🍞 천안 빵집 목록</h2>
      {bakeries.length === 0 ? (
        <p className="no-data">등록된 빵집이 없습니다.</p>
      ) : (
        <div className="bakery-items">
          {bakeries.map((bakery) => (
            <div
              key={bakery._id}
              className={`bakery-item ${selectedBakery?._id === bakery._id ? 'selected' : ''}`}
              onClick={() => onBakeryClick(bakery)}
            >
              <div className="bakery-item-header">
                <h3>{bakery.name}</h3>
                {bakery.signature && bakery.signature.length > 0 && (
                  <span className="signature-badge">대표메뉴</span>
                )}
              </div>
              <p className="address">📍 {bakery.address}</p>
              {bakery.signature && bakery.signature.length > 0 && (
                <p className="signature">🍰 {bakery.signature.join(', ')}</p>
              )}
              {bakery.openingHours && (
                <p className="hours">🕐 {bakery.openingHours}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BakeryList;