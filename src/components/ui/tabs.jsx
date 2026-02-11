import React, { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);

export function Tabs({ defaultValue, className = '', children }) {
  const [value, setValue] = useState(defaultValue);
  return <TabsContext.Provider value={{ value, setValue }}><div className={className}>{children}</div></TabsContext.Provider>;
}

export function TabsList({ className = '', children }) {
  return <div className={className} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>{children}</div>;
}

export function TabsTrigger({ value, className = '', children }) {
  const ctx = useContext(TabsContext);
  const active = ctx?.value === value;
  return (
    <button
      className={className}
      style={{
        padding: '8px 12px',
        borderRadius: 10,
        border: '1px solid #cbd5e1',
        background: active ? '#0f172a' : '#fff',
        color: active ? '#fff' : '#0f172a',
      }}
      onClick={() => ctx?.setValue(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className = '', children }) {
  const ctx = useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return <div className={className}>{children}</div>;
}
