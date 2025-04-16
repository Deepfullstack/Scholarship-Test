document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const registrationForm = document.getElementById('registrationForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const mobileInput = document.getElementById('mobile');
  const mobileError = document.getElementById('mobile-error');
  const dobInput = document.getElementById('dob');
  const dobError = document.getElementById('dob-error');

  // Set minimum date for DOB (16 years ago)
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 16);
  dobInput.max = minDate.toISOString().split('T')[0];

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Scroll animations
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animated');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    elements.forEach(el => observer.observe(el));
  };
  
  // Initialize scroll animations
  animateOnScroll();

  // Mobile number validation
  mobileInput.addEventListener('input', function() {
    this.value = this.value.replace(/\D/g, '');
    if (this.value.length > 10) this.value = this.value.slice(0, 10);
  });

  mobileInput.addEventListener('blur', function() {
    if (this.value.length !== 10) {
      mobileError.textContent = 'Please enter exactly 10 digits';
      mobileError.style.display = 'block';
    } else {
      mobileError.style.display = 'none';
    }
  });

  // DOB validation
  dobInput.addEventListener('change', function() {
    const age = calculateAge(this.value);
    if (age < 16) {
      dobError.textContent = 'You must be at least 16 years old';
      dobError.style.display = 'block';
    } else if (age > 25) {
      dobError.textContent = 'Maximum age limit is 25 years';
      dobError.style.display = 'block';
    } else {
      dobError.style.display = 'none';
    }
  });

  // Form submission handler
  registrationForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    // Validate form first
    if (!validateForm()) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
      return;
    }

    try {
      // Prepare form data
      const formData = {
        fullName: document.getElementById('fullName').value,
        mobile: document.getElementById('mobile').value,
        dob: document.getElementById('dob').value,
        medium: document.getElementById('medium').value,
        pincode: document.getElementById('pincode').value,
        city: document.getElementById('city').value,
        currentClass: document.getElementById('currentClass').value,
        careerGoal: document.getElementById('careerGoal').value
      };

      // Send to backend with correct port
      const response = await fetch('http://localhost:3800/save-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      console.log('Fetch response:', result);
      if (result.success) {
        showSuccessModal();
        console.log('Modal displayed at:', new Date().toISOString());
      } else {
        alert('Submission failed: ' + result.error);
        showSuccessModal(); // Show modal even on non-success for debugging
        console.log('Modal displayed due to non-success at:', new Date().toISOString());
      }

      // Reset form
      this.reset();

    } catch (error) {
      console.error('Error:', error);
      alert('Submission failed. Please try again or contact us. Details: ' + error.message);
      showSuccessModal(); // Show modal on error for debugging
      console.log('Modal displayed due to error at:', new Date().toISOString());
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Application';
      if (successModal.style.display === 'flex') {
        console.log('Modal still open in finally block at:', new Date().toISOString());
      }
    }
  });

  // Close modal when clicking the close button
  closeModalBtn.addEventListener('click', hideSuccessModal);

  // Helper functions
  function validateForm() {
    let isValid = true;
    
    // Validate mobile number
    const mobile = document.getElementById('mobile').value;
    if (mobile.length !== 10 || !/^\d+$/.test(mobile)) {
      document.getElementById('mobile-error').style.display = 'block';
      isValid = false;
    }

    // Validate age (16-25 years)
    const dob = document.getElementById('dob').value;
    if (dob) {
      const age = calculateAge(dob);
      if (age < 16 || age > 25) {
        document.getElementById('dob-error').style.display = 'block';
        isValid = false;
      }
    } else {
      isValid = false;
    }

    return isValid;
  }

  function showSuccessModal() {
    successModal.style.display = 'flex';
    document.body.classList.add('modal-open');
    console.log('Modal shown at:', new Date().toISOString());
  }

  function hideSuccessModal() {
    successModal.style.display = 'none';
    document.body.classList.remove('modal-open');
    console.log('Modal hidden at:', new Date().toISOString());
  }

  function calculateAge(birthdate) {
    const today = new Date();
    const dob = new Date(birthdate);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }
});