import React from 'react';

export function Card({ className = '', ...props }) {
  return <div className={`card ${className}`.trim()} {...props} />;
}

export function CardHeader({ className = '', ...props }) {
  return <div className={`p-4 ${className}`.trim()} {...props} />;
}

export function CardTitle({ className = '', ...props }) {
  return <h3 className={`m-0 text-base ${className}`.trim()} {...props} />;
}

export function CardContent({ className = '', ...props }) {
  return <div className={`p-4 pt-0 ${className}`.trim()} {...props} />;
}
