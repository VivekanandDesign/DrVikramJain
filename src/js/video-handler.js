// Video playback handling
document.addEventListener('DOMContentLoaded', function() {
    // Find all videos on the page
    const videos = document.querySelectorAll('video');
    
    // Add error handling for each video
    videos.forEach(function(video) {
        // Handle video loading errors
        video.addEventListener('error', function(e) {
            console.error('Error loading video:', e);
            const videoParent = video.parentElement;
            
            // Create error message
            if (!videoParent.querySelector('.video-error-message')) {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'video-error-message absolute inset-0 flex items-center justify-center bg-gray-900/70 text-white p-4 text-center';
                errorMessage.innerHTML = '<div><i class="fas fa-exclamation-triangle text-yellow-400 text-2xl mb-2"></i><p>Unable to load video. Please try again later.</p></div>';
                videoParent.appendChild(errorMessage);
            }
        }, true); // Use capturing phase to catch errors from source elements
        
        // Try to reload video if it fails
        video.addEventListener('canplay', function() {
            const errorMessage = video.parentElement.querySelector('.video-error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
});
