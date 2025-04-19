document.addEventListener('DOMContentLoaded', () => {
    // Inicializar los iconos de Feather
    feather.replace();

    // Referencias a elementos del DOM
    const listView = document.getElementById('listView');
    const formView = document.getElementById('formView');
    const newArticleBtn = document.getElementById('newArticleBtn');
    const backToListBtn = document.getElementById('backToList');
    const cancelBtn = document.getElementById('cancelBtn');
    const articleForm = document.getElementById('articleForm');
    const articleList = document.getElementById('articleList');
    const pageTitle = document.getElementById('pageTitle');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.querySelector('.toast-close');
    const modal = document.getElementById('confirmModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');
    const modalClose = document.querySelector('.modal-close');

    // Variables de estado
    let articles = JSON.parse(localStorage.getItem('articles')) || [];
    let currentArticleIndex = null;

    // Función para mostrar la vista de formulario
    function showFormView(isEdit = false) {
        listView.classList.remove('active');
        formView.classList.add('active');
        
        // Establecer fecha actual
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('fcreado').value = today;
        document.getElementById('fmodificado').value = today;
        
        if (isEdit && currentArticleIndex !== null) {
            pageTitle.textContent = 'Editar Artículo';
            const article = articles[currentArticleIndex];
            
            document.getElementById('codigo').value = article.codigo;
            document.getElementById('nombre').value = article.nombre;
            document.getElementById('descripcion').value = article.descripcion;
            document.getElementById('categoria').value = article.categoria;
            document.getElementById('precio').value = article.precio;
            document.getElementById('stock').value = article.stock;
            document.getElementById('fcreado').value = article.fcreado;
            document.getElementById('fmodificado').value = today;
            document.getElementById('activo').checked = article.activo;
        } else {
            pageTitle.textContent = 'Nuevo Artículo';
            articleForm.reset();
        }
    }

    // Función para mostrar la vista de listado
    function showListView() {
        formView.classList.remove('active');
        listView.classList.add('active');
        currentArticleIndex = null;
        renderArticleList();
    }

    // Función para renderizar la lista de artículos
    function renderArticleList() {
        articleList.innerHTML = '';
        articles.forEach((article, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Código">${article.codigo}</td>
                <td data-label="Nombre">${article.nombre}</td>
                <td data-label="Descripción">${article.descripcion}</td>
                <td data-label="Categoría">${article.categoria}</td>
                <td data-label="Precio">$${parseFloat(article.precio).toFixed(2)}</td>
                <td data-label="Stock">${article.stock}</td>
                <td data-label="Estado">${article.activo ? 'Activo' : 'Inactivo'}</td>
                <td data-label="Acciones">
                    <button class="edit-btn" data-index="${index}">
                        <i data-feather="edit"></i>
                    </button>
                    <button class="btn-danger" data-index="${index}">
                        <i data-feather="trash"></i>
                    </button>
                </td>
            `;
            articleList.appendChild(row);
        });
        feather.replace();

        // Agregar eventos a los botones de edición y eliminación
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                currentArticleIndex = parseInt(index);
                showFormView(true);
            });
        });

        document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                currentArticleIndex = parseInt(index);
                showModal('¿Está seguro de que desea eliminar este artículo?', () => {
                    articles.splice(currentArticleIndex, 1);
                    localStorage.setItem('articles', JSON.stringify(articles));
                    renderArticleList();
                    showToast('Artículo eliminado correctamente');
                });
            });
        });
    }

    // Función para mostrar el modal de confirmación
    function showModal(message, onConfirm) {
        modalMessage.textContent = message;
        modal.classList.add('show');
        
        modalConfirm.onclick = () => {
            onConfirm();
            modal.classList.remove('show');
        };
        
        modalCancel.onclick = () => {
            modal.classList.remove('show');
        };
        
        modalClose.onclick = () => {
            modal.classList.remove('show');
        };
    }

    // Función para mostrar notificaciones toast
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Evento para el botón de nuevo artículo
    newArticleBtn.addEventListener('click', () => {
        currentArticleIndex = null;
        showFormView(false);
    });

    // Evento para el botón volver
    backToListBtn.addEventListener('click', () => {
        showListView();
    });

    // Evento para el botón cancelar
    cancelBtn.addEventListener('click', () => {
        showListView();
    });

    // Evento para cerrar el toast
    toastClose.addEventListener('click', () => {
        toast.classList.remove('show');
    });

    // Manejar el envío del formulario
    articleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!articleForm.checkValidity()) {
            articleForm.reportValidity();
            return;
        }

        const formData = new FormData(articleForm);
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

        if (currentArticleIndex === null) {
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
                idx != currentArticleIndex && article.codigo === articleData.codigo
            );
            if (codeExists) {
                alert('El código ya existe en otro artículo. Por favor, use un código único.');
                return;
            }
            articles[currentArticleIndex] = articleData;
            showToast('Artículo actualizado correctamente');
        }

        localStorage.setItem('articles', JSON.stringify(articles));
        setTimeout(() => {
            showListView();
        }, 1500);
    });

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

    // Inicializar la aplicación
    renderArticleList();
});