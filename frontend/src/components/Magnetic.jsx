import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Magnetic – pulls child element toward cursor with a silky elastic spring.
 * Now with strength prop (0.3 = subtle, 0.6 = strong) and separate label tracking.
 */
const Magnetic = ({ children, strength = 0.38 }) => {
    const wrapRef = useRef(null);
    const innerRef = useRef(null);

    useEffect(() => {
        const wrap = wrapRef.current;
        if (!wrap) return;

        const inner = wrap.firstElementChild;
        if (!inner) return;

        // Outer wrapper moves gently (less)
        const wrapXTo = gsap.quickTo(wrap, "x", { duration: 0.9, ease: "elastic.out(1, 0.35)" });
        const wrapYTo = gsap.quickTo(wrap, "y", { duration: 0.9, ease: "elastic.out(1, 0.35)" });
        // Inner element moves more (creates the "pull" feel)
        const innerXTo = gsap.quickTo(inner, "x", { duration: 1.1, ease: "elastic.out(1, 0.25)" });
        const innerYTo = gsap.quickTo(inner, "y", { duration: 1.1, ease: "elastic.out(1, 0.25)" });

        const onMove = (e) => {
            const { left, top, width, height } = wrap.getBoundingClientRect();
            const x = e.clientX - (left + width / 2);
            const y = e.clientY - (top + height / 2);
            wrapXTo(x * strength * 0.6);
            wrapYTo(y * strength * 0.6);
            innerXTo(x * strength);
            innerYTo(y * strength);
        };

        const onLeave = () => {
            wrapXTo(0); wrapYTo(0);
            innerXTo(0); innerYTo(0);
        };

        wrap.addEventListener('mousemove', onMove);
        wrap.addEventListener('mouseleave', onLeave);

        return () => {
            wrap.removeEventListener('mousemove', onMove);
            wrap.removeEventListener('mouseleave', onLeave);
        };
    }, [strength]);

    return (
        <div ref={wrapRef} style={{ display: 'inline-flex' }}>
            {children}
        </div>
    );
};

export default Magnetic;
