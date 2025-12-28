import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createIcons, Instagram, Twitter, Facebook, Mail, Users, Heart, BookOpen, MessageCircle, Globe, Calendar, MapPin } from 'lucide';

// Initialize Lucide Icons
createIcons({
    icons: {
        Instagram,
        Twitter,
        Facebook,
        Mail,
        Users,
        Heart,
        BookOpen,
        MessageCircle,
        Globe,
        Calendar,
        MapPin
    }
});

gsap.registerPlugin(ScrollTrigger);

// Audio Assets
const interactionSound = new Audio('assets\Sound\interaction_soft.mp3');
const ambientSound = new Audio('assets\Sound\ambient_calm.mp3');
ambientSound.loop = true;
ambientSound.volume = 0.2;

// Scroll Progress Indicator
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scroll-progress').style.width = scrolled + '%';
});

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    // Hero Animations
    const tl = gsap.timeline();
    
    tl.to('.reveal-text', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.2
    })
    .to('.fade-in', {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        stagger: 0.2
    }, '-=0.5');

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('stat-card')) {
                    animateStats(entry.target);
                } else {
                    gsap.to(entry.target, {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'power3.out'
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .stat-card, .init-card').forEach(el => {
        gsap.set(el, { opacity: 0, y: 40 });
        observer.observe(el);
    });

    // Stories Orbit Animation
    gsap.utils.toArray('.story-orb').forEach((orb) => {
        const ring = orb.querySelector('.orb-ring');
        if (!ring) return;

        gsap.set(ring, { xPercent: 70, rotate: 10, opacity: 0, transformOrigin: '50% 50%' });

        gsap.timeline({
            scrollTrigger: {
                trigger: orb,
                start: 'top 80%',
                end: 'bottom 40%',
                scrub: true
            }
        })
        .to(ring, {
            xPercent: 0,
            rotate: 0,
            opacity: 1,
            ease: 'power2.out'
        })
        .to(ring, {
            xPercent: -70,
            rotate: -8,
            opacity: 0.85,
            ease: 'power2.in'
        });
    });

    // Stats Counter Animation
    function animateStats(card) {
        const numberEl = card.querySelector('.stat-number');
        const target = parseInt(numberEl.getAttribute('data-target'));
        const obj = { value: 0 };
        
        gsap.to(card, { opacity: 1, y: 0, duration: 0.8 });
        
        gsap.to(obj, {
            value: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                numberEl.textContent = Math.floor(obj.value).toLocaleString() + '+';
            }
        });
    }

    // Page Switching Logic
    const navTriggers = document.querySelectorAll('.nav-trigger');
    const pages = document.querySelectorAll('.page-section');

    function switchPage(pageId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        pages.forEach(p => {
            p.classList.remove('active');
            if (p.id === `${pageId}-page`) {
                p.classList.add('active');
                
                // Re-trigger animations for the new page
                const elements = p.querySelectorAll('.reveal-text, .fade-in, .fade-up, .stat-card');
                elements.forEach(el => {
                    gsap.set(el, { opacity: 0, y: 30 });
                    if (el.classList.contains('stat-card')) {
                        animateStats(el);
                    } else {
                        gsap.to(el, {
                            opacity: 1,
                            y: 0,
                            duration: 1,
                            delay: 0.1,
                            ease: 'power3.out'
                        });
                    }
                });
            }
        });

        // Close mobile sub-menu if open
        document.querySelector('.donate-fab-wrapper').classList.remove('active');
    }

    navTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const section = trigger.getAttribute('data-section');
            if (section) {
                switchPage(section);
            }
        });
    });

    // Interaction Sound Logic
    const clickableElements = document.querySelectorAll('button, .nav-links a, .floating-donate-pill, .sub-menu-item, .nav-trigger');
    clickableElements.forEach(el => {
        el.addEventListener('click', () => {
            interactionSound.currentTime = 0;
            interactionSound.play().catch(() => {}); // Catch browser auto-play blocks
        });
    });

    // Mobile FAB Toggle
    const fabWrapper = document.querySelector('.donate-fab-wrapper');
    const mainFab = document.querySelector('.floating-donate-pill');
    
    mainFab.addEventListener('click', (e) => {
        e.stopPropagation();
        fabWrapper.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        fabWrapper.classList.remove('active');
    });

    // Start ambient music on first interaction
    const startAudio = () => {
        ambientSound.play().catch(() => {});
        document.removeEventListener('click', startAudio);
        document.removeEventListener('touchstart', startAudio);
    };
    document.addEventListener('click', startAudio);
    document.addEventListener('touchstart', startAudio);
});

// Smooth Parallax for Hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImg = document.querySelector('.hero-bg img');
    if (heroImg) {
        heroImg.style.transform = `translateY(${scrolled * 0.4}px)`;
    }
});

// Donation FAB Wrapper Behavior
const donateFabWrapper = document.querySelector('.donate-fab-wrapper');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        donateFabWrapper.style.opacity = '1';
        donateFabWrapper.style.pointerEvents = 'all';
        donateFabWrapper.style.transform = 'translateY(0)';
    } else {
        donateFabWrapper.style.opacity = '0';
        donateFabWrapper.style.pointerEvents = 'none';
        donateFabWrapper.style.transform = 'translateY(20px)';
    }
});

// Micro-interactions for Cards
document.querySelectorAll('.init-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.03, duration: 0.4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, duration: 0.4, ease: 'power2.out' });
    });
});