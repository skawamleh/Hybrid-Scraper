import React from 'react';

export function Progress({ value = 0 }) {
  return (
    <div style={{ background: '#e2e8f0', borderRadius: 999, height: 10, width: '100%' }}>
      <div style={{ background: '#0f172a', borderRadius: 999, height: '100%', width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
