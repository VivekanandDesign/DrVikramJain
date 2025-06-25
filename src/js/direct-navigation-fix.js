/**
 * Navigation Handler - Direct solution to fix navigation issues
 * This script directly manages navigation links to ensure they work correctly from any page
 */
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        fixNavigationDirectly();
        
        // Also run after components are loaded
        document.addEventListener('component:loaded', function() {
            setTimeout(fixNavigationDirectly, 100);
        });
    });
    
    function fixNavigationDirectly() {
        console.log('Direct navigation fix running');
        
        // Determine if we're in the pages directory
        const pathname = window.location.pathname;
        const inPagesDir = pathname.includes('/pages/');
        
        // Fix all navigation links with direct handling
        const navigationLinks = {
            // Format: 'linkId': {rootPath: '...', pagesPath: '...'}
            'homeLink': {rootPath: 'index.html', pagesPath: '../index.html'},
            'mobileHomeLink': {rootPath: 'index.html', pagesPath: '../index.html'},
            'aboutLink': {rootPath: 'pages/about.html', pagesPath: 'about.html'},
            'mobileAboutLink': {rootPath: 'pages/about.html', pagesPath: 'about.html'},
            'servicesLink': {rootPath: 'pages/services.html', pagesPath: 'services.html'},
            'mobileServicesLink': {rootPath: 'pages/services.html', pagesPath: 'services.html'},
            'contactLink': {rootPath: 'pages/contact.html', pagesPath: 'contact.html'},
            'mobileContactLink': {rootPath: 'pages/contact.html', pagesPath: 'contact.html'}
        };
        
        // Apply the correct paths based on current location
        Object.keys(navigationLinks).forEach(id => {
            const link = document.getElementById(id);
            if (!link) return;
            
            // Apply the correct path based on current location
            const paths = navigationLinks[id];
            const correctPath = inPagesDir ? paths.pagesPath : paths.rootPath;
            
            // Set the href directly
            link.href = correctPath;
            
            console.log(`Direct fix: Set ${id} href to ${correctPath}`);
            
            // Add click handler for extra safety
            link.addEventListener('click', function(e) {
                console.log(`Navigating to: ${this.href}`);
                // Let the default navigation happen
            });
        });
    }
})();
