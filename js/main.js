/**
 * ==========================================================================
 * KESHAVEDA // MAIN APPLICATION SCRIPT
 * Navigation, Video Controls, Procedural Ambient Sound,
 * Animated Ingredient Showcase, Before/After Slider, Reviews, FAQ & Forms
 * ==========================================================================
 */

// 5 Sacred Pancha-Botanicals Data
const BOTANICAL_INGREDIENTS = {
    amla: {
        botanicalName: 'Emblica Officinalis',
        commonName: 'Amla (Indian Gooseberry)',
        sanskrit: 'आमलकी (Amalaki - "The Sustainer")',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
        description: 'Venerated in the Charaka Samhita as the supreme Rasayana for hair. Amla harbors the highest bio-available concentration of natural Vitamin C on Earth, neutralizing free radicals that attack the scalp papillary matrix and preventing premature melanin degradation (silvering).',
        compounds: 'Ellagic Acid • Gallic Acid • Emblicanin A & B',
        dosha: 'Tridoshic (Soothes Pitta & Vata)',
        partUsed: 'Wild Fresh Berries (Cold-Pressed Juice)',
        benefits: [
            'Stimulates follicular collagen synthesis for 3x root anchorage',
            'Inhibits 5α-reductase, reducing DHT-induced crown thinning',
            'Natural antioxidant shield preserving deep natural hair pigment'
        ]
    },
    bhringraj: {
        botanicalName: 'Eclipta Alba',
        commonName: 'Bhringraj (The King of Hair)',
        sanskrit: 'भृङ्गराज (Kesha-Raja - "King of Tresses")',
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=700&q=80',
        description: 'Known across ancient India as the sovereign monarch of hair revitalization. Clinical pharmacological studies confirm that Bhringraj extracts convert dormant telogen hair follicles back into rapid anagen growth phases more effectively than 2% minoxidil, without artificial chemicals.',
        compounds: 'Wedelolactone • Demethylwedelolactone • Ecliptine',
        dosha: 'Balances Pitta (Draws out root heat)',
        partUsed: 'Whole Wild Harvested Herb & Leaves',
        benefits: [
            'Reactivates slumbering hair follicles at the scalp dermal papilla',
            'Accelerates micro-capillary circulation directly to hair bulbs',
            'Calms fiery scalp tension and prevents stress-related hair fallout'
        ]
    },
    neem: {
        botanicalName: 'Azadirachta Indica',
        commonName: 'Neem (Divine Healer)',
        sanskrit: 'निम्ब (Nimba - "Giver of Good Health")',
        image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=700&q=80',
        description: 'An ancient purifying panacea. Rich in azadirachtin, nimbidin, and essential fatty acids, Neem cleanses the scalp microbiome of Malassezia yeasts responsible for stubborn dandruff, while cooling inflamed roots and unblocking clogged sebaceous ducts.',
        compounds: 'Azadirachtin • Nimbidin • Quercetin • Nimbolide',
        dosha: 'Pacifies Kapha & Pitta (Clarifying & Cooling)',
        partUsed: 'Fresh Organic Tender Leaves & Bark',
        benefits: [
            'Eradicates stubborn flaking, dry scales, and scalp itchiness',
            'Cleanses oxidized sebum plugs that choke emerging fine hair strands',
            'Strong antimicrobial barrier preserving scalp microbiome harmony'
        ]
    },
    hibiscus: {
        botanicalName: 'Hibiscus Rosa-Sinensis',
        commonName: 'Hibiscus (Japa Pushpa)',
        sanskrit: 'जपापुष्प (Japa Pushpa - "Sacred Crimson Lotus")',
        image: 'https://images.unsplash.com/photo-1550950158-d0d960dff51b?auto=format&fit=crop&w=700&q=80',
        description: 'Celebrated in Ayurvedic beauty rituals for imparting mirror-like silkiness and lustrous dark sheen. Packed with natural amino acids, alpha-hydroxy acids (AHAs), and mucilage, Hibiscus forms a weightless botanical sheath over the cuticle, locking in vital moisture.',
        compounds: 'Natural Amino Acids • Anthocyanins • Plant Mucilage',
        dosha: 'Balances Pitta & Vata (Deeply Conditioning)',
        partUsed: 'Fresh Crimson Petals & Calyx',
        benefits: [
            'Infuses natural keratin-building amino acids into frayed cuticles',
            'Imparts glass-like reflective shine and silky comb slip',
            'Prevents moisture dehydration in high heat and dry climates'
        ]
    },
    aloe: {
        botanicalName: 'Aloe Barbadensis Miller',
        commonName: 'Aloe Vera (Kumari)',
        sanskrit: 'कुमारी (Kumari - "Youthful Radiance")',
        image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=700&q=80',
        description: 'Revered for its youthful regenerative vitality. Kumari contains specialized proteolytic enzymes that naturally slough away dead cellular buildup on the scalp, while its acemannan polysaccharides saturate deep follicular tissues with bio-hydration without greasy heaviness.',
        compounds: 'Acemannan • Proteolytic Enzymes • Choline • Vitamins A, C, E',
        dosha: 'Tridoshic Harmonizer (Cooling & Hydrating)',
        partUsed: 'Pure Inner Leaf Fillet Gel (Cold-Extracted)',
        benefits: [
            'Gently digests dead epithelial cells, clarifying follicle openings',
            'Matches optimal natural scalp pH (5.5) for cuticle smoothing',
            'Quenches dehydrated, brittle strands with non-greasy moisture'
        ]
    }
};

