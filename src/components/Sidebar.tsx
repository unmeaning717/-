import React from 'react';
import { motion } from 'motion/react';
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
    <aside className="w-full h-full border-r border-zinc-800/60 flex flex-col p-8 bg-black/70 backdrop-blur-sm">
      <div className="mb-12">
        <motion.h1
          className="text-2xl font-medium tracking-tighter text-white"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        >
          Kang
        </motion.h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mt-1">极简主义开发者</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "relative w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-300 group",
              currentView === item.id
                ? "text-white"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {currentView === item.id && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-0 bg-zinc-900/90 border border-white/5"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <item.icon size={18} className={cn(
              "relative z-10 transition-transform duration-300",
              currentView === item.id ? "scale-110" : "group-hover:scale-110"
            )} />
            <span className="relative z-10 font-light tracking-wide">{item.label}</span>
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
