import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon, color = '#007bff', trend, trendValue }) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend === 'up') {
      return <i className="fas fa-arrow-up trend-icon trend-up"></i>;
    } else if (trend === 'down') {
      return <i className="fas fa-arrow-down trend-icon trend-down"></i>;
    }
    return null;
  };

  return (
    <div className="stats-card">
      <div className="stats-content">
        <div className="stats-main">
          <div className="stats-icon" style={{ backgroundColor: color }}>
            {icon && <i className={icon}></i>}
          </div>
          <div className="stats-info">
            <h3 className="stats-value">{value}</h3>
            <p className="stats-title">{title}</p>
          </div>
        </div>
        
        {trend && (
          <div className="stats-trend">
            {getTrendIcon()}
            <span className={`trend-value ${trend}`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
      
      <div className="stats-footer" style={{ backgroundColor: `${color}15` }}>
        <div className="stats-indicator" style={{ backgroundColor: color }}></div>
      </div>
    </div>
  );
};

export default StatsCard;