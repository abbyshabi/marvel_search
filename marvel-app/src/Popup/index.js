import React, { useState } from 'react';
import './Popup.css';

function Popup({ character, onClose }) {
  const { name, description, thumbnail, comics, events, series } = character;

  const [activeTab, setActiveTab] = useState('overview');

  const defaultImage =
    'https://dummyimage.com/200x300/cccccc/000000&text=Image+Not+Available';

  const imageUrl = thumbnail?.path.includes('image_not_available')
    ? defaultImage
    : `${thumbnail?.path}.${thumbnail?.extension}`;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-content">
            <h2 className="character-name">{name}</h2>
            <img src={imageUrl} alt={`${name} Thumbnail`} className="main-thumbnail" />
            <p className="character-description">{description || 'No description available.'}</p>
          </div>
        );

      case 'comics':
        return renderItems(comics?.items, 'Comics');
      case 'events':
        return renderItems(events?.items, 'Events');
      case 'series':
        return renderItems(series?.items, 'Series');
      default:
        return null;
    }
  };

  const renderItems = (items, type) => (
    <div className="items-grid">
      {items?.length > 0 ? (
        items.map((item, index) => (
          <div key={index} className="item">
            {/* <img
              src={thumbnail?.path ? `${thumbnail.path}.${thumbnail.extension}` : defaultImage}
              alt={item.name}
              className="item-thumbnail"
            /> */}
            <p>{item.name}</p>
          </div>
        ))
      ) : (
        <p>No {type.toLowerCase()} available for this character.</p>
      )}
    </div>
  );

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose} aria-label="Close popup">
          ✖
        </button>
        <div className="popup-header">
          <nav className="tab-navigation">
            <button
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab ${activeTab === 'comics' ? 'active' : ''}`}
              onClick={() => setActiveTab('comics')}
            >
              Comics
            </button>
            <button
              className={`tab ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              Events
            </button>
            <button
              className={`tab ${activeTab === 'series' ? 'active' : ''}`}
              onClick={() => setActiveTab('series')}
            >
              Series
            </button>
          </nav>
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default Popup;
