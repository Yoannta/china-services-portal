// Main JavaScript File - MABRSON Cinematic Edition
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // --- 0. Initialize Lenis Smooth Scroll ---
    // Neutralize global Lenis if on Études page (managed by etudes.js)
    if (document.body.classList.contains('etudes-page')) {
        console.log('[main.js] Études page detected. Skipping global Lenis init.');
    } else {
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

        window.siteLenis = lenis; // Expose for other scripts if needed

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

        // Use Lenis scroll listener for header instead of native window scroll
        lenis.on('scroll', ({ scroll }) => {
            const header = document.getElementById('site-header');
            if (header) {
                if (scroll > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }

    // --- 1. Header & Navigation ---
    const mobileBtn = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav') || document.querySelector('.et-header__nav');

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }

    // --- 2. Accompaniment Slider (Scene 2) ---
    const accompanimentSection = document.getElementById('scene-2');
    if (accompanimentSection) {
        const slides = accompanimentSection.querySelectorAll('.slide');
        const dots = accompanimentSection.querySelectorAll('.slider-dot');
        let currentSlide = 0;
        let sliderInterval;

        // --- Corrective Fix: Initial State for first slide ---
        if (slides.length > 0) {
            gsap.set(slides[0], { 
                opacity: 1, 
                zIndex: 2, 
                rotateY: 0,
                "--shadow-op": 0,
                "--shine-pos": "-100%"
            });
        }

        function showSlide(index) {
            if (index === currentSlide) return;

            const outgoing = slides[currentSlide];
            const incoming = slides[index];

            // Setup GSAP to handle CSS Variables for pseudo-elements
            gsap.set(incoming, { 
                opacity: 1, 
                rotateY: 0, 
                skewY: 0,
                scale: 1,
                zIndex: 1,
                "--shadow-op": 0,
                "--shine-pos": "-100%"
            });
            gsap.set(outgoing, { zIndex: 2 });

            const tl = gsap.timeline({
                onComplete: () => {
                    slides.forEach(s => s.classList.remove('active'));
                    incoming.classList.add('active');
                    
                    // Cleanup outgoing
                    gsap.set(outgoing, { opacity: 0, rotateY: 0, skewY: 0, "--shadow-op": 0 });
                    gsap.set(incoming, { zIndex: 2 });
                }
            });

            // The Realistic Paper Turn Timeline
            tl.to(outgoing, {
                rotateY: -120,
                skewY: 8,          // The "Bend" effect as paper lifts
                scale: 0.95,       // Slight compression during turn
                duration: 1.4,     // Reverted to old speed
                ease: "power2.inOut"
            }, 0)
            .to(outgoing, {
                "--shadow-op": 0.6, // Page darkens as it turns away
                duration: 0.7,      // Reverted
                ease: "power2.in"
            }, 0)
            .to(outgoing, {
                "--shine-pos": "100%", // Light reflection moves across the fold
                duration: 1.4,         // Reverted
                ease: "power1.inOut"
            }, 0)
            .to(outgoing, {
                opacity: 0,
                duration: 0.4
            }, 1.0); // Reverted

            // Update UI indicators
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
            currentSlide = index;
        }

        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function startSlider() {
            if (!sliderInterval) {
                sliderInterval = setInterval(nextSlide, 2000); // Reduced display time to 2s
            }
        }

        function stopSlider() {
            clearInterval(sliderInterval);
            sliderInterval = null;
        }

        // ScrollTrigger to start/stop slider
        ScrollTrigger.create({
            trigger: accompanimentSection,
            start: "top center",
            end: "bottom center",
            onEnter: startSlider,
            onEnterBack: startSlider,
            onLeave: stopSlider,
            onLeaveBack: stopSlider
        });

        // Dot navigation
        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                stopSlider();
                startSlider();
            });
        });
    }

    // --- 3. Cinematic Background Logic ---
    const scenes = gsap.utils.toArray('.scene');
    const layers = gsap.utils.toArray('.bg-layer');

    function activateLayer(index) {
        layers.forEach((layer, i) => {
            if (i === index) {
                layer.classList.add('active');
            } else {
                layer.classList.remove('active');
            }
        });
    }

    scenes.forEach((scene, i) => {
        ScrollTrigger.create({
            trigger: scene,
            start: "top center",
            end: "bottom center",
            onToggle: self => {
                if (self.isActive) {
                    if (scene.id === 'scene-1') activateLayer(0);
                    if (scene.id === 'scene-2') activateLayer(1);
                    if (scene.id === 'scene-3') activateLayer(2);
                    if (scene.id === 'scene-4') activateLayer(4);
                    if (scene.id === 'scene-5') activateLayer(5);
                }
            }
        });
    });

    // --- 4. Content Animations ---

    // Scene 1: Hero (Mask Reveal)
    const revealTexts = document.querySelectorAll('.mask-text');
    if (revealTexts.length > 0) {
        revealTexts.forEach((text, i) => {
            setTimeout(() => {
                text.classList.add('visible');
            }, 500 + (i * 200)); // Staggered delay starting at 500ms
        });
    }

    // Scene 2: Accompaniment Reveal
    if (document.querySelector(".left-content h2")) {
        gsap.from(".left-content h2, .pulse-line", {
            scrollTrigger: {
                trigger: "#scene-2",
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.3,
            ease: "power3.out"
        });
    }

    if (document.querySelector(".modern-slider-container")) {
        gsap.from(".modern-slider-container", {
            scrollTrigger: {
                trigger: "#scene-2",
                start: "top 80%",
            },
            x: 50,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out"
        });
    }

    // Scene 3: Zig-Zag Story Layout
    const serviceRows = gsap.utils.toArray('.service-row');
    if (serviceRows.length > 0) {
        serviceRows.forEach((row, i) => {
            const titleBlock = row.querySelector('.service-title-block');
            const bubbleCard = row.querySelector('.bubble-card');

            if (!titleBlock || !bubbleCard) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: row,
                    start: "top 90%",
                    end: "center 55%",
                    scrub: 1
                }
            });

            tl.fromTo(titleBlock, { y: 100, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "none" }, 0)
                .fromTo(bubbleCard, { scale: 0.6, autoAlpha: 0, transformOrigin: "center center" }, { scale: 1, autoAlpha: 1, ease: "none" }, 0.1);
        });

        if (serviceRows.length > 1) {
            ScrollTrigger.create({
                trigger: serviceRows[1],
                start: "top center",
                onEnter: () => activateLayer(3),
                onLeaveBack: () => activateLayer(2)
            });
        }
    }

    // 3D Tilt Logic for Bubble Cards
    const bubbleCards = document.querySelectorAll('.bubble-card');
    if (bubbleCards.length > 0) {
        bubbleCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;

                gsap.to(card, { rotateX: rotateX, rotateY: rotateY, duration: 0.4, ease: "power2.out" });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "power2.out" });
            });
        });

        // Parallax for bubble cards
        bubbleCards.forEach((card) => {
            gsap.fromTo(card, { y: 20 }, { y: -20, ease: 'none', scrollTrigger: { trigger: card, start: 'top 85%', end: 'bottom 60%', scrub: 1.2 } });
        });
    }

    // Scene 4: Process
    if (document.querySelector(".step-item") && document.querySelector("#scene-4")) {
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
    }

    // Scene 5: Final CTA
    if (document.querySelector(".reveal-final") && document.querySelector("#scene-5")) {
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
    }

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
            gsap.fromTo(target, { x: -6, opacity: 0.85 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 70%', end: 'top 50%', scrub: false } });
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

        if (document.querySelector('.sourcing-gate')) {
            gsap.fromTo('.sourcing-gate .gate-step', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.2, scrollTrigger: { trigger: '.sourcing-gate', start: 'top 80%', end: 'top 40%' } });
        }

        const flowLines = gsap.utils.toArray('.sourcing-flow .flow-line');
        if (flowLines.length > 0) {
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
    }

    // Transfer Page Parallax
    const transferHero = document.querySelector('.transfer-hero');
    if (transferHero) {
        const layerBack = transferHero.querySelector('.hero-slide.layer-back');
        const layerMid = transferHero.querySelector('.hero-slide.layer-mid');
        const layerFront = transferHero.querySelector('.hero-slide.layer-front');
        const heroContent = transferHero.querySelector('.hero-content');

        if (layerBack) gsap.fromTo(layerBack, { y: 0 }, { y: -60, ease: 'none', scrollTrigger: { trigger: transferHero, start: 'top top', end: 'bottom top', scrub: 1.5 } });
        if (layerMid) gsap.fromTo(layerMid, { y: 0 }, { y: -90, ease: 'none', scrollTrigger: { trigger: transferHero, start: 'top top', end: 'bottom top', scrub: 1.5 } });
        if (layerFront) gsap.fromTo(layerFront, { y: 0 }, { y: -120, ease: 'none', scrollTrigger: { trigger: transferHero, start: 'top top', end: 'bottom top', scrub: 1.5 } });
        if (heroContent) gsap.fromTo(heroContent, { y: 0 }, { y: 70, ease: 'none', scrollTrigger: { trigger: transferHero, start: 'top top', end: 'bottom top', scrub: 1.5 } });

        const trust = document.querySelector('.transfer-trust');
        if (trust) gsap.fromTo(trust, { y: 30 }, { y: -10, ease: 'none', scrollTrigger: { trigger: trust, start: 'top 90%', end: 'bottom 50%', scrub: 1.2 } });

        const calc = document.querySelector('.transfer-calculator .transfer-grid');
        if (calc) gsap.fromTo(calc, { y: 30 }, { y: -30, ease: 'none', scrollTrigger: { trigger: calc, start: 'top 90%', end: 'bottom 40%', scrub: 1.2 } });
    }

    // marketplace
    if (document.querySelector('.marketplace')) {
        const products = gsap.utils.toArray('.product-card');
        const cartCount = document.getElementById('cart-count');
        const cartList = document.getElementById('cart-list');
        const cartTotal = document.getElementById('cart-total');
        const productGrid = document.getElementById('product-grid');
        const filterButtons = document.querySelectorAll('.chip[data-filter]');
        const searchInput = document.getElementById('product-search');
        const searchBtn = document.getElementById('search-btn');
        const sortSelect = document.getElementById('sort');
        const originalOrder = new Map(products.map((card, idx) => [card, idx]));
        let activeFilter = 'all';
        let searchQuery = '';
        let cart = [];

        function renderCart() {
            if (!cartCount) return;
            if (!cart.length) {
                if (cartList) cartList.innerHTML = '<p class="empty-cart">Aucun produit ajoute.</p>';
                cartCount.textContent = '0';
                if (cartTotal) cartTotal.textContent = '$0';
                return;
            }
            if (cartList) cartList.innerHTML = cart.map(item => `<div class="cart-item"><span>${item.name}</span><strong>$${item.price}</strong></div>`).join('');
            cartCount.textContent = String(cart.length);
            const total = cart.reduce((sum, i) => sum + i.price, 0);
            if (cartTotal) cartTotal.textContent = `$${total}`;
        }

        products.forEach(card => {
            card.querySelector('.add-to-cart')?.addEventListener('click', () => {
                cart.push({ name: card.querySelector('h3')?.textContent || 'Produit', price: parseFloat(card.dataset.price || '0') });
                renderCart();
            });
        });
        renderCart();

        function matchesFilter(card) {
            const category = card.dataset.category || 'all';
            const text = (card.textContent || '').toLowerCase();
            const categoryOk = activeFilter === 'all' || category === activeFilter;
            const searchOk = !searchQuery || text.includes(searchQuery);
            return categoryOk && searchOk;
        }

        function compareCards(a, b) {
            const sortValue = (sortSelect && sortSelect.value) || 'popular';
            if (sortValue === 'price-asc') return parseFloat(a.dataset.price || '0') - parseFloat(b.dataset.price || '0');
            if (sortValue === 'price-desc') return parseFloat(b.dataset.price || '0') - parseFloat(a.dataset.price || '0');
            if (sortValue === 'moq') return parseFloat(a.dataset.moq || '0') - parseFloat(b.dataset.moq || '0');
            return (originalOrder.get(a) || 0) - (originalOrder.get(b) || 0);
        }

        function applyFilters() {
            if (!productGrid) return;
            const ordered = [...products].sort(compareCards);
            ordered.forEach(card => {
                const visible = matchesFilter(card);
                card.style.display = visible ? '' : 'none';
                productGrid.appendChild(card);
            });
        }

        if (filterButtons.length) {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    activeFilter = btn.dataset.filter || 'all';
                    applyFilters();
                });
            });
        }

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                searchQuery = searchInput.value.trim().toLowerCase();
                applyFilters();
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchQuery = searchInput.value.trim().toLowerCase();
                }
                applyFilters();
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                applyFilters();
            });
        }

        applyFilters();
    }

    // --- 4. Scroll Progress ---
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        gsap.to(progressBar, { width: "100%", ease: "none", scrollTrigger: { trigger: "body", start: "top top", end: "bottom bottom", scrub: 0.3 } });
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
});

