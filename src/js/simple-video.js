/**
 * Enhanced Video Handler v3.0
 * 
 * This script handles video playback with modal functionality:
 * - Videos do not autoplay by default
 * - Clicking on a video opens it in a full-screen modal
 * - Modal videos play with audio enabled
 * - Videos are lazy-loaded for better performance
 * - Adds loading states and error handling
 * - Automatically wraps videos in video-container if not already wrapped
 * - Enhanced visual indicators for click-to-play functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find all videos on the page
    const videos = document.querySelectorAll('video');
    
    // Function to wrap video in container if not already wrapped
    const ensureVideoContainer = function(video) {
        if (!video.closest('.video-container')) {
            const container = document.createElement('div');
            container.className = 'video-container';
            video.parentNode.insertBefore(container, video);
            container.appendChild(video);
        }
        return video.closest('.video-container');
    };
    
    
    videos.forEach(video => {
        // Ensure video is wrapped in container
        const container = ensureVideoContainer(video);
        
        // Ensure video never autoplays and is properly configured
        video.pause();
        video.removeAttribute('autoplay');
        video.setAttribute('preload', 'metadata'); // Only load metadata, not full video
        video.muted = true; // Keep muted for inline videos
        video.controls = false; // Remove controls from inline videos
        
        // Prevent any automatic playback
        video.addEventListener('canplaythrough', function() {
            video.pause(); // Ensure video stays paused even when ready
        });
        
        video.addEventListener('loadeddata', function() {
            video.pause(); // Ensure video stays paused when data loads
        });
        
        // Add visual indicator that video is ready to play
        if (container) {
            container.classList.add('ready-to-play');
            container.classList.remove('playing', 'loading');
            
            // Add play button overlay if it doesn't exist
            if (!container.querySelector('.video-play-overlay')) {
                const playOverlay = document.createElement('div');
                playOverlay.className = 'video-play-overlay absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all duration-300 cursor-pointer group';
                
                const playButton = document.createElement('div');
                playButton.className = 'play-button-circle w-16 h-16 md:w-20 md:h-20 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300';
                playButton.innerHTML = `
                    <svg class="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                `;
                
                playOverlay.appendChild(playButton);
                container.appendChild(playOverlay);
                
                // Handle overlay click
                playOverlay.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    videoModal.open();
                });
            }
        }
        
        // Create modal functionality for full-screen video playback
        const createVideoModal = function(originalVideo) {
            // Create modal overlay
            const modal = document.createElement('div');
            modal.className = 'video-modal fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4';
            modal.style.display = 'none';
            
            // Create modal content container
            const modalContent = document.createElement('div');
            modalContent.className = 'relative w-full h-full max-w-6xl max-h-full flex items-center justify-center';
            
            // Create close button
            const closeButton = document.createElement('button');
            closeButton.innerHTML = '×';
            closeButton.className = 'absolute top-4 right-4 text-white text-4xl font-bold z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition-all duration-300';
            closeButton.setAttribute('aria-label', 'Close video');
            
            // Create modal video element
            const modalVideo = document.createElement('video');
            modalVideo.className = 'w-full h-full object-contain rounded-lg';
            modalVideo.controls = true;
            modalVideo.autoplay = false; // Don't autoplay initially
            modalVideo.muted = false; // Enable audio in modal
            modalVideo.preload = 'metadata';
            modalVideo.src = originalVideo.currentSrc || originalVideo.src;
            
            // Add escape key listener
            const handleEscape = function(e) {
                if (e.key === 'Escape') {
                    closeModal();
                }
            };
            
            // Close modal function
            const closeModal = function() {
                modalVideo.pause();
                modalVideo.currentTime = 0;
                modal.style.display = 'none';
                document.body.style.overflow = '';
                document.removeEventListener('keydown', handleEscape);
                
                // Resume original video at current time if it was playing
                if (!originalVideo.paused) {
                    originalVideo.currentTime = modalVideo.currentTime;
                    originalVideo.play();
                }
            };
            
            // Open modal function
            const openModal = function() {
                // Pause original video and sync time
                const currentTime = originalVideo.currentTime;
                originalVideo.pause();
                modalVideo.currentTime = currentTime;
                
                // Show modal
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Add event listeners
                document.addEventListener('keydown', handleEscape);
                
                // Only play video in modal after user interaction (click)
                // Wait a bit for modal to show, then play
                setTimeout(() => {
                    modalVideo.play().catch(e => {
                        console.log('Modal video play failed (this is normal if no user interaction):', e);
                        // If autoplay fails, show play button
                        modalVideo.controls = true;
                    });
                }, 100);
            };
            
            // Event listeners
            closeButton.addEventListener('click', closeModal);
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
            
            // Assemble modal
            modalContent.appendChild(closeButton);
            modalContent.appendChild(modalVideo);
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            return {
                open: openModal,
                close: closeModal,
                element: modal
            };
        };
        
        // Create modal for this video
        const videoModal = createVideoModal(video);
        
        // Modified click to play/pause functionality - now opens modal
        video.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent any default behavior
            e.stopPropagation(); // Prevent event bubbling
            
            // Open video in modal instead of inline play/pause
            videoModal.open();
            console.log('Video opened in modal');
        });
        
        // Add loading indicator and error handling
        if (container) {
            // Handle video loaded metadata
            video.addEventListener('loadedmetadata', function() {
                console.log('Video metadata loaded:', video.currentSrc || video.src);
                container.classList.remove('loading');
            });
            
            // Handle errors
            video.addEventListener('error', function(e) {
                console.error('Video error:', e);
                container.classList.remove('loading');
                container.classList.add('error');
            });
        }
        
        // Lazy loading for videos with data-src
        if (video.dataset.src && !video.src) {
            video.src = video.dataset.src;
        }
        
        console.log('Video initialized for click-to-play:', video.currentSrc || video.src);
    });
});
