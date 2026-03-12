import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import gsap from "gsap";
import logo from "../assets/logo.png";
import Magnetic from "./Magnetic";

const Nav = () => {
    const [show, setShow] = useState(true);
    const [lastY, setLastY] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef(null);
    const navigate = useNavigate();

    /* Hide / Show Navbar on Scroll */
    useEffect(() => {
        const controlNavbar = () => {
            setShow(window.scrollY < lastY || window.scrollY < 50);
            setScrolled(window.scrollY > 50);
            setLastY(window.scrollY);
        };
        window.addEventListener("scroll", controlNavbar);
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [lastY]);

    /* GSAP Intro Animation */
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".nav-text", {
                opacity: 0,
                y: -20,
                duration: 1.5,
                stagger: 0.2,
                ease: "power2.inOut",
            });

            gsap.from(".logo", {
                opacity: 0,
                scale: 2,
                duration: 1,
                ease: "bounce.inOut",
            });

            const tl = gsap.timeline();
            tl.from(".logo-text", {
                x: 100,
                opacity: 0,
                duration: 1,
                ease: "bounce.inOut",
            })
                .to(".logo", { x: -100, duration: 1 }, "<")
                .to(".logo", { x: 0, rotate: 360, duration: 1 });
        });

        return () => ctx.revert();
    }, []);

    /* Mobile Menu Animation */
    useEffect(() => {
        if (menuOpen) {
            document.body.classList.add("no-scroll");

            gsap.fromTo(
                ".mobile-menu",
                { x: -300, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5 }
            );

            gsap.fromTo(
                ".menu-overlay",
                { opacity: 0 },
                { opacity: 1, duration: 0.5 }
            );
        } else {
            document.body.classList.remove("no-scroll");
        }
    }, [menuOpen]);

    const closeMenu = () => {
        gsap.to(".mobile-menu", {
            x: -300,
            opacity: 0,
            duration: 0.4,
        });
        gsap.to(".menu-overlay", {
            opacity: 0,
            duration: 0.4,
            onComplete: () => setMenuOpen(false),
        });
    };

    /* Search handlers */
    const toggleSearch = () => {
        if (searchOpen) {
            gsap.to(".search-bar", { width: 0, opacity: 0, duration: 0.3, ease: "power2.inOut", onComplete: () => setSearchOpen(false) });
        } else {
            setSearchOpen(true);
            setTimeout(() => {
                gsap.fromTo(".search-bar", { width: 0, opacity: 0 }, { width: "100%", opacity: 1, duration: 0.35, ease: "power2.out" });
                searchInputRef.current?.focus();
            }, 10);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/hostel?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setSearchOpen(false);
        }
    };

    const handleMobileSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/hostel?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            closeMenu();
        }
    };

    return (
        <nav>
            <div
                className={`fixed top-0 w-full z-50 px-4 sm:px-6 md:px-8 lg:px-12 py-3 sm:py-4 transition-all duration-500 flex items-center justify-between ${show ? "translate-y-0" : "-translate-y-full"
                    } ${scrolled ? "bg-[#f0ebd8]/70 backdrop-blur-lg shadow-xl border-b border-[#0d1b2a]/10" : "bg-[#f0ebd8] border-b-2 border-[#0d1b2a]"}`}
            >
                {/* Hamburger */}
                <div
                    className="flex-shrink-0 lg:hidden cursor-pointer text-[#0d1b2a] hover:text-[#0d1b2a]/80 transition-colors"
                    onClick={() => setMenuOpen(true)}
                >
                    <svg className="w-7 h-7 sm:w-8 sm:h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
                    </svg>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex text-sm xl:text-base space-x-6 xl:space-x-8">
                    {["/", "/hostel", "/contact"].map((path) => (
                        <Magnetic key={path}>
                            <NavLink
                                to={path}
                                className={({ isActive }) =>
                                    isActive
                                        ? "nav-text text-[#0d1b2a] font-bold border-b-2 border-[#0d1b2a] pb-1"
                                        : "nav-text text-[#0d1b2a] hover:text-[#0d1b2a]/70 transition-colors"
                                }
                            >
                                {path === "/"
                                    ? "HOME"
                                    : path.replace("/", "").toUpperCase()}
                            </NavLink>
                        </Magnetic>
                    ))}
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <>
                        <div
                            className="menu-overlay fixed top-0 left-0 w-full h-screen bg-[#0d1b2a]/80 backdrop-blur-sm z-40"
                            onClick={closeMenu}
                        ></div>

                        <div className="mobile-menu lg:hidden fixed top-0 left-0 w-64 sm:w-72 h-screen bg-[#f0ebd8] border-r-2 border-[#0d1b2a] z-50 p-6 sm:p-8 pt-16 sm:pt-20 flex flex-col gap-6">
                            {/* Mobile Search */}
                            <form onSubmit={handleMobileSearch} className="flex items-center border-2 border-[#0d1b2a] bg-white">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search hostels..."
                                    className="flex-1 px-3 py-2 text-sm text-[#0d1b2a] placeholder-[#0d1b2a]/40 outline-none bg-transparent"
                                />
                                <button type="submit" className="px-3 py-2 text-[#0d1b2a] hover:text-[#0d1b2a]/70">
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                </button>
                            </form>

                            {["/", "/hostel", "/contact"].map((path) => (
                                <NavLink
                                    key={path}
                                    to={path}
                                    onClick={closeMenu}
                                    className={({ isActive }) =>
                                        isActive
                                            ? "nav-text text-lg sm:text-xl text-[#0d1b2a] font-bold border-l-4 border-[#0d1b2a] pl-4"
                                            : "nav-text text-lg sm:text-xl text-[#0d1b2a] hover:text-[#0d1b2a]/70 transition-colors pl-4"
                                    }
                                >
                                    {path === "/" ? "HOME" : path.replace("/", "").toUpperCase()}
                                </NavLink>
                            ))}

                            {/* Close Button */}
                            <div
                                onClick={closeMenu}
                                className="absolute text-2xl sm:text-3xl top-4 sm:top-6 right-4 sm:right-6 cursor-pointer text-[#0d1b2a] hover:text-[#0d1b2a]/70 transition-colors"
                            >
                                <svg className="w-7 h-7 sm:w-8 sm:h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path>
                                </svg>
                            </div>
                        </div>
                    </>
                )}

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center pr-2">
                    <Magnetic>
                        <NavLink to="/" className="logo-text flex items-center gap-1 sm:gap-2 font-bold text-[#0d1b2a] tracking-tight hover:opacity-80 transition-opacity">
                            <img src={logo} alt="AuraLivings Logo" className="logo w-8 h-8 sm:w-11 sm:h-11 object-contain rounded-lg" />
                            <span className="text-lg sm:text-xl lg:text-2xl whitespace-nowrap">Aura<span className="opacity-50">Livings</span></span>
                        </NavLink>
                    </Magnetic>
                </div>

                {/* Search */}
                <div className="flex items-center gap-2">
                    {searchOpen && (
                        <form onSubmit={handleSearchSubmit} className="search-bar overflow-hidden">
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name or city..."
                                className="w-36 sm:w-48 lg:w-56 bg-[#0d1b2a] text-[#f0ebd8] placeholder-[#f0ebd8]/50 text-sm px-3 py-1.5 outline-none border border-[#0d1b2a] focus:border-[#f0ebd8]/40 transition-colors"
                                onBlur={() => { if (!searchQuery) { gsap.to(".search-bar", { width: 0, opacity: 0, duration: 0.3, onComplete: () => setSearchOpen(false) }); } }}
                            />
                        </form>
                    )}
                    <button
                        onClick={toggleSearch}
                        className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#0d1b2a] hover:text-[#0d1b2a]/70 transition-colors"
                        aria-label="Search"
                    >
                        <svg className="w-5 h-5 sm:w-[22px] sm:h-[22px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Nav;