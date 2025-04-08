document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    const contactBtn = document.getElementById('contactBtn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.querySelector('.toast-close');

    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            showToast('¡Gracias por tu interés! Pronto nos pondremos en contacto contigo.');
        });
    }

    if (toastClose) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('show');
        });
    }

    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});