function initSourcingSignature() {
    const sourcingPage = document.querySelector('.sourcing-page');
    if (!sourcingPage) return;

    const scanLine = document.querySelector('.scan-line');
    if (scanLine) {
        gsap.to(scanLine, { top: '100%', ease: 'none', scrollTrigger: { trigger: '.sourcing-radar', start: 'top 80%', end: 'bottom 20%', scrub: 1 } });
    }

    const dataContainer = document.querySelector('.data-stream-container');
    if (dataContainer) {
        const streams = ['SYS_AUTH_OK', 'LOG_BUFF_READY', 'QC_GATE_OPEN', 'VAL_S_043', 'NET_LINK_CHINA', 'DATA_XFER_128', 'GRID_ALIGN_TRUE', 'SHIELD_ACT_98', 'RADAR_SRCH_...'];
        for (let i = 0; i < 30; i++) {
            const item = document.createElement('div');
            item.textContent = streams[Math.floor(Math.random() * streams.length)];
            item.style.marginBottom = '20px';
            dataContainer.appendChild(item);
        }
        gsap.to(dataContainer, { y: -100, duration: 10, repeat: -1, ease: 'none' });
    }
}

// initStudiesSignature removed: managed by etudes.js

function initBridgeSignature() {
    const aboutPage = document.querySelector('.about-page');
    if (!aboutPage) return;

    const glowPath = document.querySelector('#bridge-glow');
    if (glowPath) {
        const length = glowPath.getTotalLength();
        glowPath.style.strokeDasharray = length;
        glowPath.style.strokeDashoffset = length;
        gsap.to(glowPath, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.bridge-section', start: 'top 30%', end: 'bottom 20%', scrub: 1 } });
    }

    const nodes = gsap.utils.toArray('.bridge-node');
    nodes.forEach(node => {
        ScrollTrigger.create({ trigger: node, start: 'top 75%', onEnter: () => node.classList.add('is-active'), onLeaveBack: () => node.classList.remove('is-active') });
    });
}

function initConciergeSignature() {
    const contactPage = document.querySelector('.contact-page');
    if (!contactPage) return;

    const cards = gsap.utils.toArray('.lane-card');
    cards.forEach(card => {
        ScrollTrigger.create({ trigger: card, start: 'top 80%', onEnter: () => card.classList.add('glimmer-sweep'), once: true });
    });

    const inputs = document.querySelectorAll('.concierge-form input, .concierge-form textarea, .concierge-form select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => { gsap.to('.pulse-btn', { scale: 1.02, duration: 0.3, ease: 'power2.out' }); });
        input.addEventListener('blur', () => { gsap.to('.pulse-btn', { scale: 1, duration: 0.3, ease: 'power2.out' }); });
    });

    const form = document.querySelector('.concierge-form');
    if (form) {
        const status = form.querySelector('.form-status');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.reportValidity()) {
                if (status) status.textContent = "Veuillez remplir les champs obligatoires.";
                return;
            }
            if (status) status.textContent = "Merci, votre demande a été enregistrée. Un conseiller vous contacte sous 24h.";
            form.reset();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSourcingSignature();
    initBridgeSignature();
    initConciergeSignature();
});

