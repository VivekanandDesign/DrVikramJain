/**
 * Ultimate Static Navigation System - VERSION 2.0
 * 
 * This script implements a robust, static navigation system that works regardless of page location.
 * It uses a hybrid approach with both relative and absolute paths to ensure maximum compatibility.
 * 
 * This is the MAIN navigation script - no other navigation scripts should be used.
 */
(function() {
    // Initialize navigation as soon as possible AND when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeStaticNavigation();
        });
    } else {
        initializeStaticNavigation();
    }
    
    // Also run when components are loaded
    document.addEventListener('component:loaded', function() {
        // Immediate execution - no delay needed
        initializeStaticNavigation();
        
        // Also run a second time after a small delay to catch late changes
        setTimeout(initializeStaticNavigation, 100);
    });
    
    // Make function available globally for debugging
    window.initializeStaticNavigation = initializeStaticNavigation;
    
    function initializeStaticNavigation() {
        console.log('%c STATIC NAVIGATION v2 - INITIALIZING %c', 'background: #0066cc; color: white; padding: 2px 5px;', '');
        
        // Accurate path detection
        const pathname = window.location.pathname;
        const hostname = window.location.hostname;
        
        // Multiple checks to ensure robust path detection
        const inPagesDir = pathname.includes('/pages/') || 
                          pathname.includes('pages/') || 
                          pathname.match(/\/pages\/[^\/]+\.html$/);
                          
        console.log('Current pathname:', pathname);
        console.log('Page location detection - In pages directory:', inPagesDir);
        
        // Store location for debugging
        localStorage.setItem('nav_debug_last_path', pathname);
        localStorage.setItem('nav_debug_in_pages', inPagesDir ? 'true' : 'false');
        
        // Define navigation map with context-aware URLs
        const navigationMap = {
            // Format: 'linkId': { root: 'path for root dir', pages: 'path for pages dir', absolute: 'absolute path' }
            // Desktop navigation
            'homeLink': {
                root: 'index.html',
                pages: '../index.html',
                absolute: '/index.html'
            },
            'aboutLink': {
                root: 'pages/about.html',
                pages: 'about.html',
                absolute: '/pages/about.html'
            },
            'servicesLink': {
                root: 'pages/services.html',
                pages: 'services.html',
                absolute: '/pages/services.html'
            },
            'contactLink': {
                root: 'pages/contact.html',
                pages: 'contact.html',
                absolute: '/pages/contact.html'
            },
            
            // Mobile navigation
            'mobileHomeLink': {
                root: 'index.html',
                pages: '../index.html',
                absolute: '/index.html'
            },
            'mobileAboutLink': {
                root: 'pages/about.html',
                pages: 'about.html',
                absolute: '/pages/about.html'
            },
            'mobileServicesLink': {
                root: 'pages/services.html',
                pages: 'services.html',
                absolute: '/pages/services.html'
            },
            'mobileContactLink': {
                root: 'pages/contact.html',
                pages: 'contact.html',
                absolute: '/pages/contact.html'
            },
            
            // Experience page link
            'experienceLink': {
                root: 'pages/experience.html',
                pages: 'experience.html',
                absolute: '/pages/experience.html'
            }
        };
        
        // Apply context-aware paths for all navigation links
        Object.keys(navigationMap).forEach(function(id) {
            const link = document.getElementById(id);
            if (link) {
                // Choose the right path based on current location
                const paths = navigationMap[id];
                
                // Try to determine if we're on a deployed site vs local development
                const isDeployed = window.location.hostname.includes('netlify.app') || 
                                  !window.location.hostname.includes('localhost');
                                  
                // Use absolute paths in production, relative in development
                let correctPath;
                if (isDeployed) {
                    correctPath = paths.absolute; // Always use absolute paths in production
                } else {
                    correctPath = inPagesDir ? paths.pages : paths.root; // Use relative paths in development
                }
                
                // Set the href attribute directly
                link.setAttribute('href', correctPath);
                
                // Add debugging attribute
                link.setAttribute('data-static-nav', 'true');
                link.setAttribute('data-static-nav-version', '2.0');
                link.setAttribute('data-location', inPagesDir ? 'pages' : 'root');
                
                // Enhanced click tracking for debugging
                link.addEventListener('click', function(e) {
                    // Log detailed information about the navigation
                    console.log('%c NAVIGATION CLICK v2 %c', 'background: #28a745; color: white; padding: 2px 5px;', '');
                    console.log('Link clicked:', this.id);
                    console.log('Navigating to:', this.href);
                    console.log('From page:', window.location.pathname);
                    
                    // Store debug info in localStorage for cross-page debugging
                    localStorage.setItem('nav_click_id', this.id);
                    localStorage.setItem('nav_click_href', this.href);
                    localStorage.setItem('nav_click_from', window.location.pathname);
                    localStorage.setItem('nav_click_time', new Date().toISOString());
                }, { passive: true });
                
                console.log(`Static navigation v2: Set ${id} to ${correctPath}`);
            }
        });
        
        // Also handle any links with nav-link class
        document.querySelectorAll('.nav-link:not([data-static-nav="true"])').forEach(function(link) {
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Context-aware path handling
            if (href.includes('about.html')) {
                link.setAttribute('href', inPagesDir ? 'about.html' : 'pages/about.html');
                link.setAttribute('data-static-nav', 'true');
                link.setAttribute('data-static-nav-version', '2.0');
            } else if (href.includes('services.html')) {
                link.setAttribute('href', inPagesDir ? 'services.html' : 'pages/services.html');
                link.setAttribute('data-static-nav', 'true');
                link.setAttribute('data-static-nav-version', '2.0');
            } else if (href.includes('contact.html')) {
                link.setAttribute('href', inPagesDir ? 'contact.html' : 'pages/contact.html');
                link.setAttribute('data-static-nav', 'true');
                link.setAttribute('data-static-nav-version', '2.0');
            } else if (href.includes('index.html') || href === '/' || href === '') {
                link.setAttribute('href', inPagesDir ? '../index.html' : 'index.html');
                link.setAttribute('data-static-nav', 'true');
                link.setAttribute('data-static-nav-version', '2.0');
            } else if (href.includes('experience.html')) {
                link.setAttribute('href', inPagesDir ? 'experience.html' : 'pages/experience.html');
                link.setAttribute('data-static-nav', 'true');
                link.setAttribute('data-static-nav-version', '2.0');
            }
            
            // Add enhanced click tracking to any fixed nav links
            if (link.getAttribute('data-static-nav') === 'true') {
                link.addEventListener('click', function(e) {
                    console.log('%c NAV LINK CLICK v2 %c', 'background: #28a745; color: white; padding: 2px 5px;', '');
                    console.log('Link text:', this.textContent.trim());
                    console.log('Navigating to:', this.href);
                    
                    // Store debug info in localStorage
                    localStorage.setItem('nav_click_class', 'nav-link');
                    localStorage.setItem('nav_click_href', this.href);
                    localStorage.setItem('nav_click_text', this.textContent.trim());
                }, { passive: true });
            }
        });
        
        // Log navigation completion
        console.log('%c STATIC NAVIGATION v2 - COMPLETED %c', 'background: #0066cc; color: white; padding: 2px 5px;', '');
        
        // Dispatch custom event that navigation has been set up
        document.dispatchEvent(new CustomEvent('navigation:initialized', {
            detail: { timestamp: new Date().getTime() }
        }));
    }
})();
