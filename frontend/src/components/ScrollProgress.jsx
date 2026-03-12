import React, { useEffect, useState } from 'react';

const ScrollProgress = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight) {
                setProgress((currentScroll / scrollHeight) * 100);
            }
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-[3px] z-[100] pointer-events-none">
            <div
                className="h-full bg-[#0d1b2a] transition-all duration-100 ease-out shadow-[0_0_10px_rgba(13,27,42,0.3)]"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ScrollProgress;