// Customer Reviews Database
const INITIAL_REVIEWS = [
    {
        id: 1,
        name: 'Aishwarya R.',
        location: 'London, UK',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        hairType: 'Fine & Thinning Hair',
        rating: 5,
        category: 'thinning',
        text: '“I was losing clumps of hair after giving birth. Within 4 weeks of the Keshatel Herbal Hair Oil warm ritual, the excessive shedding completely stopped, and baby hairs started sprouting along my hairline. Smells heavenly like an ancient temple sanctum.”',
        date: '3 days ago',
        helpful: 142
    },
    {
        id: 2,
        name: 'Elena Rostova',
        location: 'Geneva, Switzerland',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        hairType: 'Color-Treated 2B Waves',
        rating: 5,
        category: 'shine',
        text: '“Years of blonde bleaching left my hair like straw. This elixir is pure alchemy. My strands have never felt so silky, heavy in the best way, and genuinely strong. The Kansa wand scalp massage before bed gives the best sleep of my life.”',
        date: '1 week ago',
        helpful: 98
    },
    {
        id: 3,
        name: 'Dr. Arjun Mehta',
        location: 'San Francisco, CA',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        hairType: 'Dry & Itchy Scalp',
        rating: 5,
        category: 'scalp',
        text: '“As a dermatologist, I am very skeptical of botanical claims. But the combination of cold-pressed Amla and Neem cleared my persistent flaking in two uses. The Taila Paka Vidhi extraction technique preserves the phytocompounds noticeably.”',
        date: '2 weeks ago',
        helpful: 215
    },
    {
        id: 4,
        name: 'Maya Shenoy',
        location: 'Mumbai, India',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        hairType: 'Dense 3A Curls',
        rating: 5,
        category: 'curls',
        text: '“My grandmother used to make oil at home that took days. Keshatel is the first luxury brand that smells and feels like authentic Vedic preparation. It defines my curls without crunch and seals in hydration for days.”',
        date: '3 weeks ago',
        helpful: 84
    },
    {
        id: 5,
        name: 'Sarah Jenkins',
        location: 'New York, NY',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80',
        hairType: 'Stress Shedding & Telogen Effluvium',
        rating: 5,
        category: 'thinning',
        text: '“The 3D bottle on their site convinced me to try it, but the product itself is extraordinary. My ponytail circumference has visibly thickened over 3 months. Truly holy grail hair care.”',
        date: '1 month ago',
        helpful: 129
    },
    {
        id: 6,
        name: 'Devika Pillai',
        location: 'Singapore',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        hairType: 'Prone to Premature Grey',
        rating: 5,
        category: 'scalp',
        text: '“Noticeably cooled my scalp down during humid summers. My roots feel firmly anchored, and I have zero itchy buildup. Truly an elevated, sensory Ayurvedic masterpiece.”',
        date: '1 month ago',
        helpful: 67
    }
];

