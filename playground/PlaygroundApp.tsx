import React, { useState } from 'react';
import { Modal } from './Modal';
import { Tabs } from './Tabs';
import { Disclosure } from './Disclosure';

export const PlaygroundApp = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const exampleTabs = [
    {
      id: 'tab-1',
      label: 'Profile',
      content: <p>This is the profile tab content. You can put any React components here.</p>
    },
    {
      id: 'tab-2',
      label: 'Settings',
      content: (
        <div>
          <p style={{ marginBottom: '16px' }}>Settings panel content.</p>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Username: <input type="text" style={{ marginLeft: '8px', padding: '4px' }} />
          </label>
        </div>
      )
    },
    {
      id: 'tab-3',
      label: 'Notifications',
      content: <p>You have 3 new notifications.</p>
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: '40px', color: '#111827', textAlign: 'center' }}>Accessible Components Playground</h1>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: '#374151', fontSize: '1.25rem' }}>1. Modal Dialog</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Open Modal
        </button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Terms and Conditions"
        >
          <p style={{ marginBottom: '16px' }}>
            Please review our updated terms and conditions before proceeding. This modal demonstrates a proper focus trap and ARIA attributes.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Accept
            </button>
          </div>
        </Modal>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: '#374151', fontSize: '1.25rem' }}>2. Tabs Component</h2>
        <Tabs tabs={exampleTabs} />
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '20px', color: '#374151', fontSize: '1.25rem' }}>3. Disclosure (Accordion)</h2>
        <Disclosure title="Frequently Asked Questions">
          <p style={{ marginBottom: '12px' }}>
            <strong>How do I use these components?</strong>
          </p>
          <p>
            Simply import them into your React application and pass the required props. They handle all accessibility logic internally.
          </p>
          <p style={{ marginTop: '16px', marginBottom: '12px' }}>
            <strong>Are there any dependencies?</strong>
          </p>
          <p>
            No! These components are built with pure React and TypeScript. No external libraries are required.
          </p>
        </Disclosure>
      </section>
    </div>
  );
};

export default PlaygroundApp;

