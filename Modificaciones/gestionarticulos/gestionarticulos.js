document.addEventListener('DOMContentLoaded', () => {
    feather.replace();

    const newArticleBtn = document.getElementById('newArticleBtn');
    const articleList = document.getElementById('articleList');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.querySelector('.toast-close');
    const modal = document.getElementById('confirmModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');

    let articles = JSON.parse(localStorage.getItem('articles')) || [];

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

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                showModal('¿Desea editar este artículo?', () => {
                    localStorage.setItem('editArticleIndex', index);
                    window.location.href = 'nuevoarticulo.html';
                });
            });
        });

        document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                showModal('¿Está seguro de que desea eliminar este artículo?', () => {
                    articles.splice(index, 1);
                    localStorage.setItem('articles', JSON.stringify(articles));
                    renderArticleList();
                    showToast('Artículo eliminado correctamente');
                });
            });
        });
    }

    function showModal(message, onConfirm) {
        modalMessage.textContent = message;
        modal.classList.add('show');
        modalConfirm.onclick = () => {
            onConfirm();
            modal.classList.remove('show');
        };
        modalCancel.onclick = () => modal.classList.remove('show');
        document.querySelector('.modal-close').onclick = () => modal.classList.remove('show');
    }

    if (newArticleBtn) {
        newArticleBtn.addEventListener('click', () => {
            localStorage.removeItem('editArticleIndex');
            window.location.href = 'nuevoarticulo.html';
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

    renderArticleList();
});