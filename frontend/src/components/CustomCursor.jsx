import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        const moveCursor = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        const handleHover = () => {
            gsap.to(follower, {
                scale: 2.5,
                backgroundColor: 'rgba(240, 235, 216, 0.2)',
                duration: 0.3
            });
            gsap.to(cursor, {
                scale: 0.5,
                duration: 0.3
            });
        };

        const handleUnhover = () => {
            gsap.to(follower, {
                scale: 1,
                backgroundColor: 'transparent',
                duration: 0.3
            });
            gsap.to(cursor, {
                scale: 1,
                duration: 0.3
            });
        };

        window.addEventListener('mousemove', moveCursor);

        const interactiveElements = document.querySelectorAll('button, a, .clickable, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleHover);
            el.addEventListener('mouseleave', handleUnhover);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleHover);
                el.removeEventListener('mouseleave', handleUnhover);
            });
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-2 h-2 bg-[#f0ebd8] rounded-full pointer-events-none z-[1000] mix-blend-difference hidden md:block"
                style={{ transform: 'translate(-50%, -50%)' }}
            />
            <div
                ref={followerRef}
                className="fixed top-0 left-0 w-10 h-10 border border-[#f0ebd8] rounded-full pointer-events-none z-[999] opacity-50 hidden md:block"
                style={{ transform: 'translate(-50%, -50%)' }}
            />
        </>
    );
};

export default CustomCursor;
