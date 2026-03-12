import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
    const dotRef = useRef(null);      // small dot — snappy
    const ringRef = useRef(null);     // outer ring — lagging
    const labelRef = useRef(null);

    useEffect(() => {
        const dot = dotRef.current;
        const ring = ringRef.current;
        const label = labelRef.current;

        // Exit on touch devices
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.body.style.cursor = 'auto';
            return;
        }

        // ── High-performance quickTo (force3D enabled) ──
        const dotXTo = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2", force3D: true });
        const dotYTo = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2", force3D: true });
        const ringXTo = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3", force3D: true });
        const ringYTo = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3", force3D: true });

        let hidden = false;

        const onMouseMove = (e) => {
            if (hidden) {
                gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
                hidden = false;
            }
            dotXTo(e.clientX);
            dotYTo(e.clientY);
            ringXTo(e.clientX);
            ringYTo(e.clientY);
        };

        const onMouseLeave = () => {
            hidden = true;
            gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
        };
        const onMouseEnter = () => {
            if (hidden) {
                hidden = false;
                gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseleave', onMouseLeave);
        document.addEventListener('mouseenter', onMouseEnter);

        // ── Interactive element hover effects ──
        const onElemEnter = (e) => {
            const el = e.currentTarget;
            const cursorType = el.dataset.cursor;

            // Dot shrinks to nothing inside the ring
            gsap.to(dot, { scale: 0.2, duration: 0.25, ease: 'power2.out' });

            if (cursorType === 'view') {
                gsap.to(ring, { scale: 4.5, borderColor: 'transparent', backgroundColor: 'rgba(240,235,216,0.15)', duration: 0.4, ease: 'power2.out' });
                if (label) { label.textContent = 'VIEW'; gsap.to(label, { opacity: 1, duration: 0.3 }); }
            } else if (cursorType === 'more') {
                gsap.to(ring, { scale: 4, borderColor: 'transparent', backgroundColor: 'rgba(240,235,216,0.12)', duration: 0.4, ease: 'power2.out' });
                if (label) { label.textContent = 'MORE'; gsap.to(label, { opacity: 1, duration: 0.3 }); }
            } else {
                gsap.to(ring, { scale: 3, borderColor: '#f0ebd8', backgroundColor: 'transparent', duration: 0.35, ease: 'power2.out' });
                if (label) gsap.to(label, { opacity: 0, duration: 0.15 });
            }
        };

        const onElemLeave = () => {
            gsap.to(dot, { scale: 1, duration: 0.35, ease: 'elastic.out(1,0.5)' });
            gsap.to(ring, { scale: 1, borderColor: '#f0ebd8', backgroundColor: 'transparent', duration: 0.45, ease: 'elastic.out(1,0.5)' });
            gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2 });
        };

        const attachEvents = () => {
            const els = document.querySelectorAll('button, a, .clickable, [data-cursor]');
            els.forEach(el => {
                el.addEventListener('mouseenter', onElemEnter);
                el.addEventListener('mouseleave', onElemLeave);
            });
            return els;
        };

        let els = attachEvents();

        // MutationObserver to handle dynamically loaded elements
        const obs = new MutationObserver(() => {
            els.forEach(el => {
                el.removeEventListener('mouseenter', onElemEnter);
                el.removeEventListener('mouseleave', onElemLeave);
            });
            els = attachEvents();
        });
        obs.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mouseenter', onMouseEnter);
            els.forEach(el => {
                el.removeEventListener('mouseenter', onElemEnter);
                el.removeEventListener('mouseleave', onElemLeave);
            });
            obs.disconnect();
        };
    }, []);

    return (
        <>
            {/* Dot — fast, small, always on top */}
            <div
                ref={dotRef}
                className="fixed top-0 left-0 w-2 h-2 bg-[#f0ebd8] rounded-full pointer-events-none z-[1001] hidden md:block"
                style={{ transform: 'translate(-50%,-50%)', willChange: 'transform' }}
            />
            {/* Ring — lagging, bigger */}
            <div
                ref={ringRef}
                className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-[#f0ebd8] pointer-events-none z-[1000] hidden md:flex items-center justify-center"
                style={{ transform: 'translate(-50%,-50%)', willChange: 'transform', backgroundColor: 'transparent' }}
            >
                <span
                    ref={labelRef}
                    className="text-[8px] font-black text-[#f0ebd8] tracking-[0.2em] uppercase select-none opacity-0"
                />
            </div>
        </>
    );
};

export default CustomCursor;
