import React from 'react';

export function Badge({ className = '', children }) {
  return <span className={`badge ${className}`.trim()}>{children}</span>;
}
