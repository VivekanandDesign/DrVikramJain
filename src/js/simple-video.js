/**
 * Enhanced Video Handler
 * 
 * This script ensures videos autoplay reliably across all devices:
 * - Supports autoplay on mobile devices with workarounds
 * - Clicking on a video will pause/play it
 * - Videos are lazy-loaded for better performance
 * - Adds loading states and error handling
 * - Uses visibility detection to play videos when they're visible
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find all videos on the page
    const videos = document.querySelectorAll('video');
    
    // Check if we're on iOS or mobile Safari (which have strict autoplay policies)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isMobileSafari = isIOS && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    // Function to attempt playback with retry logic
    const attemptPlay = function(video) {
        if (video.paused) {
            // Try to play with promise handling (modern browsers)
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Autoplay started successfully
                    const container = video.closest('.video-container');
                    if (container) container.classList.add('playing');
                }).catch(error => {
                    // Autoplay was prevented
                    console.log('Autoplay prevented:', error);
                    
                    // Add a visual cue that user interaction is needed for mobile
                    const container = video.closest('.video-container');
                    if (container) container.classList.add('needs-interaction');
                    
                    // For mobile devices, try to play on first user interaction with the document
                    const playOnInteraction = function() {
                        video.play().then(() => {
                            if (container) {
                                container.classList.remove('needs-interaction');
                                container.classList.add('playing');
                            }
                        }).catch(e => console.log('Still could not play video:', e));
                        
                        // Remove these event listeners after first interaction
                        document.removeEventListener('touchstart', playOnInteraction);
                        document.removeEventListener('click', playOnInteraction);
                    };
                    
                    document.addEventListener('touchstart', playOnInteraction, {once: true});
                    document.addEventListener('click', playOnInteraction, {once: true});
                });
            }
        }
    };
    
    videos.forEach(video => {
        // Add click to play/pause functionality
        video.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent any default behavior
            if (video.paused) {
                video.play();
                const container = video.closest('.video-container');
                if (container) container.classList.add('playing');
            } else {
                video.pause();
                const container = video.closest('.video-container');
                if (container) container.classList.remove('playing');
            }
        });
        
        // Add loading indicator
        const container = video.closest('.video-container');
        if (container) {
            // Add loading state
            container.classList.add('loading');
            
            // Remove loading state when video is ready
            video.addEventListener('loadeddata', function() {
                container.classList.remove('loading');
                
                // Try to play the video when it's loaded
                attemptPlay(video);
            });
            
            // Handle errors
            video.addEventListener('error', function(e) {
                console.error('Video error:', e);
                container.classList.remove('loading');
                container.classList.add('error');
            });
        }
        
        // Use Intersection Observer for visibility-based autoplay
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // If video has a data-src attribute, set the src
                        if (video.dataset.src) {
                            video.src = video.dataset.src;
                        }
                        
                        // If the video is ready, try to play it
                        if (video.readyState >= 3) {
                            attemptPlay(video);
                        }
                        
                        observer.unobserve(video);
                    }
                });
            }, {threshold: 0.1}); // Trigger when at least 10% of the video is visible
            
            observer.observe(video);
        }
        
        // For mobile Safari - use a page visibility check
        if (isMobileSafari) {
            document.addEventListener('visibilitychange', function() {
                if (document.visibilityState === 'visible') {
                    attemptPlay(video);
                }
            });
        }
    });
});
