// ====================================
// Main JavaScript for Portfolio Site
// ====================================

// ====================================
// Utility Functions
// ====================================

/**
 * Throttle function to limit execution rate
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

/**
 * Debounce function to delay execution
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, offset = 100) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
        rect.bottom >= 0
    );
}

// ====================================
// Navigation
// ====================================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('navToggle');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }
    
    init() {
        // Scroll effect
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }, 100));
        
        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }
        
        // Close menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMenu();
            }
        });
        
        // Active link highlighting
        window.addEventListener('scroll', throttle(() => {
            this.highlightActiveSection();
        }, 100));
    }
    
    toggleMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
    }
    
    closeMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
    }
    
    highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    }
}

// ====================================
// KPI Counter Animation
// ====================================

class KPICounter {
    constructor() {
        this.counters = document.querySelectorAll('.kpi-card');
        this.hasAnimated = new Set();
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', throttle(() => {
            this.animateCounters();
        }, 100));
        
        // Initial check
        this.animateCounters();
    }
    
    animateCounters() {
        this.counters.forEach(counter => {
            if (this.hasAnimated.has(counter)) return;
            
            if (isInViewport(counter)) {
                this.hasAnimated.add(counter);
                const numberElement = counter.querySelector('.kpi-number');
                const target = parseFloat(numberElement.getAttribute('data-target'));
                this.animateValue(numberElement, 0, target, 2000);
            }
        });
    }
    
    animateValue(element, start, end, duration) {
        const startTime = performance.now();
        const isDecimal = end % 1 !== 0;
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const current = start + (end - start) * easeProgress;
            element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = isDecimal ? end.toFixed(1) : end;
            }
        };
        
        requestAnimationFrame(update);
    }
}

// ====================================
// Scroll Animations (AOS-like)
// ====================================

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.animated = new Set();
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', throttle(() => {
            this.checkElements();
        }, 100));
        
        // Initial check
        this.checkElements();
    }
    
    checkElements() {
        this.elements.forEach(element => {
            if (this.animated.has(element)) return;
            
            if (isInViewport(element, 150)) {
                const delay = element.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    element.classList.add('aos-animate');
                    this.animated.add(element);
                }, delay);
            }
        });
    }
}

// ====================================
// Back to Top Button
// ====================================

class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        // Show/hide button on scroll
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, 100));
        
        // Scroll to top on click
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ====================================
// Smooth Scroll
// ====================================

class SmoothScroll {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                // Skip empty anchors
                if (href === '#' || href === '#!') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ====================================
// Dynamic Copyright Year
// ====================================

function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    const copyrightElements = document.querySelectorAll('.footer-bottom p');
    
    copyrightElements.forEach(element => {
        if (element.textContent.includes('©')) {
            element.textContent = `© ${currentYear} Shunsuke Yoshikawa. All rights reserved.`;
        }
    });
}

// ====================================
// Card Interactions
// ====================================

class CardInteractions {
    constructor() {
        this.cards = document.querySelectorAll('.kpi-card, .solution-card, .case-card, .skill-category, .contact-item');
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transition = 'all 0.3s ease';
            });
        });
    }
}

// ====================================
// Performance Observer
// ====================================

class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Log performance metrics
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`⚡ Page Load Time: ${pageLoadTime}ms`);
            }
        });
    }
}

// ====================================
// Lazy Loading for Images
// ====================================

class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }
    
    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            
            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            this.images.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
}

// ====================================
// Parallax Effect (Optional)
// ====================================

class ParallaxEffect {
    constructor() {
        this.hero = document.querySelector('.hero');
        this.init();
    }
    
    init() {
        if (!this.hero) return;
        
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < window.innerHeight) {
                this.hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        }, 10));
    }
}

// ====================================
// Console Welcome Message
// ====================================

function displayWelcomeMessage() {
    const styles = [
        'color: #002B5B',
        'font-size: 16px',
        'font-weight: bold',
        'padding: 10px'
    ].join(';');
    
    const accentStyles = [
        'color: #C5A059',
        'font-size: 14px',
        'font-weight: normal',
        'padding: 5px'
    ].join(';');
    
    console.log('%c吉川俊輔 | Portfolio Site', styles);
    console.log('%c「再現性のある勝利を、組織に実装する。」', accentStyles);
    console.log('%cThis site was optimized using AI and prompt engineering.', accentStyles);
}

// ====================================
// Gallery Slider
// ====================================

class GallerySlider {
    constructor() {
        this.slider = document.querySelector('.gallery-slider');
        this.slides = document.querySelectorAll('.gallery-slide');
        this.prevBtn = document.querySelector('.slider-btn-prev');
        this.nextBtn = document.querySelector('.slider-btn-next');
        this.dotsContainer = document.querySelector('.slider-dots');
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        
        if (!this.slider || this.slides.length === 0) return;
        
        this.init();
    }
    
    init() {
        // Create dots
        this.createDots();
        
        // Show first slide
        this.showSlide(0);
        
        // Event listeners
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        this.slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        this.slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
        
        // Auto-play disabled
        // this.startAutoPlay();
        
        // Pause auto-play on hover (disabled)
        // this.slider.addEventListener('mouseenter', () => this.stopAutoPlay());
        // this.slider.addEventListener('mouseleave', () => this.startAutoPlay());
    }
    
    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('slider-dot');
            dot.addEventListener('click', () => this.showSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }
    
    showSlide(index) {
        // Remove active class from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        this.currentIndex = index;
        this.slides[this.currentIndex].classList.add('active');
        
        // Update dots
        const dots = this.dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000); // Change slide every 5 seconds
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
}

// ====================================
// Initialize All Components
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Portfolio Site...');
    
    // Display welcome message
    displayWelcomeMessage();
    
    // Initialize all components
    new Navigation();
    new KPICounter();
    new ScrollAnimations();
    new BackToTop();
    new SmoothScroll();
    new CardInteractions();
    new LazyLoader();
    new ParallaxEffect();
    new GallerySlider();
    new PerformanceMonitor();
    
    // Update copyright year
    updateCopyrightYear();
    
    console.log('✅ All components initialized successfully!');
});

// ====================================
// Resize Handler
// ====================================

window.addEventListener('resize', debounce(() => {
    console.log('📐 Window resized, recalculating...');
    // Trigger any resize-dependent calculations here
}, 250));

// ====================================
// Error Handler
// ====================================

window.addEventListener('error', (event) => {
    console.error('❌ Error detected:', event.error);
});

// ====================================
// Export for Testing (if needed)
// ====================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        KPICounter,
        ScrollAnimations,
        BackToTop,
        SmoothScroll
    };
}
