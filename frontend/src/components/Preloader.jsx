import React, { useEffect } from 'react';
import gsap from 'gsap';

const Preloader = () => {
    useEffect(() => {
        const tl = gsap.timeline();
        tl.to(".preloader-text", {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
        })
            .to(".preloader-text", {
                opacity: 0,
                y: -20,
                duration: 0.5,
                delay: 0.5,
                stagger: 0.05,
                ease: "power4.in",
            })
            .to(".preloader", {
                height: 0,
                duration: 1.2,
                ease: "expo.inOut",
            })
            .set(".preloader", { display: "none" });
    }, []);

    return (
        <div className="preloader fixed inset-0 z-[999] bg-[#0d1b2a] flex flex-col items-center justify-center overflow-hidden">
            <div className="flex flex-col items-center">
                <div className="flex gap-2 mb-4">
                    <div className="preloader-text opacity-0 translate-y-10 text-4xl sm:text-6xl font-bold text-[#f0ebd8]">AURA</div>
                    <div className="preloader-text opacity-0 translate-y-10 text-4xl sm:text-6xl font-black text-[#0d1b2a] bg-[#f0ebd8] px-2">LIVING</div>
                </div>
                <div className="preloader-text opacity-0 translate-y-4 text-sm tracking-[0.3em] text-[#f0ebd8]/60 uppercase">
                    Crafting Ambition
                </div>
            </div>
            <div className="absolute bottom-10 left-10 overflow-hidden">
                <div className="preloader-text opacity-0 translate-y-10 text-xs text-[#f0ebd8]/40">
                    © 2026 AURALIVINGS
                </div>
            </div>
        </div>
    );
};

export default Preloader;
