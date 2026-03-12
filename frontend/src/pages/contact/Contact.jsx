import axios from '../../api/axios.config.js';
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../../components/Footer';
import useMetadata from '../../hooks/useMetadata';
import Magnetic from '../../components/Magnetic';

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
    {
        iconPath: <path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM20 7.23792L12.0718 14.338L4 7.21594V19H20V7.23792ZM4.51146 5L12.0619 11.662L19.501 5H4.51146Z" />,
        title: 'Email Us',
        sub: 'For general inquiries and support',
        detail: 'auralivings20@gmail.com',
        href: 'mailto:auralivings20@gmail.com',
    },
    {
        iconPath: <path d="M9.36556 10.6821C10.302 12.3288 11.6712 13.698 13.3179 14.6344L14.2024 13.3961C14.4965 12.9845 15.0516 12.8573 15.4956 13.0998C16.9024 13.8683 18.4571 14.3353 20.0789 14.4637C20.599 14.5049 21 14.9389 21 15.4606V19.9234C21 20.4361 20.6122 20.8657 20.1022 20.9181C19.5723 20.9726 19.0377 21 18.5 21C9.93959 21 3 14.0604 3 5.5C3 4.96227 3.02742 4.42771 3.08189 3.89776C3.1343 3.38775 3.56394 3 4.07665 3H8.53942C9.0611 3 9.49513 3.40104 9.5363 3.92109C9.66467 5.54288 10.1317 7.09764 10.9002 8.50444C11.1427 8.9484 11.0155 9.50354 10.6039 9.79757L9.36556 10.6821Z" />,
        title: 'Call Our Helpline',
        sub: 'Connect with our admissions team',
        detail: '+91 8989140402 / +91 91114 85959',
        href: 'tel:+918989140402',
    },
    {
        iconPath: <path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z" />,
        title: 'Visit Our Office',
        sub: 'Schedule an appointment to visit us',
        detail: 'Madhu Milan, Chhawani Road, Indore',
        href: null,
    },
    {
        iconPath: <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM13 12V7H11V14H17V12H13Z" />,
        title: 'Office Hours',
        sub: "We're available to help",
        detail: 'Mon – Sat: 9:00 AM – 6:00 PM',
        href: null,
    },
];

const whyCards = [
    { title: 'Admissions Guidance', desc: 'Get personalized help with the application process', iconPath: <path d="M21 8C22.1046 8 23 8.89543 23 10V14C23 15.1046 22.1046 16 21 16H19.9381C19.446 19.9463 16.0796 23 12 23V21C15.3137 21 18 18.3137 18 15V9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9V16H3C1.89543 16 1 15.1046 1 14V10C1 8.89543 1.89543 8 3 8H4.06189C4.55399 4.05369 7.92038 1 12 1C16.0796 1 19.446 4.05369 19.9381 8H21Z" /> },
    { title: '24/7 Support', desc: 'Round-the-clock assistance for all your queries', iconPath: <path d="M21 16.42V19.9561C21 20.4811 20.5941 20.9167 20.0705 20.9537C19.6331 20.9846 19.2763 21 19 21C10.1634 21 3 13.8366 3 5C3 4.72371 3.01545 4.36687 3.04635 3.9295C3.08337 3.40588 3.51894 3 4.04386 3H7.5801C7.83678 3 8.05176 3.19442 8.07753 3.4498C8.10067 3.67907 8.12218 3.86314 8.14207 4.00202C8.34435 5.41472 8.75753 6.75936 9.3487 8.00303C9.44359 8.20265 9.38171 8.44159 9.20185 8.57006L7.04355 10.1118C8.35752 13.1811 10.8189 15.6425 13.8882 16.9565L15.4271 14.8019C15.5572 14.6199 15.799 14.5573 16.001 14.6532C17.2446 15.2439 18.5891 15.6566 20.0016 15.8584C20.1396 15.8782 20.3225 15.8995 20.5502 15.9225C20.8056 15.9483 21 16.1633 21 16.42Z" /> },
    { title: 'Feedback & Suggestions', desc: 'Share your thoughts to help us improve', iconPath: <path d="M21 3C21.5523 3 22 3.44772 22 4V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5V4C2 3.44772 2.44772 3 3 3H21Z" /> },
];

