// Enhanced navigation path correction for relative URLs - Robust version
(function() {
    // Execute as early as possible
    function readyToFix() {
        // First attempt
        fixNavigation();
        
        // Also run on DOMContentLoaded to ensure all nav elements are available
        document.addEventListener('DOMContentLoaded', fixNavigation, {once: true});
        
        // Also run when components are loaded
        document.addEventListener('component:loaded', function(e) {
            // Delay slightly to let the DOM update
            setTimeout(fixNavigation, 50);
        });
        
        // Also fix on window load to handle any late-loaded components
        window.addEventListener('load', fixNavigation, {once: true});
    }
    
    // Start fixing as early as possible
    readyToFix();
    
    // Make the fixNavigation function globally available for direct calls from other scripts
    window.fixNavigation = fixNavigation;
    
    function fixNavigation() {
        // Determine location once for better performance
        const pathname = window.location.pathname;
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        
        // Super robust path detection - handle various patterns
        const inPagesDir = pathname.includes('/pages/') || pathname.endsWith('/pages') || 
                        pathname.includes('pages/') || pathname.match(/\/pages\/[^\/]+\.html$/) ||
                        (isLocalhost && pathname.match(/pages\/[^\/]+\.html$/));
                        
        console.log('Navigation fix running for path:', pathname);
        console.log('In pages directory:', inPagesDir);
        
        // More robust path handling
        let basePath = '';
        let pagesPath = 'pages/';
        
        if (inPagesDir) {
            basePath = '../';
            pagesPath = '';
        }
        
        // Special navigation elements - handle these first with direct IDs
        const specialNavIds = ['homeLink', 'mobileHomeLink', 'aboutLink', 'servicesLink', 'contactLink',
                              'mobileAboutLink', 'mobileServicesLink', 'mobileContactLink'];
        
        specialNavIds.forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;
            
            if (id.includes('home')) {
                element.href = basePath + 'index.html';
            } else if (id.includes('about')) {
                element.href = basePath + pagesPath + 'about.html';
            } else if (id.includes('service')) {
                element.href = basePath + pagesPath + 'services.html';
            } else if (id.includes('contact')) {
                element.href = basePath + pagesPath + 'contact.html';
            }
        });
        
        // Use minimal query to optimize performance for remaining links
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return; // Skip links without href
            if (href === '#') return; // Skip empty anchors
            if (href.startsWith('http')) return; // Skip absolute URLs
            if (href.startsWith('tel:') || href.startsWith('mailto:')) return; // Skip phone/email links
            
            // Skip links that were already processed
            if (specialNavIds.includes(link.id)) return;
            
            // Handle home link
            if (href === '/' || href === 'index.html' || href === '/index.html') {
                link.href = basePath + 'index.html';
            }
            // Handle page links for links that explicitly include 'pages/'
            else if (href.includes('pages/')) {
                const pageName = href.split('/').pop();
                if (pageName) {
                    link.href = inPagesDir ? pageName : 'pages/' + pageName;
                }
            }
            // Special case for root-relative links starting with /pages/
            else if (href.startsWith('/pages/')) {
                const pageName = href.split('/').pop();
                if (pageName) {
                    link.href = inPagesDir ? pageName : 'pages/' + pageName;
                }
            }
            // Handle links to assets that might be relative to root
            else if (href.startsWith('src/') && inPagesDir) {
                link.href = '../' + href;
            }
            // Handle links starting with / (root-relative)
            else if (href.startsWith('/') && !href.startsWith('/pages/') && inPagesDir) {
                link.href = '..' + href;
            }
        });

        // Special fix for pages directory links within the pages directory
        if (inPagesDir) {
            // Fix all other anchor tags that might point to pages/ incorrectly
            document.querySelectorAll('a[href^="pages/"]').forEach(link => {
                const href = link.getAttribute('href');
                // Extract just the filename from pages/filename.html
                const fileName = href.split('/').pop();
                if (fileName) {
                    link.setAttribute('href', fileName);
                    console.log('Fixed nested pages/ link from', href, 'to', fileName);
                }
            });
        }

        // Dispatch an event to indicate navigation has been fixed
        document.dispatchEvent(new CustomEvent('navigation:fixed'));
        console.log('Navigation fix complete');
    }
})();
