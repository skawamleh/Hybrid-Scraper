import React from 'react';

export function Dialog({ open, children }) {
  if (!open) return null;
  return <>{children}</>;
}

export function DialogContent({ className = '', children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.35)', display: 'grid', placeItems: 'center', zIndex: 20 }}>
      <div className={`card ${className}`.trim()} style={{ width: 'min(980px, 92vw)', maxHeight: '90vh', overflow: 'auto', padding: 16 }}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div style={{ marginBottom: 12 }}>{children}</div>;
}

export function DialogTitle({ className = '', children }) {
  return <h2 className={className} style={{ margin: 0 }}>{children}</h2>;
}
