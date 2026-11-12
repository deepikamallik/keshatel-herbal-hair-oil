/**
 * ==========================================================================
 * KESHATEL // LUXURY E-COMMERCE ENGINE
 * Cart Drawer, Currency Switcher, Quick View Modal, Checkout System,
 * Wishlist, and Interactive Ayurvedic Hair Dosha Quiz
 * ==========================================================================
 */

const KESHAVEDA_PRODUCTS = [
    {
        id: 'keshatel-oil',
        name: 'Keshatel Herbal Hair Oil',
        category: 'Flagship Ayurvedic Hair Oil',
        tag: 'Hero Product',
        basePriceUSD: 48,
        rating: 4.9,
        reviewsCount: 14280,
        sizes: [
            { size: '50ml', priceUSD: 28 },
            { size: '100ml', priceUSD: 48, default: true },
            { size: '200ml', priceUSD: 78 }
        ],
        image: 'https://images.unsplash.com/photo-1608248597359-0097c02b28c5?auto=format&fit=crop&w=700&q=80',
        description: 'Keshatel Herbal Hair Oil is formulated according to the sacred Taila Paka Vidhi. 21 hand-harvested Ayurvedic botanicals (Amla, Bhringraj, Neem, Hibiscus & Aloe Vera) slow-simmered in copper vessels with cold-pressed virgin oils to deeply nourish the scalp, stop shedding, and unlock naturally healthy, lustrous hair.',
        botanicals: ['Bhringraj (King of Hair)', 'Virgin Amla', 'Neem Leaf', 'Hibiscus Petals', 'Fresh Aloe Vera'],
        clinicalStat: '96% noticed reduced hair fall in 21 days'
    },
    {
        id: 'keshatel-hibiscus-serum',
        name: 'Keshatel Hibiscus & Rosemary Scalp Awakening Concentrate',
        category: 'Root Revitalizer',
        tag: 'Award Winner',
        basePriceUSD: 42,
        rating: 4.8,
        reviewsCount: 8940,
        sizes: [
            { size: '30ml', priceUSD: 30 },
            { size: '50ml', priceUSD: 42, default: true },
            { size: '100ml', priceUSD: 68 }
        ],
        image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80',
        description: 'A water-free, weightless active scalp serum combining wild red Hibiscus petals with steam-distilled Himalayan Rosemary. Stimulates micro-circulation at follicular roots, boosting tensile elasticity and mirror-like radiance.',
        botanicals: ['Japa Pushpa (Red Hibiscus)', 'Himalayan Rosemary', 'Methi (Fenugreek)', 'Nagarmotha'],
        clinicalStat: '3.2x increase in tensile root anchorage'
    },
    {
        id: 'keshatel-amla-nectar',
        name: 'Keshatel Virgin Amla & Brahmi Restorative Nectar',
        category: 'Intense Gloss & Strength',
        tag: 'Pure Ayurvedic',
        basePriceUSD: 38,
        rating: 4.9,
        reviewsCount: 6150,
        sizes: [
            { size: '50ml', priceUSD: 24 },
            { size: '100ml', priceUSD: 38, default: true },
            { size: '200ml', priceUSD: 62 }
        ],
        image: 'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=700&q=80',
        description: 'Supercharged with cold-pressed Amla berries containing 20x the Vitamin C of oranges. Fortifies keratin cortex bonds, halts split ends, and delivers an opulent glass-hair finish without greasiness.',
        botanicals: ['Organic Indian Gooseberry', 'Brahmi (Gotu Kola)', 'Cold-Pressed Sweet Almond', 'Kumari (Aloe Vera)'],
        clinicalStat: '88% reported instant split-end repair'
    },
    {
        id: 'keshatel-kansa-kit',
        name: 'Keshatel Sacred Kansa Scalp Wand & Oil Ritual Box',
        category: 'Ayurvedic Spa Collector',
        tag: 'Complete Ritual',
        basePriceUSD: 88,
        rating: 5.0,
        reviewsCount: 3420,
        sizes: [
            { size: 'Standard Set', priceUSD: 88, default: true },
            { size: 'Deluxe Gift Box', priceUSD: 118 }
        ],
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80',
        description: 'The quintessential Ayurvedic Shiro Abhyanga kit. Features a hand-cast bronze Kansa wand (78% copper, 22% tin) and a full-size 100ml Keshatel Herbal Hair Oil. Draws out excess scalp heat (Pitta), stimulates Marma points, and induces deep meditative calm.',
        botanicals: ['Pure Hand-Cast Kansa Bronze', 'Teakwood Handle', '100ml Keshatel Herbal Hair Oil'],
        clinicalStat: '100% experienced scalp relaxation & tension release'
    }
];

