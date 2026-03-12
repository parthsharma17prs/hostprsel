import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import img1 from '../../assets/img1.jpg';
import img2 from '../../assets/img2.jpg';
import img3 from '../../assets/img3.jpg';
import img4 from '../../assets/img4.jpg';
import logo from '../../assets/logo.png';
import Footer from '../../components/Footer';
import useMetadata from '../../hooks/useMetadata';
import Magnetic from '../../components/Magnetic';
import { getApprovedReviews, submitReview, getPopularHostels, getSiteSettings } from '../../api/hostel.api';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    useMetadata(
        'Home',
        'AuraLivings offers premium, design-forward student hostels built for ambition. Modern amenities, vibrant communities, and spaces that inspire.'
    );
    const faqData = [
        { id: 1, question: "What makes AuraLivings different from other student hostels?", answer: "AuraLivings is designed from the ground up for ambitious students — premium interiors, curated study environments, high-speed internet, and a community of motivated peers all in one place." },
        { id: 2, question: "What accommodation options are available?", answer: "We offer fully furnished single, double, and shared rooms — each with ergonomic furniture, ample storage, and daily housekeeping." },
        { id: 3, question: "Are meals included?", answer: "Yes, wholesome, chef-curated meals are served thrice daily, with special dietary options available on request." },
        { id: 4, question: "What study facilities does AuraLivings provide?", answer: "Dedicated silent study lounges, high-speed Wi-Fi (100 Mbps), whiteboards, and 24-hour reading rooms are available to all residents." },
        { id: 5, question: "Is there an age or enrollment requirement?", answer: "AuraLivings is open to students enrolled in recognized colleges, universities, or coaching institutes. Working professionals are welcome at select locations." },
        { id: 6, question: "How do I book a room?", answer: "You can reserve your spot directly through our website, call our admissions team, or visit the hostel for a personal tour." },
        { id: 7, question: "What safety measures are in place?", answer: "Every AuraLivings property has biometric entry, 24/7 CCTV, on-site security staff, and emergency response protocols." },
        { id: 8, question: "Are there recreational and social spaces?", answer: "Yes — rooftop lounges, co-working pods, game rooms, and regular community events make sure life at AuraLivings is as vibrant as it is purposeful." },
    ];

    const [openFaq, setOpenFaq] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewForm, setReviewForm] = useState({ name: '', role: '', rating: 5, text: '' });
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState(false);
    const [displayReviews, setDisplayReviews] = useState([]);
    const [popularHostels, setPopularHostels] = useState([]);
    const [siteImages, setSiteImages] = useState(null);
    const navigate = useNavigate();
    const mainRef = useRef(null);
    const toggleFaq = (id) => setOpenFaq(openFaq === id ? null : id);

    const dummyReviews = [
        { name: 'Aarav Sharma', role: 'B.Tech Student', rating: 5, text: 'AuraLivings completely changed my hostel experience. The rooms are spotless, the food is amazing, and the study environment is unmatched. I genuinely feel at home here.' },
        { name: 'Priya Patel', role: 'MBA Student', rating: 5, text: 'I was skeptical at first, but the community here is incredible. Made lifelong friends and the amenities are top-notch. Best decision I ever made for my college life!' },
        { name: 'Rohit Verma', role: 'CA Aspirant', rating: 4, text: 'The 24/7 study rooms and high-speed Wi-Fi are a game changer for my preparation. The staff is super supportive and the security gives my parents complete peace of mind.' },
        { name: 'Sneha Gupta', role: 'Medical Student', rating: 5, text: 'Clean rooms, nutritious meals, and a quiet atmosphere — everything a medical student needs. The yoga sessions in the morning are the cherry on top!' },
        { name: 'Arjun Malhotra', role: 'Engineering Student', rating: 5, text: 'From the modern interiors to the vibrant community events, AuraLivings sets a new standard. I recommend it to every student looking for premium living.' },
        { name: 'Kavya Reddy', role: 'Design Student', rating: 4, text: 'The aesthetic of this place is inspiring. Every corner is thoughtfully designed. It really boosts my creativity and keeps me motivated throughout the day.' },
    ];

    /* Fetch approved reviews and fill with dummy if < 6 */
    const fetchReviews = async () => {
        try {
            const approved = await getApprovedReviews();
            const real = approved.map(r => ({ name: r.name, role: r.role, rating: r.rating, text: r.text }));
            if (real.length >= 6) { setDisplayReviews(real.slice(0, 6)); }
            else { setDisplayReviews([...real, ...dummyReviews.slice(0, 6 - real.length)]); }
        } catch {
            setDisplayReviews(dummyReviews);
        }
    };

    useEffect(() => {
        fetchReviews();
        getPopularHostels().then(setPopularHostels).catch(() => { });
        getSiteSettings().then(setSiteImages).catch(() => { });
    }, []);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewSubmitting(true);
        setReviewSuccess(false);
        try {
            await submitReview(reviewForm);
            setReviewSuccess(true);
            setReviewForm({ name: '', role: '', rating: 5, text: '' });
        } catch { }
        setReviewSubmitting(false);
    };
    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── REVEAL ANIMATIONS ── */
            const reveals = gsap.utils.toArray('.reveal');
            reveals.forEach((el) => {
                gsap.fromTo(el, {
                    y: 100,
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
            const heroTl = gsap.timeline({ delay: 2.5 }); // Wait for preloader
            heroTl
                .from('.hero-title span', {
                    y: 120,
                    opacity: 0,
                    stagger: 0.15,
                    duration: 1.2,
                    ease: 'expo.out'
                })
                .from('.hero-subtitle', { y: 30, opacity: 0, duration: 1, ease: 'power3.out' }, '-=1')
                .from('.hero-btn', { scale: 0.8, opacity: 0, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.8')
                .from('.hero-img-main', {
                    y: 100,
                    scale: 1.2,
                    opacity: 0,
                    duration: 1.5,
                    ease: 'expo.out'
                }, '-=1.2')
                .from('.hero-img-sub', {
                    scale: 0,
                    rotation: -45,
                    opacity: 0,
                    duration: 1,
                    ease: 'back.out(1.7)'
                }, '-=0.8');

            /* ── PERSPECTIVE TILT ── */
            const applyTilt = (selector) => {
                const el = document.querySelector(selector);
                if (!el) return;
                const inner = el.querySelector('img');

                el.addEventListener('mousemove', (e) => {
                    const { left, top, width, height } = el.getBoundingClientRect();
                    const x = (e.clientX - left) / width - 0.5;
                    const y = (e.clientY - top) / height - 0.5;

                    gsap.to(inner, {
                        rotationY: x * 15,
                        rotationX: -y * 15,
                        scale: 1.05,
                        duration: 0.6,
                        ease: 'power2.out',
                        transformPerspective: 1000
                    });
                });

                el.addEventListener('mouseleave', () => {
                    gsap.to(inner, {
                        rotationY: 0,
                        rotationX: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: 'power3.out'
                    });
                });
            };

            applyTilt('.hero-img-main');
            applyTilt('.about-img');

            /* ── PARALLAX ── */
            gsap.to('.hero-img-main img', {
                yPercent: 20,
                ease: "none",
                scrollTrigger: {
                    trigger: '.hero-img-main',
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });

            /* ── ABOUT ── */
            gsap.from('.about-img img', {
                scale: 1.5,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.about-section',
                    start: 'top 80%',
                    scrub: 1
                }
            });

            /* ── FEATURE CARDS ── */
            gsap.from('.feature-card', {
                y: 50,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.feature-cards-grid',
                    start: 'top 85%'
                }
            });


            /* ── ANIMATED COUNTERS ── */
            gsap.utils.toArray('.stat-card').forEach((card, i) => {
                gsap.from(card, {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    delay: i * 0.1,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: '.stats-section', start: 'top 80%', once: true }
                });
                const counterEl = card.querySelector('.counter');
                if (counterEl) {
                    const target = parseFloat(counterEl.dataset.target);
                    const suffix = counterEl.dataset.suffix || '';
                    const isFloat = !Number.isInteger(target);
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        duration: 2.5,
                        ease: 'power2.out',
                        delay: 0.3 + i * 0.1,
                        scrollTrigger: { trigger: '.stats-section', start: 'top 75%', once: true },
                        onUpdate: () => {
                            counterEl.textContent = (isFloat ? obj.val.toFixed(1) : Math.round(obj.val)) + suffix;
                        }
                    });
                }
            });

            /* ── WHY CARDS ── */
            gsap.utils.toArray('.why-card-premium').forEach((card, i) => {
                gsap.from(card, {
                    y: 80,
                    opacity: 0,
                    duration: 1.2,
                    delay: i * 0.12,
                    ease: 'power4.out',
                    scrollTrigger: { trigger: '.why-rows', start: 'top 80%', once: true }
                });
            });

        }, mainRef);

        /* ── SKEW ON SCROLL ── */
        let proxy = { skew: 0 },
            skewSetter = gsap.quickSetter(".skew-elem", "skewY", "deg"),
            clamp = gsap.utils.clamp(-15, 15);

        ScrollTrigger.create({
            onUpdate: (self) => {
                let skew = clamp(self.getVelocity() / -300);
                if (Math.abs(skew) > Math.abs(proxy.skew)) {
                    proxy.skew = skew;
                    gsap.to(proxy, {
                        skew: 0,
                        duration: 0.8,
                        ease: "power3",
                        overwrite: true,
                        onUpdate: () => skewSetter(proxy.skew)
                    });
                }
            }
        });

        return () => ctx.kill();
    }, []);

    const features = [
        { icon: <path d="M8 2V22H4V18H2V16H4V13H2V11H4V8H2V6H4V2H8ZM20.0049 2C21.1068 2 22 2.89821 22 3.9908V20.0092C22 21.1087 21.1074 22 20.0049 22H10V2H20.0049Z" />, title: "Premium Study Spaces", desc: "Silent study lounges, 100 Mbps Wi-Fi, and round-the-clock reading rooms built for peak focus." },
        { icon: <path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z" />, title: "Wellness & Balance", desc: "Morning yoga, meditation zones, and recreational spaces to keep your mind and body thriving." },
        { icon: <path d="M12 10C14.2091 10 16 8.20914 16 6 16 3.79086 14.2091 2 12 2 9.79086 2 8 3.79086 8 6 8 8.20914 9.79086 10 12 10ZM5.5 13C6.88071 13 8 11.8807 8 10.5 8 9.11929 6.88071 8 5.5 8 4.11929 8 3 9.11929 3 10.5 3 11.8807 4.11929 13 5.5 13ZM21 10.5C21 11.8807 19.8807 13 18.5 13 17.1193 13 16 11.8807 16 10.5 16 9.11929 17.1193 8 18.5 8 19.8807 8 21 9.11929 21 10.5ZM12 11C14.7614 11 17 13.2386 17 16V22H7V16C7 13.2386 9.23858 11 12 11ZM5 15.9999C5 15.307 5.10067 14.6376 5.28818 14.0056L5.11864 14.0204C3.36503 14.2104 2 15.6958 2 17.4999V21.9999H5V15.9999ZM22 21.9999V17.4999C22 15.6378 20.5459 14.1153 18.7118 14.0056 18.8993 14.6376 19 15.307 19 15.9999V21.9999H22Z" />, title: "Vibrant Community", desc: "Live alongside driven peers, join interest clubs, and grow your network from day one." },
        { icon: <path d="M3.78307 2.82598L12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598Z" />, title: "Safe & Secure", desc: "Biometric access, 24/7 CCTV, on-site staff, and a gated campus so you can focus without worry." },
    ];

    const stats = [
        { icon: <path d="M12 19H14V6.00003L20.3939 8.74028C20.7616 8.89786 21 9.2594 21 9.65943V19H23V21H1V19H3V5.6499C3 5.25472 3.23273 4.89659 3.59386 4.73609L11.2969 1.31251C11.5493 1.20035 11.8448 1.314 11.9569 1.56634C11.9853 1.63027 12 1.69945 12 1.76941V19Z" />, number: 10, suffix: '+', label: "Hostel Locations" },
        { icon: <path d="M2 22C2 17.5817 5.58172 14 10 14C14.4183 14 18 17.5817 18 22H2ZM10 13C6.685 13 4 10.315 4 7C4 3.685 6.685 1 10 1C13.315 1 16 3.685 16 7C16 10.315 13.315 13 10 13ZM17.3628 15.2332C20.4482 16.0217 22.7679 18.7235 22.9836 22H20C20 19.3902 19.0002 17.0139 17.3628 15.2332ZM15.3401 12.9569C16.9728 11.4922 18 9.36607 18 7C18 5.58266 17.6314 4.25141 16.9849 3.09687C19.2753 3.55397 21 5.57465 21 8C21 10.7625 18.7625 13 16 13C15.7763 13 15.556 12.9853 15.3401 12.9569Z" />, number: 500, suffix: '+', label: "Students Trust Us" },
        { icon: <path d="M22 11V20H20V17H4V20H2V4H4V14H12V7H18C20.2091 7 22 8.79086 22 11ZM8 13C6.34315 13 5 11.6569 5 10C5 8.34315 6.34315 7 8 7C9.65685 7 11 8.34315 11 10C11 11.6569 9.65685 13 8 13Z" />, number: 100, suffix: '+', label: "Beds Available" },
        { icon: <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />, number: 4.8, suffix: '★', label: "Average Rating" },
    ];

    const whyItems = [
        { title: "Curated Living Spaces", desc: "Every room is thoughtfully designed — ergonomic furniture, ample natural light, and aesthetics that inspire productivity.", icon: <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z" />, accent: '#e8d5b7', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80' },
        { title: "Structured Daily Rhythm", desc: "Balanced schedules for study, meals, exercise, and rest — designed to help you perform at your best every day.", icon: <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM13 12V7H11V14H17V12H13Z" />, accent: '#c9d8e8', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
        { title: "Mentorship & Growth", desc: "Connect with experienced mentors, attend workshops, and access resources that accelerate your academic and personal growth.", icon: <path d="M12 7.00002C16.4183 7.00002 20 10.5817 20 15C20 19.4183 16.4183 23 12 23C7.58172 23 4 19.4183 4 15C4 10.5817 7.58172 7.00002 12 7.00002ZM12 10.5L10.6775 13.1797L7.72025 13.6094L9.86012 15.6953L9.35497 18.6406L12 17.25L14.645 18.6406L14.1399 15.6953L16.2798 13.6094L13.3225 13.1797L12 10.5Z" />, accent: '#d4e8c9', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80' },
        { title: "Always-On Support", desc: "Our resident managers and support team are available round the clock for academic queries, emergencies, and everything in between.", icon: <path d="M4 12H7C8.10457 12 9 12.8954 9 14V19C9 20.1046 8.10457 21 7 21H4C2.89543 21 2 20.1046 2 19V12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V19C22 20.1046 21.1046 21 20 21H17C15.8954 21 15 20.1046 15 19V14C15 12.8954 15.8954 12 17 12H20C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z" />, accent: '#e8c9c9', img: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80' },
    ];

    return (
        <main ref={mainRef} className="w-full h-full overflow-x-hidden skew-elem">

            {/* ═══════════════ HERO ═══════════════ */}
            <section
                style={{ backgroundImage: `url('${siteImages?.heroBg || '/main1.png'}')`, backgroundPosition: "center", backgroundSize: "cover" }}
                className="min-h-screen w-full relative bg-[#0d1b2a] flex items-center"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-12 py-24 lg:py-0">

                    {/* Text */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6 text-center lg:text-left mt-8 lg:mt-0">
                        <div className="hero-logo flex md:hidden justify-center lg:justify-start">
                            <img src={logo} alt="AuraLivings Logo" className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain rounded-xl shadow-lg" />
                        </div>
                        <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-[#f0ebd8] leading-tight overflow-hidden">
                            <span className="font-bold block">Live Like</span>
                            <span className="font-bold bg-[#f0ebd8] text-[#0d1b2a] inline-block px-3 py-1 mt-2">Home.</span>
                        </h1>
                        <p className="hero-subtitle text-[#f0ebd8] text-base sm:text-lg lg:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed opacity-90">
                            AuraLivings — premium student housing where design meets discipline and every detail is built for your success.
                        </p>
                        <div className="hero-btn flex justify-center lg:justify-start pt-2">
                            <Magnetic>
                                <button
                                    onClick={() => navigate('/hostel')}
                                    className="bg-[#f0ebd8] text-[#0d1b2a] px-10 text-base sm:text-lg py-4 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 font-semibold shadow-xl"
                                >
                                    Explore Hostels
                                </button>
                            </Magnetic>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="w-full lg:w-1/2 flex justify-center items-center pb-10 lg:pb-0">
                        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[26rem] lg:h-[26rem]">
                            {/* Main arch image */}
                            <div className="hero-img-main absolute inset-0 border-4 border-[#f0ebd8] rounded-t-full overflow-hidden bg-[#f0ebd8] shadow-2xl">
                                <img
                                    src={siteImages?.heroMain || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80'}
                                    alt="Hostel"
                                    className="w-full h-full object-cover"
                                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700&q=80'}
                                />
                            </div>
                            {/* Small circle */}
                            <div className="hero-img-sub absolute -bottom-4 -left-4 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#f0ebd8] bg-[#f0ebd8] shadow-xl">
                                <img
                                    src={siteImages?.heroSub || 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&q=80'}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=300&q=80'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ ABOUT ═══════════════ */}
            <section className="about-section w-full bg-[#0d1b2a]">
                <div className="container mx-auto flex flex-col lg:flex-row min-h-[28rem] lg:min-h-[36rem]">
                    <div className="about-img w-full lg:w-2/5 h-64 sm:h-72 md:h-80 lg:h-auto relative overflow-hidden lg:rounded-tr-[200px]">
                        <img
                            src={siteImages?.aboutImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'}
                            alt="Premium hostel room"
                            className="h-full w-full object-cover"
                            onError={e => e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'}
                        />
                    </div>
                    <div className="about-text w-full lg:w-3/5 flex justify-center items-center p-6 sm:p-10 lg:p-16">
                        <div className="max-w-xl text-[#f0ebd8] space-y-4 sm:space-y-6 text-center lg:text-left">
                            <h2 className="reveal text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-snug">
                                A Space Designed for Those Who Dare to Dream
                            </h2>
                            <p className="reveal text-sm sm:text-base lg:text-lg leading-relaxed opacity-90">
                                AuraLiving is where ambitious students come to focus, connect, and grow. Premium interiors, chef-curated meals, and a community of driven peers — everything you need to perform at your absolute best.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ FEATURES ═══════════════ */}
            <section className="features-section w-full bg-[#f0ebd8] py-14 sm:py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="features-heading text-center mb-10 sm:mb-14 lg:mb-16 space-y-3">
                        <h2 className="reveal text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#0d1b2a]">
                            More Than Just a Place to Stay
                        </h2>
                        <p className="reveal text-sm sm:text-base lg:text-lg text-[#0d1b2a] max-w-2xl mx-auto">
                            We create an ecosystem where academic excellence meets personal growth
                        </p>
                    </div>
                    <div className="bg-[#0d1b2a] p-5 sm:p-8 lg:p-12 xl:p-16 rounded-2xl">
                        <div className="feature-cards-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {features.map((feat, i) => (
                                <div key={i} className="feature-card bg-[#f0ebd8] p-3 rounded-xl hover:-translate-y-2 transition-transform duration-300">
                                    <div className="border-2 border-[#0d1b2a] h-full flex flex-col rounded-xl overflow-hidden">
                                        <div className="h-20 sm:h-24 bg-[#0d1b2a] flex items-center justify-center">
                                            <div className="w-12 h-12 bg-[#f0ebd8] rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0d1b2a">{feat.icon}</svg>
                                            </div>
                                        </div>
                                        <div className="p-4 sm:p-5 flex flex-col items-center text-center gap-2">
                                            <h3 className="text-base sm:text-lg font-bold text-[#0d1b2a]">{feat.title}</h3>
                                            <p className="text-xs sm:text-sm text-[#0d1b2a] leading-relaxed">{feat.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ EXPLORE OUR SPACES ═══════════════ */}
            <section className="destinations-section w-full bg-[#0d1b2a] py-14 sm:py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
                        <div className="destinations-text w-full lg:w-1/2 space-y-5 text-center lg:text-left">
                            <span className="inline-block px-4 py-2 bg-[#f0ebd8] text-[#0d1b2a] rounded-full text-xs sm:text-sm font-medium">
                                Our Spaces
                            </span>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f0ebd8]">Designed for Comfort & Focus</h2>
                            <p className="text-sm sm:text-base lg:text-lg text-[#f0ebd8] opacity-90">
                                Step into thoughtfully crafted living spaces where every detail is designed to help you thrive — modern interiors, natural light, and a vibrant atmosphere.
                            </p>
                            <Magnetic>
                                <button onClick={() => navigate('/hostel')} className="px-6 sm:px-8 py-3 sm:py-4 bg-[#f0ebd8] text-[#0d1b2a] rounded-full text-sm sm:text-base font-semibold hover:scale-105 active:scale-95 transition-all duration-200">
                                    Explore Hostels
                                </button>
                            </Magnetic>
                        </div>
                        <div className="w-full lg:w-1/2 flex items-end justify-center gap-2 sm:gap-5" style={{ height: '18rem' }}>
                            {[
                                { src: siteImages?.exploreImages?.[0] || 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&q=80', h: 'h-[70%]' },
                                { src: siteImages?.exploreImages?.[1] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80', h: 'h-[90%]' },
                                { src: siteImages?.exploreImages?.[2] || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&q=80', h: 'h-[70%]' },
                            ].map(({ src, h }, i) => (
                                <div key={i} className={`destination-img flex-1 max-w-[6rem] sm:max-w-[9rem] lg:max-w-[10rem] ${h} bg-[#f0ebd8] rounded-t-full overflow-hidden`}>
                                    <img src={src} alt="" className="h-full w-full object-cover object-center" onError={e => e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80'} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════ POPULAR DESTINATIONS ═══════════════ */}
            <section className="popular-section w-full bg-[#f0ebd8] py-14 sm:py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="popular-heading text-center mb-10 sm:mb-14 space-y-3">
                        <span className="reveal inline-block px-4 py-2 bg-[#0d1b2a] text-[#f0ebd8] rounded-full text-xs sm:text-sm font-medium">
                            Top Picks
                        </span>
                        <h2 className="reveal text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0d1b2a]">Popular Destinations</h2>
                        <p className="reveal text-sm sm:text-base lg:text-lg text-[#0d1b2a]/70 max-w-2xl mx-auto">
                            Our most loved hostels, handpicked by students just like you.
                        </p>
                    </div>

                    {popularHostels.length > 0 ? (
                        <div className="popular-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                            {popularHostels.map((h) => (
                                <div key={h._id}
                                    onClick={() => navigate(`/hostel/${h._id}`)}
                                    data-cursor="view"
                                    className="popular-card group relative bg-[#0d1b2a] p-2 overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer hover:-translate-y-2">
                                    <div className="border-2 border-[#f0ebd8]/20">
                                        <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                                            <img src={h.images?.[0] || img1} alt={h.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            {h.popular && (
                                                <div className="absolute top-2 right-2 bg-[#f0ebd8] text-[#0d1b2a] px-2 py-1 text-[10px] sm:text-xs font-bold shadow-lg flex items-center gap-1">
                                                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    Popular
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-[#0d1b2a]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </div>
                                        <div className="p-4 sm:p-5 space-y-3">
                                            <div className="space-y-1">
                                                <h3 className="text-base sm:text-lg font-bold text-[#f0ebd8] line-clamp-1">{h.name}</h3>
                                                <p className="text-[#f0ebd8] text-xs sm:text-sm flex items-center gap-1.5 opacity-70">
                                                    <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="line-clamp-1">{h.location}</span>
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-[#f0ebd8]/15">
                                                <div className="flex items-center gap-1.5">
                                                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                    <span className="text-[#f0ebd8] font-bold text-sm sm:text-base">{h.rating?.toFixed(1) || 'N/A'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[#f0ebd8] text-lg sm:text-xl font-black">
                                                        ₹{h.price?.toLocaleString()}
                                                        <span className="text-xs font-normal opacity-50 ml-0.5">/mo</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 border-2 border-[#f0ebd8]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-[#0d1b2a]/50 text-sm">No popular hostels yet.</p>
                    )}

                    <div className="popular-btn text-center mt-10 sm:mt-12">
                        <Magnetic>
                            <button onClick={() => navigate('/hostel')} className="px-6 sm:px-8 py-3 sm:py-4 bg-[#0d1b2a] text-[#f0ebd8] rounded-full text-sm sm:text-base font-semibold hover:scale-105 active:scale-95 transition-all duration-200">
                                View All Hostels
                            </button>
                        </Magnetic>
                    </div>
                </div>
            </section>

            {/* ═══════════════ WHY CHOOSE US ═══════════════ */}
            <section className="why-section w-full bg-[#000814] py-16 sm:py-20 lg:py-28 relative overflow-hidden">
                {/* Ambient blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-[#f0ebd8] rounded-full blur-[180px] opacity-[0.04]" />
                    <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-[#f0ebd8] rounded-full blur-[180px] opacity-[0.04]" />
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Heading */}
                    <div className="why-heading grid lg:grid-cols-2 gap-10 lg:gap-16 items-end mb-16 sm:mb-20">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#f0ebd8]/10 border border-[#f0ebd8]/20 rounded-full">
                                <div className="w-2 h-2 bg-[#f0ebd8] rounded-full" />
                                <span className="text-[#f0ebd8] text-xs sm:text-sm font-semibold tracking-widest uppercase">Why Choose Us</span>
                            </div>
                            <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-[#f0ebd8] leading-tight">
                                Your Success Is{' '}
                                <span className="text-transparent" style={{ WebkitTextStroke: '2px #f0ebd8' }}>Our Priority</span>
                            </h2>
                        </div>
                        <p className="reveal text-base sm:text-lg text-[#f0ebd8]/60 lg:text-right leading-relaxed">
                            We've designed every aspect of our hostels to support your academic journey and personal growth — because your win is our win.
                        </p>
                    </div>

                    {/* Premium grid */}
                    <div className="why-rows grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
                        {whyItems.map((item, i) => (
                            <div
                                key={i}
                                data-cursor="more"
                                className="why-card-premium group relative rounded-2xl overflow-hidden border border-[#f0ebd8]/10 bg-[#0d1b2a] cursor-pointer"
                                style={{ minHeight: '260px' }}
                            >
                                {/* Background image with overlay */}
                                <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                                    <img src={item.img} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b2a]/80 via-[#0d1b2a]/60 to-transparent" />

                                {/* Content */}
                                <div className="relative z-10 p-7 sm:p-8 lg:p-10 h-full flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="w-14 h-14 bg-[#f0ebd8]/10 border border-[#f0ebd8]/30 rounded-2xl flex items-center justify-center group-hover:bg-[#f0ebd8]/20 group-hover:border-[#f0ebd8]/60 transition-all duration-300">
                                            <svg className="w-7 h-7 text-[#f0ebd8]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">{item.icon}</svg>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl sm:text-2xl font-bold text-[#f0ebd8]">{item.title}</h3>
                                            <p className="text-sm sm:text-base text-[#f0ebd8]/70 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                    {/* Bottom arrow indicator */}
                                    <div className="flex items-center gap-2 mt-6 text-[#f0ebd8]/40 group-hover:text-[#f0ebd8] transition-colors duration-300">
                                        <div className="h-px flex-1 bg-current opacity-30" />
                                        <svg className="w-5 h-5 translate-x-0 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ HOME FEEL ═══════════════ */}
            <section className="homefeel-section w-full bg-[#f0ebd8]">
                <div className="container mx-auto flex flex-col lg:flex-row min-h-[22rem]">
                    <div className="homefeel-text w-full lg:w-2/3 flex items-center justify-center p-8 sm:p-10 lg:p-16 order-2 lg:order-1">
                        <div className="max-w-lg text-center space-y-4">
                            <h2 className="reveal text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0d1b2a]">
                                Your Aura, Your Space
                            </h2>
                            <p className="reveal text-sm sm:text-base lg:text-lg text-[#0d1b2a] leading-relaxed">
                                Home isn't just four walls — it's the energy of the space you're in. AuraLiving crafts environments that feel warm, personal, and inspiring so you never have to choose between comfort and achievement.
                            </p>
                        </div>
                    </div>
                    <div className="homefeel-img w-full lg:w-1/3 h-64 sm:h-80 lg:h-auto overflow-hidden lg:rounded-tl-[10rem] order-1 lg:order-2">
                        <img
                            src={siteImages?.homeFeelImage || 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80'}
                            alt="Student thriving"
                            className="h-full w-full object-cover object-center"
                            onError={e => e.target.src = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80'}
                        />
                    </div>
                </div>
            </section>

            {/* ═══════════════ STATS ═══════════════ */}
            <section className="stats-section w-full bg-[#0d1b2a] py-16 sm:py-20 lg:py-28 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f0ebd8] rounded-full blur-[120px] opacity-5" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#f0ebd8] rounded-full blur-[120px] opacity-5" />
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Heading */}
                    <div className="text-center mb-16 sm:mb-20 space-y-4">
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#f0ebd8]/10 border border-[#f0ebd8]/20 rounded-full">
                            <div className="w-2 h-2 bg-[#f0ebd8] rounded-full animate-pulse" />
                            <span className="text-[#f0ebd8] text-xs sm:text-sm font-semibold tracking-widest uppercase">Our Impact</span>
                        </div>
                        <h2 className="reveal text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-[#f0ebd8] leading-tight">
                            Numbers That{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10">Speak</span>
                                <span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#f0ebd8] opacity-30 rounded-full" />
                            </span>{' '}for Themselves
                        </h2>
                        <p className="reveal text-base sm:text-lg text-[#f0ebd8]/60 max-w-xl mx-auto">
                            Trusted by students across India for comfort, safety, and academic growth.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card stat-card-premium group">
                                {/* Glowing border */}
                                <div className="relative h-full bg-gradient-to-b from-[#f0ebd8]/10 to-transparent border border-[#f0ebd8]/20 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center gap-4 overflow-hidden">
                                    {/* shimmer on hover */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer" />
                                    {/* Icon circle */}
                                    <div className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 bg-[#f0ebd8]/10 border border-[#f0ebd8]/30 rounded-full flex items-center justify-center group-hover:bg-[#f0ebd8]/20 group-hover:border-[#f0ebd8]/50 transition-all duration-300">
                                        <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[#f0ebd8]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">{stat.icon}</svg>
                                    </div>
                                    {/* Number */}
                                    <div className="relative z-10 space-y-1">
                                        <h3 className="stat-number text-4xl sm:text-5xl lg:text-6xl font-black text-[#f0ebd8] leading-none">
                                            <span className="counter" data-target={stat.number} data-suffix={stat.suffix}>0{stat.suffix}</span>
                                        </h3>
                                        <div className="w-8 h-0.5 bg-[#f0ebd8]/30 mx-auto rounded-full line-draw" />
                                        <p className="text-xs sm:text-sm text-[#f0ebd8]/60 font-medium uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════ REVIEWS ═══════════════ */}
            <section className="reviews-section w-full bg-[#f0ebd8] py-14 sm:py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="reviews-heading text-center mb-10 sm:mb-14 space-y-3">
                        <span className="inline-block px-4 py-2 bg-[#0d1b2a] text-[#f0ebd8] rounded-full text-xs sm:text-sm font-semibold">
                            Testimonials
                        </span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0d1b2a]">
                            What Our Residents Say
                        </h2>
                        <p className="text-sm sm:text-base text-[#0d1b2a] opacity-75 max-w-xl mx-auto">
                            Hear from students who made AuraLivings their home away from home.
                        </p>
                    </div>
                    <div className="reviews-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {displayReviews.map((review, i) => (
                            <div key={i} className="review-card bg-[#0d1b2a] rounded-2xl p-6 sm:p-7 flex flex-col gap-4 hover:-translate-y-2 transition-transform duration-300 shadow-md">
                                {/* Stars */}
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, s) => (
                                        <svg key={s} className={`w-5 h-5 ${s < review.rating ? 'text-yellow-500' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
                                        </svg>
                                    ))}
                                </div>
                                {/* Quote */}
                                <p className="text-sm sm:text-base text-[#f0ebd8] opacity-80 leading-relaxed flex-1">
                                    "{review.text}"
                                </p>
                                {/* Author */}
                                <div className="flex items-center gap-3 pt-2 border-t border-[#f0ebd8]/20">
                                    <div className="w-10 h-10 bg-[#f0ebd8] rounded-full flex items-center justify-center text-[#0d1b2a] font-bold text-sm">
                                        {review.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-[#f0ebd8]">{review.name}</p>
                                        <p className="text-xs text-[#f0ebd8] opacity-60">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Add Review Button */}
                    <div className="text-center mt-10">
                        <button onClick={() => { setReviewSuccess(false); setShowReviewModal(true); }}
                            className="px-8 py-3 bg-[#0d1b2a] text-[#f0ebd8] rounded-full text-sm sm:text-base font-semibold hover:scale-105 active:scale-95 transition-all duration-200">
                            Write a Review
                        </button>
                    </div>
                </div>
            </section>

            {/* ═══ REVIEW MODAL ═══ */}
            {showReviewModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowReviewModal(false); }}>
                    <div className="bg-[#f0ebd8] rounded-2xl w-full max-w-md p-6 sm:p-8 relative shadow-2xl">
                        <button onClick={() => setShowReviewModal(false)}
                            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-[#0d1b2a]/10 transition-colors">
                            <svg className="w-5 h-5 text-[#0d1b2a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h3 className="text-xl sm:text-2xl font-bold text-[#0d1b2a] mb-1">Write a Review</h3>
                        <p className="text-xs text-[#0d1b2a]/60 mb-5">Your review will be visible after admin approval.</p>

                        {reviewSuccess && (
                            <div className="mb-4 bg-green-500/20 border border-green-500 text-green-800 p-3 rounded-xl text-sm">
                                Thank you! Your review has been submitted and will appear after approval.
                            </div>
                        )}

                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <input required placeholder="Your Name" value={reviewForm.name}
                                onChange={(e) => setReviewForm(p => ({ ...p, name: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#0d1b2a]/15 focus:border-[#0d1b2a] outline-none text-[#0d1b2a] text-sm transition-colors" />
                            <input required placeholder="Your Role (e.g. B.Tech Student)" value={reviewForm.role}
                                onChange={(e) => setReviewForm(p => ({ ...p, role: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#0d1b2a]/15 focus:border-[#0d1b2a] outline-none text-[#0d1b2a] text-sm transition-colors" />
                            {/* Star rating selector */}
                            <div>
                                <label className="block text-xs font-semibold text-[#0d1b2a]/60 uppercase tracking-wider mb-2">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button key={star} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: star }))}>
                                            <svg className={`w-8 h-8 transition-colors ${star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea required rows={4} placeholder="Share your experience..."
                                value={reviewForm.text}
                                onChange={(e) => setReviewForm(p => ({ ...p, text: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#0d1b2a]/15 focus:border-[#0d1b2a] outline-none text-[#0d1b2a] text-sm resize-none transition-colors" />
                            <button type="submit" disabled={reviewSubmitting}
                                className="w-full py-3 rounded-xl bg-[#0d1b2a] text-[#f0ebd8] font-bold text-sm hover:bg-[#1a2d40] transition-colors disabled:opacity-50">
                                {reviewSubmitting ? 'Submitting…' : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ═══════════════ CTA ═══════════════ */}
            <section className="cta-section w-full bg-[#0d1b2a] py-16 sm:py-20 lg:py-28">
                <div className="cta-content container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-6">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#f0ebd8] max-w-4xl mx-auto leading-tight">
                        Your Best Chapter Starts Here.
                    </h2>
                    <p className="text-xs sm:text-base lg:text-lg text-[#f0ebd8] max-w-xl mx-auto leading-relaxed">
                        Join thousands of students across India who chose AuraLiving as the launchpad for their biggest ambitions.
                    </p>
                    <button onClick={() => navigate('/hostel')} className="px-6 sm:px-12 py-3 sm:py-4 bg-[#f0ebd8] text-[#0d1b2a] rounded-full text-sm sm:text-base lg:text-lg font-semibold hover:scale-105 active:scale-95 transition-all duration-200">
                        Find Your Hostel
                    </button>
                </div>
            </section>

            {/* ═══════════════ WHATSAPP CONTACT ═══════════════ */}
            <section className="wa-contact-section w-full bg-[#f0ebd8] py-16 sm:py-20 lg:py-28 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 w-40 h-40 border border-[#0d1b2a] rounded-full"></div>
                    <div className="absolute bottom-10 right-10 w-60 h-60 border border-[#0d1b2a] rounded-full"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-[#0d1b2a] rounded-full"></div>
                </div>
                <div className="wa-contact-content container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d1b2a]/10 rounded-full">
                            <svg className="w-5 h-5 text-[#0d1b2a]" viewBox="0 0 448 512" fill="currentColor">
                                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.8-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                            </svg>
                            <span className="text-[#0d1b2a] text-xs sm:text-sm font-medium">Quick Connect</span>
                        </div>
                        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#0d1b2a] leading-tight">
                            Got Questions? Let's Chat!
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg text-[#0d1b2a]/70 max-w-xl mx-auto leading-relaxed">
                            Reach out to us directly on WhatsApp for instant responses. Whether it's about pricing, availability, or a campus tour — we're here to help.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a href="https://wa.me/918989140402?text=Hi%2C%20I%E2%80%99m%20interested%20in%20AuraLivings%20hostel.%20Can%20you%20share%20more%20details%3F"
                                target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-[#0d1b2a] text-[#f0ebd8] rounded-full text-sm sm:text-base font-semibold hover:bg-[#1a2d40] hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 448 512" fill="currentColor">
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.8-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                </svg>
                                Chat on WhatsApp
                            </a>
                            <a href="tel:+918989140402"
                                className="inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-transparent border-2 border-[#0d1b2a] text-[#0d1b2a] rounded-full text-sm sm:text-base font-medium hover:bg-[#0d1b2a] hover:text-[#f0ebd8] transition-all duration-200">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9.36556 10.6821C10.302 12.3288 11.6712 13.698 13.3179 14.6344L14.2024 13.3961C14.4965 12.9845 15.0516 12.8573 15.4956 13.0998C16.9024 13.8683 18.4571 14.3353 20.0789 14.4637C20.599 14.5049 21 14.9389 21 15.4606V19.9234C21 20.4361 20.6122 20.8657 20.1022 20.9181C19.5723 20.9726 19.0377 21 18.5 21C9.93959 21 3 14.0604 3 5.5C3 4.96227 3.02742 4.42771 3.08189 3.89776C3.1343 3.38775 3.56394 3 4.07665 3H8.53942C9.0611 3 9.49513 3.40104 9.5363 3.92109C9.66467 5.54288 10.1317 7.09764 10.9002 8.50444C11.1427 8.9484 11.0155 9.50354 10.6039 9.79757L9.36556 10.6821Z" />
                                </svg>
                                Call Us
                            </a>
                        </div>
                        <p className="text-xs sm:text-sm text-[#0d1b2a]/40">Available 9 AM – 9 PM • Typically replies within minutes</p>
                    </div>
                </div>
            </section>

            {/* ═══════════════ FAQ ═══════════════ */}
            <section className="faq-section w-full bg-[#0d1b2a] py-14 sm:py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="faq-heading text-center mb-10 sm:mb-12 space-y-3">
                        <span className="inline-block px-4 py-2 bg-[#f0ebd8] text-[#0d1b2a] rounded-full text-xs sm:text-sm font-medium">FAQs</span>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#f0ebd8]">Frequently Asked Questions</h2>
                        <p className="text-sm sm:text-base lg:text-lg text-[#f0ebd8] opacity-80">Everything you need to know about AuraLiving</p>
                    </div>
                    <div className="faq-list max-w-3xl mx-auto space-y-3">
                        {faqData.map((faq) => {
                            const isOpen = openFaq === faq.id;
                            return (
                                <div key={faq.id} className="faq-item bg-[#f0ebd8] rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => toggleFaq(faq.id)}
                                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left gap-3"
                                    >
                                        <h3 className="text-sm sm:text-base text-[#0d1b2a] font-medium flex-1">{faq.question}</h3>
                                        <div className={`flex-shrink-0 w-8 h-8 bg-[#0d1b2a] rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f0ebd8">
                                                <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" />
                                            </svg>
                                        </div>
                                    </button>
                                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="px-4 sm:px-5 pb-5">
                                            <p className="text-sm sm:text-base text-[#0d1b2a] opacity-80 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}

export { Home };
