import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import CustomCursor from './components/CustomCursor';
import AmbientBackground from './components/AmbientBackground';
import { View } from './types';

const VIEW_ORDER: View[] = ['home', 'intro', 'travel', 'guestbook', 'media'];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [direction, setDirection] = useState(1);

  const changeView = (view: View) => {
    setDirection(VIEW_ORDER.indexOf(view) >= VIEW_ORDER.indexOf(currentView) ? 1 : -1);
    setCurrentView(view);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans selection:bg-white selection:text-black">
      <CustomCursor />
      <AmbientBackground />

      {/* Left Sidebar - 20% */}
      <div className="relative z-10 w-[20%] min-w-[250px] h-full hidden md:block">
        <Sidebar currentView={currentView} onViewChange={changeView} />
      </div>

      {/* Main Content - 80% */}
      <div className="relative z-10 flex-1 h-full">
        <MainContent view={currentView} direction={direction} />
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
              onClick={() => changeView(item.id)}
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

      {/* Film grain overlay */}
      <div className="grain-overlay" aria-hidden />
    </div>
  );
}
