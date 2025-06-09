// Handle form steps navigation and validation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointmentForm');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressBar = document.querySelector('#step1 ~ .flex-1 .w-0');

    // Time slot generation based on hospital selection
    const hospitalTimings = {
        'Padmashree Diagnostics': {
            days: [1, 3, 5, 6], // Mon, Wed, Fri, Sat
            hours: { start: '08:30', end: '09:30' }
        },
        'Bhagwan Mahaveer Jain Hospital': {
            days: [1, 2, 3, 4, 5, 6], // Mon-Sat
            hours: { start: '10:00', end: '15:00' }
        },
        'Optima Super Speciality Hospital': {
            days: [1, 2, 3, 4, 6], // Mon-Thu & Sat
            hours: { start: '17:00', end: '19:00' }
        }
    };

    // Update available time slots based on hospital and date selection
    function updateTimeSlots() {
        const hospital = document.querySelector('[name="location"]').value;
        const date = new Date(document.querySelector('[name="appointment_date"]').value);
        const timeSelect = document.querySelector('[name="appointment_time"]');
        
        // Clear existing options
        timeSelect.innerHTML = '<option value="">Select a time</option>';
        
        if (!hospital || !date) return;
        
        const hospitalData = hospitalTimings[hospital];
        if (!hospitalData) return;
        
        // Check if selected day is available
        if (!hospitalData.days.includes(date.getDay())) {
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const availableDays = hospitalData.days.map(d => days[d]).join(', ');
            alert(`${hospital} is only available on: ${availableDays}`);
            document.querySelector('[name="appointment_date"]').value = '';
            return;
        }
        
        // Generate time slots
        const { start, end } = hospitalData.hours;
        const startHour = parseInt(start);
        const endHour = parseInt(end);
        
        for (let hour = startHour; hour < endHour; hour++) {
            const time12 = hour <= 12 ? `${hour}:00 AM` : `${hour-12}:00 PM`;
            const time24 = `${hour.toString().padStart(2, '0')}:00`;
            const option = new Option(time12, time24);
            timeSelect.add(option);
            
            const time12Half = hour <= 12 ? `${hour}:30 AM` : `${hour-12}:30 PM`;
            const time24Half = `${hour.toString().padStart(2, '0')}:30`;
            const optionHalf = new Option(time12Half, time24Half);
            timeSelect.add(optionHalf);
        }
    }

    // Set date input constraints
    function setupDateConstraints() {
        const dateInput = document.querySelector('[name="appointment_date"]');
        const today = new Date();
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 2); // Allow booking up to 2 months ahead
        
        dateInput.min = today.toISOString().split('T')[0];
        dateInput.max = maxDate.toISOString().split('T')[0];
    }

    // Step navigation
    function showStep(stepNumber) {
        step1.classList.toggle('hidden', stepNumber !== 1);
        step2.classList.toggle('hidden', stepNumber !== 2);
        prevBtn.classList.toggle('hidden', stepNumber === 1);
        nextBtn.classList.toggle('hidden', stepNumber === 2);
        submitBtn.classList.toggle('hidden', stepNumber !== 2);
        progressBar.style.width = stepNumber === 1 ? '0%' : '100%';
    }

    // Form validation
    function validateStep1() {
        const location = document.querySelector('[name="location"]').value;
        const date = document.querySelector('[name="appointment_date"]').value;
        const time = document.querySelector('[name="appointment_time"]').value;
        
        if (!location || !date || !time) {
            alert('Please complete all fields to proceed.');
            return false;
        }
        return true;
    }

    function validateStep2() {
        const name = document.querySelector('[name="name"]').value;
        const phone = document.querySelector('[name="phone"]').value;
        const email = document.querySelector('[name="email"]').value;

        if (!name || !phone || !email) {
            alert('Please fill in all required fields.');
            return false;
        }

        // Basic phone validation
        if (!/^\d{10}$/.test(phone.replace(/[\s-]/g, ''))) {
            alert('Please enter a valid 10-digit phone number.');
            return false;
        }

        // Basic email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        return true;
    }

    // Show hospital availability
    function showHospitalAvailability(hospital) {
        const availabilityInfo = document.getElementById('hospitalAvailability');
        if (!availabilityInfo) return;

        const hospitalData = hospitalTimings[hospital];
        if (!hospitalData) {
            availabilityInfo.innerHTML = '';
            return;
        }

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const availableDays = hospitalData.days.map(d => days[d]);
        const timeRange = `${convert24To12(hospitalData.hours.start)} - ${convert24To12(hospitalData.hours.end)}`;

        availabilityInfo.innerHTML = `
            <div class="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 class="text-sm font-medium text-gray-900 mb-2">Hospital Availability</h4>
                <div class="space-y-2">
                    <div class="flex items-start">
                        <i class="fas fa-calendar-alt text-primary mt-1 mr-2"></i>
                        <span class="text-sm text-gray-600">Available on: ${availableDays.join(', ')}</span>
                    </div>
                    <div class="flex items-start">
                        <i class="fas fa-clock text-primary mt-1 mr-2"></i>
                        <span class="text-sm text-gray-600">Consultation Hours: ${timeRange}</span>
                    </div>
                </div>
            </div>
        `;
    }

    function convert24To12(time24) {
        const [hours, minutes] = time24.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    // Event listeners
    document.querySelector('[name="location"]').addEventListener('change', (e) => {
        const selectedHospital = e.target.value;
        showHospitalAvailability(selectedHospital);
        updateTimeSlots();
    });
    document.querySelector('[name="appointment_date"]').addEventListener('change', updateTimeSlots);

    prevBtn.addEventListener('click', () => showStep(1));
    
    nextBtn.addEventListener('click', () => {
        if (validateStep1()) {
            showStep(2);
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateStep2()) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="inline-block animate-spin mr-2">↻</span> Booking...';

            // Show confirmation dialog
            const formData = new FormData(form);
            const appointmentDetails = {
                hospital: formData.get('location'),
                date: new Date(formData.get('appointment_date')).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                time: formData.get('appointment_time'),
                name: formData.get('name')
            };

            // Create and show confirmation overlay
            const overlay = document.createElement('div');
            overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
            overlay.innerHTML = `
                <div class="bg-white p-8 rounded-xl max-w-md w-full mx-4 transform transition-all duration-300 scale-95">
                    <div class="text-center">
                        <div class="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full mx-auto flex items-center justify-center mb-6 animate-bounce shadow-lg">
                            <i class="fas fa-check-circle text-4xl text-green-500"></i>
                        </div>
                        <div class="inline-block px-4 py-2 bg-green-50 rounded-full text-green-700 text-sm font-medium mb-4">
                            Successfully Booked
                        </div>
                        <h3 class="text-2xl font-bold text-gray-900 mb-2">Thank You, ${appointmentDetails.name}!</h3>
                        <p class="text-gray-600 mb-6">
                            Your appointment has been successfully scheduled.
                        </p>
                        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl mb-6 shadow-sm">
                            <h4 class="font-semibold text-gray-900 mb-4">Appointment Details</h4>
                            <div class="space-y-3 text-left">
                                <div class="flex items-center">
                                    <i class="fas fa-hospital text-primary w-6"></i>
                                    <span class="ml-3">${appointmentDetails.hospital}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-calendar text-primary w-6"></i>
                                    <span class="ml-3">${appointmentDetails.date}</span>
                                </div>
                                <div class="flex items-center">
                                    <i class="fas fa-clock text-primary w-6"></i>
                                    <span class="ml-3">${appointmentDetails.time}</span>
                                </div>
                            </div>
                        </div>
                        <div class="text-left bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
                            <div class="flex">
                                <i class="fas fa-info-circle text-yellow-600 mt-0.5"></i>
                                <div class="ml-3">
                                    <h4 class="text-sm font-medium text-yellow-800">Important Note</h4>
                                    <p class="text-sm text-yellow-700 mt-1">Please arrive 15 minutes before your appointment time. Don't forget to bring any relevant medical records.</p>
                                </div>
                            </div>
                        </div>
                        <div class="text-center text-gray-600 mt-6">
                            <p class="mb-2">A confirmation email has been sent to your inbox.</p>
                            <div class="mt-4">
                                <button type="button" class="btn-primary" onclick="this.closest('.fixed').remove()">
                                    <i class="fas fa-check mr-2"></i> Done
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);
        }
    });

    // Initialize
    setupDateConstraints();
});
