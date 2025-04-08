document.addEventListener('DOMContentLoaded', () => {
    // Inicializar los iconos de Feather
    feather.replace();

    // Referencias a elementos del DOM
    const form = document.getElementById('articleForm');
    const backToListBtn = document.getElementById('backToList');
    const cancelBtn = document.getElementById('cancelBtn');
    const pageTitle = document.getElementById('pageTitle');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.querySelector('.toast-close');

    // Establecer fecha actual
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fcreado').value = today;
    document.getElementById('fmodificado').value = today;

    // Cargar datos si estamos en modo edición
    let articles = JSON.parse(localStorage.getItem('articles')) || [];
    const editIndex = localStorage.getItem('editArticleIndex');

    if (editIndex !== null) {
        pageTitle.textContent = 'Editar Artículo';
        const article = articles[editIndex];
        if (article) {
            document.getElementById('codigo').value = article.codigo;
            document.getElementById('nombre').value = article.nombre;
            document.getElementById('descripcion').value = article.descripcion;
            document.getElementById('categoria').value = article.categoria;
            document.getElementById('precio').value = article.precio;
            document.getElementById('stock').value = article.stock;
            document.getElementById('fcreado').value = article.fcreado;
            document.getElementById('fmodificado').value = today;
            document.getElementById('activo').checked = article.activo;
        }
    }

    // Evento para el botón volver
    if (backToListBtn) {
        backToListBtn.addEventListener('click', () => {
            window.location.href = 'gestionarticulos.html';
        });
    }

    // Evento para el botón cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'gestionarticulos.html';
        });
    }

    // Manejar el envío del formulario
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const formData = new FormData(form);
            const articleData = {
                codigo: formData.get('codigo'),
                nombre: formData.get('nombre'),
                descripcion: formData.get('descripcion'),
                categoria: formData.get('categoria'),
                precio: formData.get('precio'),
                stock: formData.get('stock'),
                fcreado: formData.get('fcreado'),
                fmodificado: formData.get('fmodificado'),
                activo: formData.get('activo') === 'on'
            };

            if (editIndex === null) {
                // Nuevo artículo
                const codeExists = articles.some(article => article.codigo === articleData.codigo);
                if (codeExists) {
                    alert('El código ya existe. Por favor, use un código único.');
                    return;
                }
                articles.push(articleData);
                showToast('Artículo guardado correctamente');
            } else {
                // Editar artículo existente
                const codeExists = articles.some((article, idx) => 
                    idx != editIndex && article.codigo === articleData.codigo
                );
                if (codeExists) {
                    alert('El código ya existe en otro artículo. Por favor, use un código único.');
                    return;
                }
                articles[editIndex] = articleData;
                showToast('Artículo actualizado correctamente');
            }

            localStorage.setItem('articles', JSON.stringify(articles));
            setTimeout(() => {
                window.location.href = 'gestionarticulos.html';
            }, 1500);
        });
    }

    // Efectos visuales para los inputs
    const inputs = document.querySelectorAll('.input-container input, .input-container select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const icon = input.nextElementSibling;
            if (icon && icon.classList.contains('input-icon')) {
                icon.style.color = 'var(--primary)';
            }
        });
        input.addEventListener('blur', () => {
            const icon = input.nextElementSibling;
            if (icon && icon.classList.contains('input-icon') && !input.value) {
                icon.style.color = 'var(--text-secondary)';
            }
        });
    });

    // Manejo del toast
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