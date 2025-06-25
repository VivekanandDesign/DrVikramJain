// Debug script for navigation issues
(function() {
    // Execute on page load to check if we arrived here from another page
    document.addEventListener('DOMContentLoaded', function() {
        // Check if we have debug info from previous navigation
        const lastClicked = localStorage.getItem('nav_debug_last_clicked');
        const lastHref = localStorage.getItem('nav_debug_last_href');
        const timestamp = localStorage.getItem('nav_debug_timestamp');
        
        if (lastClicked && lastHref && timestamp) {
            const timeAgo = Math.round((new Date() - new Date(timestamp)) / 1000);
            
            // Only show if navigation was recent (within last 5 seconds)
            if (timeAgo < 5) {
                console.log('%c NAVIGATION DEBUG - PAGE LOADED %c', 'background: #dc3545; color: white; padding: 2px 5px;', '');
                console.log('Last clicked element:', lastClicked);
                console.log('Expected to navigate to:', lastHref);
                console.log('Actually navigated to:', window.location.href);
                console.log('Time between click and load:', timeAgo, 'seconds');
                
                // Clear debug info to avoid confusion on future manual page loads
                setTimeout(() => {
                    localStorage.removeItem('nav_debug_last_clicked');
                    localStorage.removeItem('nav_debug_last_href');
                    localStorage.removeItem('nav_debug_timestamp');
                }, 1000);
            }
        }
        
        // Record current page for debugging purposes
        localStorage.setItem('nav_debug_current_page', window.location.href);
    });
})();
