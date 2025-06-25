/**
 * Page loader control script
 * This script controls the page loader component and ensures all content is fully loaded
 * before removing the loading screen.
 */

document.addEventListener('DOMContentLoaded', function() {
    // First make sure the loader is visible during loading
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.style.opacity = '1';
        loader.style.display = 'flex';
    }
    
    // Keep track of component loading
    const componentsToLoad = ['navbarComponent', 'footerComponent'];
    let loadedComponents = 0;
    
    // Function to check if all components have loaded
    function checkAllComponentsLoaded() {
        loadedComponents++;
        if (loadedComponents >= componentsToLoad.length) {
            // Additional delay to ensure scripts execute
            setTimeout(hideLoader, 500);
        }
    }
    
    // Function to hide loader
    function hideLoader() {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }
    }
    
    // Check if components exist and are loaded
    componentsToLoad.forEach(componentId => {
        const component = document.getElementById(componentId);
        if (component) {
            // Use MutationObserver to detect when content is added to component
            const observer = new MutationObserver((mutations, obs) => {
                if (component.innerHTML.trim() !== '') {
                    checkAllComponentsLoaded();
                    obs.disconnect(); // Stop observing once loaded
                }
            });
            
            // Start observing
            observer.observe(component, { childList: true, subtree: true });
            
            // Failsafe: if after 3 seconds the component hasn't loaded, continue anyway
            setTimeout(() => {
                observer.disconnect();
                checkAllComponentsLoaded();
            }, 3000);
        } else {
            // Component doesn't exist, consider it loaded
            checkAllComponentsLoaded();
        }
    });
    
    // Failsafe: if after 5 seconds the page still shows loader, hide it
    setTimeout(hideLoader, 5000);
});
