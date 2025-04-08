document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
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
    const backToListBtn = document.getElementById('backToList');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const pageTitle = document.getElementById('pageTitle');
    const notification = document.getElementById('notification');
    const notificationCloseBtn = document.querySelector('.toast-close');

    // Verificar si estamos editando
    const editProductId = localStorage.getItem('editProductId');
    if (editProductId) {
        pageTitle.textContent = 'Editar Producto';
        loadProductData(editProductId);
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

    // Volver a la lista
    if (backToListBtn) {
        backToListBtn.addEventListener('click', function() {
            window.location.href = 'productos.html';
        });
    }

    // Cancelar
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', function() {
            window.location.href = 'productos.html';
        });
    }

    // Guardar producto
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', function() {
            if (!validateProductForm()) {
                showNotification('Error', 'Por favor complete todos los campos requeridos', 'error');
                return;
            }
            const productData = {
                id: productIdInput.value || Date.now(), // Usar timestamp como ID si es nuevo
                name: productNameInput.value,
                category: productCategoryInput.value,
                price1: parseFloat(productPrice1Input.value),
                price2: parseFloat(productPrice2Input.value) || 0,
                price3: parseFloat(productPrice3Input.value) || 0,
                stock: parseInt(productStockInput.value)
            };
            saveProduct(productData);
            showNotification('Producto guardado', 'El producto ha sido guardado correctamente');
            setTimeout(() => {
                window.location.href = 'productos.html';
            }, 1000);
        });
    }

    // Validar formulario
    function validateProductForm() {
        return productCodeInput.value && productNameInput.value && productCategoryInput.value && productPrice1Input.value && productStockInput.value;
    }

    // Cargar datos para edición
    function loadProductData(id) {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.id == id);
        if (product) {
            productIdInput.value = product.id;
            productCodeInput.value = product.id;
            productNameInput.value = product.name;
            productCategoryInput.value = product.category;
            productPrice1Input.value = product.price1;
            productPrice2Input.value = product.price2;
            productPrice3Input.value = product.price3;
            productStockInput.value = product.stock;
        }
    }

    // Guardar producto en localStorage
    function saveProduct(productData) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        if (editProductId) {
            products = products.map(p => p.id == editProductId ? productData : p);
        } else {
            products.push(productData);
        }
        localStorage.setItem('products', JSON.stringify(products));
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

    // Cerrar notificación
    if (notificationCloseBtn) {
        notificationCloseBtn.addEventListener('click', function() {
            notification.classList.remove('show');
        });
    }
});