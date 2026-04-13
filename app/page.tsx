'use client';

import React, { useEffect, useState } from 'react';

/**
 * Beef Asset Configuration
 */
const beefImages = ['/beef1.png', '/beef2.png', '/beef3.png'];

// 9个部位的配置：包括ID、名称、对应的特写图路径、以及感应热区的坐标范围
// 坐标(top, left, width, height)基于容器百分比，你可以根据最终图片的牛形位置微调
const anatomyParts = [
  { id: 'chuck', name: 'Chuck (7%)', img: '/chuck.png', style: { top: '20%', left: '33%', width: '30%', height: '25%' } },
  { id: 'rib', name: 'Rib (7%)', img: '/rib.png', style: { top: '10%', left: '31%', width: '13%', height: '32%' } },
  { id: 'short-loin', name: 'Short Loin (8%)', img: '/short-loin.png', style: { top: '10%', left: '45%', width: '10%', height: '32%' } },
  { id: 'sirloin', name: 'Sirloin (9%)', img: '/sirloin.png', style: { top: '10%', left: '56%', width: '12%', height: '32%' } },
  { id: 'round', name: 'Round (27%)', img: '/round.png', style: { top: '10%', left: '69%', width: '22%', height: '50%' } },
  { id: 'brisket', name: 'Brisket (6%)', img: '/brisket.png', style: { top: '48%', left: '10%', width: '18%', height: '25%' } },
  { id: 'fore-shank', name: 'Fore Shank (4%)', img: '/fore-shank.png', style: { top: '55%', left: '28%', width: '8%', height: '30%' } },
  { id: 'short-plate', name: 'Short Plate (5.5%)', img: '/short-plate.png', style: { top: '43%', left: '38%', width: '15%', height: '22%' } },
  { id: 'flank', name: 'Flank (4%)', img: '/flank.png', style: { top: '43%', left: '54%', width: '14%', height: '20%' } },
];

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  
  // 核心交互状态：当前鼠标悬停的部位ID
  const [activePart, setActivePart] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll('.reveal, .reveal-left');
    revealElements.forEach((el) => observer.observe(el));

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll('.floating-item');
    items.forEach((item, index) => {
      const el = item as HTMLElement;
      if (!el) return;
      const scrollRotation = scrollY * 0.15 * (index + 1);  
      const mouseTiltX = mousePos.y * 10;  
      const mouseTiltY = mousePos.x * 10;
      const scaleFactor = Math.max(0.4, 1 - (scrollY * 0.0008));

      el.style.transform = `
        perspective(1000px)  
        rotateX(${scrollRotation + mouseTiltX}deg)  
        rotateY(${scrollRotation * 0.5 + mouseTiltY}deg)  
        scale(${scaleFactor})
      `;
    });
  }, [mousePos, scrollY]);

  return (
    <div className="relative min-h-screen w-full bg-[#fcfcfc] text-black overflow-x-hidden font-sans">
      
      <style dangerouslySetInnerHTML={{ __html: `
        .bg-text { font-size: 20vw; line-height: 0.8; font-weight: 900; letter-spacing: -0.05em; white-space: nowrap; pointer-events: none; }
        
        .floating-item {  
          position: absolute;  
          transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1);  
          z-index: 20;  
          will-change: transform;  
          transform-style: preserve-3d;
        }
        .floating-item img { width: 100%; height: auto; filter: drop-shadow(40px 60px 50px rgba(0,0,0,0.3)); }
        
        .item-1 { top: 10%; right: 8%; width: 30%; }
        .item-2 { top: 35%; right: -5%; width: 36%; }
        .item-3 { top: 62%; right: 12%; width: 28%; }
        
        .reveal {  
          opacity: 0;  
          transform: translateY(80px) scale(0.9);  
          filter: blur(10px);
          transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);  
          will-change: transform, opacity;
        }
        .reveal.active {  
          opacity: 1;  
          transform: translateY(0) scale(1);  
          filter: blur(0px);
        }

        .reveal-left {
          opacity: 0;
          transform: translateX(-100px);
          filter: blur(10px);
          transition: all 1.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-left.active {
          opacity: 1;
          transform: translateX(0);
          filter: blur(0px);
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }

        .nav-glass {
          background: rgba(255, 255, 255, 0.65);  
          backdrop-filter: blur(25px) saturate(180%);
          -webkit-backdrop-filter: blur(25px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
        }

        .footer-link {
          position: relative;
          text-decoration: none;
          color: inherit;
        }
        .footer-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: white;
          transition: width 0.4s ease;
        }
        .footer-link:hover::after { width: 100%; }
      `}} />

      {/* 1. Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl h-20 px-10 flex justify-between items-center z-[1000] nav-glass rounded-full">
        <div className="flex items-center space-x-12">
          <span className="text-2xl font-black tracking-tighter cursor-pointer">BEEF</span>
          <div className="hidden md:flex space-x-10 text-[11px] font-bold uppercase tracking-[0.2em]">
            <a href="#products" className="hover:opacity-50 transition-opacity">Products</a>
            <a href="#anatomy" className="hover:opacity-50 transition-opacity">Anatomy</a>
            <a href="#factory" className="hover:opacity-50 transition-opacity">Factory</a>
            <a href="#about" className="hover:opacity-50 transition-opacity">About</a>
          </div>
        </div>
        <button className="text-[11px] font-bold uppercase bg-black text-white px-8 py-3 rounded-full hover:scale-105 transition-transform active:scale-95">
          Get in Touch
        </button>
      </nav>

      <main>
        {/* 2. Hero Section */}
        <section className="relative h-screen flex items-center">
          <div className="bg-text select-none text-black pl-[3vw] z-10 uppercase">Premium Beef</div>
          
          <div className="floating-item item-1"><img src={beefImages[0]} alt="Beef Cut 1" /></div>
          <div className="floating-item item-2"><img src={beefImages[1]} alt="Beef Cut 2" /></div>
          <div className="floating-item item-3"><img src={beefImages[2]} alt="Beef Cut 3" /></div>
          
          <div className="absolute left-[4vw] bottom-20 z-50 max-w-md">
            <div className="flex items-start space-x-8">
              <div className="text-xs font-black uppercase tracking-[0.3em] leading-tight pt-1">World<br />Class</div>
              <div className="text-gray-500 text-[13px] leading-relaxed max-w-[260px]">
                Direct from global ranches to your business. We define the global standard of high-end meat supply and logistics.
              </div>
            </div>
            <div className="mt-10">
              <a href="#" className="group relative inline-flex items-center border-[1.5px] border-black px-10 py-4 overflow-hidden">
                <span className="absolute inset-0 bg-black translate-y-full transition-transform duration-500 group-hover:translate-y-0"></span>
                <span className="relative text-xs font-black uppercase tracking-[0.4em] text-black group-hover:text-white transition-colors duration-500">Inquire Now</span>
                <span className="relative ml-4 text-black group-hover:text-white transition-colors group-hover:translate-x-1 duration-500">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* 3. Anatomy Section (整牛部位分布图) - 核心修改区域 */}
        <section id="anatomy" className="py-40 bg-black relative z-50 px-[6vw] overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                    <div className="reveal">
                        <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-gray-500">Visual Guide</span>
                        <h2 className="text-[6vw] font-black tracking-tighter leading-none uppercase mt-4 text-white">Full Cattle <br />Distribution</h2>
                    </div>
                    <p className="max-w-xs text-sm text-gray-400 leading-relaxed reveal" style={{ transitionDelay: '0.2s' }}>
                        Each cut represents a distinct culinary profile. Our master butchers identify and extract these prime sections with surgical precision to preserve marbling and texture.
                    </p>
                </div>
                
                {/* 交互容器：鼠标离开整体区域时重置状态 */}
                <div 
                  className="relative w-full aspect-[21/9] flex items-center justify-center reveal"
                  onMouseLeave={() => setActivePart(null)}
                >
                    {/* 图片包装容器：继承原有的缩放和过渡效果 */}
                    <div className="relative w-full h-full max-w-6xl group scale-125 transition-transform duration-1000 group-hover:scale-115">
                        
                        {/* 层级 1: 默认黑白轮廓图 (图二) */}
                        <img 
                            src="/cattle-anatomy.png" 
                            className={`w-full h-full object-contain grayscale transition-opacity duration-700 ${activePart ? 'opacity-20' : 'opacity-80'}`} 
                            alt="Full Cattle Anatomy" 
                        />

                        {/* 层级 2: 动态生肉特写层 (图一对应部位) */}
                        {anatomyParts.map((part) => (
                          <img
                            key={part.id}
                            src={part.img}
                            alt={part.name}
                            className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500 ease-in-out ${
                              activePart === part.id ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        ))}

                        {/* 层级 3: 交互热区 (无形层，拦截鼠标事件) */}
                        {anatomyParts.map((part) => (
                          <div
                            key={`hitbox-${part.id}`}
                            className="absolute cursor-pointer z-30"
                            style={part.style}
                            onMouseEnter={() => setActivePart(part.id)}
                          />
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* 4. Factory Advantage (工厂优势) */}
        <section id="factory" className="py-40 bg-[#f9f9f9] relative z-50 px-[6vw]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 reveal">
                    <h2 className="text-5xl font-black tracking-tighter uppercase mb-12">The Industrial <br />Standard</h2>
                    <div className="space-y-12">
                        {[
                            { title: "Precision Processing", desc: "Automated precision cutting systems ensure weight consistency within 0.5% margin of error." },
                            { title: "Smart Cold Chain", desc: "IoT-enabled real-time temperature monitoring from the deboning room to the shipping container." },
                            { title: "HACCP Certified", desc: "Highest food safety protocols with ISO 22000 integration across all processing lines." }
                        ].map((item, i) => (
                            <div key={i} className="group">
                                <div className="flex items-center space-x-4 mb-2">
                                    <span className="text-xs font-black w-6 h-6 rounded-full border border-black flex items-center justify-center">{i+1}</span>
                                    <h4 className="font-black uppercase tracking-widest">{item.title}</h4>
                                </div>
                                <p className="text-gray-500 text-sm pl-10 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-7 grid grid-cols-2 gap-4 reveal" style={{ transitionDelay: '0.3s' }}>
                    <div className="space-y-4">
                        <div className="aspect-[4/5] bg-gray-200 rounded-2xl overflow-hidden">
                            <img src="/111.jpg" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Factory View 1" />
                        </div>
                        <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                            <img src="/222.jpg" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Factory View 2" />
                        </div>
                    </div>
                    <div className="pt-12 space-y-4">
                        <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                            <img src="/555.jpg" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Factory View 3" />
                        </div>
                        <div className="aspect-[4/5] bg-gray-200 rounded-2xl overflow-hidden">
                            <img src="/666.jpg" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Factory View 4" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* 5. Brand Story (About) - 保持不动 */}
        <section id="about" className="py-40 px-[6vw] bg-white relative z-50 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="reveal">
              <h2 className="text-[8vw] font-black tracking-tighter mb-10 uppercase leading-[0.85] text-black">
                01 / <br/>The Essence
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6 font-medium">
                We deliver excellence, not just meat. From pristine natural pastures to the table, every fiber is meticulously selected for superior quality.
              </p>
              <div className="h-px w-20 bg-black mb-8"></div>
              
              <div className="grid grid-cols-2 gap-8 font-bold uppercase tracking-[0.25em]">
                <div>
                  <p className="text-gray-400 text-[14px] mb-2">Origin</p>
                  <p className="text-lg">Natural Pasture</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[14px] mb-2">Quality</p>
                  <p className="text-lg">A5 / Marble Score 9+</p>
                </div>
              </div>
            </div>
            <div className="relative h-[600px] bg-gray-100 overflow-hidden group reveal" style={{ transitionDelay: '0.2s' }}>
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" 
                alt="Artisanal Farm"
              />
            </div>
          </div>
        </section>

        {/* 6. Selection Gallery (Products) - 保持不动 */}
        <section id="products" className="py-32 bg-[#0a0a0a] text-white overflow-hidden relative z-50">
          <div className="px-[6vw] mb-20">
            <h2 className="text-8xl font-black tracking-tighter opacity-10 mb-[-25px] select-none uppercase">SELECTION</h2>
            <h3 className="text-5xl font-bold relative z-10">Selected Quality Products</h3>
          </div>
          
          <div className="flex flex-nowrap space-x-10 px-[6vw] overflow-x-auto pb-16 no-scrollbar">
            {[
              { name: 'Ribeye', desc: 'Exceptional marbling with a rich, buttery texture.', img: beefImages[0] },
              { name: 'Sirloin', desc: 'Firm texture with a deep, robust beef profile.', img: beefImages[1] },
              { name: 'Tenderloin', desc: 'The ultimate lean cut with velvet-soft tenderness.', img: beefImages[2] },
              { name: 'Tomahawk', desc: 'Majestic presentation with intense flavor profile.', img: beefImages[0] }
            ].map((item, i) => (
              <div key={i} className="min-w-[380px] group cursor-pointer reveal">
                <div className="aspect-[3/4] bg-[#151515] mb-6 overflow-hidden flex items-center justify-center p-12">
                  <img src={item.img} className="w-full h-auto transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6" alt={item.name} />
                </div>
                <h4 className="text-2xl font-black uppercase tracking-widest mb-2">{item.name}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 7. Footer */}
      <footer className="bg-black text-white pt-32 pb-12 px-[6vw] relative z-50">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 border-b border-white/10 pb-24">
            <div>
              <h2 className="reveal-left text-[8vw] leading-[0.8] font-black tracking-tighter mb-12 uppercase -ml-[0.5vw]">
                Premium <br/> Beef.
              </h2>
              <p className="text-xl text-gray-400 max-w-md font-medium reveal" style={{ transitionDelay: '0.2s' }}>
                Setting the global standard for high-end meat supply and logistics since 2026.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 pt-8 lg:pl-20">
              <div className="flex flex-col space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Company</span>
                <div className="flex flex-col space-y-4 text-sm font-medium">
                  <a href="#about" className="footer-link">Our Story</a>
                  <a href="#" className="footer-link">Pastures</a>
                  <a href="#" className="footer-link">Sustainability</a>
                </div>
              </div>
              <div className="flex flex-col space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Services</span>
                <div className="flex flex-col space-y-4 text-sm font-medium">
                  <a href="#products" className="footer-link">Selection</a>
                  <a href="#" className="footer-link">Global Logistics</a>
                  <a href="#" className="footer-link">Partnerships</a>
                </div>
              </div>
              <div className="flex flex-col space-y-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Contact</span>
                <div className="flex flex-col space-y-4 text-sm font-medium">
                  <a href="mailto:trade@premium-beef.com" className="footer-link">Inquiries</a>
                  <a href="#" className="footer-link">LinkedIn</a>
                  <a href="#" className="footer-link">Instagram</a>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest text-gray-500">
              <p>© 2026 Premium Beef International</p>
              <div className="w-[1px] h-4 bg-white/10 hidden md:block"></div>
              <p>Built with Precision</p>
            </div>

            <div className="flex space-x-10 text-[10px] font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
