import React from 'react';

export function Separator({ className = '' }) {
  return <hr className={className} style={{ border: 0, borderTop: '1px solid #e2e8f0' }} />;
}
