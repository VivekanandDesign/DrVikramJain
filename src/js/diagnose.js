/**
 * Navigation Diagnostics Tool
 * This script helps diagnose navigation issues in real-time
 */
(function() {
    // Run diagnostics as soon as possible
    runDiagnostics();
    
    // Also run on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', runDiagnostics);
    
    // Run every time components are loaded
    document.addEventListener('component:loaded', function(e) {
        console.debug('Component loaded event received:', e.detail?.targetId || 'unnamed component');
        setTimeout(runDiagnostics, 50);
    });

    function runDiagnostics() {
        // Current page info
        const path = window.location.pathname;
        const href = window.location.href;
        const pageName = path.split('/').pop() || 'index.html';
        
        console.debug('%c NAVIGATION DIAGNOSIS %c', 'background: #ff9a3c; color: white; padding: 2px 5px;', '');
        console.debug('Current page:', pageName);
        console.debug('URL path:', path);
        
        // Check navbar
        const navbarEl = document.getElementById('navbarComponent');
        if (navbarEl) {
            const hasChildren = navbarEl.children.length > 0;
            console.debug('✅ Navbar container found with content:', hasChildren);
            
            // Check navigation links
            const navLinks = document.querySelectorAll('a[data-static-nav="true"]');
            console.debug('Navigation links found:', navLinks.length);
            
            // Log each navigation link
            navLinks.forEach(link => {
                console.debug(`- Link [${link.id || 'unnamed'}]: ${link.textContent.trim()} → ${link.href}`);
            });
            
            // Specifically check services link
            const servicesLinks = document.querySelectorAll('#servicesLink, #mobileServicesLink');
            servicesLinks.forEach(link => {
                console.debug(`🔍 SERVICES LINK CHECK: ID=${link.id}, href=${link.href}`);
            });
        } else {
            console.debug('❌ No navbar container found!');
        }
        
        // Check localStorage for navigation debugging data
        const lastClick = localStorage.getItem('nav_click_id');
        const lastClickHref = localStorage.getItem('nav_click_href');
        
        if (lastClick) {
            console.debug('Last clicked navigation:', lastClick);
            console.debug('Last clicked href:', lastClickHref);
        }
        
        // Check that static navigation is available
        if (window.initializeStaticNavigation) {
            console.debug('✅ Static navigation function is available');
        } else {
            console.debug('❌ Static navigation function is NOT available');
        }
    }
})();
