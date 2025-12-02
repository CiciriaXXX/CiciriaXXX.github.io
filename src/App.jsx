import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Gamepad2, 
  Cpu, 
  Palette, 
  Github, 
  Twitter, 
  Mail, 
  ChevronRight, 
  X, 
  ExternalLink,
  ArrowLeft,
  Code,
  Layers,
  Zap, // Use Zap for more impact
  Shield, // Use Shield for 'emblem/crest' look
} from 'lucide-react';

// --- 模拟数据 (Mock Data) ---

const personalInfo = {
  name: "Cecilia Xu",
  title: "Game Developer & Digital Artist",
  bio: "致力于创造沉浸式交互体验。热衷于计算机图形学、游戏开发以及数字艺术创作。我相信代码是骨架，而艺术是灵魂。",
  skills: ["Unity / C#", "OpenGL / GLSL", "React / WebGL", "Blender", "Photoshop/CSP/SAI/Procreate/Aseprite"]
};

const gamesData = [
  {
    id: 1,
    title: "TimeLoopForest",
    category: "Puzzle",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
    description: "一款高节奏的复古未来主义赛博朋克竞速游戏。玩家需要在霓虹闪烁的城市中极速穿梭，同时躲避执法无人机的追捕。",
    details: "Solo Developer",
    tech: ["Unity", "C#", "HLSL Shader", "FMOD"],
    link: "#"
  },
  {
    id: 2,
    title: "Escape.exe",
    category: "Click Point Adventure",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit:crop&q=80&w=800",
    description: "在神秘的森林中醒来，通过控制风和光线来解开古老的谜题。",
    details: "Programmer/Gameplay Designer/ Artist",
    tech: ["Unreal Engine 5", "Blueprints", "Niagara VFX"],
    link: "#"
  }
];

const graphicsData = [
  {
    id: 1,
    title: "Silh",
    category: "渲染引擎",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit:crop&q=80&w=800",
    description: "基于 C++ 从零编写的光线追踪渲染器，支持软阴影、反射和折射。",
    details: "这是一个用于学习计算机图形学底层原理的项目。实现了 BVH 加速结构，支持 Monte Carlo 路径追踪，以及多种材质模型（Lambertian, Metal, Dielectric）。",
    tech: ["C++", "Multi-threading", "Math"],
    link: "#"
  }
];

const artData = [
  {
    id: 1,
    title: "Cyber Skull",
    description: "探索机械与骨骼的结合。",
    src: "https://images.unsplash.com/photo-1531297461136-82lw9z0u?auto=format&fit:crop&q=80&w=800",
    year: "2023"
  },
  {
    id: 2,
    title: "Abstract Waves",
    description: "情绪的数字化表达。",
    src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit:crop&q=80&w=800",
    year: "2023"
  },
  {
    id: 3,
    title: "Lost City",
    description: "概念场景设计。",
    src: "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?auto=format&fit:crop&q=80&w=800",
    year: "2022"
  },
  {
    id: 4,
    title: "Glitch Portrait",
    description: "故障艺术实验。",
    src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit:crop&q=80&w=800",
    year: "2024"
  }
];

// --- 核心样式定义 - Hard Shadow & Pop Colors ---

// Tailwind Hard Shadow Utility
const HARD_SHADOW_SM = "shadow-[3px_3px_0px_black]";
const HARD_SHADOW_MD = "shadow-[6px_6px_0px_black]";
const HARD_SHADOW_LG = "shadow-[10px_10px_0px_black]";

// Halftone Dot Pattern (CSS Background)
const HALFTONE_BG = "bg-[radial-gradient(rgb(254_243_199)_1px,transparent_1px)] [background-size:8px_8px]";


// --- 组件部分 - Pop Geometric Style ---

const NavItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 px-6 py-3 w-full transition-all duration-150 group rounded-none
      border-l-4 ${active ? 'border-red-500' : 'border-black'} 
      ${active 
        ? 'bg-yellow-400 text-black font-black' 
        : 'text-gray-700 hover:bg-yellow-100'
      }`}
  >
    <Icon size={24} className={`transition-transform duration-150 ${active ? 'scale-110' : ''}`} />
    <span className="tracking-wide">{label}</span>
  </button>
);

const ProjectCard = ({ project, onClick }) => (
  <div 
    onClick={() => onClick(project)}
    // Hard Shadow and Thick Border
    className={`group relative cursor-pointer overflow-hidden rounded-lg bg-white border-4 border-black ${HARD_SHADOW_MD} transition-all duration-200 
      hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:border-red-500`}
  >
    <div className="aspect-video overflow-hidden border-b-4 border-black">
      <img 
        src={project.image} 
        alt={project.title} 
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        // Add a harsh, textured overlay on hover
      />
    </div>
    <div className="p-4 relative">
      {/* Pop Category Tag with Hard Shadow */}
      <p className={`text-sm font-black tracking-widest uppercase mb-2 inline-block px-3 py-1 bg-red-500 text-white border-2 border-black ${HARD_SHADOW_SM}`}>
        {project.category}
      </p>
      <h3 className="text-2xl font-black text-gray-900 mb-4">{project.title}</h3>
      <p className="text-gray-700 text-sm line-clamp-2 mb-4">{project.description}</p>
      
      {/* Action Button Style */}
      <div className={`flex items-center gap-1 text-black text-sm font-black border-2 border-black bg-yellow-400 px-3 py-1 inline-block ${HARD_SHADOW_SM} transition-all duration-150 group-hover:bg-red-500 group-hover:text-white`}>
        GO <ChevronRight size={16} />
      </div>
    </div>
  </div>
);

const ProjectDetail = ({ project, onBack }) => (
  <div className={`animate-fade-in-up bg-white p-6 md:p-10 rounded-lg border-4 border-black ${HARD_SHADOW_LG}`}>
    <button 
      onClick={onBack}
      className={`mb-8 flex items-center gap-2 text-black font-black bg-yellow-400 px-4 py-2 rounded-none border-2 border-black ${HARD_SHADOW_SM} transition-all hover:bg-red-500 hover:text-white hover:shadow-none`}
    >
      <ArrowLeft size={20} /> 返回列表
    </button>
    
    {/* Hero Image with Heavy Border */}
    <div className="relative h-64 md:h-80 w-full rounded-none overflow-hidden mb-8 border-4 border-black">
      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30" /> 
      <div className="absolute bottom-0 left-0 p-6 md:p-8">
        <h1 className="text-4xl md:text-5xl font-black text-white bg-black px-2 py-1 inline-block">{project.title}</h1>
        <p className="text-xl font-bold text-yellow-400 mt-2">{project.category}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2 border-b-4 border-red-500 pb-2">
          <Layers size={24} className="text-red-500" /> 项目详情
        </h3>
        {/* Detail Box with Halftone Background */}
        <p className="text-gray-800 leading-relaxed text-lg font-medium p-4 rounded-lg border-2 border-black bg-yellow-100">
          {project.details}
        </p>
        <p className="text-gray-700 leading-relaxed">
          {project.description}
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Tech Box with Hard Shadow */}
        <div className={`bg-white p-6 rounded-lg border-2 border-black ${HARD_SHADOW_SM}`}>
          <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
             <Code size={20} className="text-red-500" /> 技术栈
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t, index) => (
              <span key={index} className="px-3 py-1 bg-teal-500 text-black rounded-none text-sm font-black border border-black">
                {t}
              </span>
            ))}
          </div>
        </div>
        
        {/* Call to Action Button */}
        <button className={`w-full py-4 bg-red-500 text-white font-black text-lg rounded-none border-4 border-black ${HARD_SHADOW_SM} hover:bg-red-600 transition-all hover:shadow-none`}>
          <ExternalLink size={20} className="inline mr-2" /> 访问项目 / 源码
        </button>
      </div>
    </div>
  </div>
);

const ArtModal = ({ art, onClose }) => {
  if (!art) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors bg-red-500 border-4 border-black p-2"
      >
        <X size={32} />
      </button>
      
      <div 
        className="max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row bg-white rounded-none overflow-hidden border-4 border-black"
        onClick={e => e.stopPropagation()} 
      >
        <div className="w-full md:w-2/3 h-[50vh] md:h-auto bg-stone-100 flex items-center justify-center relative border-r-4 border-black">
          <img 
            src={art.src} 
            alt={art.title} 
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <div className="w-full md:w-1/3 p-8 flex flex-col justify-center border-l-4 border-black bg-yellow-400">
          <p className="text-black font-black text-sm mb-2 uppercase tracking-widest bg-white inline-block px-2 py-0.5 self-start border-2 border-black">{art.year}</p>
          <h2 className="text-3xl font-black text-black mb-4">{art.title}</h2>
          <p className="text-gray-900 leading-relaxed mb-8">{art.description}</p>
          <div className="mt-auto pt-6 border-t-4 border-black">
             {/* Emblem/Crest Look */}
             <div className="flex items-center gap-4 bg-red-500 p-3 border-2 border-black">
                <Shield size={24} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-white font-black">ARTIST: {personalInfo.name}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 主应用组件 ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null); 
  const [selectedArt, setSelectedArt] = useState(null); 

  useEffect(() => {
    setSelectedProject(null);
    window.scrollTo(0, 0);
  }, [activeTab]);

  const renderContent = () => {
    if (selectedProject) {
      return (
        <ProjectDetail 
          project={selectedProject} 
          onBack={() => setSelectedProject(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="max-w-4xl mx-auto py-12 animate-fade-in">
            {/* Retro Hero Card with Hard Shadow, Color Block and Thick Border */}
            <div className={`bg-white p-10 rounded-lg border-4 border-black ${HARD_SHADOW_LG} mb-16 relative overflow-hidden`}>
              {/* Decorative Halftone Layer */}
              <div className={`absolute inset-0 opacity-50 z-0 ${HALFTONE_BG}`}></div>

              <div className="relative z-10">
                <div className="mb-12">
                  <span className={`inline-block px-3 py-1 mb-4 text-xs font-black tracking-wider text-black uppercase bg-teal-400 border-2 border-black ${HARD_SHADOW_SM}`}>
                    SYSTEM READY
                  </span>
                  <h1 className="text-5xl md:text-7xl font-black text-black mb-6 leading-none">
                    <span className="bg-red-500 text-white px-3 py-1 inline-block whitespace-nowrap">INIT</span> {personalInfo.name}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-black bg-yellow-200 p-4 border-2 border-black">
                    {personalInfo.bio}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Skills Block */}
                  <div className={`bg-white p-6 border-4 border-black ${HARD_SHADOW_SM}`}>
                    <h3 className="text-gray-900 font-black mb-4 flex items-center gap-2">
                      <Zap size={20} className="text-red-500" /> SKILL LEVEL
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {personalInfo.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-teal-500 text-black rounded-none text-sm font-black border border-black">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Contact Block */}
                  <div className={`bg-white p-6 border-4 border-black ${HARD_SHADOW_SM}`}>
                    <h3 className="text-gray-900 font-black mb-4">CONTACT</h3>
                    <div className="flex gap-4">
                      <a href="#" className="p-2 bg-black text-white rounded-none border-2 border-white hover:bg-red-500"><Github size={20}/></a>
                      <a href="#" className="p-2 bg-black text-white rounded-none border-2 border-white hover:bg-yellow-400 hover:text-black"><Twitter size={20}/></a>
                      <a href="#" className="p-2 bg-black text-white rounded-none border-2 border-white hover:bg-teal-500"><Mail size={20}/></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'game':
        return (
          <div className="animate-fade-in">
            <header className="mb-12">
              <h2 className="text-4xl font-black text-black mb-2 inline-block border-b-4 border-red-500">GAME PROJECT</h2>
              <p className="text-gray-700 font-black">Level Select: Retro Arcade</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {gamesData.map(game => (
                <ProjectCard key={game.id} project={game} onClick={setSelectedProject} />
              ))}
            </div>
          </div>
        );

      case 'graphics':
        return (
          <div className="animate-fade-in">
            <header className="mb-12">
              <h2 className="text-4xl font-black text-black mb-2 inline-block border-b-4 border-red-500">GRAPHICS ENGINE</h2>
              <p className="text-gray-700 font-black">Code Collage: GPU Experiments</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {graphicsData.map(proj => (
                <ProjectCard key={proj.id} project={proj} onClick={setSelectedProject} />
              ))}
            </div>
          </div>
        );

      case 'art':
        return (
          <div className="animate-fade-in">
             <header className="mb-12">
              <h2 className="text-4xl font-black text-black mb-2 inline-block border-b-4 border-red-500">DIGITAL ART</h2>
              <p className="text-gray-700 font-black">Visual Transmission</p>
            </header>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {artData.map(art => (
                <div 
                  key={art.id} 
                  className={`break-inside-avoid relative group cursor-pointer border-4 border-black ${HARD_SHADOW_SM} overflow-hidden`}
                  onClick={() => setSelectedArt(art)}
                >
                  <img src={art.src} alt={art.title} className="w-full h-auto transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center font-black text-white p-4 bg-black/80 border-2 border-white">
                      <h3 className="text-xl">{art.title}</h3>
                      <p className="text-yellow-400 text-sm mt-1">OPEN VIEW</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-100 text-black font-sans selection:bg-red-500 selection:text-white">
      
      {/* 侧边导航栏 (Desktop) - 强调硬切割和边框 */}
      <nav className={`hidden lg:flex flex-col w-72 bg-yellow-400 border-r-4 border-black fixed h-full z-20 ${HARD_SHADOW_LG}`}>
        <div className="p-8 border-b-4 border-black text-center bg-white">
          <div className={`w-16 h-16 bg-red-500 rounded-none mx-auto mb-4 border-4 border-black flex items-center justify-center text-white text-3xl font-black ${HARD_SHADOW_SM}`}>
             CX
          </div>
          <h1 className="text-xl font-black text-black tracking-wide">{personalInfo.name}</h1>
          <p className="text-xs text-red-500 font-black mt-1 uppercase tracking-widest">{personalInfo.title}</p>
        </div>

        <div className="flex-1 py-4 px-0 space-y-0 border-b-4 border-black">
          <NavItem icon={Home} label="HOME BASE" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <NavItem icon={Gamepad2} label="ARCADE ZONE" active={activeTab === 'game'} onClick={() => setActiveTab('game')} />
          <NavItem icon={Cpu} label="CODE LAB" active={activeTab === 'graphics'} onClick={() => setActiveTab('graphics')} />
          <NavItem icon={Palette} label="VISUAL ASSETS" active={activeTab === 'art'} onClick={() => setActiveTab('art')} />
        </div>

        <div className="p-8 text-black font-black text-sm bg-teal-400 border-t-2 border-black">
           <p className="mb-1">STATUS: OPERATIONAL</p>
           <p>MODE: CREATION</p>
        </div>
      </nav>

      {/* 移动端顶部导航 - 采用黑色背景和高对比度文字 */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-black z-30 border-b-4 border-red-500 p-4 flex justify-between items-center shadow-lg">
         <span className="font-black text-yellow-400 text-xl">{personalInfo.name}</span>
         <div className="flex gap-4">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-yellow-400 bg-red-500 p-1' : 'text-gray-400'}><Home size={20}/></button>
            <button onClick={() => setActiveTab('game')} className={activeTab === 'game' ? 'text-yellow-400 bg-red-500 p-1' : 'text-gray-400'}><Gamepad2 size={20}/></button>
            <button onClick={() => setActiveTab('graphics')} className={activeTab === 'graphics' ? 'text-yellow-400 bg-red-500 p-1' : 'text-gray-400'}><Cpu size={20}/></button>
            <button onClick={() => setActiveTab('art')} className={activeTab === 'art' ? 'text-yellow-400 bg-red-500 p-1' : 'text-gray-400'}><Palette size={20}/></button>
         </div>
      </div>

      {/* 主内容区域 */}
      <main className="flex-1 lg:ml-72 min-h-screen relative bg-stone-100">
        {/* 背景纹理 - 网点图案 */}
        <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80 ${HALFTONE_BG}`}>
        </div>

        <div className="relative z-10 p-6 md:p-12 lg:p-16 pt-24 lg:pt-16 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* 全局模态窗组件 */}
      <ArtModal art={selectedArt} onClose={() => setSelectedArt(null)} />
      
    </div>
  );
}