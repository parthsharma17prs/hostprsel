import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Nav from './components/Navbar'
import MainRoutes from './routes/MainRoutes'
import ScrollToTop from './components/ScrollToTop'
import WhatsAppButton from './components/WhatsAppButton'
import Preloader from './components/Preloader'
import CustomCursor from './components/CustomCursor'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div className='min-h-screen w-full flex flex-col bg-[#0d1b2a]'>
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