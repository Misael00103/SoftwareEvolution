  document.addEventListener('DOMContentLoaded', function() {s
    const urlParams = new URLSearchParams(window.location.search);
    const errorMsg = urlParams.get('error');
    
    if (errorMsg) {
        const errorContainer = document.getElementById('error-container');
        errorContainer.textContent = errorMsg;
        errorContainer.style.display = 'flex';
    }
    
    const formElements = document.querySelectorAll('.form-input, .button-primary');
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
});