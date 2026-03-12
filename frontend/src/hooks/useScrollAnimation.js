import {useEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animate elements into view when they scroll into the viewport.
 * @param {string} selector - CSS selector for target elements
 * @param {object} fromVars - GSAP "from" vars
 * @param {object} toVars - GSAP "to" vars (merged with scrollTrigger)
 * @param {string} containerSelector - optional scoping container selector
 */
export function useScrollAnimation(selector, fromVars={}, toVars={}, containerSelector=null)
{
    useEffect(() =>
    {
        const ctx=gsap.context(() =>
        {
            gsap.fromTo(
                selector,
                {opacity: 0, ...fromVars},
                {
                    opacity: 1,
                    ...toVars,
                    scrollTrigger: {
                        trigger: selector,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                        ...toVars.scrollTrigger,
                    },
                }
            );
        }, containerSelector? document.querySelector(containerSelector):document.body);

        return () => ctx.revert();
    }, []);
}

/** Staggered children animation */
export function useStaggerAnimation(parentSelector, childSelector, fromVars={}, stagger=0.15)
{
    useEffect(() =>
    {
        const ctx=gsap.context(() =>
        {
            const parents=document.querySelectorAll(parentSelector);
            parents.forEach((parent) =>
            {
                const children=parent.querySelectorAll(childSelector);
                gsap.fromTo(
                    children,
                    {opacity: 0, ...fromVars},
                    {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        duration: 0.7,
                        stagger,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: parent,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });
        });
        return () => ctx.revert();
    }, []);
}

export default useScrollAnimation;

