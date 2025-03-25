document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const filterButtons = document.querySelectorAll('.clear-filter');
    const filterInputs = document.querySelectorAll('.filter-group input');
    const filterButton = document.querySelector('.filter-button');
    // Referencias a modales
    const productModal = document.getElementById('productModal');
    const confirmModal = document.getElementById('confirmModal');
    // Referencias a botones
    const openAddProductBtn = document.getElementById('openAddProductModal');
    const addRowBtn = document.getElementById('addRowBtn');
    const closeProductModalBtn = document.getElementById('closeProductModal');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const closeConfirmModalBtn = document.getElementById('closeConfirmModal');
    const cancelConfirmBtn = document.getElementById('cancelConfirmBtn');
    const confirmActionBtn = document.getElementById('confirmActionBtn');
    // Referencias a elementos del formulario
    const productForm = document.getElementById('productForm');
    const productIdInput = document.getElementById('productId');
    const productCodeInput = document.getElementById('productCode');
    const productNameInput = document.getElementById('productName');
    const productCategoryInput = document.getElementById('productCategory');
    const productPrice1Input = document.getElementById('productPrice1');
    const productPrice2Input = document.getElementById('productPrice2');
    const productPrice3Input = document.getElementById('productPrice3');
    const productStockInput = document.getElementById('productStock');
    const productImageInput = document.getElementById('productImage');
    const previewImage = document.getElementById('previewImage');
    // Referencias a la tabla
    const productsTable = document.getElementById('productsTable');
    const tableBody = productsTable.querySelector('tbody');
    // Referencias a notificaciones
    const notification = document.getElementById('notification');
    const notificationCloseBtn = document.querySelector('.toast-close');
    // Variable para almacenar el elemento a eliminar
    let elementToDelete = null;
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
    // Abrir modal para agregar producto
    if (openAddProductBtn) {
        openAddProductBtn.addEventListener('click', function() {
            resetProductForm();
            document.getElementById('modalTitle').innerHTML = '<span class="material-icons">add</span> Agregar Producto';
            productModal.classList.add('show');
        });
    }
    // Abrir modal desde el botón de la tabla
    if (addRowBtn) {
        addRowBtn.addEventListener('click', function() {
            resetProductForm();
            document.getElementById('modalTitle').innerHTML = '<span class="material-icons">add</span> Agregar Producto';
            productModal.classList.add('show');
        });
    }
    // Cerrar modal de producto
    if (closeProductModalBtn) {
        closeProductModalBtn.addEventListener('click', function() {
            productModal.classList.remove('show');
        });
    }
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', function() {
            productModal.classList.remove('show');
        });
    }
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === productModal) {
            productModal.classList.remove('show');
        }
        if (event.target === confirmModal) {
            confirmModal.classList.remove('show');
        }
    });
    // Cerrar modal de confirmación
    if (closeConfirmModalBtn) {
        closeConfirmModalBtn.addEventListener('click', function() {
            confirmModal.classList.remove('show');
        });
    }
    if (cancelConfirmBtn) {
        cancelConfirmBtn.addEventListener('click', function() {
            confirmModal.classList.remove('show');
        });
    }
    // Cerrar notificación
    if (notificationCloseBtn) {
        notificationCloseBtn.addEventListener('click', function() {
            notification.classList.remove('show');
        });
    }
    // Vista previa de imagen
    if (productImageInput) {
        productImageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    // Guardar producto
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', function() {
            if (!validateProductForm()) {
                showNotification('Error', 'Por favor complete todos los campos requeridos', 'error');
                return;
            }
            const isEditing = productIdInput.value !== '';
            if (isEditing) {
                updateProductInTable();
                showNotification('Producto actualizado', 'El producto ha sido actualizado correctamente');
            } else {
                addProductToTable();
                showNotification('Producto agregado', 'El producto ha sido agregado correctamente');
            }
            productModal.classList.remove('show');
        });
    }
    // Acciones de fila - Usar delegación de eventos
    tableBody.addEventListener('click', function(e) {
        const target = e.target.closest('button');
        if (!target) return;
        const row = target.closest('tr');
        if (!row) return;
        // Si es el botón de editar
        if (target.classList.contains('edit-btn') || target.querySelector('.material-icons').textContent === 'edit') {
            const id = row.cells[1].textContent;
            const name = row.cells[2].textContent;
            const category = row.cells[3].textContent;
            const price1 = row.cells[4].textContent.replace(/,/g, '');
            const price2 = row.cells[5].textContent.replace(/,/g, '');
            const price3 = row.cells[6].textContent.replace(/,/g, '');
            const stock = row.cells[7].textContent;
            // Llenar el formulario con los datos
            productIdInput.value = id;
            productCodeInput.value = id;
            productNameInput.value = name;
            productCategoryInput.value = category;
            productPrice1Input.value = price1;
            productPrice2Input.value = price2;
            productPrice3Input.value = price3;
            productStockInput.value = stock;
            // Cambiar el título del modal
            document.getElementById('modalTitle').innerHTML = '<span class="material-icons">edit</span> Editar Producto';
            // Mostrar el modal
            productModal.classList.add('show');
        }
        // Si es el botón de ver
        if (target.classList.contains('view-btn') || target.querySelector('.material-icons').textContent === 'visibility') {
            const id = row.cells[1].textContent;
            showNotification('Detalles del producto', `Viendo detalles del producto #${id}`);
        }
        // Si es el botón de eliminar
        if (target.classList.contains('delete-btn') || target.querySelector('.material-icons').textContent === 'delete') {
            elementToDelete = row;
            const id = row.cells[1].textContent;
            document.getElementById('confirmMessage').textContent = `¿Está seguro que desea eliminar el producto #${id}?`;
            confirmModal.classList.add('show');
        }
    });
    // Confirmar eliminación
    if (confirmActionBtn) {
        confirmActionBtn.addEventListener('click', function() {
            if (elementToDelete) {
                const id = elementToDelete.cells[1].textContent;
                elementToDelete.remove();
                showNotification('Producto eliminado', `El producto #${id} ha sido eliminado correctamente`);
                elementToDelete = null;
                confirmModal.classList.remove('show');
            }
        });
    }
    // Función para validar el formulario
    function validateProductForm() {
        // Verificar campos requeridos
        if (!productCodeInput.value || 
            !productNameInput.value || 
            !productCategoryInput.value || 
            !productPrice1Input.value || 
            !productStockInput.value) {
            return false;
        }
        return true;
    }
    // Función para agregar producto a la tabla
    function addProductToTable() {
        // Obtener el último ID y aumentarlo en 1
        const rows = tableBody.querySelectorAll('tr:not(.empty-row)');
        let lastId = 0;
        if (rows.length > 0) {
            lastId = parseInt(rows[rows.length - 1].cells[1].textContent);
        }
        const newId = lastId + 1;
        // Crear nueva fila
        const newRow = document.createElement('tr');
        // Formatear precios con comas
        const price1 = parseFloat(productPrice1Input.value).toLocaleString('es-DO');
        const price2 = productPrice2Input.value ? parseFloat(productPrice2Input.value).toLocaleString('es-DO') : '0.00';
        const price3 = productPrice3Input.value ? parseFloat(productPrice3Input.value).toLocaleString('es-DO') : '0.00';
        // Contenido de la fila
        newRow.innerHTML = `
            <td>
                <label class="checkbox-container">
                    <input type="checkbox" />
                    <span class="checkmark"></span>
                </label>
            </td>
            <td>${newId}</td>
            <td>${productNameInput.value}</td>
            <td>${productCategoryInput.value}</td>
            <td>${price1}</td>
            <td>${price2}</td>
            <td>${price3}</td>
            <td>${productStockInput.value}</td>
            <td>
                <div class="row-actions">
                    <button class="icon-btn edit-btn" title="Editar">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="icon-btn view-btn" title="Ver detalles">
                        <span class="material-icons">visibility</span>
                    </button>
                    <button class="icon-btn danger delete-btn" title="Eliminar">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </td>
        `;
        // Insertar la fila antes de la fila vacía
        const emptyRow = tableBody.querySelector('.empty-row');
        tableBody.insertBefore(newRow, emptyRow);
    }
    // Función para actualizar producto en la tabla
    function updateProductInTable() {
        const id = productIdInput.value;
        const rows = tableBody.querySelectorAll('tr');
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            if (row.cells[1] && row.cells[1].textContent === id) {
                const price1 = parseFloat(productPrice1Input.value).toLocaleString('es-DO');
                const price2 = productPrice2Input.value ? parseFloat(productPrice2Input.value).toLocaleString('es-DO') : '0.00';
                const price3 = productPrice3Input.value ? parseFloat(productPrice3Input.value).toLocaleString('es-DO') : '0.00';
                // Actualizar celdas
                row.cells[2].textContent = productNameInput.value;
                row.cells[3].textContent = productCategoryInput.value;
                row.cells[4].textContent = price1;
                row.cells[5].textContent = price2;
                row.cells[6].textContent = price3;
                row.cells[7].textContent = productStockInput.value;
                break;
            }
        }
    }
    function resetProductForm() {
        productForm.reset();
        productIdInput.value = '';
        previewImage.src = '/placeholder.svg?height=200&width=300';
    }
    // Función para mostrar notificaciones
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
    const pageNumbers = document.querySelectorAll('.page-number');
    const pageNavs = document.querySelectorAll('.page-nav');
    pageNumbers.forEach(button => {
        button.addEventListener('click', function() {
            pageNumbers.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const page = this.textContent;
            console.log('Cambiar a página:', page);
        });
    });
    pageNavs.forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled) return;
            const direction = this.querySelector('.material-icons').textContent;
            const activePage = document.querySelector('.page-number.active');
            const currentPage = parseInt(activePage.textContent);
            let newPage;
            if (direction === 'chevron_left') {
                newPage = currentPage - 1;
            } else {
                newPage = currentPage + 1;
            }
            const targetPageBtn = document.querySelector(`.page-number:nth-child(${newPage + 1})`);
            if (targetPageBtn) {
                pageNumbers.forEach(btn => btn.classList.remove('active'));
                targetPageBtn.classList.add('active');
                console.log('Cambiar a página:', newPage);
            }
        });
    });
});