export default function ContactPage() {
    useMetadata(
        'Contact Us',
        'Have questions about AuraLivings? Get in touch with our team for admissions guidance, support, or to schedule a visit to our premium student hostels.'
    );
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);
    const mainRef = useRef(null);

    const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.id]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionSuccess(false);
        try { await axios.post('/contact/send/message', formData); } catch (_) { }
        setIsSubmitting(false);
        setSubmissionSuccess(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

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
            gsap.timeline({ delay: 2.5 })
                .from('.c-badge', { y: -30, opacity: 0, duration: 0.7, ease: 'power3.out' })
                .from('.c-title', {
                    y: 100,
                    opacity: 0,
                    duration: 1.5,
                    skewY: 7,
                    ease: 'expo.out'
                }, '-=0.4')
                .from('.c-sub', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');

            /* ── PANELS ── */
            gsap.from('.c-left-panel', {
                x: -100,
                opacity: 0,
                duration: 1.2,
                ease: 'expo.out',
                scrollTrigger: { trigger: '.c-grid', start: 'top 80%' },
            });
            gsap.from('.c-right-panel', {
                x: 100,
                opacity: 0,
                duration: 1.2,
                ease: 'expo.out',
                scrollTrigger: { trigger: '.c-grid', start: 'top 80%' },
            });

            /* ── WHY CARDS ── */
            gsap.from('.why-card', {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.why-cards-grid',
                    start: 'top 85%'
                }
            });
        }, mainRef);
        return () => ctx.kill();
    }, []);

    /* shared outer panel style — cream border + dark interior */
    const panelOuter = 'rounded-2xl sm:rounded-3xl p-[3px] shadow-2xl bg-[#f0ebd8]';
    const panelInner = 'rounded-2xl sm:rounded-3xl bg-[#0d1b2a] h-full p-6 sm:p-8 flex flex-col';

    return (
        <div ref={mainRef} className="w-full min-h-screen bg-[#0d1b2a] overflow-x-hidden">

            {/* ══ HERO ══ */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
                {/* blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#f0ebd8] rounded-full blur-3xl opacity-20" />
                    <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-[#f0ebd8] rounded-full blur-3xl opacity-20" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    {/* heading */}
                    <div className="text-center mb-10 sm:mb-16 space-y-4">
                        <span className="c-badge inline-block px-4 py-1.5 sm:px-5 sm:py-2 bg-[#f0ebd8] text-[#0d1b2a] rounded-full text-[10px] sm:text-sm font-bold uppercase tracking-widest">
                            Get In Touch
                        </span>
                        <h1 className="c-title text-3xl sm:text-5xl md:text-6xl font-black text-[#f0ebd8] leading-tight">
                            Let's Start a{' '}
                            <span className="bg-[#f0ebd8] text-[#0d1b2a] px-2 inline-block">Conversation</span>
                        </h1>
                        <p className="c-sub text-sm sm:text-lg text-[#f0ebd8] opacity-75 max-w-xl mx-auto leading-relaxed">
                            We're here to help you find your perfect home away from home at AuraLivings. Reach out to our team today.
                        </p>
                    </div>

                    {/* ── TWO EQUAL PANELS ── */}
                    <div className="c-grid grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto items-stretch">

                        {/* LEFT — Contact Info panel */}
                        <div className={`c-left-panel ${panelOuter}`}>
                            <div className={panelInner}>
                                <h2 className="text-2xl sm:text-3xl font-bold text-[#f0ebd8] mb-1">Contact Info</h2>
                                <p className="text-[#f0ebd8] opacity-50 text-sm mb-6">Reach us through any of these channels</p>

                                <div className="flex flex-col gap-3 flex-1">
                                    {contactInfo.map((item, i) => (
                                        <div key={i} data-cursor="more" className="flex-1 flex items-center gap-4 bg-[#f0ebd8] rounded-xl p-4 min-h-[4.5rem] transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                                            <div className="flex-shrink-0 w-11 h-11 bg-[#0d1b2a] rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f0ebd8">
                                                    {item.iconPath}
                                                </svg>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-[#0d1b2a] opacity-60">{item.sub}</p>
                                                <h3 className="text-sm sm:text-base font-bold text-[#0d1b2a] leading-snug">{item.title}</h3>
                                                {item.href
                                                    ? <a href={item.href} className="text-xs sm:text-sm font-semibold text-[#0d1b2a] hover:underline break-all">{item.detail}</a>
                                                    : <p className="text-xs sm:text-sm font-semibold text-[#0d1b2a]">{item.detail}</p>
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT — Form panel */}
                        <div className={`c-right-panel ${panelOuter}`}>
                            <div className={panelInner}>
                                <h2 className="text-2xl sm:text-3xl font-bold text-[#f0ebd8] mb-6">Send Us a Message</h2>

                                {submissionSuccess && (
                                    <div className="mb-4 bg-green-500/20 border border-green-400 text-green-300 p-3 rounded-xl text-sm">
                                        Message sent! We'll get back to you soon. ✓
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1">
                                    <div className="grid grid-cols-2 gap-3">
                                        {['name', 'email'].map((f) => (
                                            <input key={f} id={f} value={formData[f]} onChange={handleChange} required
                                                placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                                                className="w-full px-4 py-3 rounded-xl bg-[#f0ebd8] text-[#0d1b2a] placeholder-[#0d1b2a]/60 outline-none focus:ring-2 focus:ring-[#f0ebd8]/40 transition-all text-sm" />
                                        ))}
                                    </div>
                                    {['phone', 'subject'].map((f) => (
                                        <input key={f} id={f} value={formData[f]} onChange={handleChange} required
                                            placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                                            className="w-full px-4 py-3 rounded-xl bg-[#f0ebd8] text-[#0d1b2a] placeholder-[#0d1b2a]/60 outline-none focus:ring-2 focus:ring-[#f0ebd8]/40 transition-all text-sm" />
                                    ))}
                                    <textarea id="message" rows={4} required placeholder="Your Message"
                                        value={formData.message} onChange={handleChange}
                                        className="w-full flex-1 px-4 py-3 rounded-xl bg-[#f0ebd8] text-[#0d1b2a] placeholder-[#0d1b2a]/60 outline-none focus:ring-2 focus:ring-[#f0ebd8]/40 resize-none transition-all text-sm" />
                                    <Magnetic>
                                        <button disabled={isSubmitting}
                                            className="w-full py-3 sm:py-4 rounded-xl bg-[#f0ebd8] text-[#0d1b2a] font-bold text-base hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 mt-auto">
                                            {isSubmitting ? 'Sending…' : 'Send Message'}
                                        </button>
                                    </Magnetic>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ WHY REACH OUT ══ */}
            <section className="why-contact-section w-full bg-[#f0ebd8] py-14 sm:py-20 lg:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="why-contact-heading text-center mb-10 sm:mb-14 space-y-3">
                        <span className="reveal inline-block px-5 py-2 bg-[#0d1b2a] text-[#f0ebd8] rounded-full text-xs sm:text-sm font-semibold">
                            Why Reach Out
                        </span>
                        <h2 className="reveal text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0d1b2a]">We're Here to Help You Succeed</h2>
                        <p className="reveal text-sm sm:text-base text-[#0d1b2a] opacity-75 max-w-xl mx-auto">
                            Your questions and concerns matter to us.
                        </p>
                    </div>
                    <div className="why-cards-grid grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
                        {whyCards.map((card, i) => (
                            <div key={i} data-cursor="more" className="why-card bg-white rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
                                <div className="w-12 h-12 bg-[#0d1b2a] rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#f0ebd8">{card.iconPath}</svg>
                                </div>
                                <h3 className="text-lg font-bold text-[#0d1b2a] mb-1">{card.title}</h3>
                                <p className="text-sm text-[#0d1b2a] opacity-70 leading-relaxed">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
