import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { View } from '../types';
import { ARTICLES, PROJECTS } from '../constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Calendar, ArrowRight, MapPin } from 'lucide-react';
import WorldMap from './WorldMap';
import {
  EASE,
  Reveal,
  Stagger,
  StaggerItem,
  Magnetic,
  TiltCard,
  TextReveal,
} from './motion';

interface MainContentProps {
  view: View;
  direction: number;
}

const viewVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? 48 : -48,
    filter: 'blur(6px)',
  }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? -48 : 48,
    filter: 'blur(6px)',
  }),
};

export default function MainContent({ view, direction }: MainContentProps) {
  const progress = useMotionValue(0);
  const progressSpring = useSpring(progress, { stiffness: 120, damping: 25, mass: 0.4 });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const max = target.scrollHeight - target.clientHeight;
    progress.set(max > 0 ? (target.scrollTop / max) * 100 : 0);
  };

  return (
    <main className="h-full overflow-hidden relative">
      {/* Reading Progress Bar */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] w-full z-50 origin-left bg-gradient-to-r from-zinc-600 via-white to-zinc-600 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        style={{ scaleX: progressSpring }}
      />

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={view}
          custom={direction}
          variants={viewVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: EASE }}
          className="h-full"
        >
          <ScrollArea className="h-full" onScrollCapture={handleScroll}>
            <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-20 pb-24 md:pb-20">
              {view === 'home' && <HomeView />}
              {view === 'intro' && <IntroView />}
              {view === 'travel' && <TravelView />}
              {view === 'guestbook' && <GuestbookView />}
              {view === 'media' && <MediaView />}
            </div>
          </ScrollArea>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

