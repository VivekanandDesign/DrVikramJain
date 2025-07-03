/**
 * Enhanced Simple Navigation System
 * 
 * This script implements a reliable navigation system with consistent paths
 * regardless of where the user is on the website.
 * 
 * Version 2.0: Improved path handling and error checking
 */
document.addEventListener('DOMContentLoaded', function() {
    // Simple function to handle all navigation links
    function setupNavigation() {
        console.log('Setting up enhanced simple navigation');
        
        // Determine if we're in a subpage
        const isSubPage = window.location.pathname.includes('/pages/');
        const prefix = isSubPage ? '../' : '';
        const rootPrefix = isSubPage ? '..' : '';
        
        console.log('Current path:', window.location.pathname);
        console.log('Is subpage:', isSubPage);
        
        // Handle all navigation links
        const navLinks = {
            // Main navigation
            'homeLink': rootPrefix + '/',
            'aboutLink': rootPrefix + '/pages/about.html',
            'servicesLink': rootPrefix + '/pages/services.html',
            'contactLink': rootPrefix + '/pages/contact.html',
            'experienceLink': rootPrefix + '/pages/experience.html',
            
            // Mobile navigation
            'mobileHomeLink': rootPrefix + '/',
            'mobileAboutLink': rootPrefix + '/pages/about.html',
            'mobileServicesLink': rootPrefix + '/pages/services.html',
            'mobileContactLink': rootPrefix + '/pages/contact.html'
        };
        
        // Fix paths by removing any double slashes
        Object.keys(navLinks).forEach(key => {
            navLinks[key] = navLinks[key].replace(/\/\//g, '/');
            // If path starts with a single slash and we're in a subpage, add the prefix
            if (isSubPage && navLinks[key].startsWith('/')) {
                navLinks[key] = '..' + navLinks[key];
            }
        });
        
        // Set all navigation links
        Object.keys(navLinks).forEach(function(id) {
            const link = document.getElementById(id);
            if (link) {
                // Set href directly - use appropriate paths based on location
                link.setAttribute('href', navLinks[id]);
                console.log(`Set ${id} to ${navLinks[id]}`);
            }
        });
        
        // Also update all nav-link class elements
        document.querySelectorAll('.nav-link').forEach(function(link) {
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Update based on text content for better reliability
            const text = link.textContent.trim().toLowerCase();
            
            if (text.includes('home') || href.includes('index') || href === '/' || href === '') {
                link.setAttribute('href', isSubPage ? '../' : '/');
            } else if (text.includes('about')) {
                link.setAttribute('href', isSubPage ? '../pages/about.html' : '/pages/about.html');
            } else if (text.includes('services')) {
                link.setAttribute('href', isSubPage ? '../pages/services.html' : '/pages/services.html');
            } else if (text.includes('contact')) {
                link.setAttribute('href', isSubPage ? '../pages/contact.html' : '/pages/contact.html');
            } else if (text.includes('experience')) {
                link.setAttribute('href', isSubPage ? '../pages/experience.html' : '/pages/experience.html');
            }
        });
        
        // Handle all anchor tags with data-nav attribute for custom navigation
        document.querySelectorAll('a[data-nav]').forEach(function(anchor) {
            const navType = anchor.getAttribute('data-nav');
            
            switch(navType) {
                case 'home':
                case 'home-mobile':
                    anchor.setAttribute('href', isSubPage ? '../' : '/');
                    break;
                case 'about':
                case 'about-mobile':
                    anchor.setAttribute('href', isSubPage ? '../pages/about.html' : '/pages/about.html');
                    break;
                case 'services':
                case 'services-mobile':
                    anchor.setAttribute('href', isSubPage ? '../pages/services.html' : '/pages/services.html');
                    break;
                case 'contact':
                case 'contact-mobile':
                    anchor.setAttribute('href', isSubPage ? '../pages/contact.html' : '/pages/contact.html');
                    break;
                case 'experience':
                    anchor.setAttribute('href', isSubPage ? '../pages/experience.html' : '/pages/experience.html');
                    break;
            }
        });
        
        console.log('Enhanced simple navigation setup complete');
    }
    
    // Run navigation setup immediately
    setupNavigation();
    
    // Also run when components are loaded, with multiple retries
    let setupAttempts = 0;
    const maxSetupAttempts = 3;
    
    document.addEventListener('component:loaded', function() {
        // Small delay to ensure components are fully rendered
        setTimeout(function() {
            setupNavigation();
            setupAttempts++;
            
            // Additional check after components are fully loaded and rendered
            setTimeout(function() {
                // Re-check navigation links to ensure they're correct
                if (setupAttempts < maxSetupAttempts) {
                    console.log(`Additional navigation check ${setupAttempts} of ${maxSetupAttempts}`);
                    setupNavigation();
                }
            }, 500);
        }, 100);
    });
    
    // Final check after all page content is loaded
    window.addEventListener('load', function() {
        // Final check to ensure navigation is correct
        setTimeout(setupNavigation, 300);
        
        // Fix any remaining navigation issues
        document.querySelectorAll('a').forEach(function(link) {
            const href = link.getAttribute('href');
            
            // Handle common navigation errors
            if (href === 'about.html' || href === './about.html') {
                link.setAttribute('href', window.location.pathname.includes('/pages/') ? 
                    '../pages/about.html' : '/pages/about.html');
            }
            
            if (href === 'contact.html' || href === './contact.html') {
                link.setAttribute('href', window.location.pathname.includes('/pages/') ? 
                    '../pages/contact.html' : '/pages/contact.html');
            }
            
            if (href === 'services.html' || href === './services.html') {
                link.setAttribute('href', window.location.pathname.includes('/pages/') ? 
                    '../pages/services.html' : '/pages/services.html');
            }
            
            // Replace any double slashes in URLs
            if (href && href.includes('//')) {
                link.setAttribute('href', href.replace(/\/\//g, '/'));
            }
        });
    });
});
