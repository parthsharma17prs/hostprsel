import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHostelById } from '../store/slice/hostel.slice';
import useMetadata from '../hooks/useMetadata';
import Footer from './Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const HostelPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const hostel = useSelector((state) => state.hostels.selectedHostel);
    const status = useSelector((state) => state.hostels.status);
    const error = useSelector((state) => state.hostels.error);

    // Update metadata dynamically based on hostel info
    useMetadata(
        hostel ? `${hostel.name} in ${hostel.location}` : 'Hostel Details',
        hostel ? `Book your stay at ${hostel.name} in ${hostel.location}. ${hostel.description?.substring(0, 150)}...` : 'View premium student hostel details.'
    );

    const [primaryImage, setPrimaryImage] = useState(hostel?.images?.length > 0 ? hostel.images[0] : null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Swipe state for main image gallery
    const [mainSwipeOffset, setMainSwipeOffset] = useState(0);
    const [mainTransitioning, setMainTransitioning] = useState(false);
    const mainTouchRef = useRef({ startX: 0, startY: 0, isDragging: false });

    // Swipe state for lightbox
    const [lbSwipeOffset, setLbSwipeOffset] = useState(0);
    const [lbTransitioning, setLbTransitioning] = useState(false);
    const lbTouchRef = useRef({ startX: 0, startY: 0, isDragging: false });

    const SWIPE_THRESHOLD = 50;

    const openLightbox = (idx) => { setLightboxIndex(idx); setLightboxOpen(true); document.body.style.overflow = 'hidden'; };
    const closeLightbox = () => { setLightboxOpen(false); document.body.style.overflow = ''; };
    const lightboxPrev = () => setLightboxIndex(i => (i - 1 + hostel.images.length) % hostel.images.length);
    const lightboxNext = () => setLightboxIndex(i => (i + 1) % hostel.images.length);

    // Main image swipe handlers
    const currentMainIndex = hostel?.images ? hostel.images.indexOf(primaryImage) : 0;

    const goToMainImage = useCallback((newIndex) => {
        if (!hostel?.images || hostel.images.length <= 1) return;
        const len = hostel.images.length;
        const idx = ((newIndex % len) + len) % len;
        setMainTransitioning(true);
        setTimeout(() => {
            setPrimaryImage(hostel.images[idx]);
            setMainTransitioning(false);
        }, 250);
    }, [hostel]);

    const handleMainTouchStart = (e) => {
        mainTouchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, isDragging: true };
        setMainSwipeOffset(0);
    };
    const handleMainTouchMove = (e) => {
        if (!mainTouchRef.current.isDragging) return;
        const dx = e.touches[0].clientX - mainTouchRef.current.startX;
        const dy = e.touches[0].clientY - mainTouchRef.current.startY;
        if (Math.abs(dx) > Math.abs(dy)) { e.preventDefault(); setMainSwipeOffset(dx); }
    };
    const handleMainTouchEnd = () => {
        if (!mainTouchRef.current.isDragging) return;
        mainTouchRef.current.isDragging = false;
        if (mainSwipeOffset < -SWIPE_THRESHOLD) goToMainImage(currentMainIndex + 1);
        else if (mainSwipeOffset > SWIPE_THRESHOLD) goToMainImage(currentMainIndex - 1);
        setMainSwipeOffset(0);
    };

    // Lightbox swipe handlers
    const handleLbTouchStart = (e) => {
        lbTouchRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, isDragging: true };
        setLbSwipeOffset(0);
    };
    const handleLbTouchMove = (e) => {
        if (!lbTouchRef.current.isDragging) return;
        const dx = e.touches[0].clientX - lbTouchRef.current.startX;
        const dy = e.touches[0].clientY - lbTouchRef.current.startY;
        if (Math.abs(dx) > Math.abs(dy)) { e.preventDefault(); setLbSwipeOffset(dx); }
    };
    const handleLbTouchEnd = () => {
        if (!lbTouchRef.current.isDragging) return;
        lbTouchRef.current.isDragging = false;
        if (lbSwipeOffset < -SWIPE_THRESHOLD) lightboxNext();
        else if (lbSwipeOffset > SWIPE_THRESHOLD) lightboxPrev();
        setLbSwipeOffset(0);
    };

    useEffect(() => {
        if (!lightboxOpen) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev();
            if (e.key === 'ArrowRight') lightboxNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxOpen]);

    useEffect(() => {
        if (id) dispatch(fetchHostelById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (hostel) {
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
                const heroTl = gsap.timeline({ delay: 0.1 });
                heroTl
                    .from('.hostel-name', {
                        y: 80,
                        opacity: 0,
                        duration: 1.5,
                        skewY: 5,
                        ease: 'expo.out'
                    })
                    .from('.hostel-subinfo', { y: 20, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1')
                    .from('.gallery-container', { scale: 0.95, opacity: 0, duration: 1.2, ease: 'expo.out' }, '-=0.8');

                /* ── QUICK CARDS ── */
                gsap.from('.quick-card', {
                    y: 40,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.quick-cards-grid',
                        start: 'top 85%'
                    }
                });

                ScrollTrigger.refresh();
            }, mainRef);
            return () => ctx.kill();
        }
    }, [hostel]);

    useEffect(() => {
        if (hostel && hostel.images && hostel.images.length > 0) {
            setPrimaryImage(hostel.images[0]);
        }
    }, [hostel]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-[#f0ebd8] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-[#f0ebd8] text-lg">Loading hostel details...</p>
                </div>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center p-4">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f0ebd8">
                            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"></path>
                        </svg>
                    </div>
                    <p className="text-red-400 text-lg">Error: {error}</p>
                </div>
            </div>
        );
    }

    if (!hostel) {
        return (
            <div className="min-h-screen bg-[#0d1b2a] flex items-center justify-center p-4">
                <p className="text-[#f0ebd8] text-lg">No hostel found.</p>
            </div>
        );
    }

    return (
        <main className="w-full min-h-screen bg-[#0d1b2a] overflow-x-hidden">
            {/* Hero Section with Image Gallery */}
            <section className="w-full bg-[#0d1b2a] pt-20 pb-12 sm:pb-16 lg:pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#f0ebd8] text-[#0d1b2a] rounded-full text-xs sm:text-sm font-medium">
                            {hostel.comming_soon && <span className="animate-pulse flex items-center gap-1.5"><svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 23C10.6192 23 9.32067 22.4595 8.3988 21.5024C7.95049 21.0314 7.59483 20.4709 7.35451 19.8516C6.35408 20.1685 5.26066 20.0701 4.32679 19.5318C3.02143 18.778 2.34702 17.3325 2.53794 15.8774C2.60588 15.337 2.79145 14.8284 3.07496 14.3813C2.24553 13.891 1.58191 13.1331 1.20631 12.1839C0.690039 10.8812 0.915615 9.41567 1.79291 8.31974C2.17045 7.84748 2.63895 7.46139 3.16714 7.18399C2.87728 6.39447 2.81078 5.52943 2.99697 4.67034C3.28838 3.29553 4.25239 2.17786 5.53636 1.6348C6.03768 1.42238 6.57023 1.30658 7.10537 1.28926C7.13254 0.49289 7.52116 -0.240798 8.18952 -0.687116L8.39003 -0.810974C9.32614 -1.43199 10.5512 -1.30432 11.3472 -0.499963L12 0.157106L12.6528 -0.499963C13.4488 -1.30432 14.6739 -1.43199 15.61 -0.810974L15.8105 -0.687116C16.4789 -0.240798 16.8675 0.49289 16.8946 1.28926C17.4298 1.30658 17.9623 1.42238 18.4636 1.6348C19.7476 2.17786 20.7116 3.29553 21.003 4.67034C21.1892 5.52943 21.1227 6.39447 20.8329 7.18399C21.361 7.46139 21.8295 7.84748 22.2071 8.31974C23.0844 9.41567 23.31 10.8812 22.7937 12.1839C22.4181 13.1331 21.7545 13.891 20.925 14.3813C21.2086 14.8284 21.3941 15.337 21.4621 15.8774C21.653 17.3325 20.9786 18.778 19.6732 19.5318C18.7393 20.0701 17.6459 20.1685 16.6455 19.8516C16.4052 20.4709 16.0495 21.0314 15.6012 21.5024C14.6793 22.4595 13.3808 23 12 23ZM12 21C14.2091 21 16 19.2091 16 17V12H8V17C8 19.2091 9.79086 21 12 21Z"></path></svg> Coming Soon</span>}
                            {hostel.popular && !hostel.comming_soon && <span className="flex items-center gap-1.5"><svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path></svg> Popular Choice</span>}
                        </div>
                        <h1 className="hostel-name text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-[#f0ebd8] leading-tight overflow-hidden">
                            {hostel.name}
                        </h1>
                        <div className="hostel-subinfo flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[#f0ebd8]">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 20.9L16.95 23.95L15.75 18.3L20.5 14.2L14.9 13.75L12 8.5L9.1 13.75L3.5 14.2L8.25 18.3L7.05 23.95L12 20.9Z"></path>
                                </svg>
                                <span className="text-sm sm:text-base">{hostel.rating || 'N/A'} Rating</span>
                            </div>
                            <span className="text-[#f0ebd8]/40">•</span>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z"></path>
                                </svg>
                                <span className="text-sm sm:text-base">{hostel.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="gallery-container max-w-6xl mx-auto">
                        <div className="bg-[#f0ebd8] p-3 sm:p-4 lg:p-6 rounded-2xl">
                            <div className="border-4 border-[#0d1b2a] rounded-xl overflow-hidden">
                                {hostel.images && hostel.images.length > 0 ? (
                                    <div className="space-y-4">
                                        {/* Main Image - Swipeable */}
                                        <div className="relative aspect-video sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-[#0d1b2a] cursor-pointer group select-none touch-pan-y"
                                            onTouchStart={handleMainTouchStart}
                                            onTouchMove={handleMainTouchMove}
                                            onTouchEnd={handleMainTouchEnd}
                                            onClick={() => { if (Math.abs(mainSwipeOffset) < 5) openLightbox(hostel.images.indexOf(primaryImage)); }}>
                                            <img
                                                src={primaryImage}
                                                alt={hostel.name}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                                                style={{
                                                    transform: `translateX(${mainSwipeOffset}px)`,
                                                    transition: mainTouchRef.current.isDragging ? 'none' : 'transform 0.25s ease-out',
                                                    opacity: mainTransitioning ? 0 : 1,
                                                }}
                                                draggable={false}
                                            />
                                            {/* Swipe indicator dots */}
                                            {hostel.images.length > 1 && (
                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                                    {hostel.images.map((_, idx) => (
                                                        <button key={idx} onClick={(e) => { e.stopPropagation(); setPrimaryImage(hostel.images[idx]); }}
                                                            className={`w-2 h-2 rounded-full transition-all ${idx === currentMainIndex ? 'bg-[#f0ebd8] w-5' : 'bg-[#f0ebd8]/40 hover:bg-[#f0ebd8]/70'}`} />
                                                    ))}
                                                </div>
                                            )}
                                            {/* Navigation arrows for desktop */}
                                            {hostel.images.length > 1 && (
                                                <>
                                                    <button onClick={(e) => { e.stopPropagation(); goToMainImage(currentMainIndex - 1); }}
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
                                                        </svg>
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); goToMainImage(currentMainIndex + 1); }}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M13.1714 12.0007L8.22168 7.05093L9.63589 5.63672L15.9999 12.0007L9.63589 18.3646L8.22168 16.9504L13.1714 12.0007Z"></path>
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Thumbnails */}
                                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 p-3 sm:p-4 bg-[#0d1b2a]">
                                            {hostel.images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setPrimaryImage(img)}
                                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${primaryImage === img
                                                        ? 'border-[#f0ebd8] scale-105'
                                                        : 'border-transparent hover:border-[#f0ebd8]/50'
                                                        }`}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`View ${idx + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-video flex items-center justify-center bg-[#0d1b2a] text-[#f0ebd8]">
                                        <div className="text-center space-y-3">
                                            <svg className="w-16 h-16 mx-auto opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M2.9918 21C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918ZM20 15V5H4V19L14 9L20 15ZM20 17.8284L14 11.8284L6.82843 19H20V17.8284ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path>
                                            </svg>
                                            <p className="text-lg">No images available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Info Cards */}
            <section className="w-full bg-[#f0ebd8] py-8 sm:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="quick-cards-grid max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {hostel.propertyType === 'flat' ? (
                            <div className="quick-card bg-[#0d1b2a] p-4 sm:p-6 lg:p-8 rounded-xl text-center space-y-2 border border-[#f0ebd8]/10">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f0ebd8] rounded-full flex items-center justify-center mx-auto mb-1">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">
                                        <path d="M17 19H21V21H3V19H7V4C7 3.44772 7.44772 3 8 3H16C16.5523 3 17 3.44772 17 4V19ZM9 5V19H15V5H9ZM11 11H13V13H11V11Z"></path>
                                    </svg>
                                </div>
                                <p className="text-xl sm:text-3xl font-black text-[#f0ebd8]">{hostel.flatType || 'Flat'}</p>
                                <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider text-[#f0ebd8]/60">Flat Type</p>
                            </div>
                        ) : (
                            <div className="quick-card bg-[#0d1b2a] p-4 sm:p-6 lg:p-8 rounded-xl text-center space-y-2 border border-[#f0ebd8]/10">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f0ebd8] rounded-full flex items-center justify-center mx-auto mb-1">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">
                                        <path d="M21 16V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V16H21ZM3 13H21V15H3V13ZM3 8H21V11H3V8ZM21 3C21.5523 3 22 3.44772 22 4V6H2V4C2 3.44772 2.44772 3 3 3H21Z"></path>
                                    </svg>
                                </div>
                                <p className="text-xl sm:text-3xl font-black text-[#f0ebd8]">{hostel.totalRemainingBeds}</p>
                                <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider text-[#f0ebd8]/60">Beds Left</p>
                            </div>
                        )}

                        <div className="quick-card bg-[#0d1b2a] p-4 sm:p-6 lg:p-8 rounded-xl text-center space-y-2 border border-[#f0ebd8]/10">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f0ebd8] rounded-full flex items-center justify-center mx-auto mb-1">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">
                                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9.71002 19.6674C8.74743 17.6259 8.15732 15.3742 8.02731 13H4.06189C4.458 16.1765 6.71639 18.7747 9.71002 19.6674ZM10.0307 13C10.1811 15.4388 10.8778 17.7297 12 19.752C13.1222 17.7297 13.8189 15.4388 13.9693 13H10.0307ZM19.9381 13H15.9727C15.8427 15.3742 15.2526 17.6259 14.29 19.6674C17.2836 18.7747 19.542 16.1765 19.9381 13ZM9.71002 4.33265C6.71639 5.22535 4.458 7.8235 4.06189 11H8.02731C8.15732 8.62577 8.74743 6.37407 9.71002 4.33265ZM14.29 4.33265C15.2526 6.37407 15.8427 8.62577 15.9727 11H19.9381C19.542 7.8235 17.2836 5.22535 14.29 4.33265ZM10.0307 11H13.9693C13.8189 8.56118 13.1222 6.27025 12 4.24799C10.8778 6.27025 10.1811 8.56118 10.0307 11Z"></path>
                                </svg>
                            </div>
                            <p className="text-xl sm:text-3xl font-black text-[#f0ebd8]">{hostel.gender}</p>
                            <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider text-[#f0ebd8]/60">Gender</p>
                        </div>

                        <div className="quick-card bg-[#0d1b2a] p-4 sm:p-6 lg:p-8 rounded-xl text-center space-y-2 border border-[#f0ebd8]/10">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f0ebd8] rounded-full flex items-center justify-center mx-auto mb-1">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">
                                    <path d="M13 21V23H11V21H3C2.44772 21 2 20.5523 2 20V6H22V20C22 20.5523 21.5523 21 21 21H13ZM4 19H20V8H4V19ZM13 10H18V12H13V10ZM13 14H18V16H13V14ZM9 10V13H12V10H9ZM7 8V13C7 13.5523 7.44772 14 8 14H11V15C11 15.5523 11.4477 16 12 16C12.5523 16 13 15.5523 13 15V9C13 8.44772 12.5523 8 12 8H7ZM2 3H22V5H2V3Z"></path>
                                </svg>
                            </div>
                            <p className="text-xl sm:text-3xl font-black text-[#f0ebd8]">{hostel.established}</p>
                            <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider text-[#f0ebd8]/60">Built</p>
                        </div>

                        <div className="quick-card bg-[#0d1b2a] p-4 sm:p-6 lg:p-8 rounded-xl text-center space-y-2 border border-[#f0ebd8]/10">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#f0ebd8] rounded-full flex items-center justify-center mx-auto mb-1">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">
                                    <path d="M17 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9V3H15V1H17V3ZM4 9V19H20V9H4ZM6 11H8V13H6V11ZM6 15H8V17H6V15ZM10 11H18V13H10V11ZM10 15H15V17H10V15Z"></path>
                                </svg>
                            </div>
                            {hostel.discountedPrice && hostel.discountedPrice < hostel.price ? (
                                <>
                                    <p className="text-sm sm:text-lg text-[#f0ebd8]/50 line-through">₹{hostel.price?.toLocaleString('en-IN')}</p>
                                    <p className="text-xl sm:text-3xl font-black text-[#f0ebd8]">₹{hostel.discountedPrice?.toLocaleString('en-IN')}</p>
                                </>
                            ) : (
                                <p className="text-xl sm:text-3xl font-black text-[#f0ebd8]">₹{hostel.price?.toLocaleString('en-IN')}</p>
                            )}
                            <p className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider text-[#f0ebd8]/60">Per Month</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Description Section */}
            <section className="w-full bg-[#0d1b2a] py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-[#f0ebd8] p-6 sm:p-8 lg:p-12 rounded-2xl space-y-6">
                            <h2 className="reveal text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0d1b2a]">About This {hostel.propertyType === 'flat' ? 'Flat' : 'Hostel'}</h2>
                            <p className="reveal text-base sm:text-lg text-[#0d1b2a] leading-relaxed">{hostel.description}</p>

                            {hostel.usps && hostel.usps.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#0d1b2a]">Unique Selling Points</h3>
                                    <ul className="space-y-2">
                                        {hostel.usps.map((usp, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-base sm:text-lg text-[#0d1b2a]">
                                                <svg className="w-5 h-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">
                                                    <path d="M10 15.172L19.192 5.979L20.607 7.393L10 18L3.636 11.636L5.05 10.222L10 15.172Z"></path>
                                                </svg>
                                                {usp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="w-full bg-[#f0ebd8] py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
                        <div className="text-center space-y-3 sm:space-y-4">
                            <h2 className="reveal text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0d1b2a]">Amenities & Features</h2>
                            <p className="reveal text-base sm:text-lg text-[#0d1b2a]">Everything you need for comfortable living</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {hostel.features && hostel.features.length > 0 ? (
                                hostel.features.map((feature, idx) => (
                                    <div key={idx} className="bg-[#0d1b2a] p-4 sm:p-6 rounded-xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#f0ebd8] rounded-full flex items-center justify-center shrink-0">
                                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">
                                                    <path d="M10 15.172L19.192 5.979L20.607 7.393L10 18L3.636 11.636L5.05 10.222L10 15.172Z"></path>
                                                </svg>
                                            </div>
                                            <span className="text-base sm:text-lg font-medium text-[#f0ebd8]">{feature}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-full text-center text-[#0d1b2a]">No features listed</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Nearby Places */}
            <section className="w-full bg-[#0d1b2a] py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-8 sm:mb-12 space-y-3 sm:space-y-4">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f0ebd8]">What's Nearby</h2>
                            <p className="text-base sm:text-lg text-[#f0ebd8]">Convenient access to everything you need</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                            {hostel.nearby1 && (
                                <div className="bg-[#f0ebd8] p-6 rounded-xl space-y-3">
                                    <div className="w-12 h-12 bg-[#0d1b2a] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f0ebd8">
                                            <path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0d1b2a]">{hostel.nearby1}</h3>
                                    <p className="text-[#0d1b2a]/70">{hostel.nearby1distance}</p>
                                </div>
                            )}
                            {hostel.nearby2 && (
                                <div className="bg-[#f0ebd8] p-6 rounded-xl space-y-3">
                                    <div className="w-12 h-12 bg-[#0d1b2a] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f0ebd8">
                                            <path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0d1b2a]">{hostel.nearby2}</h3>
                                    <p className="text-[#0d1b2a]/70">{hostel.nearby2distance}</p>
                                </div>
                            )}
                            {hostel.nearby3 && (
                                <div className="bg-[#f0ebd8] p-6 rounded-xl space-y-3">
                                    <div className="w-12 h-12 bg-[#0d1b2a] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f0ebd8">
                                            <path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13Z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0d1b2a]">{hostel.nearby3}</h3>
                                    <p className="text-[#0d1b2a]/70">{hostel.nearby3distance}</p>
                                </div>
                            )}
                        </div>

                        {hostel.locationLink && (
                            <div className="mt-8 text-center">
                                <a
                                    href={hostel.locationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#f0ebd8] text-[#0d1b2a] rounded-full text-sm sm:text-base font-medium hover:bg-opacity-90 transition-all"
                                >
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.364 17.364L12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364ZM12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z"></path>
                                    </svg>
                                    View on Google Maps
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Additional Info Cards */}
            <section className="w-full bg-[#f0ebd8] py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-[#0d1b2a] p-6 rounded-xl space-y-3">
                            <div className="w-12 h-12 bg-[#f0ebd8] rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">
                                    <path d="M12 19H14V6.00003L20.3939 8.74028C20.7616 8.89786 21 9.2594 21 9.65943V19H23V21H1V19H3V5.6499C3 5.25472 3.23273 4.89659 3.59386 4.73609L11.2969 1.31251C11.5493 1.20035 11.8448 1.314 11.9569 1.56634C11.9853 1.63027 12 1.69945 12 1.76941V19Z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-[#f0ebd8]">{hostel.propertyType === 'flat' ? 'Flat Type' : 'Hostel Type'}</h3>
                            <p className="text-[#f0ebd8]/80">{hostel.propertyType === 'flat' ? (hostel.flatType || 'Flat') : hostel.hostelType}</p>
                        </div>

                        {hostel.propertyType !== 'flat' ? (
                            <>
                                <div className="bg-[#0d1b2a] p-6 rounded-xl space-y-3">
                                    <div className="w-12 h-12 bg-[#f0ebd8] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">
                                            <path d="M2 19H22V21H2V19ZM2 5L7 8.5V13H9V8.5L14 5V17H16V5L21 8.5V17H22V7L12 1L2 7V17H2V5ZM4 9.23L4 12H6V9.23L4 9.23ZM8 10.05L8 12H10V10.05L8 10.05ZM16 8.5L18 9.5V12H20V10.05L18 9.05L16 8.05V8.5Z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#f0ebd8]">Total Capacity</h3>
                                    <p className="text-[#f0ebd8]/80">{hostel.capacity} Students</p>
                                </div>

                                <div className="bg-[#0d1b2a] p-6 rounded-xl space-y-3">
                                    <div className="w-12 h-12 bg-[#f0ebd8] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">
                                            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM8.5 14.5L6 12L4.5 13.5L8.5 17.5L19 7L17.5 5.5L8.5 14.5Z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#f0ebd8]">Occupancy Rate</h3>
                                    <p className="text-[#f0ebd8]/80">{hostel.occupancy}% Full</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="bg-[#0d1b2a] p-6 rounded-xl space-y-3">
                                    <div className="w-12 h-12 bg-[#f0ebd8] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">
                                            <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13Z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#f0ebd8]">For</h3>
                                    <p className="text-[#f0ebd8]/80">{hostel.gender}</p>
                                </div>

                                <div className="bg-[#0d1b2a] p-6 rounded-xl space-y-3">
                                    <div className="w-12 h-12 bg-[#f0ebd8] rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">
                                            <path d="M17 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H7V1H9V3H15V1H17V3ZM4 9V19H20V9H4ZM6 11H8V13H6V11ZM6 15H8V17H6V15ZM10 11H18V13H10V11ZM10 15H15V17H10V15Z"></path>
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#f0ebd8]">Monthly Rent</h3>
                                    {hostel.discountedPrice && hostel.discountedPrice < hostel.price ? (
                                        <>
                                            <p className="text-[#f0ebd8]/50 line-through text-sm">₹{hostel.price?.toLocaleString('en-IN')}</p>
                                            <p className="text-[#f0ebd8]/80">₹{hostel.discountedPrice?.toLocaleString('en-IN')}</p>
                                        </>
                                    ) : (
                                        <p className="text-[#f0ebd8]/80">₹{hostel.price?.toLocaleString('en-IN')}</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full bg-[#0d1b2a] py-16 sm:py-20 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
                        <h2 className="reveal text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#f0ebd8]">
                            Ready to Make This Your Home?
                        </h2>
                        <p className="text-base sm:text-lg lg:text-xl text-[#f0ebd8] max-w-2xl mx-auto">
                            Join the community and start your journey to success today. Book your visit or get in touch with us.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href={`https://wa.me/918989140402?text=${encodeURIComponent(`Hi, I'd like to book a visit to ${hostel.name} in ${hostel.location}. Please share the available time slots.`)}`} target="_blank" rel="noopener noreferrer" className="px-8 sm:px-10 py-3 sm:py-4 bg-[#f0ebd8] text-[#0d1b2a] rounded-full text-sm sm:text-base font-medium hover:bg-opacity-90 transition-all text-center">
                                Book a Visit
                            </a>
                            <button onClick={() => navigate('/contact')} className="px-8 sm:px-10 py-3 sm:py-4 bg-transparent border-2 border-[#f0ebd8] text-[#f0ebd8] rounded-full text-sm sm:text-base font-medium hover:bg-[#f0ebd8] hover:text-[#0d1b2a] transition-all">
                                Contact Us
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {/* Fullscreen Lightbox */}
            {lightboxOpen && hostel.images && hostel.images.length > 0 && (
                <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center select-none"
                    onClick={closeLightbox}
                    onTouchStart={handleLbTouchStart}
                    onTouchMove={handleLbTouchMove}
                    onTouchEnd={handleLbTouchEnd}>
                    {/* Close button */}
                    <button onClick={closeLightbox}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 10.5858L16.9497 5.63604L18.364 7.05025L13.4142 12L18.364 16.9497L16.9497 18.364L12 13.4142L7.05025 18.364L5.63604 16.9497L10.5858 12L5.63604 7.05025L7.05025 5.63604L12 10.5858Z"></path>
                        </svg>
                    </button>

                    {/* Prev button */}
                    {hostel.images.length > 1 && (
                        <button onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
                            className="absolute left-2 sm:left-6 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
                            </svg>
                        </button>
                    )}

                    {/* Next button */}
                    {hostel.images.length > 1 && (
                        <button onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
                            className="absolute right-2 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13.1714 12.0007L8.22168 7.05093L9.63589 5.63672L15.9999 12.0007L9.63589 18.3646L8.22168 16.9504L13.1714 12.0007Z"></path>
                            </svg>
                        </button>
                    )}

                    {/* Lightbox Image - Swipeable */}
                    <img
                        src={hostel.images[lightboxIndex]}
                        alt={`${hostel.name} - Image ${lightboxIndex + 1}`}
                        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl pointer-events-none"
                        style={{
                            transform: `translateX(${lbSwipeOffset}px)`,
                            transition: lbTouchRef.current.isDragging ? 'none' : 'transform 0.3s ease-out',
                        }}
                        draggable={false}
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Counter */}
                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium">
                        {lightboxIndex + 1} / {hostel.images.length}
                    </div>
                </div>
            )}

            <Footer />
        </main>
    );
};

export default HostelPage;