// Lightweight component loader with caching
(function() {
    // Component cache to avoid multiple fetches
    const componentCache = {};
    
    // Pre-load critical components
    const CRITICAL_COMPONENTS = [
        { url: 'src/components/navbar.html', targetId: 'navbarComponent' },
        { url: 'src/components/footer.html', targetId: 'footerComponent' }
    ];
    
    // Enhanced component path handling - VERSION 2.0
    function getComponentPath(url) {
        const pathname = window.location.pathname;
        const hostname = window.location.hostname;
        
        console.log('%c COMPONENT LOADER v2 - PATH DETECTION %c', 'background: #6f42c1; color: white; padding: 2px 5px;', '');
        console.log('Processing component URL:', url);
        console.log('Current pathname:', pathname);
        
        // Multiple checks for robust path detection
        const inPagesDir = pathname.includes('/pages/') || 
                          pathname.includes('pages/') || 
                          pathname.match(/\/pages\/[^\/]+\.html$/);
        
        console.log('Is in pages directory:', inPagesDir);
        
        // Store for debugging
        localStorage.setItem('component_loader_pathname', pathname);
        localStorage.setItem('component_loader_in_pages', inPagesDir ? 'true' : 'false');
        
        // Ensure components are loaded from the correct relative path
        let adjustedUrl = url;
        if (inPagesDir && !url.startsWith('../')) {
            adjustedUrl = '../' + url;
            console.log('Adjusted component path to:', adjustedUrl);
        }
        
        // Additional logging for debugging
        console.log('Final component URL:', adjustedUrl);
        return adjustedUrl;
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
        
        // After components are loaded, ensure static navigation is applied 
        setTimeout(() => {
            // Dispatch event for static navigation to handle
            document.dispatchEvent(new CustomEvent('component:loaded'));
            console.log('Component loader triggering static navigation');
        }, 200); // Give components time to load
    }, { once: true });
})();
