import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import logo from "../assets/logo.png";
import Magnetic from "./Magnetic";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const footerRef = useRef(null);
    const { pathname } = useLocation();

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── SEMI-CIRCLES wave-in ── */
            gsap.from('.footer-circle', {
                y: -60, opacity: 0, duration: 1.2, stagger: 0.06, ease: 'bounce.out',
                scrollTrigger: { trigger: '.footer-circles', start: 'top 105%', once: true }
            });

            /* ── FOOTER COLUMNS ── */
            gsap.from('.footer-col', {
                y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
                scrollTrigger: { trigger: '.footer-content', start: 'top 105%', once: true }
            });

            /* ── BOTTOM BAR ── */
            gsap.from('.footer-bottom', {
                y: 20, opacity: 0, duration: 1.2, ease: 'power2.out',
                scrollTrigger: { trigger: '.footer-bottom', start: 'top 105%', once: true }
            });
        }, footerRef);

        const timer = setTimeout(() => ScrollTrigger.refresh(), 200);

        return () => {
            ctx.kill();
            clearTimeout(timer);
        };
    }, [pathname]);

    return (
        <footer ref={footerRef} className="bg-[#0d1b2a] text-[#f0ebd8] relative overflow-hidden">
            {/* SEMI-CIRCLES — responsive count to prevent overflow */}
            <div className="footer-circles w-full overflow-hidden">
                <div className="sm:hidden grid grid-flow-col auto-cols-fr w-full">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="footer-circle aspect-square bg-[#f0ebd8] rounded-b-full" />
                    ))}
                </div>
                <div className="hidden sm:grid lg:hidden grid-flow-col auto-cols-fr w-full">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="footer-circle aspect-square bg-[#f0ebd8] rounded-b-full" />
                    ))}
                </div>
                <div className="hidden lg:grid grid-flow-col auto-cols-fr w-full">
                    {Array.from({ length: 14 }).map((_, i) => (
                        <div key={i} className="footer-circle aspect-square bg-[#f0ebd8] rounded-b-full" />
                    ))}
                </div>
            </div>

            {/* FOOTER CONTENT */}
            <div className="footer-content max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="footer-col">
                    <div className="flex items-center gap-3 mb-3">
                        <img src={logo} alt="AuraLivings Logo" className="w-10 h-10 object-contain rounded-lg" />
                        <h2 className="text-2xl font-bold">AuraLivings</h2>
                    </div>
                    <p className="text-sm opacity-80 leading-relaxed">
                        Premium student living for those who refuse to settle. Design-forward spaces, vibrant community, and every amenity you need to thrive.
                    </p>
                </div>

                <div className="footer-col">
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm opacity-90">
                        <li><Link to="/" className="hover:underline hover:opacity-70 transition-opacity">Home</Link></li>
                        <li><Link to="/hostel" className="hover:underline hover:opacity-70 transition-opacity">Hostels</Link></li>
                        <li><Link to="/contact" className="hover:underline hover:opacity-70 transition-opacity">Contact</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h3 className="text-lg font-semibold mb-4">Contact</h3>
                    <ul className="space-y-2 text-sm opacity-90">
                        <li>Madhu Milan, Chhawani Road, Indore</li>
                        <li><a href="tel:+918989140402" className="hover:underline">+91 8989140402</a></li>
                        <li><a href="tel:+919111485959" className="hover:underline">+91 91114 85959</a></li>
                        <li><a href="mailto:auralivings20@gmail.com" className="hover:underline">auralivings20@gmail.com</a></li>
                    </ul>
                    <div className="flex gap-4 mt-4">
                        {/* Instagram */}
                        <Magnetic>
                            <a href="https://www.instagram.com/auralivings__?igsh=ODM3cWs3aHliMzJm" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Instagram">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 1.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm4.75-2.75a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" />
                                </svg>
                            </a>
                        </Magnetic>
                        {/* Facebook */}
                        <Magnetic>
                            <a href="https://www.facebook.com/share/1GYpSSa6yt/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Facebook">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12Z" />
                                </svg>
                            </a>
                        </Magnetic>
                        {/* WhatsApp */}
                        <Magnetic>
                            <a href="https://wa.me/918989140402" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="WhatsApp">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                </svg>
                            </a>
                        </Magnetic>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="footer-bottom border-t border-[#f0ebd8]/30 text-center py-4 text-sm opacity-70">
                © {new Date().getFullYear()} AuraLivings. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
