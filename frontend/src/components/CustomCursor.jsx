import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const cursorLabelRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const label = cursorLabelRef.current;

        const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" });
        const yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });

        const handleMouseMove = (e) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        const handleMouseEnter = (e) => {
            const el = e.currentTarget;
            let scale = 4;
            let labelText = "";
            let backgroundColor = "#f0ebd8";
            let mixMode = "difference";

            if (el.dataset.cursor === "view") {
                labelText = "VIEW";
                scale = 6;
                backgroundColor = "#f0ebd8";
            } else if (el.dataset.cursor === "more") {
                labelText = "MORE";
                scale = 6;
            } else {
                scale = 4;
            }

            gsap.to(cursor, {
                scale: scale,
                backgroundColor: backgroundColor,
                duration: 0.3,
                ease: "power2.out"
            });

            if (label && labelText) {
                label.innerText = labelText;
                gsap.to(label, { opacity: 1, duration: 0.2 });
            }
        };

        const handleMouseLeave = () => {
            gsap.to(cursor, {
                scale: 1,
                backgroundColor: "#f0ebd8",
                duration: 0.3,
                ease: "power2.out"
            });
            if (label) {
                gsap.to(label, { opacity: 0, duration: 0.2 });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        const attachEvents = () => {
            const interactiveElements = document.querySelectorAll('button, a, .clickable, [data-cursor]');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
            return interactiveElements;
        };

        let interactiveElements = attachEvents();

        // Re-attach events if DOM changes (simplified for this context)
        const observer = new MutationObserver(() => {
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            interactiveElements = attachEvents();
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            observer.disconnect();
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-4 h-4 bg-[#f0ebd8] rounded-full pointer-events-none z-[1000] mix-blend-difference hidden md:flex items-center justify-center overflow-hidden"
            style={{ transform: 'translate(-50%, -50%)' }}
        >
            <span
                ref={cursorLabelRef}
                className="text-[2px] font-bold text-[#0d1b2a] opacity-0"
            ></span>
        </div>
    );
};

export default CustomCursor;
