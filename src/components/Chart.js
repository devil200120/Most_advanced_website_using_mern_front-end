// frontend/src/components/Chart.js
import React from 'react';
import './Chart.css';

const Chart = ({ data, type = 'bar', title, height = 300 }) => {
  const getMaxValue = () => {
    return Math.max(...data.map(item => item.value));
  };

  const getBarHeight = (value) => {
    const max = getMaxValue();
    return (value / max) * 100;
  };

  const getColor = (index) => {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    return colors[index % colors.length];
  };

  const renderBarChart = () => (
    <div className="bar-chart" style={{ height }}>
      <div className="chart-bars">
        {data.map((item, index) => (
          <div key={index} className="bar-container">
            <div 
              className="bar"
              style={{
                height: `${getBarHeight(item.value)}%`,
                backgroundColor: getColor(index)
              }}
            >
              <span className="bar-value">{item.value}</span>
            </div>
            <span className="bar-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLineChart = () => (
    <div className="line-chart" style={{ height }}>
      <svg width="100%" height="100%">
        <polyline
          points={data.map((item, index) => 
            `${(index / (data.length - 1)) * 100}%,${100 - getBarHeight(item.value)}%`
          ).join(' ')}
          fill="none"
          stroke="#667eea"
          strokeWidth="2"
        />
        {data.map((item, index) => (
          <circle
            key={index}
            cx={`${(index / (data.length - 1)) * 100}%`}
            cy={`${100 - getBarHeight(item.value)}%`}
            r="4"
            fill="#667eea"
          />
        ))}
      </svg>
      <div className="line-labels">
        {data.map((item, index) => (
          <span key={index} className="line-label">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="pie-chart" style={{ height }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (item.value / total) * 360;
            const x1 = 100 + 80 * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 100 + 80 * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 100 + 80 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 100 + 80 * Math.sin(((currentAngle + angle) * Math.PI) / 180);
            
            const largeArc = angle > 180 ? 1 : 0;
            const pathData = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={getColor(index)}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={index} className="pie-legend-item">
              <div 
                className="pie-legend-color"
                style={{ backgroundColor: getColor(index) }}
              ></div>
              <span>{item.label}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="chart-container">
      {title && <h3 className="chart-title">{title}</h3>}
      {type === 'bar' && renderBarChart()}
      {type === 'line' && renderLineChart()}
      {type === 'pie' && renderPieChart()}
    </div>
  );
};

export default Chart;