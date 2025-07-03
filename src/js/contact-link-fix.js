/**
 * Emergency fix for contact page navigation
 * This script specifically targets the contact links to ensure they work correctly from any page
 * This script is designed to run at the highest priority
 */
(function() {
    // Run immediately when loaded
    fixContactLinks();
    
    // Also run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixContactLinks);
    } else {
        setTimeout(fixContactLinks, 0);
    }
    
    // Run again after components are loaded
    document.addEventListener('component:loaded', function() {
        setTimeout(fixContactLinks, 0);
    });
    
    // Fix contact links function
    function fixContactLinks() {
        console.log('%c CONTACT LINK FIX - RUNNING %c', 'background: #dc3545; color: white; padding: 2px 5px;', '');
        
        // Target all contact links by ID and href
        const contactLinks = [
            ...Array.from(document.querySelectorAll('#contactLink, #mobileContactLink')),
            ...Array.from(document.querySelectorAll('a[href*="contact.html"]'))
        ];
        
        // Process all contact links
        contactLinks.forEach(link => {
            // Determine if we're in production
            const isProduction = window.location.hostname.includes('drvikramjain') ||
                               !window.location.hostname.includes('localhost');
            
            // Force absolute path in production for maximum reliability
            if (isProduction) {
                link.href = '/pages/contact.html';
                link.setAttribute('data-fixed-by', 'contact-link-fix.js');
                console.log('Production: Fixed contact link to absolute path:', link.href);
            } else {
                // For development, use relative path based on current page location
                const inPagesDir = window.location.pathname.includes('/pages/') || 
                                  window.location.pathname.includes('pages/') || 
                                  window.location.pathname.match(/\/pages\/[^\/]+\.html$/);
                                  
                const contactPath = inPagesDir ? 'contact.html' : 'pages/contact.html';
                link.href = contactPath;
                link.setAttribute('data-fixed-by', 'contact-link-fix.js');
                console.log(`Development: Fixed contact link to ${inPagesDir ? 'relative' : 'pages/'} path:`, link.href);
            }
            
            // Add debug click handler
            if (!link.getAttribute('data-click-debug')) {
                link.addEventListener('click', function(e) {
                    console.log('%c CONTACT LINK CLICKED %c', 'background: #28a745; color: white; padding: 2px 5px;', '');
                    console.log('Link href:', this.href);
                    console.log('From page:', window.location.pathname);
                    
                    // Store debug info
                    localStorage.setItem('contact_link_clicked', 'true');
                    localStorage.setItem('contact_link_href', this.href);
                    localStorage.setItem('contact_link_time', new Date().toISOString());
                });
                link.setAttribute('data-click-debug', 'true');
            }
        });
        
        console.log('%c CONTACT LINK FIX - COMPLETED %c', 'background: #dc3545; color: white; padding: 2px 5px;', '');
    }
})();
