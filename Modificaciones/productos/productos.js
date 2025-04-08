document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const filterButtons = document.querySelectorAll('.clear-filter');
    const filterInputs = document.querySelectorAll('.filter-group input');
    const filterButton = document.querySelector('.filter-button');
    const goToAddProductBtn = document.getElementById('goToAddProduct');
    const productList = document.getElementById('productList');
    const notification = document.getElementById('notification');
    const notificationCloseBtn = document.querySelector('.toast-close');

    // Lista de productos inicial
    let products = [
        { id: 1, name: 'CPU DELL CI5 DESKTOP', category: 'Computadoras', price1: 10500, price2: 10000, price3: 9500, stock: 5 },
        { id: 2, name: 'MONITOR DELL 24"', category: 'Monitores', price1: 5200, price2: 5000, price3: 4800, stock: 8 },
        { id: 3, name: 'TECLADO LOGITECH', category: 'Periféricos', price1: 1200, price2: 1100, price3: 1000, stock: 15 }
    ];

    // Renderizar lista de productos
    function renderProductList() {
        productList.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <label class="checkbox-container">
                        <input type="checkbox" />
                        <span class="checkmark"></span>
                    </label>
                </td>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.price1.toLocaleString('es-DO')}</td>
                <td>${product.price2.toLocaleString('es-DO')}</td>
                <td>${product.price3.toLocaleString('es-DO')}</td>
                <td>${product.stock}</td>
                <td>
                    <div class="row-actions">
                        <button class="icon-btn edit-btn" data-id="${product.id}" title="Editar">
                            <span class="material-icons">edit</span>
                        </button>
                        <button class="icon-btn view-btn" data-id="${product.id}" title="Ver detalles">
                            <span class="material-icons">visibility</span>
                        </button>
                        <button class="icon-btn danger delete-btn" data-id="${product.id}" title="Eliminar">
                            <span class="material-icons">delete</span>
                        </button>
                    </div>
                </td>
            `;
            productList.appendChild(row);
        });
    }

    // Seleccionar/deseleccionar todos los checkboxes
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            rowCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });
    }

    // Limpiar campos de filtro
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            input.value = '';
            input.focus();
        });
    });

    // Filtrar productos
    if (filterButton) {
        filterButton.addEventListener('click', function() {
            const filters = {};
            filterInputs.forEach(input => {
                if (input.value.trim() !== '') {
                    filters[input.placeholder] = input.value.trim();
                }
            });
            console.log('Filtros aplicados:', filters);
            showNotification('Filtros aplicados', 'Se han aplicado los filtros seleccionados');
        });
    }

    // Ir a pantalla de agregar producto
    if (goToAddProductBtn) {
        goToAddProductBtn.addEventListener('click', function() {
            localStorage.removeItem('editProductId'); // Limpiar cualquier edición
            window.location.href = 'gestion-producto.html';
        });
    }

    // Acciones de fila
    productList.addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;
        const id = target.getAttribute('data-id');
        const product = products.find(p => p.id == id);

        if (target.classList.contains('edit-btn')) {
            localStorage.setItem('editProductId', id);
            window.location.href = 'gestion-producto.html';
        } else if (target.classList.contains('view-btn')) {
            showNotification('Detalles del producto', `Viendo detalles del producto #${id}`);
        } else if (target.classList.contains('delete-btn')) {
            if (confirm(`¿Está seguro que desea eliminar el producto #${id}?`)) {
                products = products.filter(p => p.id != id);
                renderProductList();
                showNotification('Producto eliminado', `El producto #${id} ha sido eliminado correctamente`);
            }
        }
    });

    // Cerrar notificación
    if (notificationCloseBtn) {
        notificationCloseBtn.addEventListener('click', function() {
            notification.classList.remove('show');
        });
    }

    // Mostrar notificaciones
    function showNotification(title, message, type = 'success') {
        const toastTitle = notification.querySelector('.toast-title');
        const toastMessage = notification.querySelector('.toast-message');
        const toastIcon = notification.querySelector('.toast-icon .material-icons');
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        if (type === 'error') {
            toastIcon.textContent = 'error';
            notification.style.borderLeftColor = 'var(--danger)';
            toastIcon.style.color = 'var(--danger)';
        } else {
            toastIcon.textContent = 'check_circle';
            notification.style.borderLeftColor = 'var(--success)';
            toastIcon.style.color = 'var(--success)';
        }
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // Inicializar lista
    renderProductList();
});