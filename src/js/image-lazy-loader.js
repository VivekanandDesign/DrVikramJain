/**
 * Lightweight image lazy loading and optimization utility
 * Improves performance by loading images only when they enter the viewport
 */
(function() {
    // Use IntersectionObserver for efficient lazy loading
    if ('IntersectionObserver' in window) {
        // Set up observer for all images with data-src
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: "100px", // Start loading when images are 100px from viewport
            threshold: 0.1 // Trigger when 10% of the image is visible
        });
        
        // Apply observer to all images with data-src
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
            
            // Re-check after components are loaded
            document.addEventListener('component:loaded', () => {
                document.querySelectorAll('img[data-src]:not(.loaded)').forEach(img => {
                    imageObserver.observe(img);
                });
            });
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        document.addEventListener('DOMContentLoaded', () => {
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
            });
        });
    }
})();
