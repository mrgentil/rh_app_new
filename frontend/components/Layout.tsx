import { useState } from 'react';
import EnhancedSidebar from './EnhancedSidebar';
import Navbar from './Navbar';
import { useAuth } from '../hooks/useAuth';
// import { SuspensionNotification } from './SuspensionNotification';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''}`}>
      {/* <SuspensionNotification /> */}
      <EnhancedSidebar />
      
      {/* Main content */}
      <div className="flex-1">
        {/* Top header */}
        <Navbar />

        {/* Main content area */}
        <main className="bg-gray-50 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
} 