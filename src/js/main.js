// Mobile Menu
const initMobileMenu = () => {
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const body = document.body;

    function toggleMenu() {
        const isOpen = mobileMenu.classList.contains('translate-x-0');
        
        if (isOpen) {
            // Close menu
            mobileMenu.classList.remove('translate-x-0');
            mobileMenu.classList.add('-translate-x-full');
            body.classList.remove('overflow-hidden');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
            }, 300);
        } else {
            // Open menu
            mobileMenu.classList.remove('hidden');
            // Force a reflow
            mobileMenu.offsetHeight;
            mobileMenu.classList.remove('-translate-x-full');
            mobileMenu.classList.add('translate-x-0');
            body.classList.add('overflow-hidden');
        }
    }

    // Toggle menu on button click
    mobileMenuButton?.addEventListener('click', toggleMenu);
    closeMobileMenu?.addEventListener('click', toggleMenu);

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            toggleMenu();
        }
    });

    // Close menu on resize if screen becomes larger than mobile breakpoint
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
            toggleMenu();
        }
    });

    // Handle mobile menu link clicks
    const mobileMenuLinks = mobileMenu.querySelectorAll('a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
        });
    });
};

// FAQ Accordion
const initFAQAccordion = () => {
    const faqBtns = document.querySelectorAll('.faq-btn');
    
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('svg');
            
            content.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
            
            // Close other FAQs
            faqBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.nextElementSibling.classList.add('hidden');
                    otherBtn.querySelector('svg').classList.remove('rotate-180');
                }
            });
        });
    });
};

// Smooth Scrolling
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
};

// Stats Animation
const initStatsAnimation = () => {
    const stats = document.querySelectorAll('.stats-gradient h3');
    const animatedStats = [];
    
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            let currentValue = Math.floor(progress * (end - start) + start);
            
            if (element.dataset.format === 'plus') {
                element.textContent = `${currentValue}+`;
            } else if (element.dataset.format === '24-7') {
                element.textContent = '24/7';
            } else {
                element.textContent = currentValue;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedStats.includes(entry.target)) {
                animatedStats.push(entry.target);
                const value = parseInt(entry.target.dataset.value);
                animateValue(entry.target, 0, value, 1500);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
};

// Booking functionality
const hospitalHours = {
    'Apollo Hospital': {
        'Monday': ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
        'Tuesday': ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
        'Wednesday': ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
        'Thursday': ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
        'Friday': ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
        'Saturday': ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM']
    },
    'Fortis Hospital': {
        'Monday': ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'],
        'Tuesday': ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'],
        'Wednesday': ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'],
        'Thursday': ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'],
        'Friday': ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'],
        'Sunday': ['11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM']
    },
    'Lilavati Hospital': {
        'Tuesday': ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'],
        'Thursday': ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'],
        'Saturday': ['3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']
    }
};

function openBooking(hospital) {
    const modal = document.getElementById('bookingModal');
    const hospitalInput = document.getElementById('hospitalName');
    const dateInput = document.getElementById('date');
    
    if (modal && hospitalInput) {
        modal.classList.remove('hidden');
        hospitalInput.value = hospital;
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Reset time slots
        updateTimeSlots(hospital, dateInput.value);
    }
}

function closeBooking() {
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function updateTimeSlots(hospital, date) {
    const timeSelect = document.getElementById('time');
    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    
    // Clear existing options
    timeSelect.innerHTML = '<option value="">Select a time slot</option>';
    
    // Add available time slots for the selected hospital and day
    if (hospitalHours[hospital] && hospitalHours[hospital][dayOfWeek]) {
        hospitalHours[hospital][dayOfWeek].forEach(time => {
            const option = document.createElement('option');
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });
    }
}

// Booking Section Functionality
const initBookingSection = () => {
    const bookingModal = document.getElementById('bookingModal');
    const hospitalNameInput = document.getElementById('hospitalName');
    const timeSelect = document.getElementById('time');
    const bookingForm = document.getElementById('bookingForm');

    window.openBooking = (hospital) => {
        if (bookingModal && hospitalNameInput) {
            bookingModal.classList.remove('hidden');
            hospitalNameInput.value = hospital;
            document.body.classList.add('overflow-hidden');
            updateTimeSlots(hospital);
        }
    }

    window.closeBooking = () => {
        if (bookingModal) {
            bookingModal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
            if (bookingForm) bookingForm.reset();
        }
    }

    const updateTimeSlots = (hospital) => {
        if (!timeSelect) return;

        timeSelect.innerHTML = '<option value="">Select a time slot</option>';
        let slots = [];

        switch(hospital) {
            case 'Apollo Hospital':
                slots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];
                break;
            case 'Fortis Hospital':
                slots = ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
                break;
            case 'Lilavati Hospital':
                slots = ['4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
                break;
        }

        slots.forEach(slot => {
            const option = document.createElement('option');
            option.value = slot;
            option.textContent = slot;
            timeSelect.appendChild(option);
        });
    }

    // Handle form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically send the form data to your backend
            alert('Thank you for booking an appointment. We will contact you shortly to confirm.');
            closeBooking();
        });
    }

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeBooking();
    });

    // Close modal on outside click
    if (bookingModal) {
        bookingModal.addEventListener('click', (e) => {
            if (e.target === bookingModal) closeBooking();
        });
    }
};

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initFAQAccordion();
    initSmoothScroll();
    initStatsAnimation();
    initBookingSection();
    
    const dateInput = document.getElementById('date');
    const hospitalInput = document.getElementById('hospitalName');
    const bookingForm = document.getElementById('bookingForm');

    if (dateInput && hospitalInput) {
        dateInput.addEventListener('change', () => {
            updateTimeSlots(hospitalInput.value, dateInput.value);
        });
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            const bookingDetails = Object.fromEntries(formData);
            
            // Here you would typically send this data to your backend
            console.log('Booking details:', bookingDetails);
            
            // Show success message
            alert('Appointment booked successfully! We will contact you shortly to confirm your appointment.');
            closeBooking();
            bookingForm.reset();
        });
    }
});

// Add smooth scroll behavior to all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .card').forEach(el => {
    observer.observe(el);
});

// Handle responsive images
function handleResponsiveImages() {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        if (window.innerWidth < 768) {
            img.src = img.dataset.mobileSrc || img.dataset.src;
        } else {
            img.src = img.dataset.src;
        }
    });
}

window.addEventListener('load', handleResponsiveImages);
window.addEventListener('resize', handleResponsiveImages);

// Social Icons Interaction
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.querySelector('i').style.transform = 'scale(1.2) rotate(5deg)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.querySelector('i').style.transform = 'scale(1) rotate(0)';
    });
});
