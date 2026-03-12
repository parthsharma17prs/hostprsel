import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Nav from './components/Navbar'
import MainRoutes from './routes/MainRoutes'
import ScrollToTop from './components/ScrollToTop'
import WhatsAppButton from './components/WhatsAppButton'
import Preloader from './components/Preloader'
import CustomCursor from './components/CustomCursor'
import ScrollProgress from './components/ScrollProgress'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const lenisRef = useRef(null);

  useEffect(() => {
    // ── HIGH-PERFORMANCE LENIS CONFIG ──
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
      infinite: false,
      lerp: 0.1,                 // More responsive follow
      syncTouch: false,
    });

    lenisRef.current = lenis;

    // Connect Lenis ↔ ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // GSAP ticker drives Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Global GSAP optimizations
    gsap.ticker.lagSmoothing(0);
    gsap.config({ force3D: true });

    gsap.defaults({
      ease: 'power2.out',
      duration: 0.8,
    });

    // ── PAGE TRANSITION ──
    const handleRouteChange = () => {
      lenis.scrollTo(0, { immediate: true });
      ScrollTrigger.refresh(true);
    };

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  // Smooth scroll to top + refresh triggers on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }
  }, [pathname]);

  return (
    <div className='min-h-screen w-full flex flex-col bg-[#0d1b2a]'>
      <ScrollProgress />
      <Preloader />
      <CustomCursor />
      <ScrollToTop />
      {!isAdminRoute && <Nav />}
      <div className='flex-grow'>
        <MainRoutes />
      </div>
      {!isAdminRoute && <WhatsAppButton />}
    </div>
  )
}

export default App