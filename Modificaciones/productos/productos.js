document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const selectAllCheckbox = document.getElementById('selectAll');
    const rowCheckboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    const filterButtons = document.querySelectorAll('.clear-filter');
    const filterInputs = document.querySelectorAll('.filter-group input');
    const filterButton = document.querySelector('.filter-button');
    const addProductBtn = document.querySelector('.add-button');
    const productModal = document.getElementById('productModal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const notification = document.getElementById('notification');
    const notificationCloseBtn = document.querySelector('.toast-close');
    const productImageInput = document.getElementById('productImage');
    const previewImage = document.getElementById('previewImage');
    
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
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            productModal.classList.add('show');
        });
    }
    
    // Cerrar modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            productModal.classList.remove('show');
        });
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === productModal) {
            productModal.classList.remove('show');
        }
    });
    
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
    
    // Acciones de fila
    const editButtons = document.querySelectorAll('.row-actions .icon-btn:first-child');
    const viewButtons = document.querySelectorAll('.row-actions .icon-btn:nth-child(2)');
    const deleteButtons = document.querySelectorAll('.row-actions .icon-btn:last-child');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.cells[1].textContent;
            console.log('Editar producto ID:', id);
            productModal.classList.add('show');
        });
    });
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.cells[1].textContent;
            console.log('Ver detalles del producto ID:', id);
            showNotification('Detalles del producto', `Viendo detalles del producto #${id}`);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const id = row.cells[1].textContent;
            if (confirm(`¿Está seguro que desea eliminar el producto #${id}?`)) {
                console.log('Eliminar producto ID:', id);
                row.remove();
                showNotification('Producto eliminado', `El producto #${id} ha sido eliminado correctamente`);
            }
        });
    });
    
    // Función para mostrar notificaciones
    function showNotification(title, message) {
        const toastTitle = notification.querySelector('.toast-title');
        const toastMessage = notification.querySelector('.toast-message');
        
        toastTitle.textContent = title;
        toastMessage.textContent = message;
        
        notification.classList.add('show');
        
        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
    
    // Acciones rápidas
    const actionButtons = document.querySelectorAll('.action-buttons-grid .action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim();
            console.log('Acción rápida:', action);
            showNotification('Acción iniciada', `Se ha iniciado la acción: ${action}`);
        });
    });
    
    // Paginación
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