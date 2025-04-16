document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

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
  document.getElementById('showModalBtn').addEventListener('click', showSuccessModal);
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

  // Close modal when clicking the close button
  closeModalBtn.addEventListener('click', hideSuccessModal);

  // Helper functions
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
});
