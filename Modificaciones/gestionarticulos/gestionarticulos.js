document.addEventListener('DOMContentLoaded', () => {
    feather.replace();

    const form = document.getElementById('articleForm');
    const backToListBtn = document.getElementById('backToList');
    const cancelBtn = document.getElementById('cancelBtn');
    const pageTitle = document.getElementById('pageTitle');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.querySelector('.toast-close');
    const newArticleBtn = document.getElementById('newArticleBtn');
    const articleList = document.getElementById('articleList');

    // Cargar y mostrar la lista de artículos
    function loadArticleList() {
        const articles = JSON.parse(localStorage.getItem('articles')) || [];
        articleList.innerHTML = '';
        
        articles.forEach((article, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${article.codigo}</td>
                <td>${article.nombre}</td>
                <td>${article.descripcion}</td>
                <td>${article.categoria}</td>
                <td>${article.precio}</td>
                <td>${article.stock}</td>
                <td>
                    <span class="status-badge ${article.activo ? 'active' : 'inactive'}">
                        ${article.activo ? 'Activo' : 'Inactivo'}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn secondary edit-article" data-index="${index}">
                            <i data-feather="edit"></i>
                            <span>Editar</span>
                        </button>
                        <button class="btn secondary delete-article" data-index="${index}">
                            <i data-feather="trash-2"></i>
                            <span>Eliminar</span>
                        </button>
                    </div>
                </td>
            `;
            articleList.appendChild(row);

            // Agregar eventos a los botones
            const editBtn = row.querySelector('.edit-article');
            const deleteBtn = row.querySelector('.delete-article');

            editBtn.addEventListener('click', () => {
                localStorage.setItem('editArticleIndex', index);
                window.location.href = 'nuevoarticulo.html';
            });

            deleteBtn.addEventListener('click', () => {
                if (confirm('¿Está seguro de que desea eliminar este artículo?')) {
                    articles.splice(index, 1);
                    localStorage.setItem('articles', JSON.stringify(articles));
                    loadArticleList();
                    showToast('Artículo eliminado correctamente');
                }
            });
        });
        
        // Reinicializar los iconos después de agregar nuevas filas
        feather.replace();
    }

    // Cargar la lista al iniciar
    if (articleList) {
        loadArticleList();
    }

    // Evento para el botón de nuevo artículo
    if (newArticleBtn) {
        newArticleBtn.addEventListener('click', () => {
            localStorage.removeItem('editArticleIndex');
            window.location.href = 'nuevoarticulo.html';
        });
    }

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fcreado').value = today;
    document.getElementById('fmodificado').value = today;

    let articles = JSON.parse(localStorage.getItem('articles')) || [];
    const editIndex = localStorage.getItem('editArticleIndex');

    if (editIndex !== null) {
        pageTitle.textContent = 'Editar Artículo';
        const article = articles[editIndex];
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

    if (backToListBtn) {
        backToListBtn.addEventListener('click', () => {
            window.location.href = 'gestionarticulos.html';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'gestionarticulos.html';
        });
    }

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
                const codeExists = articles.some(article => article.codigo === articleData.codigo);
                if (codeExists) {
                    alert('El código ya existe. Por favor, use un código único.');
                    return;
                }
                articles.push(articleData);
                showToast('Artículo guardado correctamente');
            } else {
                const codeExists = articles.some((article, idx) => idx != editIndex && article.codigo === articleData.codigo);
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