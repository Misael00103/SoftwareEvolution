// Función existente para el toggle del sidebar
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.querySelector('.toggle-btn');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    toggleBtn.innerHTML = sidebar.classList.contains('collapsed') ? '▶' : '◀';
});

// Función existente para los menu items
const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Nueva función jQuery para manejar los clics en .menu-arrow
$(document).ready(function() {
    const $toggle = $('.menu-arrow'); // Usamos .menu-arrow para coincidir con tu HTML

    $toggle.on('click', function() {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }
    });
});