class KeshavedaApp {
    constructor() {
        this.reviews = [...INITIAL_REVIEWS];
        this.audioCtx = null;
        this.isAudioPlaying = false;
        this.init();
    }

    init() {
        this.setupHeaderScroll();
        this.setupMobileMenu();
        this.setupVideoBackground();
        this.setupAmbientSound();
        this.setupIngredientShowcase();
        this.setupBeforeAfterSlider();
        this.setupReviewsFilter();
        this.setupReviewModal();
        this.setupFAQAccordion();
        this.setupContactForm();
        this.setupSmoothScroll();
        this.setupScrollReveal();
        this.setupScrollSpy();
        this.setupBackToTop();
    }

    // 1. Header Sticky Glass on Scroll
    setupHeaderScroll() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Mobile Drawer Navigation
    setupMobileMenu() {
        const toggleBtn = document.getElementById('mobile-toggle-btn');
        const navMenu = document.getElementById('nav-menu');

        if (toggleBtn && navMenu) {
            toggleBtn.addEventListener('click', () => {
                navMenu.classList.toggle('open');
                toggleBtn.setAttribute('aria-expanded', navMenu.classList.contains('open'));
            });

            // Close menu on link click
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('open');
                });
            });
        }
    }

    // 3. Cinematic Background Video Controls
    setupVideoBackground() {
        const video = document.getElementById('hero-bg-video');
        const playBtn = document.getElementById('video-play-toggle');

        if (video && playBtn) {
            playBtn.addEventListener('click', () => {
                if (video.paused) {
                    video.play();
                    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Video';
                } else {
                    video.pause();
                    playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Play Video';
                }
            });
        }
    }

    // 4. Procedural Ayurvedic Ambient Sound (Web Audio API - Temple Chimes & Forest Mist)
    setupAmbientSound() {
        const soundBtn = document.getElementById('ambient-sound-toggle');
        if (!soundBtn) return;

        soundBtn.addEventListener('click', () => {
            if (!this.audioCtx) {
                const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioCtxClass();
            }

            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            if (!this.isAudioPlaying) {
                this.startAmbientSound();
                this.isAudioPlaying = true;
                soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Ambient: On';
                soundBtn.style.color = '#ECC880';
            } else {
                this.stopAmbientSound();
                this.isAudioPlaying = false;
                soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> Ambient: Off';
                soundBtn.style.color = 'var(--cream-muted)';
            }
        });
    }

    startAmbientSound() {
        if (!this.audioCtx) return;

        // Create warm low drone (Tanpura/drone harmony in C# / 138.59 Hz)
        this.ambientGain = this.audioCtx.createGain();
        this.ambientGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        this.ambientGain.connect(this.audioCtx.destination);

        // Low drone oscillator
        this.droneOsc = this.audioCtx.createOscillator();
        this.droneOsc.type = 'sine';
        this.droneOsc.frequency.setValueAtTime(138.59, this.audioCtx.currentTime); // C#3
        this.droneOsc.connect(this.ambientGain);
        this.droneOsc.start();

        // High overtone oscillator
        this.harmonicOsc = this.audioCtx.createOscillator();
        this.harmonicOsc.type = 'sine';
        this.harmonicOsc.frequency.setValueAtTime(207.65, this.audioCtx.currentTime); // G#3 (fifth)
        this.harmonicOsc.connect(this.ambientGain);
        this.harmonicOsc.start();

        // Recurring meditative singing bowl chime
        this.chimeInterval = setInterval(() => {
            this.playSingingBowlChime();
        }, 5500);

        this.playSingingBowlChime(); // Initial chime
    }

    playSingingBowlChime() {
        if (!this.audioCtx || !this.isAudioPlaying) return;

        // Frequencies of brass singing bowl: 528Hz (Love/Transformation) & harmonics
        const frequencies = [528, 1056, 1584];
        frequencies.forEach((freq, idx) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

            const initialVolume = 0.05 / (idx + 1);
            gain.gain.setValueAtTime(initialVolume, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 3.8);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + 4.0);
        });
    }

    stopAmbientSound() {
        if (this.chimeInterval) {
            clearInterval(this.chimeInterval);
        }
        if (this.droneOsc) {
            this.droneOsc.stop();
            this.droneOsc.disconnect();
        }
        if (this.harmonicOsc) {
            this.harmonicOsc.stop();
            this.harmonicOsc.disconnect();
        }
    }

    // 5. Animated Ingredient Showcase
    setupIngredientShowcase() {
        const tabs = document.querySelectorAll('.ing-tab-btn');
        const displayCard = document.getElementById('ingredient-display-card');
        if (!tabs.length || !displayCard) return;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const ingKey = tab.dataset.ing;
                const data = BOTANICAL_INGREDIENTS[ingKey];
                if (!data) return;

                // Animate Transition
                displayCard.style.opacity = '0';
                displayCard.style.transform = 'translateY(12px)';

                setTimeout(() => {
                    displayCard.innerHTML = `
                        <div class="ing-visual-col">
                            <div class="ing-image-wrapper">
                                <img src="${data.image}" alt="${data.commonName}">
                            </div>
                            <div class="ing-sanskrit-badge">${data.sanskrit}</div>
                        </div>
                        <div class="ing-info-col">
                            <span class="ing-botanical-name">${data.botanicalName}</span>
                            <h3 class="ing-common-name">${data.commonName}</h3>
                            <p class="ing-description">${data.description}</p>
                            
                            <div class="ing-attributes-grid">
                                <div class="ing-attr-box">
                                    <span class="attr-title">Active Molecules</span>
                                    <span class="attr-val">${data.compounds}</span>
                                </div>
                                <div class="ing-attr-box">
                                    <span class="attr-title">Dosha Harmony</span>
                                    <span class="attr-val">${data.dosha}</span>
                                </div>
                                <div class="ing-attr-box">
                                    <span class="attr-title">Botanical Part</span>
                                    <span class="attr-val">${data.partUsed}</span>
                                </div>
                            </div>

                            <ul class="ing-key-benefits-list">
                                ${data.benefits.map(b => `
                                    <li>
                                        <i class="fa-solid fa-spa"></i>
                                        <span>${b}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `;

                    displayCard.style.opacity = '1';
                    displayCard.style.transform = 'translateY(0)';
                }, 250);
            });
        });
    }

    // 6. Interactive Before & After Comparison Slider
    setupBeforeAfterSlider() {
        const sliderContainer = document.getElementById('ba-slider-container');
        const handle = document.getElementById('ba-slider-handle');
        const afterImg = document.getElementById('ba-img-after');

        if (!sliderContainer || !handle || !afterImg) return;

        let isDown = false;

        const updateSlider = (clientX) => {
            const rect = sliderContainer.getBoundingClientRect();
            let x = clientX - rect.left;
            x = Math.max(0, Math.min(x, rect.width));
            const percent = (x / rect.width) * 100;

            handle.style.left = `${percent}%`;
            afterImg.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
        };

        sliderContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            updateSlider(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDown = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            updateSlider(e.clientX);
        });

        // Touch support
        sliderContainer.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                isDown = true;
                updateSlider(e.touches[0].clientX);
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isDown = false;
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDown || e.touches.length === 0) return;
            updateSlider(e.touches[0].clientX);
        }, { passive: true });
    }

    // 7. Filterable Customer Reviews
    setupReviewsFilter() {
        const filterBtns = document.querySelectorAll('.review-filter-btn');
        const container = document.getElementById('reviews-grid-container');
        if (!filterBtns.length || !container) return;

        this.renderReviews('all');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderReviews(btn.dataset.category);
            });
        });
    }

    renderReviews(category = 'all') {
        const container = document.getElementById('reviews-grid-container');
        if (!container) return;

        const filtered = category === 'all'
            ? this.reviews
            : this.reviews.filter(r => r.category === category);

        container.innerHTML = filtered.map(r => `
            <div class="review-card">
                <div class="review-header">
                    <div class="reviewer-meta">
                        <img src="${r.avatar}" alt="${r.name}" class="reviewer-avatar">
                        <div>
                            <div class="reviewer-name">
                                ${r.name}
                                <i class="fa-solid fa-circle-check verified-badge" title="Verified Vedic Buyer"></i>
                            </div>
                            <span class="reviewer-hair-type">${r.hairType}</span>
                        </div>
                    </div>
                    <div class="stars">
                        ${'<i class="fa-solid fa-star"></i>'.repeat(r.rating)}
                    </div>
                </div>
                <p class="review-text">${r.text}</p>
                <div class="review-footer">
                    <span>${r.location} • ${r.date}</span>
                    <button class="helpful-btn" onclick="this.classList.toggle('active'); const s = this.querySelector('span'); s.textContent = parseInt(s.textContent) + 1;">
                        <i class="fa-regular fa-thumbs-up"></i> Helpful (<span>${r.helpful}</span>)
                    </button>
                </div>
            </div>
        `).join('');
    }

    // 8. Write a Review Modal
    setupReviewModal() {
        const modal = document.getElementById('review-modal');
        const openBtn = document.getElementById('open-review-modal-btn');
        const closeBtn = document.getElementById('close-review-modal');
        const form = document.getElementById('review-form');

        if (openBtn && modal) {
            openBtn.addEventListener('click', () => modal.classList.add('open'));
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => modal.classList.remove('open'));
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('open');
            });
        }

        // Star Rating selector inside modal
        const starPickers = document.querySelectorAll('#star-picker i');
        let selectedStar = 5;
        starPickers.forEach(star => {
            star.addEventListener('click', () => {
                selectedStar = parseInt(star.dataset.val);
                starPickers.forEach((s, idx) => {
                    s.className = (idx < selectedStar) ? 'fa-solid fa-star' : 'fa-regular fa-star';
                });
            });
        });

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('review-name').value;
                const hairType = document.getElementById('review-hair-type').value;
                const comment = document.getElementById('review-comment').value;

                const newReview = {
                    id: Date.now(),
                    name: name,
                    location: 'Verified Ritualist',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                    hairType: hairType,
                    rating: selectedStar,
                    category: 'thinning',
                    text: `“${comment}”`,
                    date: 'Just now',
                    helpful: 1
                };

                this.reviews.unshift(newReview);
                this.renderReviews('all');
                modal.classList.remove('open');
                form.reset();

                if (window.KeshavedaStore) {
                    window.KeshavedaStore.showToast('Thank you! Your testimonial has been posted.');
                }
            });
        }
    }

    // 9. FAQ Accordion
    setupFAQAccordion() {
        const accordionItems = document.querySelectorAll('.accordion-item');
        accordionItems.forEach(item => {
            const btn = item.querySelector('.accordion-btn');
            const content = item.querySelector('.accordion-content');

            if (btn && content) {
                btn.addEventListener('click', () => {
                    const isOpen = item.classList.contains('active');

                    // Close all others
                    accordionItems.forEach(other => {
                        other.classList.remove('active');
                        other.querySelector('.accordion-content').style.maxHeight = null;
                    });

                    if (!isOpen) {
                        item.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                });
            }
        });
    }

    // 10. Contact / Consultation Form
    setupContactForm() {
        const form = document.getElementById('consultation-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('consult-name').value;
            const email = document.getElementById('consult-email').value;

            form.innerHTML = `
                <div style="text-align: center; padding: 32px 10px;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(197, 160, 89, 0.15); border: 1.5px solid var(--gold-primary); color: var(--gold-light); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin: 0 auto 18px;">
                        <i class="fa-solid fa-scroll"></i>
                    </div>
                    <h3 style="font-size: 1.6rem; color: var(--cream-light); margin-bottom: 8px;">Consultation Scheduled</h3>
                    <p style="color: var(--gold-light); font-family: var(--font-serif); font-size: 1.1rem; margin-bottom: 14px;">
                        Namaste, ${name}
                    </p>
                    <p style="color: var(--cream-muted); font-size: 0.92rem; line-height: 1.7; max-width: 420px; margin: 0 auto;">
                        Our Senior Ayurvedic Vaidya (Herbalist) will examine your scalp details and send a personalized herbal prescription to <strong>${email}</strong> within 12 hours.
                    </p>
                </div>
            `;

            if (window.KeshavedaStore) {
                window.KeshavedaStore.showToast('Ayurvedic Consultation booked successfully!');
            }
        });
    }

    // 11. Smooth Navigation Anchor Scrolling
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || targetId === '') return;

                const targetElem = document.querySelector(targetId);
                if (targetElem) {
                    e.preventDefault();
                    const headerHeight = 80;
                    const topPos = targetElem.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    window.scrollTo({
                        top: topPos,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 12. IntersectionObserver Scroll Reveal Animations
    setupScrollReveal() {
        const revealTargets = document.querySelectorAll(
            '.section-header-center, .about-visual, .about-text-content, ' +
            '.ingredient-display-card, .clinical-stat-card, .before-after-wrapper, ' +
            '.ritual-step-card, .review-card, .reviews-score-hero, .quiz-banner-box, ' +
            '.contact-info-col, .contact-form-card, .trust-feature, .product-card'
        );

        revealTargets.forEach((el, index) => {
            el.classList.add('reveal-init');
            // Add subtle staggered delays for grids
            if (el.classList.contains('product-card') || el.classList.contains('clinical-stat-card') || el.classList.contains('ritual-step-card')) {
                const delayIndex = (index % 4) + 1;
                el.classList.add(`delay-${delayIndex}`);
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Once revealed, keep it visible
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealTargets.forEach(el => observer.observe(el));

        // Re-observe dynamically created elements like product cards
        window.addEventListener('products-rendered', () => {
            document.querySelectorAll('.product-card').forEach((el, idx) => {
                el.classList.add('reveal-init', `delay-${(idx % 4) + 1}`);
                observer.observe(el);
            });
        });

        // --- Benefits Editorial Scroll Reveal (separate observer) ---
        const benRows = document.querySelectorAll('.ben-reveal');
        if (benRows.length) {
            const benObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('ben-visible');
                        benObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -60px 0px'
            });
            benRows.forEach(el => benObserver.observe(el));
        }
    }

    // 13. Active Scroll-Spy on Sticky Navigation
    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');

        window.addEventListener('scroll', () => {
            let currentSectionId = '';
            const scrollPos = window.scrollY + 120;

            sections.forEach(sec => {
                const top = sec.offsetTop;
                const height = sec.offsetHeight;
                if (scrollPos >= top && scrollPos < top + height) {
                    currentSectionId = sec.getAttribute('id');
                }
            });

            if (currentSectionId) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // 14. Floating Back to Top Button with Circular Scroll Progress
    setupBackToTop() {
        const btn = document.getElementById('back-to-top');
        const progressFill = document.getElementById('scroll-progress-fill');
        if (!btn || !progressFill) return;

        const circleRadius = 20;
        const circumference = 2 * Math.PI * circleRadius; // ~126

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;

            // Show button after scrolling past hero (~400px)
            if (scrollTop > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }

            // Update SVG circle stroke
            const offset = circumference - (scrollPercent * circumference);
            progressFill.style.strokeDashoffset = offset;
        });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Instantiate App upon DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.KeshavedaMainApp = new KeshavedaApp();
});
