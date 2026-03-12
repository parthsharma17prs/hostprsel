import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchHostels } from '../../store/slice/hostel.slice';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import img5 from '../../assets/img5.jpg';
import img6 from '../../assets/img6.jpg';
import img7 from '../../assets/img7.jpg';
import HostelCard from '../../components/HostelCard';
import Footer from '../../components/Footer';
import useMetadata from '../../hooks/useMetadata';
import Magnetic from '../../components/Magnetic';
import { getSiteSettings } from '../../api/hostel.api';

gsap.registerPlugin(ScrollTrigger);

const Hostel = () => {
    useMetadata(
        'Hostels',
        'Explore our collection of premium student hostels. From high-speed Wi-Fi to chef-curated meals, find the perfect residence for your academic journey.'
    );
    const dispatch = useDispatch();
    const hostels = useSelector((state) => state.hostels.hostels);
    const status = useSelector((state) => state.hostels.status);
    const mainRef = useRef(null);
    const searchSectionRef = useRef(null);
    const cardsAnimated = useRef(false); // prevent card animation from running twice
    const [searchParams, setSearchParams] = useSearchParams();

    /* ── Search & Filter State ── */
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [genderFilter, setGenderFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);
    const [siteImages, setSiteImages] = useState(null);

    /* Sync search param on mount & scroll to results */
    useEffect(() => {
        const q = searchParams.get('search');
        if (q) {
            setSearchTerm(q);
            setShowFilters(true);
            // Scroll to search/filter section after a short delay for DOM rendering
            setTimeout(() => {
                searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }, [searchParams]);

    /* ── Filtered & sorted hostels ── */
    const filteredHostels = useMemo(() => {
        let result = [...hostels];

        // Search by name or location
        if (searchTerm.trim()) {
            const q = searchTerm.trim().toLowerCase();
            result = result.filter(h =>
                h.name?.toLowerCase().includes(q) ||
                h.location?.toLowerCase().includes(q)
            );
        }

        // Gender filter
        if (genderFilter !== 'all') {
            result = result.filter(h => h.gender?.toLowerCase() === genderFilter.toLowerCase());
        }

        // Property type filter
        if (typeFilter !== 'all') {
            result = result.filter(h => (h.propertyType || 'hostel') === typeFilter);
        }

        // Sort
        if (sortBy === 'price-low') result.sort((a, b) => (a.price || 0) - (b.price || 0));
        else if (sortBy === 'price-high') result.sort((a, b) => (b.price || 0) - (a.price || 0));
        else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));

        return result;
    }, [hostels, searchTerm, genderFilter, typeFilter, sortBy]);

    const clearFilters = () => {
        setSearchTerm('');
        setGenderFilter('all');
        setTypeFilter('all');
        setSortBy('default');
        setSearchParams({});
    };

    const hasActiveFilters = searchTerm || genderFilter !== 'all' || typeFilter !== 'all' || sortBy !== 'default';

    useEffect(() => { dispatch(fetchHostels()); getSiteSettings().then(setSiteImages).catch(() => { }); }, [dispatch]);

    /* ── ANIMATIONS ── */
    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── REVEAL ANIMATIONS ── */
            const reveals = gsap.utils.toArray('.reveal');
            reveals.forEach((el) => {
                gsap.fromTo(el, {
                    y: 80,
                    opacity: 0,
                    clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)"
                }, {
                    y: 0,
                    opacity: 1,
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                    duration: 1.2,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                });
            });

            /* ── HERO ── */
            const heroTl = gsap.timeline({ delay: 0.15 });
            heroTl
                .from('.hostel-hero-title', {
                    y: 100,
                    opacity: 0,
                    duration: 1.5,
                    skewY: 7,
                    ease: 'expo.out'
                })
                .from('.hostel-hero-desc', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1')
                .from('.hostel-hero-btn', { scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.8')
                .from('.hostel-arc-1', { y: 120, opacity: 0, duration: 1.2, ease: 'expo.out' }, '-=1')
                .from('.hostel-arc-2', { y: 140, opacity: 0, duration: 1.2, ease: 'expo.out' }, '-=1.1')
                .from('.hostel-arc-3', { scale: 0.5, opacity: 0, duration: 1, ease: 'power2.out' }, '-=1');

            /* ── CARD ANIMATIONS ── */
            if (status === 'succeeded' && !cardsAnimated.current) {
                cardsAnimated.current = true;
                gsap.from('.hostel-card-anim', {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.hostel-grid',
                        start: 'top 85%',
                        once: true,
                    },
                });
            }
        }, mainRef);

        return () => ctx.kill();
    }, [status]);

    return (
        <main ref={mainRef} className='w-full bg-[#0d1b2a] overflow-x-hidden'>
            {/* ── Hero Section ── */}
            <section
                style={{ backgroundImage: `url('${siteImages?.hostelHeroBg || siteImages?.heroBg || '/main1.png'}')`, backgroundPosition: "center", backgroundSize: "cover" }}
                className='w-full min-h-screen flex flex-col relative overflow-hidden bg-[#0d1b2a]'
            >
                {/* Content Container */}
                <div className='flex-1 flex flex-col lg:flex-row w-full container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-0'>
                    {/* Left Content */}
                    <div className='w-full lg:w-3/5 flex justify-center lg:justify-start items-center text-center lg:text-left mt-8 lg:mt-0'>
                        <div className='w-full max-w-2xl flex gap-6 sm:gap-8 flex-col items-center lg:items-start'>
                            <h1 className='hostel-hero-title text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl text-[#f0ebd8] leading-tight overflow-hidden'>
                                <span className="font-bold block">Premium</span>
                                <span className="block">Student</span>
                                <span className="font-bold bg-[#f0ebd8] text-[#0d1b2a] inline-block px-3 py-1 mt-2">Residences</span>
                            </h1>
                            <p className='hostel-hero-desc text-[#f0ebd8] text-base sm:text-lg md:text-xl lg:text-xl leading-relaxed max-w-lg opacity-90'>
                                Discover design-forward residences built for your success. High-speed Wi-Fi, chef-curated meals, and a community wired for excellence.
                            </p>
                            <Magnetic>
                                <button onClick={() => document.querySelector('.hostel-grid')?.scrollIntoView({ behavior: 'smooth' })} className='hostel-hero-btn bg-[#f0ebd8] text-[#0d1b2a] px-10 py-4 rounded-full font-bold hover:scale-105 transition-all duration-300 text-base sm:text-lg shadow-2xl'>
                                    Browse Hostels
                                </button>
                            </Magnetic>
                        </div>
                    </div>

                    {/* Right Decorative Arcs */}
                    <div className='w-full lg:w-2/5 flex relative items-end justify-center pb-12 lg:pb-0'>
                        <div className='relative flex items-end justify-center scale-100 sm:scale-110 lg:scale-125 xl:scale-135'>
                            <div className='hostel-arc-1 bg-[#f0ebd8] rounded-t-full z-30 p-2 h-64 w-48 sm:h-72 sm:w-52 md:h-80 md:w-60 shadow-2xl flex-shrink-0'>
                                <div className='overflow-hidden border-2 h-full w-full rounded-t-full border-[#0d1b2a]'>
                                    <img src={siteImages?.hostelArchImages?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80'} alt="" className='h-full w-full object-cover' onError={e => e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80'} />
                                </div>
                            </div>
                            <div className='hostel-arc-2 bg-[#f0ebd8] rounded-t-full z-20 -ml-16 -mb-12 p-2 h-64 w-48 sm:h-72 sm:w-52 md:h-80 md:w-60 shadow-xl flex-shrink-0'>
                                <div className='overflow-hidden border-2 h-full w-full rounded-t-full border-[#0d1b2a]'>
                                    <img src={siteImages?.hostelArchImages?.[1] || 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&q=80'} alt="" className='h-full w-full object-cover object-center' onError={e => e.target.src = 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=500&q=80'} />
                                </div>
                            </div>
                            <div className='hostel-arc-3 hidden md:block bg-[#f0ebd8] rounded-t-full absolute z-0 p-2 h-[26rem] w-80 lg:h-[30rem] lg:w-96 left-0 opacity-30 shadow-lg'>
                                <div className='overflow-hidden border-2 h-full w-full rounded-t-full border-[#0d1b2a]'>
                                    <img src={siteImages?.hostelArchImages?.[2] || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&q=80'} alt="" className='h-full w-full object-cover object-center' onError={e => e.target.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&q=80'} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Search & Filter Bar ── */}
            <section ref={searchSectionRef} className="w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 pt-10 pb-2">
                <div className="flex flex-col gap-4">
                    {/* Search Row */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 flex items-center bg-[#f0ebd8] border-2 border-[#f0ebd8]/30 hover:border-[#f0ebd8]/60 transition-colors">
                            <div className="pl-4 pr-2 text-[#0d1b2a]/50">
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by hostel name or city..."
                                className="flex-1 bg-transparent text-[#0d1b2a] placeholder-[#0d1b2a]/40 text-sm sm:text-base py-3 px-2 outline-none"
                            />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm('')} className="pr-3 text-[#0d1b2a]/40 hover:text-[#0d1b2a] transition-colors">
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 10.5858L16.9497 5.63604L18.364 7.05025L13.4142 12L18.364 16.9497L16.9497 18.364L12 13.4142L7.05025 18.364L5.63604 16.9497L10.5858 12L5.63604 7.05025L7.05025 5.63604L12 10.5858Z"></path>
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-2 transition-all ${showFilters ? 'bg-[#f0ebd8] text-[#0d1b2a] border-[#f0ebd8]' : 'bg-transparent text-[#f0ebd8] border-[#f0ebd8]/30 hover:border-[#f0ebd8]/60'}`}
                        >
                            <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"></path>
                            </svg>
                            <span className="hidden sm:inline">Filters</span>
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="flex flex-wrap items-center gap-3 pb-2">
                            {/* Gender */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-[#f0ebd8]/60 text-xs font-semibold uppercase tracking-wider">Gender</span>
                                <div className="flex">
                                    {['all', 'Boys', 'Girls', 'Co-Ed'].map(g => (
                                        <button key={g} onClick={() => setGenderFilter(g)}
                                            className={`px-3 py-1.5 text-xs font-semibold border border-[#f0ebd8]/20 transition-all ${genderFilter === g ? 'bg-[#f0ebd8] text-[#0d1b2a]' : 'text-[#f0ebd8]/70 hover:text-[#f0ebd8] hover:border-[#f0ebd8]/40'}`}>
                                            {g === 'all' ? 'All' : g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Property Type */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-[#f0ebd8]/60 text-xs font-semibold uppercase tracking-wider">Type</span>
                                <div className="flex">
                                    {['all', 'hostel', 'flat'].map(t => (
                                        <button key={t} onClick={() => setTypeFilter(t)}
                                            className={`px-3 py-1.5 text-xs font-semibold border border-[#f0ebd8]/20 transition-all ${typeFilter === t ? 'bg-[#f0ebd8] text-[#0d1b2a]' : 'text-[#f0ebd8]/70 hover:text-[#f0ebd8] hover:border-[#f0ebd8]/40'}`}>
                                            {t === 'all' ? 'All' : t === 'hostel' ? 'Hostel' : 'Flat'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div className="flex items-center gap-1.5">
                                <span className="text-[#f0ebd8]/60 text-xs font-semibold uppercase tracking-wider">Sort</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent text-[#f0ebd8] text-xs font-semibold px-3 py-1.5 border border-[#f0ebd8]/20 outline-none cursor-pointer hover:border-[#f0ebd8]/40 transition-colors"
                                >
                                    <option value="default" className="bg-[#0d1b2a]">Default</option>
                                    <option value="price-low" className="bg-[#0d1b2a]">Price: Low to High</option>
                                    <option value="price-high" className="bg-[#0d1b2a]">Price: High to Low</option>
                                    <option value="rating" className="bg-[#0d1b2a]">Highest Rated</option>
                                </select>
                            </div>

                            {/* Clear */}
                            {hasActiveFilters && (
                                <button onClick={clearFilters}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/60 transition-all ml-auto">
                                    <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 10.5858L16.9497 5.63604L18.364 7.05025L13.4142 12L18.364 16.9497L16.9497 18.364L12 13.4142L7.05025 18.364L5.63604 16.9497L10.5858 12L5.63604 7.05025L7.05025 5.63604L12 10.5858Z"></path>
                                    </svg>
                                    Clear All
                                </button>
                            )}
                        </div>
                    )}

                    {/* Results count */}
                    {status === 'succeeded' && (
                        <p className="text-[#f0ebd8]/50 text-xs font-medium">
                            {filteredHostels.length} {filteredHostels.length === 1 ? 'property' : 'properties'} found
                            {searchTerm && <span> for "<span className="text-[#f0ebd8]">{searchTerm}</span>"</span>}
                        </p>
                    )}
                </div>
            </section>

            {/* ── Hostels Grid ── */}
            <section className='hostel-grid w-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 py-6 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-6 lg:gap-8'>
                {status === 'succeeded' && filteredHostels.length > 0 && filteredHostels.map((hostel) => (
                    <div key={hostel._id} className='hostel-card-anim'>
                        <HostelCard {...hostel} />
                    </div>
                ))}

                {status === 'succeeded' && filteredHostels.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                        <svg className="w-16 h-16 text-[#f0ebd8]/30 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11 2C15.968 2 20 6.032 20 11C20 15.968 15.968 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2ZM11 18C14.8675 18 18 14.8675 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18ZM19.4853 18.0711L22.3137 20.8995L20.8995 22.3137L18.0711 19.4853L19.4853 18.0711Z"></path>
                        </svg>
                        <h3 className="text-xl font-bold text-[#f0ebd8]/60 mb-2">No properties found</h3>
                        <p className="text-[#f0ebd8]/40 text-sm mb-4">Try adjusting your search or filters</p>
                        <button onClick={clearFilters}
                            className="px-6 py-2 bg-[#f0ebd8] text-[#0d1b2a] text-sm font-bold hover:bg-[#f0ebd8]/90 transition-colors">
                            Clear Filters
                        </button>
                    </div>
                )}
            </section>
            <Footer />
        </main>
    );
};

export default Hostel;
