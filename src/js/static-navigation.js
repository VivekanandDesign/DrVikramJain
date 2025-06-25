/**
 * Static Navigation System
 * 
 * This script implements a simple, static navigation system that works regardless of page location.
 * It uses absolute URLs that don't require path detection or transformation.
 * 
 * This approach ensures navigation works consistently across all pages.
 */
(function() {
    // Run on DOMContentLoaded to ensure all elements are available
    document.addEventListener('DOMContentLoaded', function() {
        initializeStaticNavigation();
        
        // Also run when components are loaded
        document.addEventListener('component:loaded', function() {
            // Use a slight delay to ensure DOM is updated
            setTimeout(initializeStaticNavigation, 100);
        });
    });
    
    function initializeStaticNavigation() {
        console.log('Static navigation system initializing...');
        
        // Define navigation map with absolute URLs
        const navigationMap = {
            // Desktop navigation
            'homeLink': '/index.html',
            'aboutLink': '/pages/about.html',
            'servicesLink': '/pages/services.html',
            'contactLink': '/pages/contact.html',
            
            // Mobile navigation
            'mobileHomeLink': '/index.html',
            'mobileAboutLink': '/pages/about.html',
            'mobileServicesLink': '/pages/services.html',
            'mobileContactLink': '/pages/contact.html'
        };
        
        // Force absolute paths for all navigation links
        Object.keys(navigationMap).forEach(function(id) {
            const link = document.getElementById(id);
            if (link) {
                const absoluteUrl = navigationMap[id];
                
                // Set the href attribute directly
                link.setAttribute('href', absoluteUrl);
                
                // Mark as static navigation
                link.setAttribute('data-static-nav', 'true');
                
                console.log(`Static navigation: Set ${id} to ${absoluteUrl}`);
            }
        });
        
        // Also handle any links with nav-link class
        document.querySelectorAll('.nav-link:not([data-static-nav="true"])').forEach(function(link) {
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Standardize URLs for consistency
            if (href.includes('about.html')) {
                link.setAttribute('href', '/pages/about.html');
                link.setAttribute('data-static-nav', 'true');
            } else if (href.includes('services.html')) {
                link.setAttribute('href', '/pages/services.html');
                link.setAttribute('data-static-nav', 'true');
            } else if (href.includes('contact.html')) {
                link.setAttribute('href', '/pages/contact.html');
                link.setAttribute('data-static-nav', 'true');
            } else if (href.includes('index.html') || href === '/' || href === '') {
                link.setAttribute('href', '/index.html');
                link.setAttribute('data-static-nav', 'true');
            }
        });
        
        console.log('Static navigation system initialized');
    }
})();
