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

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-t border-zinc-800">
        <div className="flex justify-around items-center h-16">
          {([
            { id: 'home' as View, label: '首页', icon: '⌂' },
            { id: 'intro' as View, label: '简介', icon: '○' },
            { id: 'travel' as View, label: '足迹', icon: '◎' },
            { id: 'guestbook' as View, label: '留言', icon: '▧' },
            { id: 'media' as View, label: '媒体', icon: '◇' },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
                currentView === item.id ? 'text-white' : 'text-zinc-600'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-[10px] tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

