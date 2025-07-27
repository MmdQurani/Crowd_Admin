import React, { useState } from 'react';

const Tooltip = ({ text, children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMouseMove = (e) => {
    setPosition({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  return (
    <div
      className="relative inline-block cursor-cell"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}>
      {children}
      {visible && (
        <div
          className="fixed z-50 text-sm border border-gray-500 text-justify bg-gray-800 text-white px-2 py-1 rounded-md shadow-lg max-h-[200px] max-w-[300px]"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            pointerEvents: 'auto',
            whiteSpace: 'normal'
          }}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
