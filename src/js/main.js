// Main JavaScript file for Dr. Vikram Jain's website - Optimized for performance

// Wait for components to load before initializing UI
document.addEventListener('DOMContentLoaded', () => {
    // Initialize immediately on page load if components are already there
    initializeUI();
    
    // Make sure navigation is fixed on DOMContentLoaded
    if (window.fixNavigation) {
        window.fixNavigation();
    }
    
    // Also listen for component loaded events
    document.addEventListener('component:loaded', (e) => {
        // Short delay to ensure the DOM is updated
        setTimeout(() => {
            initializeUI();
            
            // Ensure navigation fixes are applied after component loading
            if (window.fixNavigation) {
                console.log('Fixing navigation after component load');
                window.fixNavigation();
            }
        }, 100); // Increased delay to ensure DOM is fully updated
    });
    
    // Listen for navigation fixes
    document.addEventListener('navigation:fixed', () => {
        console.log('Navigation has been fixed, ensuring menu functionality');
        
        // After navigation is fixed, ensure the mobile menu is still properly configured
        const mobileMenuButton = document.getElementById('mobileMenuButton');
        if (mobileMenuButton && !mobileMenuButton.dataset.initialized) {
            initMobileMenu();
        }
    });
    
    // Also fix navigation on window load as a final check
    window.addEventListener('load', () => {
        if (window.fixNavigation) {
            console.log('Final navigation check on window load');
            window.fixNavigation();
        }
    });
});

function initializeUI() {
    // Initialize mobile menu regardless of how it was loaded
    initMobileMenu();
    
    // Initialize smooth scroll for any existing anchor links
    initSmoothScroll();
}

function initMobileMenu() {
    // Check if the mobile menu elements exist
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    
    // If any of these elements don't exist or initialization was already done by navbar.html's inline script, return early
    if (!mobileMenuButton || !mobileMenu || mobileMenuButton.dataset.initialized === 'true') {
        return;
    }
    
    // Mark as initialized to prevent duplicate handlers
    mobileMenuButton.dataset.initialized = 'true';
    
    const body = document.body;
    
    function toggleMenu(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const isHidden = mobileMenu.classList.contains('hidden');
        
        if (isHidden) {
            // Open menu
            mobileMenu.classList.remove('hidden');
            body.classList.add('overflow-hidden');
            
            // Force browser to recognize the element before applying transforms
            mobileMenu.getBoundingClientRect();
        } else {
            // Close menu
            body.classList.remove('overflow-hidden');
            mobileMenu.classList.add('hidden');
        }
    }

    // Add click handlers
    mobileMenuButton.addEventListener('click', toggleMenu);
    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', toggleMenu);
    }

    // Handle closing on screen resize
    const closeOnResize = function() {
        if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
            toggleMenu();
        }
    };

    // Add resize listener
    window.addEventListener('resize', closeOnResize, {passive: true});
    
    // Also close the menu when clicking on any link inside it (for better usability)
    mobileMenu.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && !e.target.classList.contains('no-close')) {
            // Close menu after a slight delay to allow the click to register
            setTimeout(() => {
                toggleMenu();
            }, 150);
        }
    });
    
    // Add escape key handler for accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            toggleMenu();
        }
    });
}

function initSmoothScroll() {
    // Use event delegation for better performance - attach one listener to document
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return; // Not clicking on an anchor link
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return; // Empty hash, ignore
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, {passive: false}); // Can't be passive because we're calling preventDefault
}
