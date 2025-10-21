import React from 'react';

interface NodeWrapperProps {
 children?: React.ReactNode;
 bottom?: number;
 top?: number;
 left?: number;
 right?: number;
 width?: number;
 height?: number;
}

const NodeWrapper: React.FC<NodeWrapperProps> = ({ children, bottom, top, left, right, width, height }) => {
  const toPx = (value?: number): string => (value !== undefined ? `${value}px` : '');

  return (
    <div
      className="react-flow__node-annotation"
      style={{
        position: 'absolute',
        fontSize: '12px',
        bottom: toPx(bottom),
        left: toPx(left),
        width: toPx(width),
        height: toPx(height),
        top: toPx(top),
        right: toPx(right),
      }}
    >
      {children}
    </div>
  );
};

export default NodeWrapper;
