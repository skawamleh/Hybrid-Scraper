import React from 'react';

export function Button({ className = '', variant = 'default', size = 'md', children, ...props }) {
  const base = {
    borderRadius: 10,
    cursor: 'pointer',
    border: '1px solid #cbd5e1',
    fontWeight: 500,
  };

  const theme = variant === 'default'
    ? { background: '#0f172a', color: '#fff', borderColor: '#0f172a' }
    : { background: '#fff', color: '#0f172a' };

  const sizing = size === 'sm' ? { padding: '6px 10px', fontSize: 12 } : { padding: '8px 12px', fontSize: 14 };

  return (
    <button className={className} style={{ ...base, ...theme, ...sizing }} {...props}>
      {children}
    </button>
  );
}
