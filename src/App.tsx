import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import CustomCursor from './components/CustomCursor';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden font-sans selection:bg-white selection:text-black">
      <CustomCursor />
      
      {/* Left Sidebar - 20% */}
      <div className="w-[20%] min-w-[250px] h-full hidden md:block">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      </div>

      {/* Main Content - 80% */}
      <div className="flex-1 h-full">
        <MainContent view={currentView} />
      </div>

      {/* Mobile Overlay (Optional enhancement) */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setCurrentView(currentView === 'home' ? 'intro' : 'home')}
          className="bg-white text-black p-4 rounded-full shadow-xl"
        >
          Menu
        </button>
      </div>
    </div>
  );
}

