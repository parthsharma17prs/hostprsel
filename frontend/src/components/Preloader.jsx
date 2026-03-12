import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import logo from '../assets/logo.png';

const Preloader = () => {
    const preRef = useRef(null);
    const progressRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        // Progress bar fill
        tl.to(progressRef.current, {
            width: '100%',
            duration: 1.4,
            ease: 'power2.inOut',
        }, 0)

            // Logo pop in
            .from('.pre-logo', {
                scale: 0.6,
                opacity: 0,
                duration: 0.8,
                ease: 'back.out(1.7)',
            }, 0)

            // Title words cascade in
            .from('.pre-word', {
                y: '100%',
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'expo.out',
            }, 0.2)

            // Tagline
            .from('.pre-tag', {
                opacity: 0,
                y: 12,
                duration: 0.6,
                ease: 'power3.out',
            }, 0.7)

            // Count up
            .from('.pre-count', {
                opacity: 0,
                duration: 0.3,
            }, 0)

            // ── EXIT ──
            // Words exit up
            .to('.pre-word', {
                y: '-110%',
                opacity: 0,
                stagger: 0.06,
                duration: 0.6,
                ease: 'expo.in',
            }, 1.6)

            .to('.pre-logo, .pre-tag, .pre-count', {
                opacity: 0,
                duration: 0.4,
            }, 1.7)

            // Panel split exit (top and bottom halves)
            .to('.pre-top', {
                yPercent: -100,
                duration: 1.0,
                ease: 'expo.inOut',
            }, 1.9)

            .to('.pre-bot', {
                yPercent: 100,
                duration: 1.0,
                ease: 'expo.inOut',
            }, 1.9)

            .set('.preloader', { display: 'none' });

        // Animate count 0→100
        const obj = { n: 0 };
        gsap.to(obj, {
            n: 100,
            duration: 1.4,
            ease: 'power2.inOut',
            onUpdate: () => {
                if (progressRef.current) {
                    const el = document.querySelector('.pre-count');
                    if (el) el.textContent = `${Math.round(obj.n)}%`;
                }
            },
        });
    }, []);

    return (
        <div className="preloader fixed inset-0 z-[999] pointer-events-none">
            {/* Top half */}
            <div className="pre-top absolute inset-x-0 top-0 h-1/2 bg-[#0d1b2a] flex flex-col items-center justify-end pb-4">
                {/* Logo */}
                <img src={logo} alt="" className="pre-logo w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-xl mb-6 opacity-90" />

                {/* Title */}
                <div className="overflow-hidden flex gap-3 mb-3">
                    <div className="overflow-hidden"><span className="pre-word inline-block text-5xl sm:text-7xl lg:text-8xl font-black text-[#f0ebd8] tracking-tight">AURA</span></div>
                    <div className="overflow-hidden"><span className="pre-word inline-block text-5xl sm:text-7xl lg:text-8xl font-black text-[#0d1b2a] bg-[#f0ebd8] px-3">LIVING</span></div>
                </div>

                {/* Tagline */}
                <p className="pre-tag text-xs sm:text-sm tracking-[0.4em] text-[#f0ebd8]/50 uppercase">
                    Premium Student Living
                </p>
            </div>

            {/* Divider line + progress */}
            <div className="absolute left-0 right-0 z-10" style={{ top: '50%', transform: 'translateY(-50%)' }}>
                <div className="h-[1px] w-full bg-[#f0ebd8]/10 relative overflow-hidden">
                    <div ref={progressRef} className="absolute left-0 top-0 h-full bg-[#f0ebd8] w-0" />
                </div>
            </div>

            {/* Bottom half */}
            <div className="pre-bot absolute inset-x-0 bottom-0 h-1/2 bg-[#0d1b2a] flex items-start pt-4 px-8 sm:px-16 justify-between">
                <p className="text-xs text-[#f0ebd8]/30 tracking-widest uppercase">© 2026</p>
                <p className="pre-count text-xs text-[#f0ebd8]/50 tabular-nums">0%</p>
            </div>
        </div>
    );
};

export default Preloader;