// Currency Rates relative to USD
const CURRENCY_CONFIG = {
    USD: { symbol: '$', rate: 1.0, decimals: 2 },
    EUR: { symbol: '€', rate: 0.92, decimals: 2 },
    GBP: { symbol: '£', rate: 0.79, decimals: 2 },
    INR: { symbol: '₹', rate: 84.5, decimals: 0 }
};

class StoreEngine {
    constructor() {
        this.products = KESHAVEDA_PRODUCTS;
        this.currentCurrency = localStorage.getItem('keshaveda_currency') || 'USD';
        this.cart = JSON.parse(localStorage.getItem('keshaveda_cart') || '[]');
        this.wishlist = JSON.parse(localStorage.getItem('keshaveda_wishlist') || '[]');
        this.promoApplied = null;
        this.discountRate = 0;

        this.init();
    }

    init() {
        this.setupCurrencySwitcher();
        this.renderProductCards();
        this.renderCartUI();
        this.setupCartDrawerEvents();
        this.setupQuickViewModal();
        this.setupCheckoutModal();
        this.setupWishlistButtons();
        this.setupDoshaQuiz();
        this.updateHeaderBadges();
    }

    // --- Currency Conversion ---
    formatPrice(usdAmount) {
        const config = CURRENCY_CONFIG[this.currentCurrency] || CURRENCY_CONFIG.USD;
        const converted = usdAmount * config.rate;
        if (config.decimals === 0) {
            return `${config.symbol}${Math.round(converted).toLocaleString()}`;
        }
        return `${config.symbol}${converted.toFixed(config.decimals)}`;
    }

    setupCurrencySwitcher() {
        const select = document.getElementById('currency-selector');
        if (select) {
            select.value = this.currentCurrency;
            select.addEventListener('change', (e) => {
                this.currentCurrency = e.target.value;
                localStorage.setItem('keshaveda_currency', this.currentCurrency);
                this.renderProductCards();
                this.renderCartUI();
                this.showToast(`Currency updated to ${this.currentCurrency}`);
            });
        }
    }

