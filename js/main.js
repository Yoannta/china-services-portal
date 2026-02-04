// Main JavaScript File - MABRSON Cinematic Edition
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Initialize Lenis Smooth Scroll ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP with Lenis
    lenis.on('scroll', (e) => {
        ScrollTrigger.update();

        // --- Liquid Depth Logic ---
        const velocity = e.velocity;
        const liquidLayers = document.querySelectorAll('.liquid-layer');

        liquidLayers.forEach(layer => {
            const viscosity = parseFloat(layer.dataset.viscosity) || 0.5;
            // Force adjustment: higher viscosity = more deformation resistance? 
            // Actually let's use viscosity as a multiplier for the effect for now.
            const skew = Math.max(-1.5, Math.min(1.5, velocity * 0.1 * viscosity));

            gsap.to(layer, {
                skewY: skew,
                duration: 0.4,
                ease: "power2.out",
                overwrite: true
            });
        });
    });

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0); // Disable lag smoothing for instant response

    // --- 1. Header & Navigation ---
    const header = document.getElementById('site-header');
    const mobileBtn = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');

    // Use Lenis scroll listener for header instead of native window scroll
    lenis.on('scroll', ({ scroll }) => {
        if (scroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // --- 2. Cinematic Background Logic ---
    const scenes = gsap.utils.toArray('.scene');
    const layers = gsap.utils.toArray('.bg-layer');

    // Function to handle background management
    function activateLayer(index) {
        layers.forEach((layer, i) => {
            if (i === index) {
                layer.classList.add('active');
            } else {
                layer.classList.remove('active');
            }
        });
    }

    // Individual Scene Triggers for Backgrounds
    scenes.forEach((scene, i) => {
        ScrollTrigger.create({
            trigger: scene,
            start: "top center",
            end: "bottom center",
            onToggle: self => {
                if (self.isActive) {
                    // Logic for specific layers based on scene ID
                    if (scene.id === 'scene-1') activateLayer(0);
                    if (scene.id === 'scene-2') activateLayer(1);
                    if (scene.id === 'scene-3') {
                        // Special handling for scene 3 inner transitions
                        activateLayer(2); // Start with Factory
                    }
                    if (scene.id === 'scene-4') activateLayer(4);
                    if (scene.id === 'scene-5') activateLayer(5);
                }
            }
        });
    });

    // --- 3. Content Animations (Scene by Scene) ---

    // Scene 1: Hero (Mask Reveal)
    const revealTexts = document.querySelectorAll('.mask-text');
    revealTexts.forEach((text, i) => {
        setTimeout(() => {
            text.classList.add('visible');
        }, 500 + (i * 200)); // Staggered delay starting at 500ms
    });

    // Scene 2: Problems
    gsap.from(".problem-list li", {
        scrollTrigger: {
            trigger: "#scene-2",
            start: "top 80%",
            end: "top 40%",
            scrub: 1.5
        },
        x: -50,
        opacity: 0,
        stagger: 0.2
    });

    // Scene 3: Zig-Zag Story Layout (Scrubbed / Film-like Control)
    const serviceRows = gsap.utils.toArray('.service-row');
    serviceRows.forEach((row, i) => {
        const titleBlock = row.querySelector('.service-title-block');
        const bubbleCard = row.querySelector('.bubble-card');

        if (!titleBlock || !bubbleCard) return;

        // Timeline linked to scroll bar (Scrubbing)
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: row,
                start: "top 90%",  // Animation starts when row enters bottom
                end: "center 55%", // Animation completes when row reaches middle
                scrub: 1           // 1s lag for smooth "film reel" feel
            }
        });

        // 1. Title Appears (Driven by scroll)
        tl.fromTo(titleBlock,
            { y: 100, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, ease: "none" },
            0 // Start at timeline start
        )

            // 2. Bubble Grows (Driven by scroll, slightly after title)
            .fromTo(bubbleCard,
                { scale: 0.6, autoAlpha: 0, transformOrigin: "center center" },
                {
                    scale: 1,
                    autoAlpha: 1,
                    ease: "none" /* Elastic ease is bad for scrubbing, linear is getting better control */
                },
                0.1 // Slight offset relative to scroll progress
            );
    });

    // Swap Scene 3 BG midway (Linked to the middle row)
    if (serviceRows.length > 1) {
        ScrollTrigger.create({
            trigger: serviceRows[1],
            start: "top center",
            onEnter: () => activateLayer(3), // Switch to University
            onLeaveBack: () => activateLayer(2) // Back to Factory
        });
    }
    // 3D Tilt Logic for Bubble Cards
    const bubbleCards = document.querySelectorAll('.bubble-card');
    bubbleCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5; /* Reduced tilt for bubbles */
            const rotateY = ((x - centerX) / centerX) * 5;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        });
    });

    // Scene 4: Process
    gsap.from(".step-item", {
        scrollTrigger: {
            trigger: "#scene-4",
            start: "top 80%",
            end: "top 40%",
            scrub: 1.5
        },
        y: 30,
        opacity: 0,
        stagger: 0.2
    });


    // Transfer Page: Squarespace-style Parallax Scrubbing
    const transferHero = document.querySelector('.transfer-hero');
    if (transferHero) {
        const layerBack = transferHero.querySelector('.hero-slide.layer-back');
        const layerMid = transferHero.querySelector('.hero-slide.layer-mid');
        const layerFront = transferHero.querySelector('.hero-slide.layer-front');
        const heroContent = transferHero.querySelector('.hero-content');

        if (layerBack) {
            gsap.fromTo(layerBack,
                { y: 0 },
                { y: -60, ease: 'none', scrollTrigger: { trigger: transferHero, start: 'top top', end: 'bottom top', scrub: 1.5 } }
            );
        }

        if (layerMid) {
            gsap.fromTo(layerMid,
                { y: 0 },
                { y: -90, ease: 'none', scrollTrigger: { trigger: transferHero, start: 'top top', end: 'bottom top', scrub: 1.5 } }
            );
        }

        if (layerFront) {
            gsap.fromTo(layerFront,
                { y: 0 },
                { y: -120, ease: 'none', scrollTrigger: { trigger: transferHero, start: 'top top', end: 'bottom top', scrub: 1.5 } }
            );
        }

        if (heroContent) {
            gsap.fromTo(heroContent,
                { y: 0 },
                { y: 70, ease: 'none', scrollTrigger: { trigger: transferHero, start: 'top top', end: 'bottom top', scrub: 1.5 } }
            );
        }

        const trust = document.querySelector('.transfer-trust');
        if (trust) {
            gsap.fromTo(trust,
                { y: 30 },
                { y: -10, ease: 'none', scrollTrigger: { trigger: trust, start: 'top 90%', end: 'bottom 50%', scrub: 1.2 } }
            );
        }

        const calc = document.querySelector('.transfer-calculator .transfer-grid');
        if (calc) {
            gsap.fromTo(calc,
                { y: 30 },
                { y: -30, ease: 'none', scrollTrigger: { trigger: calc, start: 'top 90%', end: 'bottom 40%', scrub: 1.2 } }
            );
        }

        // Parallax on solution cards
        const transferCards = gsap.utils.toArray('.transfer-page .services-grid .service-card');
        transferCards.forEach((card) => {
            gsap.fromTo(card,
                { y: 20 },
                { y: -20, ease: 'none', scrollTrigger: { trigger: card, start: 'top 85%', end: 'bottom 60%', scrub: 1.2 } }
            );
        });
    }

    // Home Page: Parallax depth for hero layers + solution cards
    if (document.body.classList.contains('cinematic-home')) {
        const scene1 = document.querySelector('#scene-1');
        const layer1 = document.querySelector('.bg-layer.layer-1');
        const layer2 = document.querySelector('.bg-layer.layer-2');
        const heroBlock = document.querySelector('#scene-1 .text-block');

        if (scene1 && layer1) {
            gsap.fromTo(layer1,
                { y: 0 },
                { y: -80, ease: 'none', scrollTrigger: { trigger: scene1, start: 'top top', end: 'bottom top', scrub: 1.5 } }
            );
        }

        if (scene1 && layer2) {
            gsap.fromTo(layer2,
                { y: 0 },
                { y: -50, ease: 'none', scrollTrigger: { trigger: scene1, start: 'top top', end: 'bottom top', scrub: 1.5 } }
            );
        }

        if (scene1 && heroBlock) {
            gsap.fromTo(heroBlock,
                { y: 0 },
                { y: 60, ease: 'none', scrollTrigger: { trigger: scene1, start: 'top top', end: 'bottom top', scrub: 1.5 } }
            );
        }

        const bubbleCards = gsap.utils.toArray('.service-card.bubble-card');
        bubbleCards.forEach((card) => {
            gsap.fromTo(card,
                { y: 20 },
                { y: -20, ease: 'none', scrollTrigger: { trigger: card, start: 'top 85%', end: 'bottom 60%', scrub: 1.2 } }
            );
        });
    }


    // Depth blur toggle on scroll (subtle)
    const depthTargets = gsap.utils.toArray('.transfer-page .service-card, .transfer-page .transfer-card, .cinematic-home .service-card.bubble-card');
    depthTargets.forEach((el) => {
        el.classList.add('depth-blur');
        ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            end: 'bottom 50%',
            onEnter: () => el.classList.remove('is-distant'),
            onLeave: () => el.classList.add('is-distant'),
            onEnterBack: () => el.classList.remove('is-distant'),
            onLeaveBack: () => el.classList.add('is-distant')
        });
    });

    // Scene 5: Final CTA
    gsap.from(".reveal-final", {
        scrollTrigger: {
            trigger: "#scene-5",
            start: "top center",
            end: "bottom center",
            scrub: 1.5
        },
        scale: 0.8,
        opacity: 0
    });


    // Signal Glitch Clean (Accueil)
    if (document.body.classList.contains('cinematic-home')) {
        const signalSections = gsap.utils.toArray('.signal-section');
        signalSections.forEach((section) => {
            if (!section.querySelector('.signal-layer')) {
                const layer = document.createElement('div');
                layer.className = 'signal-layer';
                section.appendChild(layer);
            }

            ScrollTrigger.create({
                trigger: section,
                start: 'top 70%',
                end: 'top 40%',
                onEnter: () => section.classList.add('is-signal'),
                onLeave: () => section.classList.remove('is-signal'),
                onEnterBack: () => section.classList.add('is-signal'),
                onLeaveBack: () => section.classList.remove('is-signal')
            });

            const target = section.querySelector('.content-wrapper') || section;
            gsap.fromTo(target,
                { x: -6, opacity: 0.85 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 70%',
                        end: 'top 50%',
                        scrub: false
                    }
                }
            );
        });
    }


    // Sourcing Animations
    if (document.body.classList.contains('premium-site') && document.querySelector('.sourcing-page')) {
        const radarCards = gsap.utils.toArray('.sourcing-radar .radar-card');
        radarCards.forEach((card) => {
            ScrollTrigger.create({
                trigger: card,
                start: 'top 80%',
                end: 'bottom 60%',
                onEnter: () => card.classList.add('is-active'),
                onLeave: () => card.classList.remove('is-active'),
                onEnterBack: () => card.classList.add('is-active'),
                onLeaveBack: () => card.classList.remove('is-active')
            });
        });

        gsap.fromTo('.sourcing-gate .gate-step',
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                stagger: 0.2,
                scrollTrigger: {
                    trigger: '.sourcing-gate',
                    start: 'top 80%',
                    end: 'top 40%'
                }
            }
        );

        const flowLines = gsap.utils.toArray('.sourcing-flow .flow-line');
        ScrollTrigger.create({
            trigger: '.sourcing-flow',
            start: 'top 80%',
            end: 'bottom 50%',
            onEnter: () => flowLines.forEach(l => l.classList.add('is-pulse')),
            onLeave: () => flowLines.forEach(l => l.classList.remove('is-pulse')),
            onEnterBack: () => flowLines.forEach(l => l.classList.add('is-pulse')),
            onLeaveBack: () => flowLines.forEach(l => l.classList.remove('is-pulse'))
        });
    }


    // Marketplace Sourcing
    if (document.querySelector('.marketplace')) {
        const grid = document.getElementById('product-grid');
        const searchInput = document.getElementById('product-search');
        const chips = document.querySelectorAll('.marketplace-toolbar .chip');
        const cartCount = document.getElementById('cart-count');
        const cartList = document.getElementById('cart-list');
        const cartTotal = document.getElementById('cart-total');
        const products = gsap.utils.toArray('.product-card');
        let cart = [];

        function renderCart() {
            if (!cart.length) {
                cartList.innerHTML = '<p class="empty-cart">Aucun produit ajoute.</p>';
                cartCount.textContent = '0';
                cartTotal.textContent = '$0';
                return;
            }
            cartList.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <strong>$${item.price}</strong>
                </div>
            `).join('');
            cartCount.textContent = String(cart.length);
            const total = cart.reduce((sum, i) => sum + i.price, 0);
            cartTotal.textContent = `$${total}`;
        }

        function filterProducts() {
            const query = (searchInput?.value || '').toLowerCase();
            const active = document.querySelector('.marketplace-toolbar .chip.active')?.dataset.filter || 'all';
            products.forEach(card => {
                const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
                const category = card.dataset.category || '';
                const match = (active === 'all' || category === active) && name.includes(query);
                card.style.display = match ? 'flex' : 'none';
            });
        }

        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                filterProducts();
            });
        });

        searchInput?.addEventListener('input', filterProducts);

        products.forEach(card => {
            card.querySelector('.add-to-cart')?.addEventListener('click', () => {
                cart.push({
                    name: card.querySelector('h3')?.textContent || 'Produit',
                    price: parseFloat(card.dataset.price || '0')
                });
                renderCart();
            });
        });

        renderCart();
    }

    // --- 4. Scroll Progress ---
    const progressBar = document.querySelector('.scroll-progress');
    gsap.to(progressBar, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3
        }
    });

    // Lucide Icons initialization (fallback)
    if (window.lucide) {
        window.lucide.createIcons();
    }
});


// --- Sourcing Page Unique Logic ---
function initSourcingSignature() {
    const sourcingPage = document.querySelector('.sourcing-page');
    if (!sourcingPage) return;

    // 1. Radar Scan Line Animation (Scroll-driven)
    const scanLine = document.querySelector('.scan-line');
    if (scanLine) {
        gsap.to(scanLine, {
            top: '100%',
            ease: 'none',
            scrollTrigger: {
                trigger: '.sourcing-radar',
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1
            }
        });
    }

    // 2. Data Stream Overlay Population
    const dataContainer = document.querySelector('.data-stream-container');
    if (dataContainer) {
        const streams = [
            'SYS_AUTH_OK', 'LOG_BUFF_READY', 'QC_GATE_OPEN',
            'VAL_S_043', 'NET_LINK_CHINA', 'DATA_XFER_128',
            'GRID_ALIGN_TRUE', 'SHIELD_ACT_98', 'RADAR_SRCH_...'
        ];

        for (let i = 0; i < 30; i++) {
            const item = document.createElement('div');
            item.textContent = streams[Math.floor(Math.random() * streams.length)];
            item.style.marginBottom = '20px';
            dataContainer.appendChild(item);
        }

        // Slow vertical crawl
        gsap.to(dataContainer, {
            y: -100,
            duration: 10,
            repeat: -1,
            ease: 'none'
        });
    }
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', initSourcingSignature);



// --- Studies Page Unique Logic (The Golden Path) ---
function initStudiesSignature() {
    const studiesPage = document.querySelector('.studies-page');
    if (!studiesPage) return;

    // 1. SVG Path Drawing on Scroll
    const path = document.querySelector('#master-path');
    if (path) {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;

        gsap.to(path, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.studies-detail-section',
                start: 'top 40%',
                end: 'bottom 80%',
                scrub: 1
            }
        });
    }

    // 2. Step Reveal Sync
    const steps = gsap.utils.toArray('.path-step');
    steps.forEach((step, i) => {
        ScrollTrigger.create({
            trigger: step,
            start: 'top 80%',
            onEnter: () => step.classList.add('is-active'),
            onLeaveBack: () => step.classList.remove('is-active')
        });
    });

    // 3. Medallion Internal Parallax
    const medallions = gsap.utils.toArray('.medallion-inner span');
    medallions.forEach(span => {
        gsap.to(span, {
            y: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: span,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });
}

// Add to list of initializers
document.addEventListener('DOMContentLoaded', initStudiesSignature);



// --- Contact Page Unique Logic (Conciergerie Pulse) ---
function initConciergeSignature() {
    const contactPage = document.querySelector('.contact-page');
    if (!contactPage) return;

    // 1. Beacon Activation (Subtle)
    const beaconCard = document.querySelector('.lane-card.beacon-ready');
    if (beaconCard) {
        setTimeout(() => {
            beaconCard.classList.add('beacon-active');
        }, 1500);
    }

    // 2. Glimmer Sweep on Scroll (Single)
    const cards = gsap.utils.toArray('.lane-card');
    cards.forEach(card => {
        ScrollTrigger.create({
            trigger: card,
            start: 'top 80%',
            onEnter: () => card.classList.add('glimmer-sweep'),
            once: true
        });
    });

    // 3. Form Glimmer Effect on Focus
    const inputs = document.querySelectorAll('.concierge-form input, .concierge-form textarea, .concierge-form select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            gsap.to('.pulse-btn', { scale: 1.02, duration: 0.3, ease: 'power2.out' });
        });
        input.addEventListener('blur', () => {
            gsap.to('.pulse-btn', { scale: 1, duration: 0.3, ease: 'power2.out' });
        });
    });
}

document.addEventListener('DOMContentLoaded', initConciergeSignature);



// --- About Page Unique Logic (Bridge of Trust) ---
function initBridgeSignature() {
    const aboutPage = document.querySelector('.about-page');
    if (!aboutPage) return;

    // 1. Bridge Path Drawing
    const glowPath = document.querySelector('#bridge-glow');
    if (glowPath) {
        const length = glowPath.getTotalLength();
        glowPath.style.strokeDasharray = length;
        glowPath.style.strokeDashoffset = length;

        gsap.to(glowPath, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.bridge-section',
                start: 'top 30%',
                end: 'bottom 20%',
                scrub: 1
            }
        });
    }

    // 2. Node Reveal Sync
    const nodes = gsap.utils.toArray('.bridge-node');
    nodes.forEach(node => {
        ScrollTrigger.create({
            trigger: node,
            start: 'top 75%',
            onEnter: () => node.classList.add('is-active'),
            onLeaveBack: () => node.classList.remove('is-active')
        });
    });
}

document.addEventListener('DOMContentLoaded', initBridgeSignature);

