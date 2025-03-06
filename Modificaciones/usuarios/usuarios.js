document.addEventListener('DOMContentLoaded', () => {
  // Initialize Feather icons
  feather.replace();
  
  // Set current date for creation date field
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('fcreado').value = today;
  
  // Get form elements
  const form = document.getElementById('userForm');
  const cancelBtn = document.getElementById('cancelBtn');
  const newUserBtn = document.getElementById('newUserBtn');
  const passwordInput = document.getElementById('clave');
  const togglePasswordBtn = document.querySelector('.toggle-password');
  const toast = document.getElementById('toast');
  
  // Toggle password visibility
  togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Change eye icon
    const eyeIcon = togglePasswordBtn.querySelector('i');
    if (type === 'password') {
      eyeIcon.setAttribute('data-feather', 'eye');
    } else {
      eyeIcon.setAttribute('data-feather', 'eye-off');
    }
    feather.replace();
  });
  
  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i data-feather="loader"></i> Guardando...';
    submitBtn.classList.add('bounce');
    submitBtn.disabled = true;
    feather.replace();
    
    // Simulate API call (setTimeout)
    setTimeout(() => {
      // Reset button state
      submitBtn.innerHTML = originalContent;
      submitBtn.classList.remove('bounce');
      submitBtn.disabled = false;
      feather.replace();
      
      // Show success toast
      showToast();
    }, 1500);
  });
  
  // Cancel button functionality
  cancelBtn.addEventListener('click', () => {
    form.classList.add('fade-out');
    
    setTimeout(() => {
      form.reset();
      
      // Reset creation date
      document.getElementById('fcreado').value = today;
      
      // Ensure "active" checkbox is checked
      document.getElementById('activo').checked = true;
      
      form.classList.remove('fade-out');
    }, 300);
  });
  
  // New user button
  newUserBtn.addEventListener('click', () => {
    form.classList.add('fade-out');
    
    setTimeout(() => {
      form.reset();
      
      // Reset creation date
      document.getElementById('fcreado').value = today;
      
      // Ensure "active" checkbox is checked
      document.getElementById('activo').checked = true;
      
      form.classList.remove('fade-out');
      
      // Focus on first input
      document.getElementById('nombre').focus();
    }, 300);
  });
  
  // Input focus animation
  const inputs = document.querySelectorAll('.input-container input');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      const icon = input.previousElementSibling || input.nextElementSibling;
      if (icon && icon.classList.contains('input-icon')) {
        icon.style.color = 'var(--primary)';
      }
    });
    
    input.addEventListener('blur', () => {
      const icon = input.previousElementSibling || input.nextElementSibling;
      if (icon && icon.classList.contains('input-icon') && !input.value) {
        icon.style.color = 'var(--muted)';
      }
    });
  });
  
  // Function to show toast notification
  function showToast() {
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
});


