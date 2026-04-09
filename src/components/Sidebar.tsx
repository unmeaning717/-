import React from 'react';
import { Home, User, MessageSquare, Share2, Globe, Monitor, Calendar as CalendarIcon } from 'lucide-react';
import { View } from '../types';
import { cn } from '@/lib/utils';
import { Solar, Lunar } from 'lunar-javascript';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'intro', label: '简介', icon: User },
    { id: 'travel', label: '足迹', icon: Globe },
    { id: 'guestbook', label: '留言板', icon: MessageSquare },
    { id: 'media', label: '媒体', icon: Share2 },
  ] as const;

  // Date Logic
  const now = new Date();
  const solar = Solar.fromDate(now);
  const lunar = Lunar.fromDate(now);

  const solarDateStr = solar.toFullString().split(' ')[0]; // YYYY-MM-DD
  const lunarDateStr = `${lunar.getYearInGanZhi()}${lunar.getYearShengXiao()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;

  return (
    <aside className="w-full h-full border-r border-zinc-800 flex flex-col p-8 bg-black">
      <div className="mb-12">
        <h1 className="text-2xl font-medium tracking-tighter text-white">Kang</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">极简主义开发者</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 group",
              currentView === item.id 
                ? "text-white bg-zinc-900" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
            )}
          >
            <item.icon size={18} className={cn(
              "transition-transform duration-300",
              currentView === item.id ? "scale-110" : "group-hover:scale-110"
            )} />
            <span className="font-light tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-8 border-t border-zinc-900 space-y-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-4 px-4">Calendar / 日历</p>
          <div className="space-y-4 px-4">
            <div className="flex items-start gap-3">
              <CalendarIcon size={14} className="text-zinc-500 mt-0.5" />
              <div className="space-y-1">
                <div className="text-[11px] text-zinc-300 font-mono tracking-wider">
                  {solarDateStr}
                </div>
                <div className="text-[10px] text-zinc-500 font-light">
                  {lunarDateStr}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="text-[10px] text-zinc-700 font-mono">
            © 2026-04-09 / BUILD 0.1.0
          </div>
        </div>
      </div>
    </aside>
  );
}
