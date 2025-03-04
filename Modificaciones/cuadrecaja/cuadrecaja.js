document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather icons
    feather.replace();

    // Tab functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });


    // Form submission
    const form = document.querySelector('.user-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted');
        // Add your form submission logic here
    });

    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    searchInput.addEventListener('input', (e) => {
        console.log('Searching for:', e.target.value);
        // Add your search logic here
    });

    // New user button
    const newUserButton = document.querySelector('.primary-button');
    newUserButton.addEventListener('click', () => {
        console.log('New user button clicked');
        // Add your new user logic here
    });
});

//Codigo nuevo insertar debajo esta linea