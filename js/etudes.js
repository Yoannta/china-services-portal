/* ==============================================
   ETUDES.JS — Page-specific Animations
   ABRSON | Designer Edition | 2026
   ============================================== */

(function () {
    'use strict';

    // Only run on the studies page
    if (!document.body.classList.contains('etudes-page')) return;

    /* ---- Lenis Smooth Scroll ---- */
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', () => ScrollTrigger.update());

    /* ---- Header scroll state ---- */
    const header = document.querySelector('.et-header');
    lenis.on('scroll', ({ scroll }) => {
        header?.classList.toggle('is-scrolled', scroll > 60);
    });

    /* ---- Hero Entrance Animations ---- */
    const tl = gsap.timeline({ delay: 0.3 });

    // Badge
    tl.to('.et-hero .et-badge', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    });

    // Title lines — staggered
    tl.to('.et-title-line', {
        opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power4.out'
    }, '-=0.4');

    // Subtitle
    tl.to('.et-hero__sub', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    }, '-=0.5');

    // Buttons
    tl.to('.et-hero__actions', {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
    }, '-=0.5');

    // Trust bar
    tl.to('.et-hero__trust', {
        opacity: 1, duration: 0.8, ease: 'power2.out'
    }, '-=0.3');

    /* ---- Parallax on hero BG ---- */
    const heroBg = document.querySelector('.et-hero__bg');
    if (heroBg) {
        gsap.to(heroBg, {
            y: '20%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.et-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    }

    /* ---- Service Mini-Cards Stagger (Horizontal Grid) ---- */
    const miniCards = document.querySelectorAll('.et-service-mini-card');
    if (miniCards.length > 0) {
        ScrollTrigger.create({
            trigger: '.et-services-grid',
            start: 'top 85%',
            onEnter: () => {
                gsap.to(miniCards, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power3.out',
                    onComplete: () => miniCards.forEach(card => card.classList.add('is-visible'))
                });
            }
        });
    }

    /* ---- Domain Cards Stagger (Directory) ---- */
    const domainCards = document.querySelectorAll('.et-domain-card');
    if (domainCards.length > 0) {
        ScrollTrigger.create({
            trigger: '.et-domains-directory',
            start: 'top 85%',
            onEnter: () => {
                gsap.to(domainCards, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out'
                });
            }
        });
    }

    /* ---- Roadmap Steps Stagger ---- */
    const roadmapSteps = document.querySelectorAll('.et-roadmap-step');
    if (roadmapSteps.length > 0) {
        ScrollTrigger.create({
            trigger: '.et-roadmap__timeline',
            start: 'top 80%',
            onEnter: () => {
                gsap.to(roadmapSteps, {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power3.out'
                });
            }
        });
    }

    /* ---- Scholar rows stagger ---- */
    const scholarRows = document.querySelectorAll('.et-scholar-row');
    if (scholarRows.length > 0) {
        ScrollTrigger.create({
            trigger: '.et-scholarships__list',
            start: 'top 85%',
            onEnter: () => {
                gsap.to(scholarRows, {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out'
                });
            }
        });
    }
    const ctaInner = document.querySelector('.et-cta__inner');
    if (ctaInner) {
        ScrollTrigger.create({
            trigger: ctaInner,
            start: 'top 80%',
            onEnter: () => {
                gsap.to(ctaInner, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power4.out',
                    onComplete: () => ctaInner.classList.add('is-visible')
                });
            }
        });
    }

    /* ---- CTA glow pulsing parallax ---- */
    const ctaGlow = document.querySelector('.et-cta__glow');
    if (ctaGlow) {
        gsap.to(ctaGlow, {
            scale: 1.3,
            opacity: 0.8,
            duration: 3,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut'
        });
    }

    /* ---- Domain visual parallax ---- */
    const domainImg = document.querySelector('.et-domains__visual img');
    if (domainImg) {
        gsap.to(domainImg, {
            y: '-8%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.et-domains__visual',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.5
            }
        });
    }

    /* ---- Trust number counter ---- */
    const trustNums = document.querySelectorAll('.et-trust-num');
    trustNums.forEach(num => {
        const target = parseFloat(num.textContent.replace('+', '').replace('%', ''));
        const isPlus = num.textContent.includes('+');
        const isPct = num.textContent.includes('%');

        ScrollTrigger.create({
            trigger: num,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                gsap.from({ val: 0 }, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: function () {
                        num.textContent = (isPlus ? '+' : '') +
                            Math.round(this.targets()[0].val) +
                            (isPct ? '%' : '');
                    }
                });
            }
        });
    });

    /* ---- Lucide icons ---- */
    if (window.lucide) {
        window.lucide.createIcons();
    }

})();
