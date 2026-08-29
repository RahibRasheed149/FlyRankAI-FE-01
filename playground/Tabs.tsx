import React, { useState, useRef, KeyboardEvent } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export const Tabs = ({ tabs }: TabsProps) => {
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || '');
  const tabListRef = useRef<HTMLDivElement>(null);

  const getTabNodes = (): HTMLButtonElement[] => {
    if (!tabListRef.current) return [];
    return Array.from(tabListRef.current.querySelectorAll('[role="tab"]'));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const nodes = getTabNodes();
    if (!nodes.length) return;

    let nextIndex = -1;

    switch (e.key) {
      case 'ArrowLeft':
        nextIndex = index === 0 ? nodes.length - 1 : index - 1;
        break;
      case 'ArrowRight':
        nextIndex = index === nodes.length - 1 ? 0 : index + 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = nodes.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        setActiveTabId(tabs[index].id);
        break;
      default:
        break;
    }

    if (nextIndex !== -1) {
      e.preventDefault();
      nodes[nextIndex].focus();
    }
  };

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
      <div 
        ref={tabListRef}
        role="tablist" 
        aria-label="Example Tabs"
        style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}
      >
        {tabs.map((tab, index) => {
          const isSelected = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTabId(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: 'none',
                borderBottom: isSelected ? '2px solid #2563eb' : '2px solid transparent',
                backgroundColor: isSelected ? '#ffffff' : 'transparent',
                color: isSelected ? '#2563eb' : '#4b5563',
                fontWeight: isSelected ? 'bold' : 'normal',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      
      {tabs.map((tab) => {
        const isSelected = activeTabId === tab.id;
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={!isSelected}
            tabIndex={0}
            style={{ padding: '24px', backgroundColor: '#ffffff', color: '#1f2937' }}
          >
            {isSelected && tab.content}
          </div>
        );
      })}
    </div>
  );
};

