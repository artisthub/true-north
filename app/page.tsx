'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const TrueNorthLanding = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.fade-trigger');
    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-pink-500/30 overflow-x-hidden relative">
      {/* --- GLOBAL STYLES & ANIMATIONS --- */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;800&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .delay-100 {
          transition-delay: 100ms;
        }
        .delay-200 {
          transition-delay: 200ms;
        }
        .delay-300 {
          transition-delay: 300ms;
        }

        .bg-noise {
          background-image: url('data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.05"/%3E%3C/svg%3E');
        }

        .glass-card {
          background: rgba(255, 20, 147, 0.04);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 20, 147, 0.2);
          box-shadow: 0 10px 40px rgba(255, 20, 147, 0.12);
        }

        .text-glow {
          text-shadow: 0 0 50px rgba(255, 105, 180, 0.35);
        }

        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(45deg);
            opacity: 1;
          }
          100% {
            transform: translateX(-500px) translateY(500px) rotate(45deg);
            opacity: 0;
          }
        }

        .shooting-star {
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, rgba(255, 20, 147, 0), rgba(255, 20, 147, 0.95));
          animation: shoot 4s linear infinite;
          opacity: 0;
        }

        .shooting-star:nth-child(1) {
          top: 10%;
          right: 20%;
          animation-delay: 2s;
        }
        .shooting-star:nth-child(2) {
          top: 30%;
          right: 0%;
          animation-delay: 5s;
        }
        .shooting-star:nth-child(3) {
          top: 5%;
          right: 40%;
          animation-delay: 8s;
        }

        .starfield {
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: screen;
        }

        .starfield-slow {
          background-image:
            radial-gradient(rgba(255, 20, 147, 0.25) 1px, transparent 1px),
            radial-gradient(rgba(255, 105, 180, 0.2) 1px, transparent 1px);
          background-size: 900px 900px, 700px 700px;
          background-position: 0 0, 200px 150px;
          animation: driftStars 160s linear infinite;
          opacity: 0.45;
        }

        .starfield-fast {
          background-image:
            radial-gradient(rgba(255, 182, 193, 0.65) 1px, transparent 1px),
            radial-gradient(rgba(255, 69, 160, 0.45) 2px, transparent 1px);
          background-size: 500px 500px, 650px 650px;
          background-position: 100px 50px, 300px 200px;
          animation: driftStars 90s linear infinite reverse, twinkle 6s ease-in-out infinite;
          opacity: 0.7;
        }

        .aurora-glow {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -30vh;
          height: 70vh;
          background: radial-gradient(circle at 50% 20%, rgba(255, 85, 185, 0.35), transparent 55%);
          filter: blur(80px);
          opacity: 0.7;
          animation: auroraFloat 18s ease-in-out infinite;
        }

        @keyframes driftStars {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(200px);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.9;
          }
        }

        @keyframes auroraFloat {
          0% {
            transform: translateY(0) scaleX(0.9);
          }
          50% {
            transform: translateY(-40px) scaleX(1.1);
          }
          100% {
            transform: translateY(0) scaleX(0.9);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>

      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-10" />
        <div className="starfield starfield-slow" />
        <div className="starfield starfield-fast" />
        <div className="absolute inset-x-0 top-0 h-[45vh] bg-gradient-to-b from-[#FF1493]/20 via-transparent to-transparent" />
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#FF1493]/18 rounded-full blur-[140px]" />
        <div className="absolute bottom-[5%] right-[-10%] w-[45vw] h-[45vw] bg-[#FF69B4]/18 rounded-full blur-[140px]" />
        <div className="aurora-glow" />

        <div className="shooting-star" />
        <div className="shooting-star" />
        <div className="shooting-star" />
        <div className="absolute top-20 left-20 text-pink-400/40 text-xs animate-pulse">✦</div>
        <div className="absolute top-40 right-1/4 text-white/20 text-xl animate-pulse delay-75">✧</div>
        <div className="absolute bottom-32 left-1/3 text-rose-400/30 text-sm animate-pulse delay-150">✦</div>
      </div>

      {/* --- HEADER --- */}
      <header
        className={`fixed w-full top-0 z-50 transition-all duration-500 border-b ${
          scrolled ? 'bg-[rgba(5,0,8,0.9)] backdrop-blur-md border-[#FF1493]/30 py-4' : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center cursor-pointer">
            <Image src="/logo.svg" alt="True North logo" width={160} height={160} priority className="w-32 h-auto drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]" />
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Distribution', 'About', 'Pricing', 'Features'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-gray-300 hover:text-[#FF1493] transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-4 left-0 w-0 h-[2px] bg-gradient-to-r from-[#FF1493] to-[#FF69B4] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </a>
            ))}
          </nav>

          <a
            href="#start"
            className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-gradient-to-r from-[#FF1493] to-[#FF69B4] rounded-full shadow-[0_10px_30px_rgba(255,20,147,0.25)] hover:shadow-[0_20px_45px_rgba(255,20,147,0.45)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF69B4] focus:ring-offset-[#050005]"
          >
            Get Started
          </a>
        </div>
      </header>

      <main className="relative z-10">
        {/* --- HERO --- */}
        <section className="min-h-screen flex flex-col justify-center pt-20 relative overflow-hidden">
          <div className="container mx-auto px-6 text-center">

            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 fade-trigger opacity-0 translate-y-10 transition-all duration-700 delay-100 text-glow">
              Release with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FFE0F4] to-[#FF69B4]">
                Direction
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed fade-trigger opacity-0 translate-y-10 transition-all duration-700 delay-200">
              Global distribution, clean splits, fast data—no busywork.
              <span className="block mt-2 text-gray-500 text-lg">
                For artists and labels who want less admin and more release days.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-trigger opacity-0 translate-y-10 transition-all duration-700 delay-300">
              <a
                href="#start"
                className="w-full sm:w-auto px-10 py-4 rounded-full font-semibold text-lg bg-gradient-to-r from-[#FF1493] to-[#FF69B4] text-white shadow-[0_20px_60px_rgba(255,20,147,0.25)] hover:-translate-y-0.5 transition-all"
              >
                Start Distributing
              </a>
              <a
                href="#features"
                className="w-full sm:w-auto px-10 py-4 bg-transparent border border-[#FF1493]/30 text-[#FFB6DA] rounded-full font-semibold text-lg hover:bg-[#FF1493]/10 transition-colors"
              >
                View Features
              </a>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050005] to-transparent pointer-events-none" />
        </section>

        {/* --- DSPS --- */}
        <section id="distribution" className="py-24 border-t border-[#FF1493]/20 bg-[rgba(5,0,5,0.85)] backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 fade-trigger opacity-0 translate-y-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Drop once. Live everywhere.</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Ship to 100+ DSPs from a single dashboard. Pre‑saves and smart links included.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center opacity-60 fade-trigger opacity-0 translate-y-10 delay-200">
              {[
                {
                  name: 'Spotify',
                  path: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z',
                },
                {
                  name: 'Apple',
                  path: 'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z',
                },
                {
                  name: 'YouTube',
                  path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
                },
                {
                  name: 'Amazon',
                  path: 'M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726-1.53.406-3.045.61-4.516.61-2.265 0-4.463-.4-6.59-1.195-2.11-.794-3.935-1.89-5.43-3.286-.088-.08-.104-.15-.045-.248zm23.71-1.935c-.165-.17-.345-.258-.53-.258-.184 0-.368.088-.534.258-.166.17-.248.35-.248.533 0 .184.082.364.248.533.166.17.35.257.533.257.185 0 .365-.087.53-.257.166-.17.25-.35.25-.533 0-.184-.084-.364-.25-.533zm-.705 3.022c-.062-.065-.137-.097-.226-.097-.09 0-.164.032-.226.097-.062.064-.094.139-.094.226 0 .088.032.163.094.226.062.064.137.097.226.097.09 0 .164-.033.226-.097.062-.063.094-.138.094-.226 0-.087-.032-.162-.094-.226z',
                },
                {
                  name: 'TikTok',
                  path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
                },
                {
                  name: 'Instagram',
                  path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
                },
                {
                  name: 'SoundCloud',
                  path: 'M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c0 .055.045.094.09.094s.089-.045.104-.104l.21-1.319-.21-1.334c0-.061-.044-.09-.09-.09m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.12.119.12.061 0 .12-.061.12-.12l.254-2.474-.254-2.548c-.007-.06-.061-.12-.135-.12m.973-.278c-.07 0-.135.06-.15.135l-.193 2.341.21 2.443c0 .06.06.134.134.134.075 0 .134-.06.134-.134l.24-2.458-.24-2.326c-.007-.075-.074-.135-.135-.135m.828-1.019c-.075 0-.15.074-.15.149l-.18 3.389.18 3.463c.015.074.09.149.165.149.09 0 .149-.074.164-.149l.21-3.463-.21-3.389c-.008-.075-.075-.149-.165-.149m.976.187c-.09 0-.18.09-.18.18l-.15 3.201.165 3.563c0 .074.074.164.164.164.074 0 .164-.074.18-.18l.194-3.548-.194-3.201c-.016-.074-.091-.18-.18-.18m1.038 6.273c-.09 0-.18-.09-.195-.194l-.179-3.389.18-3.015c0-.09.074-.18.179-.18.09 0 .18.074.18.18l.209 3 .015.015-.209 3.389c-.015.09-.09.194-.18.194m.984-7.777c-.104 0-.194.089-.194.194l-.18 4.608.18 3.449c.016.104.09.194.194.194.09 0 .195-.09.195-.194l.209-3.449-.209-4.608c-.016-.104-.09-.194-.195-.194m1.065.119c-.105 0-.21.09-.21.21l-.164 4.488.164 3.45c.016.119.105.21.21.21.119 0 .224-.091.224-.21l.195-3.45-.195-4.488c-.015-.12-.105-.21-.224-.21m1.004 7.776c-.105 0-.195-.074-.21-.18l-.209-3.389.209-4.443c.015-.104.105-.194.21-.194.104 0 .194.089.209.194l.225 4.443-.225 3.389c-.015.104-.104.18-.209.18m1.245-.119c-.119 0-.209-.089-.209-.21l-.195-3.269.195-4.967c.016-.12.09-.21.209-.21.105 0 .21.09.21.21l.224 4.967-.224 3.269c-.016.119-.105.21-.21.21m1.004-8.192c-.119 0-.224.09-.224.225l-.195 5.026.195 3.15c.016.134.105.224.224.224.12 0 .225-.09.225-.224l.209-3.15-.209-5.026c-.016-.134-.105-.225-.225-.225M24 14.479c0-2.09-1.703-3.793-3.792-3.793-.45 0-.899.075-1.319.195-.135-5.115-4.373-9.194-9.563-9.194-1.35 0-2.595.285-3.748.794-.24.104-.285.285-.255.525v19.897c.016.24.195.419.435.45h14.325c2.09 0 3.793-1.703 3.793-3.792z',
                },
              ].map((dsp) => (
                <div
                  key={dsp.name}
                  className="group relative flex flex-col items-center gap-2 p-4 transition-all duration-300 hover:opacity-100 hover:scale-110 cursor-default"
                >
                  <div className="w-10 h-10 fill-current text-gray-400 group-hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24">
                      <path d={dsp.path} />
                    </svg>
                  </div>
                  <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 whitespace-nowrap text-pink-300">
                    {dsp.name}
                  </span>
                </div>
              ))}

              <div className="flex flex-col items-center gap-1 p-4 rounded-full bg-[#FF1493]/5 border border-[#FF1493]/30 text-xs font-medium hover:bg-[#FF1493]/10 transition-colors">
                <span className="text-pink-300 font-bold">+100</span>
                <span className="text-gray-500">more</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- FEATURES (BENTO GRID) --- */}
        <section id="features" className="py-32 bg-gradient-to-b from-[#050005] via-[#02000A] to-[#000000]">
          <div className="container mx-auto px-6">
            <div className="mb-16">
              <h2 className="text-4xl font-bold mb-4 fade-trigger opacity-0 translate-y-10">Built for modern rights</h2>
              <p className="text-xl text-gray-400 fade-trigger opacity-0 translate-y-10 delay-100">
                Everything you need to manage a catalogue, not just files.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 glass-card rounded-3xl p-10 relative overflow-hidden group fade-trigger opacity-0 translate-y-10 delay-100">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF1493]/20 rounded-full blur-[80px] group-hover:bg-[#FF1493]/30 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Splits that don&apos;t need spreadsheets</h3>
                  <p className="text-gray-400 max-w-md text-lg">
                    Set splits in seconds, add recoupables, track costs, and pay collaborators automatically. Statements
                    are clean. Payouts are fast.
                  </p>
                </div>
              </div>

              <div className="md:col-span-1 glass-card rounded-3xl p-10 relative overflow-hidden group fade-trigger opacity-0 translate-y-10 delay-200">
                <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-rose-900/20 to-transparent opacity-50" />
                <div className="w-12 h-12 mb-6 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Data you&apos;ll actually use</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Real‑time trends by platform, territory, and track. See what&apos;s working, skip what isn&apos;t. Export anything.
                </p>
              </div>

              <div className="md:col-span-1 glass-card rounded-3xl p-8 fade-trigger opacity-0 translate-y-10 delay-100">
                <div className="w-10 h-10 mb-4 rounded-lg bg-[#FF1493]/12 border border-[#FF1493]/30 flex items-center justify-center text-[#FFB6DA]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Lyrics land day one</h3>
                <p className="text-gray-400 text-sm">
                  Deliver lyrics through musicmatch + LyricFind, so fans can sing along instantly.
                </p>
              </div>

              <div className="md:col-span-1 glass-card rounded-3xl p-8 fade-trigger opacity-0 translate-y-10 delay-200">
                <div className="w-10 h-10 mb-4 rounded-lg bg-[#FF1493]/12 border border-[#FF1493]/30 flex items-center justify-center text-[#FFB6DA]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Video & UGC, covered</h3>
                <p className="text-gray-400 text-sm">
                  YouTube Content ID + UGC monetization included. Claim revenue without the babysitting.
                </p>
              </div>

              <div className="md:col-span-1 glass-card rounded-3xl p-8 border-l-4 border-l-pink-500 bg-gradient-to-br from-pink-900/20 to-transparent fade-trigger opacity-0 translate-y-10 delay-300">
                <div className="text-xs font-bold tracking-widest text-pink-400 mb-4 uppercase">Enterprise Grade</div>
                <h3 className="text-lg font-bold mb-2">Built to Scale</h3>
                <p className="text-gray-400 text-xs mb-4">
                  Powered by Revelator. DDEX‑compliant deliveries, UPC/ISRC auto-gen, 99.9% uptime.
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded text-[10px] text-[#FFE0F4] bg-[#FF1493]/10 border border-[#FF1493]/30">DDEX</span>
                  <span className="px-2 py-1 rounded text-[10px] text-[#FFE0F4] bg-[#FF1493]/10 border border-[#FF1493]/30">XML</span>
                  <span className="px-2 py-1 rounded text-[10px] text-[#FFE0F4] bg-[#FF1493]/10 border border-[#FF1493]/30">API</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- QUOTE --- */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF1493]/20 via-transparent to-[#FF69B4]/15" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <p className="text-4xl md:text-6xl font-serif italic text-transparent bg-clip-text bg-gradient-to-b from-white to-[#FF9AD5] fade-trigger opacity-0 translate-y-10 duration-1000">
              &quot;Move in the right direction.&quot;
            </p>
          </div>
        </section>

        {/* --- STATS --- */}
        <section className="py-24 border-y border-[#FF1493]/15 bg-[#050005]">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#FF1493]/10 fade-trigger opacity-0 translate-y-10">
              {[
                { val: '100+', label: 'DSPs Worldwide', sub: 'Global Reach' },
                { val: 'One', label: 'Unified Dashboard', sub: 'Total Control' },
                { val: 'Zero', label: 'Hidden Fees', sub: 'Transparent Terms' },
                { val: 'DDEX', label: 'Compliant', sub: 'Industry Standard' },
              ].map((stat, i) => (
                <div key={i} className="pt-8 md:pt-0 px-4">
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-[#FF9AD5] mb-2">
                    {stat.val}
                  </div>
                  <div className="text-white font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- PRICING --- */}
        <section id="pricing" className="py-32 bg-[#050005] relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF1493]/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-4xl font-bold text-center mb-16 fade-trigger opacity-0 translate-y-10">Transparent Pricing</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              <div className="glass-card p-8 rounded-3xl relative group border-pink-500/30 fade-trigger opacity-0 translate-y-10 delay-100">
                <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                <div className="relative z-10">
                  <h3 className="text-xl font-medium text-pink-300 mb-4">Active</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-bold text-white">$39</span>
                    <span className="text-gray-400">/yr</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-8">+ 40% of sync revenue</div>

                  <ul className="space-y-4 mb-8 text-gray-300 text-sm">
                    {['Global distribution', 'Automated splits & payouts', 'Advanced Analytics', 'Smart Links', 'Lyrics Delivery'].map(
                      (feat) => (
                        <li key={feat} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                          {feat}
                        </li>
                      ),
                    )}
                  </ul>
                  <a
                    href="#start"
                    className="block w-full py-4 text-center rounded-xl font-bold bg-gradient-to-r from-[#FF1493] to-[#FF69B4] text-white shadow-[0_15px_45px_rgba(255,20,147,0.35)] hover:-translate-y-0.5 transition-all"
                  >
                    Choose Active
                  </a>
                </div>
              </div>

              <div className="glass-card p-8 rounded-3xl relative fade-trigger opacity-0 translate-y-10 delay-200">
                <h3 className="text-xl font-medium text-[#FFC4E5] mb-4">Partner</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold text-white">15%</span>
                  <span className="text-gray-400">revenue</span>
                </div>
                <div className="text-sm text-gray-400 mb-8">No annual fee</div>

                <ul className="space-y-4 mb-8 text-gray-300 text-sm">
                  {['Everything in Active', 'White-label pages', 'Priority Support', 'Ideal for Labels', 'Custom Contracts'].map(
                    (feat) => (
                      <li key={feat} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF4EBF]" />
                        {feat}
                      </li>
                    ),
                  )}
                </ul>
                <a
                  href="#start"
                  className="block w-full py-4 text-center rounded-xl border border-[#FF1493]/30 hover:bg-[#FF1493]/10 transition-colors text-white font-semibold"
                >
                  Choose Partner
                </a>
              </div>
            </div>

            <div className="max-w-3xl mx-auto glass-card rounded-2xl overflow-hidden fade-trigger opacity-0 translate-y-10 delay-300">
              <div className="p-6 border-b border-[#FF1493]/15 bg-[#FF1493]/5">
                <h3 className="font-semibold">Add-Ons</h3>
              </div>
              <div className="divide-y divide-[#FF1493]/10 text-sm text-gray-300">
                <div className="flex justify-between p-6 hover:bg-[#FF1493]/5 transition-colors">
                  <span>YouTube Content ID + UGC</span>
                  <span className="text-white font-mono">30%</span>
                </div>
                <div className="flex justify-between p-6 hover:bg-[#FF1493]/5 transition-colors">
                  <span>Video Distribution</span>
                  <span className="text-white font-mono">$100 / video</span>
                </div>
                <div className="flex justify-between p-6 hover:bg-[#FF1493]/5 transition-colors">
                  <span>Blog Placement</span>
                  <span className="text-white font-mono">On Request</span>
                </div>
                <div className="flex justify-between p-6 hover:bg-[#FF1493]/5 transition-colors">
                  <span>White-label links</span>
                  <span className="text-green-400 font-mono">Included</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CTA --- */}
        <section id="start" className="py-32 flex items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#FF1493]/25 to-transparent" />
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white fade-trigger opacity-0 translate-y-10">
              Ready when you are.
            </h2>
            <p className="text-xl text-gray-400 mb-10 fade-trigger opacity-0 translate-y-10 delay-100">
              Upload the single, set your splits, and point your compass north.
            </p>
            <a
              href="#"
              className="inline-block px-10 py-5 rounded-full text-xl font-bold bg-gradient-to-r from-[#FF1493] to-[#FF69B4] text-white shadow-[0_25px_80px_rgba(255,20,147,0.35)] hover:-translate-y-1 transition-transform fade-trigger opacity-0 translate-y-10 delay-200"
            >
              Get Started Now
            </a>
          </div>
        </section>

        {/* --- LEGAL (Condensed) --- */}
        <section className="py-16 border-t border-[#FF1493]/15 bg-[rgba(5,0,5,0.9)] text-gray-400 text-sm">
          <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12">
            <div>
              <h4 className="text-white font-bold mb-4">DMCA Policy</h4>
              <p className="mb-4 leading-relaxed">
                True North respects the rights of creators. If you believe content distributed through our services violates
                your copyright, submit a detailed Digital Millennium Copyright Act (DMCA) notice to{' '}
                <a href="mailto:dmca@truenorth.com" className="text-pink-400 hover:underline">
                  dmca@truenorth.com
                </a>
                .
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Privacy & Cookies</h4>
              <p className="leading-relaxed">
                We use essential cookies to keep your account secure and performance cookies to understand release metrics.
                Marketing cookies are optional. Contact{' '}
                <a href="mailto:privacy@truenorth.com" className="text-pink-400 hover:underline">
                  privacy@truenorth.com
                </a>{' '}
                for data requests.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#050005] py-12 border-t border-[#FF1493]/15">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#FF1493]/20 border border-[#FF1493]/40 flex items-center justify-center text-xs text-[#FF69B4]">
              ↑
            </div>
            <span className="font-bold text-white">True North</span>
          </div>

          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-[#FF69B4] transition-colors">
              About
            </a>
            <a href="#" className="hover:text-[#FF69B4] transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-[#FF69B4] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#FF69B4] transition-colors">
              Help
            </a>
          </div>

          <div className="text-xs text-gray-600">© 2025 True North Music. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default TrueNorthLanding;
