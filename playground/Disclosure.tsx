import React, { useState, useRef, useEffect } from 'react';

interface DisclosureProps {
  title: string;
  children: React.ReactNode;
}

export const Disclosure = ({ title, children }: DisclosureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  // Generate a unique ID for ARIA linking
  const idPrefix = React.useId ? React.useId() : Math.random().toString(36).substr(2, 9);
  const buttonId = `disclosure-button-${idPrefix}`;
  const panelId = `disclosure-panel-${idPrefix}`;

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#ffffff' }}>
      <button
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          backgroundColor: '#f9fafb',
          border: 'none',
          borderBottom: isOpen ? '1px solid #e5e7eb' : 'none',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          color: '#1f2937',
          textAlign: 'left'
        }}
      >
        {title}
        <span 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>
      
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        style={{
          height: contentHeight,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
        }}
      >
        <div ref={contentRef} style={{ padding: '20px', color: '#4b5563', lineHeight: '1.6' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