function HomeView() {
  return (
    <div className="space-y-24">
      <section>
        <h2 className="text-6xl font-light tracking-tighter text-white mb-6 leading-tight">
          <TextReveal text="CODE WITH" delay={0.1} />
          <br />
          <motion.span
            className="text-zinc-600 italic"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          >
            <TextReveal text="INTENTION." delay={0.5} />
          </motion.span>
        </h2>
        <Reveal delay={0.9} y={12}>
          <p className="text-zinc-400 max-w-xl text-lg font-light leading-relaxed">
            探索技术边界，记录生活灵感
          </p>
        </Reveal>
      </section>

      {/* NOW Section */}
      <Reveal>
        <section className="glass-panel p-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-medium">Currently / NOW</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-[10px] text-zinc-600 uppercase mb-1">Reading</p>
              <p className="text-sm text-zinc-300">The Psychology of Money</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-600 uppercase mb-1">Building</p>
              <p className="text-sm text-zinc-300">ai驱动的笔记助手</p>
            </div>
            <div>
              <p className="text-[10px] text-zinc-600 uppercase mb-1">Listening</p>
              <p className="text-sm text-zinc-300">If I Ever</p>
            </div>
          </div>
        </section>
      </Reveal>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-medium">Recent Articles</h3>
          <Button variant="link" className="text-zinc-500 hover:text-white p-0 h-auto text-xs uppercase tracking-widest">
            View All <ArrowRight size={12} className="ml-1" />
          </Button>
        </div>
        <Stagger className="space-y-12">
          {ARTICLES.map((article) => (
            <StaggerItem key={article.id}>
              <article className="group relative cursor-pointer transition-all duration-300 hover:pl-3">
                <span className="absolute left-0 top-0 h-full w-px bg-white scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-[10px] font-mono text-zinc-600">{article.date}</span>
                  <h4 className="text-xl text-zinc-300 group-hover:text-white transition-colors">{article.title}</h4>
                  <ArrowRight size={14} className="ml-auto text-zinc-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-white transition-all duration-300 shrink-0 self-center" />
                </div>
                <p className="text-zinc-500 text-sm font-light line-clamp-2 pl-14 group-hover:text-zinc-400 transition-colors">
                  {article.excerpt}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </div>
  );
}

function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-mask overflow-hidden py-1">
      <div className="marquee-track flex w-max">
        {doubled.map((tech, i) => (
          <span
            key={i}
            className="mr-3 px-3 py-1 bg-zinc-900 text-zinc-400 text-xs font-mono border border-zinc-800 whitespace-nowrap"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

function IntroView() {
  const techStack = ['React', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'C/C++', 'Python'];
  return (
    <div className="space-y-16">
      <section>
        <h2 className="text-4xl font-light text-white mb-8">关于我 / ABOUT</h2>
        <div className="prose prose-invert max-w-none">
          <Reveal>
            <p className="text-zinc-400 leading-relaxed text-lg font-light">
              你好，我是一名电子信息类学生，热衷于技术探索、影像记录和未知领域的研究。喜欢在代码、硬件与创意之间寻找连接，也习惯用运动保持节奏，用摄影捕捉灵感。这里是我的数字空间，记录成长过程中的思考、实践与发现。
            </p>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-6 font-medium">Tech Stack</h3>
            <Marquee items={techStack} />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-6 font-medium">Interests</h3>
            <Stagger className="space-y-2 text-zinc-400 font-light text-sm">
              <StaggerItem><li className="list-none">• 嵌入式开发与硬件 DIY</li></StaggerItem>
              <StaggerItem><li className="list-none">• 偶尔的图书馆深度阅读</li></StaggerItem>
              <StaggerItem><li className="list-none">• 校园生活碎片记录</li></StaggerItem>
              <StaggerItem><li className="list-none">• 凌晨的灵感代码马拉松</li></StaggerItem>
              <StaggerItem><li className="list-none">• 寻找城市中安静的自习角落</li></StaggerItem>
            </Stagger>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

function GuestbookView() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    import('twikoo').then((twikoo) => {
      const init = twikoo.init || twikoo.default?.init || twikoo.default;
      init({
        envId: 'https://meek-torrone-6db489.netlify.app/.netlify/functions/twikoo',
        el: '#twikoo-comments',
      });
    }).catch((err) => {
      console.error('Twikoo init failed:', err);
    });
  }, []);

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-4xl font-light text-white mb-4">留言板 / GUESTBOOK</h2>
        <p className="text-zinc-500 font-light">留下你的足迹，或者只是打个招呼。</p>
      </section>

      <Reveal delay={0.15}>
        <div className="glass-panel p-6 md:p-8">
          <div id="twikoo-comments" />
        </div>
      </Reveal>
    </div>
  );
}

function MediaView() {
  const platforms = [
    { name: '抖音 / TikTok', desc: '此账号仅记录个人生活碎片。另有视频创作主号，静候有缘人自行发掘。', href: 'https://www.douyin.com/user/MS4wLjABAAAAgOxo7u4RIXE24lc-nyyJqopeFXbUy8X2YN84VXkbMiv7RHKjfX7-vwk24VpwrgdC?from_tab_name=main' },
    { name: 'Bilibili', desc: '技术教程与深度长视频分享。', href: 'https://space.bilibili.com/3546698976594458?spm_id_from=333.1387.0.0' },
    { name: 'GitHub', desc: '开源项目与代码实验室。', href: 'https://github.com/unmeaning717' },
    { name: 'Email', desc: '18836071736@163.com', href: 'mailto:18836071736@163.com' },
  ];

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-4xl font-light text-white mb-4">媒体 / MEDIA</h2>
        <p className="text-zinc-500 font-light">在不同的平台上关注我，了解更多维度的我。</p>
      </section>

      <Stagger className="grid grid-cols-1 gap-4">
        {platforms.map((p) => {
          const isEmail = p.name === 'Email';
          const Content = (
            <>
              <div>
                <h3 className="text-xl text-zinc-200 mb-1">{p.name}</h3>
                <p className="text-zinc-500 font-light text-sm group-hover:text-zinc-400 transition-colors">{p.desc}</p>
              </div>
              {!isEmail && <ArrowRight size={20} className="text-zinc-700 group-hover:text-white group-hover:translate-x-2 transition-all" />}
            </>
          );

          return (
            <StaggerItem key={p.name}>
              <Magnetic strength={0.08} className="w-full">
                <TiltCard maxTilt={5} className="w-full">
                  {isEmail ? (
                    <div className="group p-8 bg-zinc-950 border border-zinc-900 flex justify-between items-center">
                      {Content}
                    </div>
                  ) : (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-8 bg-zinc-950 border border-zinc-900 hover:border-zinc-600 transition-colors"
                    >
                      {Content}
                    </a>
                  )}
                </TiltCard>
              </Magnetic>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}

function TravelView() {
  const visited = [
    { en: 'China', zh: '中国' },
    { en: 'Malaysia', zh: '马来西亚' },
    { en: 'Singapore', zh: '新加坡' },
    { en: 'Thailand', zh: '泰国' }
  ];
  const planned = [
    { en: 'Japan', zh: '日本' },
    { en: 'Vietnam', zh: '越南' },
    { en: 'South Korea', zh: '韩国' }
  ];

  const visitedEn = visited.map(c => c.en);
  const plannedEn = planned.map(c => c.en);

  return (
    <div className="space-y-16">
      <section>
        <h2 className="text-4xl font-light text-white mb-6">足迹 / TRAVEL</h2>
        <div className="prose prose-invert max-w-none">
          <Reveal>
            <p className="text-zinc-400 leading-relaxed text-lg font-light">
              我是一个热爱旅游的人，我的梦想之一是环游全世界。
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-zinc-400 leading-relaxed text-lg font-light mt-4">
              我崇尚极简的旅行方式：背起行囊，搭乘廉航，在有限的负重中寻找无限的自由。
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-zinc-400 leading-relaxed text-lg font-light mt-4">
              旅行对我来说不仅是看风景，更是一种探索未知、理解多元文化的方式。每到一个新的国家，我都会被那里独特的建筑、美食和人文气息所吸引。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-medium">World Map</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white" />
              <span className="text-[10px] text-zinc-500 uppercase">Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-zinc-500" />
              <span className="text-[10px] text-zinc-500 uppercase">Planned</span>
            </div>
          </div>
        </div>

        <WorldMap visitedCountries={visitedEn} plannedCountries={plannedEn} />

        <Stagger className="space-y-4">
          <StaggerItem>
            <h4 className="text-[10px] uppercase tracking-widest text-zinc-600">Visited / 已访问</h4>
          </StaggerItem>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visited.map(country => (
              <StaggerItem key={country.en}>
                <div className="p-6 bg-zinc-950 border border-zinc-900 flex items-center gap-4 hover:border-zinc-600 transition-colors duration-300">
                  <MapPin size={16} className="text-white" />
                  <div>
                    <p className="text-sm text-zinc-200">{country.zh}</p>
                    <p className="text-[10px] text-zinc-600 uppercase font-mono">{country.en}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </Stagger>

        <Stagger className="space-y-4">
          <StaggerItem>
            <h4 className="text-[10px] uppercase tracking-widest text-zinc-600">Planned / 计划中</h4>
          </StaggerItem>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planned.map(country => (
              <StaggerItem key={country.en}>
                <div className="p-6 bg-zinc-950 border border-zinc-900 flex items-center gap-4 hover:border-zinc-600 transition-colors duration-300">
                  <MapPin size={16} className="text-zinc-500" />
                  <div>
                    <p className="text-sm text-zinc-400">{country.zh}</p>
                    <p className="text-[10px] text-zinc-700 uppercase font-mono">{country.en}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </section>

      <section>
        <h3 className="text-xs uppercase tracking-[0.3em] text-zinc-500 font-medium mb-8">Travel Philosophy</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Reveal>
            <div className="space-y-4">
              <h4 className="text-white font-medium">极简出行</h4>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">
                只带必要的装备，让身体和心灵都保持轻盈。一个背包，一台相机，就是我全部的行囊。
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-4">
              <h4 className="text-white font-medium">深度体验</h4>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">
                比起打卡热门景点，我更喜欢在当地的小巷里漫步，去菜市场感受烟火气，和当地人聊聊天。
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
