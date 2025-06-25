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
            
            // Create context-aware paths based on current location
            if (id.includes('home')) {
                element.href = basePath + 'index.html';
                console.log('Set home link to:', element.href);
            } else if (id.includes('about')) {
                element.href = basePath + pagesPath + 'about.html';
                console.log('Set about link to:', element.href);
            } else if (id.includes('service')) {
                element.href = basePath + pagesPath + 'services.html';
                console.log('Set services link to:', element.href);
            } else if (id.includes('contact')) {
                element.href = basePath + pagesPath + 'contact.html';
                console.log('Set contact link to:', element.href);
            }
            
            // Add event listener to debug the navigation and prevent default if needed
            element.addEventListener('click', function(e) {
                console.log('Navigation clicked:', this.id, 'href =', this.href);
            });
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
            
            // Handle home link with explicit path setting
            if (href === '/' || href === 'index.html' || href === '/index.html') {
                link.href = basePath + 'index.html';
                console.log('Fixed index link to:', link.href);
            }
            // Handle page links for links that explicitly include 'pages/'
            else if (href.includes('pages/')) {
                const pageName = href.split('/').pop();
                if (pageName) {
                    // Always use the correct path based on current location
                    link.href = inPagesDir ? pageName : 'pages/' + pageName;
                    console.log('Fixed pages/ link from', href, 'to', link.href);
                }
            }
            // Special case for root-relative links starting with /pages/
            else if (href.startsWith('/pages/')) {
                const pageName = href.split('/').pop();
                if (pageName) {
                    // Keep absolute path format when on root, use relative path when in pages dir
                    link.href = inPagesDir ? pageName : href.substring(1); // remove leading slash but keep pages/
                    console.log('Fixed /pages/ link from', href, 'to', link.href);
                }
            }
            // Handle links to assets that might be relative to root
            else if (href.startsWith('src/') && inPagesDir) {
                link.href = '../' + href;
                console.log('Fixed src/ link from', href, 'to', link.href);
            }
            // Handle links starting with / (root-relative)
            else if (href.startsWith('/') && !href.startsWith('/pages/') && inPagesDir) {
                link.href = '..' + href;
                console.log('Fixed root-relative link from', href, 'to', link.href);
            }
            // Handle explicit links between pages that might not have the right form
            else if ((href.endsWith('.html') || href.includes('.html#')) && !href.includes('/') && inPagesDir && !link.id) {
                // This is likely a direct reference to another page in the same directory
                // No change needed, but log to confirm
                console.log('Keeping direct page reference:', href);
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
            
            // Fix any absolute URLs that don't have the right prefix
            document.querySelectorAll('a[href^="/pages/"]').forEach(link => {
                const href = link.getAttribute('href');
                // Extract just the filename from /pages/filename.html
                const fileName = href.split('/').pop();
                if (fileName) {
                    link.setAttribute('href', fileName);
                    console.log('Fixed absolute pages link from', href, 'to', fileName);
                }
            });
        }
        
        // Handle special case for links from index to pages directory
        if (!inPagesDir) {
            // Fix any navbar links that need to be direct
            specialNavIds.forEach(id => {
                const element = document.getElementById(id);
                if (!element) return;
                
                const href = element.getAttribute('href');
                // Check if this is a navbar link that uses absolute path
                if (href && href.startsWith('/pages/')) {
                    // Convert to proper relative path from root
                    element.href = href.substring(1); // Remove leading slash only
                    console.log('Fixed absolute navbar link to relative:', element.href);
                }
            });
        }

        // Dispatch an event to indicate navigation has been fixed
        document.dispatchEvent(new CustomEvent('navigation:fixed'));
        console.log('Navigation fix complete');
    }
})();
