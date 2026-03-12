import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

const ScrollToTop=() =>
{
    const {pathname}=useLocation();

    // On initial load / reload — always scroll to top
    useEffect(() =>
    {
        if ('scrollRestoration' in window.history)
        {
            window.history.scrollRestoration='manual';
        }
        window.scrollTo(0, 0);
    }, []);

    useEffect(() =>
    {
        // 1. Disable browser's automatic scroll restoration immediately
        if ('scrollRestoration' in window.history)
        {
            window.history.scrollRestoration='manual';
        }

        // 2. Immediate scroll to top
        window.scrollTo(0, 0);

        // 3. Ensure it happens after initial render/layout
        const timer=setTimeout(() =>
        {
            window.scrollTo(0, 0);
        }, 0);

        // 4. "Safety" scroll after a longer delay (handles late-loading content or other scripts)
        const safetyTimer=setTimeout(() =>
        {
            window.scrollTo(0, 0);
        }, 100);

        return () =>
        {
            clearTimeout(timer);
            clearTimeout(safetyTimer);
        };
    }, [pathname]);

    return null;
};

export default ScrollToTop;