    // --- Product Cards Rendering ---
    renderProductCards(filterCategory = 'all') {
        const container = document.getElementById('products-grid-container');
        if (!container) return;

        container.innerHTML = '';

        const filtered = filterCategory === 'all' 
            ? this.products 
            : this.products.filter(p => p.category.toLowerCase().includes(filterCategory.toLowerCase()));

        filtered.forEach(p => {
            const isWishlisted = this.wishlist.includes(p.id);
            const defaultSize = p.sizes.find(s => s.default) || p.sizes[0];

            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.id = p.id;

            card.innerHTML = `
                <div class="product-badge-flag">${p.tag}</div>
                <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${p.id}" title="Add to Wishlist">
                    <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                </button>
                <div class="product-image-container">
                    <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
                    <button class="quick-view-overlay-btn" data-id="${p.id}">
                        <i class="fa-regular fa-eye"></i> Quick View
                    </button>
                </div>
                <div class="product-details">
                    <span class="product-category-tag">${p.category}</span>
                    <h3 class="product-title">${p.name}</h3>
                    <div class="product-rating">
                        <div class="stars">
                            ${'<i class="fa-solid fa-star"></i>'.repeat(5)}
                        </div>
                        <span>${p.rating} (${p.reviewsCount.toLocaleString()})</span>
                    </div>
                    <div class="product-size-selector" data-id="${p.id}">
                        ${p.sizes.map((s, idx) => `
                            <button class="size-pill ${s.default ? 'active' : ''}" data-size="${s.size}" data-price="${s.priceUSD}">
                                ${s.size}
                            </button>
                        `).join('')}
                    </div>
                    <div class="product-price-row">
                        <span class="current-price" id="price-${p.id}">${this.formatPrice(defaultSize.priceUSD)}</span>
                        <span class="original-price">${this.formatPrice(defaultSize.priceUSD * 1.25)}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn-add-cart" data-id="${p.id}">
                            <i class="fa-solid fa-bag-shopping"></i> Add to Cart
                        </button>
                        <button class="btn-buy-now" data-id="${p.id}">
                            Buy Now
                        </button>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        this.bindProductCardInteractions();
        window.dispatchEvent(new CustomEvent('products-rendered'));
    }

    bindProductCardInteractions() {
        // Size Selector Pills
        document.querySelectorAll('.product-size-selector').forEach(selector => {
            const prodId = selector.dataset.id;
            const pills = selector.querySelectorAll('.size-pill');
            pills.forEach(pill => {
                pill.addEventListener('click', () => {
                    pills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    const priceUSD = parseFloat(pill.dataset.price);
                    const priceElem = document.getElementById(`price-${prodId}`);
                    if (priceElem) {
                        priceElem.textContent = this.formatPrice(priceUSD);
                    }
                });
            });
        });

        // Add to Cart
        document.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prodId = btn.dataset.id;
                const card = btn.closest('.product-card');
                const activeSizePill = card.querySelector('.size-pill.active');
                const size = activeSizePill ? activeSizePill.dataset.size : '100ml';
                const price = activeSizePill ? parseFloat(activeSizePill.dataset.price) : 48;

                this.addToCart(prodId, size, price, 1);
            });
        });

        // Buy Now (Direct to Checkout)
        document.querySelectorAll('.btn-buy-now').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prodId = btn.dataset.id;
                const card = btn.closest('.product-card');
                const activeSizePill = card.querySelector('.size-pill.active');
                const size = activeSizePill ? activeSizePill.dataset.size : '100ml';
                const price = activeSizePill ? parseFloat(activeSizePill.dataset.price) : 48;

                this.addToCart(prodId, size, price, 1);
                this.openCartDrawer();
                this.openCheckoutModal();
            });
        });

        // Quick View Buttons
        document.querySelectorAll('.quick-view-overlay-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prodId = btn.dataset.id;
                this.openQuickView(prodId);
            });
        });

        // Wishlist Toggle
        document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prodId = btn.dataset.id;
                this.toggleWishlist(prodId, btn);
            });
        });
    }

    // --- Cart Actions ---
    addToCart(productId, size, priceUSD, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const cartItemId = `${productId}-${size}`;
        const existingIndex = this.cart.findIndex(item => item.cartItemId === cartItemId);

        if (existingIndex > -1) {
            this.cart[existingIndex].quantity += quantity;
        } else {
            this.cart.push({
                cartItemId: cartItemId,
                id: product.id,
                name: product.name,
                image: product.image,
                size: size,
                priceUSD: priceUSD,
                quantity: quantity
            });
        }

        this.saveCart();
        this.renderCartUI();
        this.openCartDrawer();
        this.showToast(`Added ${product.name} (${size}) to your Bag!`);
    }

    removeFromCart(cartItemId) {
        this.cart = this.cart.filter(item => item.cartItemId !== cartItemId);
        this.saveCart();
        this.renderCartUI();
    }

    updateQuantity(cartItemId, delta) {
        const item = this.cart.find(i => i.cartItemId === cartItemId);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity <= 0) {
            this.removeFromCart(cartItemId);
        } else {
            this.saveCart();
            this.renderCartUI();
        }
    }

    saveCart() {
        localStorage.setItem('keshaveda_cart', JSON.stringify(this.cart));
        this.updateHeaderBadges();
    }

    updateHeaderBadges() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartBadge = document.getElementById('cart-badge');
        if (cartBadge) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        const wishlistBadge = document.getElementById('wishlist-badge');
        if (wishlistBadge) {
            wishlistBadge.textContent = this.wishlist.length;
            wishlistBadge.style.display = this.wishlist.length > 0 ? 'flex' : 'none';
        }
    }

    // --- Cart Drawer UI ---
    renderCartUI() {
        const itemsContainer = document.getElementById('cart-items-list');
        const subtotalElem = document.getElementById('cart-subtotal');
        const discountElem = document.getElementById('cart-discount');
        const totalElem = document.getElementById('cart-final-total');
        const freeShippingFill = document.getElementById('shipping-meter-fill');
        const freeShippingText = document.getElementById('shipping-meter-text');

        if (!itemsContainer) return;

        if (this.cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="cart-empty-message">
                    <i class="fa-solid fa-seedling"></i>
                    <h4>Your Botanical Bag is Empty</h4>
                    <p>Infuse your crown with sacred Ayurvedic elixirs.</p>
                </div>
            `;
            if (subtotalElem) subtotalElem.textContent = this.formatPrice(0);
            if (discountElem) discountElem.textContent = this.formatPrice(0);
            if (totalElem) totalElem.textContent = this.formatPrice(0);
            if (freeShippingFill) freeShippingFill.style.width = '0%';
            return;
        }

        let subtotalUSD = 0;
        itemsContainer.innerHTML = '';

        this.cart.forEach(item => {
            const itemTotalUSD = item.priceUSD * item.quantity;
            subtotalUSD += itemTotalUSD;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-meta">${item.size}</div>
                    <div class="cart-item-controls">
                        <div class="quantity-stepper">
                            <button class="stepper-btn minus" data-id="${item.cartItemId}">-</button>
                            <span class="stepper-val">${item.quantity}</span>
                            <button class="stepper-btn plus" data-id="${item.cartItemId}">+</button>
                        </div>
                        <span class="cart-item-price">${this.formatPrice(itemTotalUSD)}</span>
                    </div>
                </div>
                <button class="cart-item-remove" data-id="${item.cartItemId}" title="Remove item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            itemsContainer.appendChild(itemDiv);
        });

        // Event listeners for stepper and remove
        itemsContainer.querySelectorAll('.stepper-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => this.updateQuantity(btn.dataset.id, -1));
        });
        itemsContainer.querySelectorAll('.stepper-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => this.updateQuantity(btn.dataset.id, 1));
        });
        itemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => this.removeFromCart(btn.dataset.id));
        });

        // Calculations
        const freeShippingThresholdUSD = 65;
        const progress = Math.min(100, (subtotalUSD / freeShippingThresholdUSD) * 100);
        if (freeShippingFill) freeShippingFill.style.width = `${progress}%`;

        if (freeShippingText) {
            if (subtotalUSD >= freeShippingThresholdUSD) {
                freeShippingText.innerHTML = `✨ <strong>Complimentary Worldwide Express Delivery</strong> Unlocked!`;
            } else {
                const remaining = freeShippingThresholdUSD - subtotalUSD;
                freeShippingText.innerHTML = `Add <strong>${this.formatPrice(remaining)}</strong> more for Free Global Shipping & Kansa Comb`;
            }
        }

        const discountUSD = subtotalUSD * this.discountRate;
        const finalUSD = Math.max(0, subtotalUSD - discountUSD);

        if (subtotalElem) subtotalElem.textContent = this.formatPrice(subtotalUSD);
        if (discountElem) discountElem.textContent = this.discountRate > 0 ? `-${this.formatPrice(discountUSD)}` : this.formatPrice(0);
        if (totalElem) totalElem.textContent = this.formatPrice(finalUSD);
    }

    setupCartDrawerEvents() {
        const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
        const cartToggleBtn = document.getElementById('cart-toggle-btn');
        const closeDrawerBtn = document.getElementById('close-drawer-btn');
        const checkoutBtn = document.getElementById('cart-checkout-btn');
        const promoApplyBtn = document.getElementById('apply-promo-btn');
        const promoInput = document.getElementById('cart-promo-input');

        if (cartToggleBtn) {
            cartToggleBtn.addEventListener('click', () => this.openCartDrawer());
        }

        if (closeDrawerBtn) {
            closeDrawerBtn.addEventListener('click', () => this.closeCartDrawer());
        }

        if (cartDrawerOverlay) {
            cartDrawerOverlay.addEventListener('click', (e) => {
                if (e.target === cartDrawerOverlay) {
                    this.closeCartDrawer();
                }
            });
        }

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showToast('Please add items to your bag first!');
                    return;
                }
                this.closeCartDrawer();
                this.openCheckoutModal();
            });
        }

        if (promoApplyBtn && promoInput) {
            promoApplyBtn.addEventListener('click', () => {
                const code = promoInput.value.trim().toUpperCase();
                if (code === 'KESHATEL15' || code === 'VEDA15') {
                    this.discountRate = 0.15;
                    this.promoApplied = 'KESHATEL15';
                    this.showToast('15% Keshatel Sacred Discount Applied!');
                    this.renderCartUI();
                } else if (code === 'AYUSH20') {
                    this.discountRate = 0.20;
                    this.promoApplied = 'AYUSH20';
                    this.showToast('20% Ayurvedic Ritualist Discount Applied!');
                    this.renderCartUI();
                } else {
                    this.showToast('Invalid promo code. Try "VEDA15"');
                }
            });
        }
    }

    openCartDrawer() {
        const overlay = document.getElementById('cart-drawer-overlay');
        if (overlay) overlay.classList.add('open');
    }

    closeCartDrawer() {
        const overlay = document.getElementById('cart-drawer-overlay');
        if (overlay) overlay.classList.remove('open');
    }

    // --- Wishlist System ---
    toggleWishlist(productId, btnElement) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            if (btnElement) {
                btnElement.classList.remove('active');
                btnElement.querySelector('i').className = 'fa-regular fa-heart';
            }
            this.showToast('Removed from Wishlist');
        } else {
            this.wishlist.push(productId);
            if (btnElement) {
                btnElement.classList.add('active');
                btnElement.querySelector('i').className = 'fa-solid fa-heart';
            }
            this.showToast('Saved to your Sacred Wishlist!');
        }
        localStorage.setItem('keshaveda_wishlist', JSON.stringify(this.wishlist));
        this.updateHeaderBadges();
    }

    setupWishlistButtons() {
        const wishlistBtn = document.getElementById('wishlist-toggle-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                if (this.wishlist.length === 0) {
                    this.showToast('Your wishlist is empty! Heart items to save them.');
                } else {
                    this.showToast(`You have ${this.wishlist.length} saved ritual items!`);
                }
            });
        }
    }

    // --- Quick View Modal ---
    setupQuickViewModal() {
        const modal = document.getElementById('quick-view-modal');
        const closeBtn = document.getElementById('close-quick-view');
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => modal.classList.remove('open'));
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('open');
            });
        }
    }

    openQuickView(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.getElementById('quick-view-modal');
        const content = document.getElementById('quick-view-content');
        if (!modal || !content) return;

        const defaultSize = product.sizes.find(s => s.default) || product.sizes[0];

        content.innerHTML = `
            <div class="modal-product-grid">
                <div class="modal-product-img-wrap">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="modal-product-info">
                    <span class="product-category-tag">${product.category}</span>
                    <h2 class="product-title" style="font-size: 2rem; margin-bottom: 10px;">${product.name}</h2>
                    <div class="product-rating" style="margin-bottom: 18px;">
                        <div class="stars">${'<i class="fa-solid fa-star"></i>'.repeat(5)}</div>
                        <span>${product.rating} / 5.0 (${product.reviewsCount.toLocaleString()} Verified Reviews)</span>
                    </div>
                    <div class="product-price-row" style="margin-bottom: 20px;">
                        <span class="current-price" id="qv-price" style="font-size: 1.8rem;">${this.formatPrice(defaultSize.priceUSD)}</span>
                    </div>
                    <p style="color: var(--cream-muted); font-size: 0.95rem; line-height: 1.7; margin-bottom: 24px;">
                        ${product.description}
                    </p>
                    <div style="margin-bottom: 24px;">
                        <h5 style="color: var(--gold-light); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Sacred Botanicals</h5>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${product.botanicals.map(b => `<span style="background: rgba(197, 160, 89, 0.15); border: 1px solid rgba(197, 160, 89, 0.3); border-radius: 999px; padding: 4px 12px; font-size: 0.78rem; color: var(--cream-light);">${b}</span>`).join('')}
                        </div>
                    </div>
                    <div class="product-size-selector" id="qv-size-selector" style="margin-bottom: 24px;">
                        ${product.sizes.map((s, idx) => `
                            <button class="size-pill ${s.default ? 'active' : ''}" data-size="${s.size}" data-price="${s.priceUSD}">
                                ${s.size}
                            </button>
                        `).join('')}
                    </div>
                    <button class="btn-primary" id="qv-add-btn" style="width: 100%; justify-content: center;">
                        <i class="fa-solid fa-bag-shopping"></i> Add to Botanical Bag
                    </button>
                </div>
            </div>
        `;

        // Bind sizes in Quick View
        const pills = content.querySelectorAll('#qv-size-selector .size-pill');
        let selectedSize = defaultSize.size;
        let selectedPrice = defaultSize.priceUSD;

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                selectedSize = pill.dataset.size;
                selectedPrice = parseFloat(pill.dataset.price);
                document.getElementById('qv-price').textContent = this.formatPrice(selectedPrice);
            });
        });

        // Bind Add Button
        document.getElementById('qv-add-btn').addEventListener('click', () => {
            this.addToCart(product.id, selectedSize, selectedPrice, 1);
            modal.classList.remove('open');
        });

        modal.classList.add('open');
    }

    // --- Checkout Modal ---
    setupCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        const closeBtn = document.getElementById('close-checkout-modal');
        const checkoutForm = document.getElementById('checkout-form');

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => modal.classList.remove('open'));
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('open');
            });
        }

        // Payment Method Switcher inside checkout
        document.querySelectorAll('.pay-method-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.completeOrder();
            });
        }
    }

    openCheckoutModal() {
        const modal = document.getElementById('checkout-modal');
        if (!modal) return;

        // Populate order summary in checkout modal
        const subtotalUSD = this.cart.reduce((sum, item) => sum + (item.priceUSD * item.quantity), 0);
        const discountUSD = subtotalUSD * this.discountRate;
        const totalUSD = subtotalUSD - discountUSD;

        const summaryElem = document.getElementById('checkout-summary-box');
        if (summaryElem) {
            summaryElem.innerHTML = `
                <div style="background: rgba(13, 38, 28, 0.6); border: 1px solid rgba(197, 160, 89, 0.25); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h5 style="color: var(--gold-light); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 14px;">Order Summary (${this.cart.length} items)</h5>
                    ${this.cart.map(item => `
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 8px; color: var(--cream-muted);">
                            <span>${item.name} (${item.size}) x${item.quantity}</span>
                            <span style="color: var(--cream-light); font-weight: 600;">${this.formatPrice(item.priceUSD * item.quantity)}</span>
                        </div>
                    `).join('')}
                    <div style="border-top: 1px solid rgba(197, 160, 89, 0.2); padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between; font-family: var(--font-serif); font-size: 1.25rem; color: var(--gold-light);">
                        <span>Total Payable:</span>
                        <span>${this.formatPrice(totalUSD)}</span>
                    </div>
                </div>
            `;
        }

        modal.classList.add('open');
    }

    completeOrder() {
        const modal = document.getElementById('checkout-modal');
        const orderId = 'KV-' + Math.floor(100000 + Math.random() * 900000);

        // Celebration Confetti
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#D4AF37', '#FAF7F2', '#164030', '#E5C378']
            });
        }

        // Show Success View in Modal
        const content = document.getElementById('checkout-modal-body');
        if (content) {
            content.innerHTML = `
                <div style="text-align: center; padding: 48px 24px;">
                    <div style="width: 76px; height: 76px; border-radius: 50%; background: rgba(197, 160, 89, 0.15); border: 2px solid var(--gold-primary); color: var(--gold-light); display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 24px;">
                        <i class="fa-solid fa-check"></i>
                    </div>
                    <span class="section-label">Order Confirmed</span>
                    <h2 class="section-title" style="margin-bottom: 12px;">May Your Crown Flourish</h2>
                    <p style="color: var(--gold-light); font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 18px;">
                        Order Ref: #${orderId}
                    </p>
                    <p style="color: var(--cream-muted); max-width: 480px; margin: 0 auto 28px; line-height: 1.7;">
                        Your artisanal Ayurvedic formulation has been entrusted to our herbal apothecaries. A confirmation email with cold-chain tracking details has been dispatched.
                    </p>
                    <button class="btn-primary" id="continue-shopping-btn" style="margin: 0 auto;">
                        Continue Ritual Journey
                    </button>
                </div>
            `;

            document.getElementById('continue-shopping-btn').addEventListener('click', () => {
                modal.classList.remove('open');
                this.cart = [];
                this.saveCart();
                this.renderCartUI();
                window.location.reload();
            });
        }
    }

    // --- Interactive Ayurvedic Hair Dosha Quiz ---
    setupDoshaQuiz() {
        const startBtn = document.getElementById('start-quiz-btn');
        const modal = document.getElementById('quiz-modal');
        const closeBtn = document.getElementById('close-quiz-modal');

        if (startBtn && modal) {
            startBtn.addEventListener('click', () => {
                this.renderQuizStep(1);
                modal.classList.add('open');
            });
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => modal.classList.remove('open'));
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('open');
            });
        }
    }

    renderQuizStep(step, answers = {}) {
        const container = document.getElementById('quiz-modal-body');
        if (!container) return;

        if (step === 1) {
            container.innerHTML = `
                <div style="padding: 36px;">
                    <span class="section-label">Vedic Crown Diagnostic • Step 1 of 3</span>
                    <h3 style="font-size: 1.8rem; color: var(--cream-light); margin-bottom: 8px;">What best describes your scalp climate?</h3>
                    <p style="color: var(--cream-muted); font-size: 0.9rem; margin-bottom: 24px;">Your scalp's elemental dosha directs the optimal herbal carriers and heat levels.</p>
                    <div style="display: flex; flex-direction: column; gap: 14px;">
                        <button class="method-card quiz-opt-btn" data-val="dry-flaky">
                            <strong>Dry, Itchy or Prone to Fine Dandruff (Vata Imbalance)</strong>
                            <p>Feels tight, lacks natural sebum, hair strands feel rough and brittle.</p>
                        </button>
                        <button class="method-card quiz-opt-btn" data-val="oily-irritated">
                            <strong>Warm, Sensitive, or Prone to Breakouts (Pitta Imbalance)</strong>
                            <p>Excess scalp heat, redness, inflammation, and sudden root thinning.</p>
                        </button>
                        <button class="method-card quiz-opt-btn" data-val="heavy-buildup">
                            <strong>Heavy Sebum, Sluggish Roots, or Sticky Flakes (Kapha Imbalance)</strong>
                            <p>Scalp feels congested, roots become oily within 24 hours of cleansing.</p>
                        </button>
                    </div>
                </div>
            `;

            container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    answers.scalp = btn.dataset.val;
                    this.renderQuizStep(2, answers);
                });
            });
        } else if (step === 2) {
            container.innerHTML = `
                <div style="padding: 36px;">
                    <span class="section-label">Vedic Crown Diagnostic • Step 2 of 3</span>
                    <h3 style="font-size: 1.8rem; color: var(--cream-light); margin-bottom: 8px;">What is your primary hair aspiration?</h3>
                    <p style="color: var(--cream-muted); font-size: 0.9rem; margin-bottom: 24px;">Select the foremost transformation you seek from the herbs.</p>
                    <div style="display: flex; flex-direction: column; gap: 14px;">
                        <button class="method-card quiz-opt-btn" data-val="growth">
                            <strong>Accelerate Rapid Regrowth & Stop Shedding</strong>
                            <p>Target crown thinning, temples, and hair loss after stress or postpartum.</p>
                        </button>
                        <button class="method-card quiz-opt-btn" data-val="thickness">
                            <strong>Deep Hydration & Split-End Repair</strong>
                            <p>Strengthen bleached, heat-damaged strands with bio-lipids and Vitamin C.</p>
                        </button>
                        <button class="method-card quiz-opt-btn" data-val="greying">
                            <strong>Delay Premature Silvering & Intensify Sheen</strong>
                            <p>Infuse roots with melanin-protecting antioxidant bioflavonoids.</p>
                        </button>
                    </div>
                </div>
            `;

            container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    answers.goal = btn.dataset.val;
                    this.renderQuizStep(3, answers);
                });
            });
        } else if (step === 3) {
            // Diagnosis calculation
            container.innerHTML = `
                <div style="padding: 36px; text-align: center;">
                    <div style="display: inline-block; padding: 6px 18px; background: rgba(197, 160, 89, 0.15); border: 1px solid var(--gold-primary); border-radius: 999px; color: var(--gold-light); font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 16px;">
                        Ayurvedic Diagnostic Result
                    </div>
                    <h2 class="section-title" style="margin-bottom: 8px;">Pitta-Vata Harmonizing Protocol</h2>
                    <p style="color: var(--gold-light); font-family: var(--font-serif); font-size: 1.25rem; font-style: italic; margin-bottom: 20px;">
                        Recommended Ritual: Maha Bhringraj + Kansa Scalp Abhyanga
                    </p>
                    <p style="color: var(--cream-muted); max-width: 520px; margin: 0 auto 28px; line-height: 1.7;">
                        Based on your scalp profile, your hair roots require cooling copper detoxification to balance excess Pitta heat, combined with deep Bhringraj and Amla lipids to eliminate Vata dry brittleness.
                    </p>
                    <div style="display: flex; justify-content: center; gap: 16px;">
                        <button class="btn-primary" id="add-quiz-regimen">
                            <i class="fa-solid fa-sparkles"></i> Add Recommended Regimen ($88)
                        </button>
                    </div>
                </div>
            `;

            document.getElementById('add-quiz-regimen').addEventListener('click', () => {
                this.addToCart('maha-bhringraj', '100ml', 48, 1);
                this.addToCart('hibiscus-serum', '50ml', 42, 1);
                document.getElementById('quiz-modal').classList.remove('open');
                this.showToast('Prescribed Regimen Added to Cart with 15% VIP bundle discount!');
            });
        }
    }

    // --- Toast Notifications ---
    showToast(message) {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="fa-solid fa-seedling toast-icon"></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);

        // Slide in
        setTimeout(() => toast.classList.add('show'), 50);

        // Slide out & remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }
}

// Instantiate Store upon DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.KeshavedaStore = new StoreEngine();
    window.KeshatelStore = window.KeshavedaStore;
});
