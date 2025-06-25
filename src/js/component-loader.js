// Lightweight component loader with caching
(function() {
    // Component cache to avoid multiple fetches
    const componentCache = {};
    
    // Pre-load critical components
    const CRITICAL_COMPONENTS = [
        { url: 'src/components/navbar.html', targetId: 'navbarComponent' },
        { url: 'src/components/footer.html', targetId: 'footerComponent' }
    ];
    
    // Handle relative paths based on current location with improved path detection
    function getComponentPath(url) {
        const pathname = window.location.pathname;
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        
        // Super robust path detection - handle various patterns
        const inPagesDir = pathname.includes('/pages/') || pathname.endsWith('/pages') || 
                        pathname.includes('pages/') || pathname.match(/\/pages\/[^\/]+\.html$/) ||
                        (isLocalhost && pathname.match(/pages\/[^\/]+\.html$/));
                        
        // For pages directory, add ../ to paths that don't already have it
        if (inPagesDir && !url.startsWith('../')) {
            return '../' + url;
        }
        return url;
    }
    
    // Main component loading function
    window.loadComponent = async function(url, targetId) {
        const target = document.getElementById(targetId);
        if (!target) return;
        
        // Show a lightweight placeholder while loading
        target.innerHTML = '<div class="component-placeholder"></div>';
        
        try {
            const adjustedUrl = getComponentPath(url);
            
            // Use cached component if available
            if (!componentCache[adjustedUrl]) {
                const response = await fetch(adjustedUrl, { cache: 'force-cache' });
                if (!response.ok) throw new Error(`Failed to load ${adjustedUrl}`);
                const html = await response.text();
                componentCache[adjustedUrl] = html; // Cache the component
            }
            
            target.innerHTML = componentCache[adjustedUrl];
            
            // Execute any scripts in the loaded component
            const scripts = target.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                script.parentNode.replaceChild(newScript, script);
            });
            
            // Dispatch event for component loaded
            target.dispatchEvent(new CustomEvent('component:loaded'));
            document.dispatchEvent(new CustomEvent('component:loaded', { 
                detail: { targetId, url: adjustedUrl }
            }));
        } catch (error) {
            console.error('Error loading component:', error);
            target.innerHTML = `<div class="p-4 text-red-500">Failed to load component</div>`;
        }
    };
    
    // Pre-load critical components once DOM is interactive
    document.addEventListener('DOMContentLoaded', () => {
        const pagePath = window.location.pathname;
        const isRootPath = pagePath === '/' || pagePath.endsWith('index.html');
        
        CRITICAL_COMPONENTS.forEach(({ url, targetId }) => {
            const target = document.getElementById(targetId);
            if (target) {
                loadComponent(url, targetId);
            }
        });
    }, { once: true });
})();
