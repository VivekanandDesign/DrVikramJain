// Main JavaScript file for Dr. Vikram Jain's website

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSmoothScroll();
});

function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;

    function toggleMenu() {
        const isOpen = mobileMenu?.classList.contains('translate-x-0');
        
        if (isOpen) {
            // Close menu
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('-translate-x-full');
            body.classList.remove('overflow-hidden');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        } else if (mobileMenu) {
            // Open menu
            mobileMenu.classList.remove('hidden');
            // Force a reflow
            mobileMenu.offsetHeight;
            mobileMenu.classList.remove('-translate-x-full');
            mobileMenu.classList.add('translate-x-0');
            body.classList.add('overflow-hidden');
        }
    }

    mobileMenuButton?.addEventListener('click', toggleMenu);
    closeMobileMenu?.addEventListener('click', toggleMenu);

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            toggleMenu();
        }
    });

    // Close menu on resize if screen becomes larger than mobile breakpoint
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            toggleMenu();
        }
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
