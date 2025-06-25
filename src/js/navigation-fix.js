// This script ensures navigation links work correctly from any page
document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links
    const navLinks = document.querySelectorAll('a[href*="pages/"]');
    
    // Determine if we're in the root or in a subfolder
    const isInSubfolder = window.location.pathname.includes('/pages/');
    const prefix = isInSubfolder ? '../' : '';
    
    // Update each link
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // Only process relative links to pages
        if (href && (href.startsWith('/pages/') || href.startsWith('../pages/'))) {
            // Extract the page name
            const pageName = href.split('/').pop();
            // Set the correct path
            link.setAttribute('href', prefix + 'pages/' + pageName);
            
            // Add click handler for additional reliability
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = prefix + 'pages/' + pageName;
            });
        }
        
        // Fix home link
        if (href === '/' || href === '/index.html') {
            link.setAttribute('href', isInSubfolder ? '../' : '/');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = isInSubfolder ? '../' : '/';
            });
        }
    });
});
