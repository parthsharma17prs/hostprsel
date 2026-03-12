import React from 'react'
import Magnetic from './Magnetic'

const WhatsAppButton = () => {
    const phoneNumber = '918989140402'
    const whatsappUrl = `https://wa.me/${phoneNumber}`

    return (
        <>
            <style>{`
                @keyframes whatsapp-glow {
                    0% { box-shadow: 0 0 0 0 rgba(240, 235, 216, 0.4); }
                    70% { box-shadow: 0 0 0 15px rgba(240, 235, 216, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(240, 235, 216, 0); }
                }
                .whatsapp-btn-pulse {
                    animation: whatsapp-glow 2.5s infinite;
                }
            `}</style>
            <div className="fixed bottom-8 right-8 z-[90]">
                <Magnetic strength={0.5}>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat on WhatsApp"
                        className="whatsapp-btn-pulse bg-[#0d1b2a] text-[#f0ebd8] border border-[#f0ebd8]/30 rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:border-[#f0ebd8] transition-colors duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 32 32"
                            fill="currentColor"
                            className="w-8 h-8"
                        >
                            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.745 3.046 9.378L1.053 31.502l6.31-2.026A15.89 15.89 0 0 0 16.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.335 22.594c-.39 1.1-1.932 2.013-3.168 2.28-.846.18-1.95.323-5.67-1.218-4.762-1.97-7.826-6.804-8.064-7.118-.23-.314-1.932-2.573-1.932-4.907s1.222-3.482 1.658-3.96c.435-.478.95-.597 1.265-.597.316 0 .63.003.907.016.29.014.68-.11 1.064.812.39.94 1.326 3.236 1.443 3.47.117.236.195.51.04.824-.157.314-.235.51-.47.784-.236.275-.496.614-.708.824-.236.236-.482.49-.207.96.275.47 1.222 2.013 2.625 3.263 1.804 1.607 3.326 2.104 3.796 2.34.47.236.746.196 1.02-.118.275-.314 1.183-1.378 1.498-1.852.314-.478.63-.394 1.064-.236.435.157 2.77 1.306 3.243 1.543.474.236.79.353.907.55.118.195.118 1.14-.272 2.24z" />
                        </svg>
                    </a>
                </Magnetic>
            </div>
        </>
    )
}

export default WhatsAppButton
