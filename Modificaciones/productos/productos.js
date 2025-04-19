document.addEventListener('DOMContentLoaded', () => {
    // Inicializar los iconos de Material
    if (typeof M !== 'undefined' && M.AutoInit) {
        M.AutoInit();
    }

    // Referencias a elementos del DOM
    const listView = document.getElementById('listView');
    const formView = document.getElementById('formView');
    const newProductBtn = document.getElementById('newProductBtn');
    const backToListBtn = document.getElementById('backToList');
    const cancelBtn = document.getElementById('cancelBtn');
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const pageTitle = document.getElementById('pageTitle');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastClose = document.querySelector('.toast-close');
    const modal = document.getElementById('confirmModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');
    const modalClose = document.querySelector('.modal-close');
    const productImageInput = document.getElementById('imagen');
    const previewImage = document.getElementById('previewImage');

    // Variables de estado
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let currentProductIndex = null;

    // Función para mostrar la vista de formulario
    function showFormView(isEdit = false) {
        listView.classList.remove('active');
        formView.classList.add('active');
        
        // Establecer fecha actual
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('fcreado').value = today;
        document.getElementById('fmodificado').value = today;
        
        if (isEdit && currentProductIndex !== null) {
            pageTitle.textContent = 'Editar Producto';
            const product = products[currentProductIndex];
            
            document.getElementById('codigo').value = product.codigo;
            document.getElementById('descripcion').value = product.descripcion;
            document.getElementById('categoria').value = product.categoria;
            document.getElementById('subcategoria').value = product.subcategoria || '';
            document.getElementById('precio1').value = product.precio1;
            document.getElementById('precio2').value = product.precio2 || '';
            document.getElementById('precio3').value = product.precio3 || '';
            document.getElementById('existencia').value = product.existencia;
            document.getElementById('almacen').value = product.almacen || '';
            document.getElementById('unidad').value = product.unidad || '';
            document.getElementById('detalles').value = product.detalles || '';
            document.getElementById('fcreado').value = product.fcreado;
            document.getElementById('fmodificado').value = today;
            document.getElementById('activo').checked = product.activo;
            
            if (product.imagen) {
                previewImage.src = product.imagen;
            } else {
                previewImage.src = '/placeholder.svg?height=200&width=300';
            }
        } else {
            pageTitle.textContent = 'Nuevo Producto';
            productForm.reset();
            previewImage.src = '/placeholder.svg?height=200&width=300';
        }
    }

    // Función para mostrar la vista de listado
    function showListView() {
        formView.classList.remove('active');
        listView.classList.add('active');
        currentProductIndex = null;
        renderProductList();
    }

    // Función para renderizar la lista de productos
    function renderProductList() {
        productList.innerHTML = '';
        products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Código">${product.codigo}</td>
                <td data-label="Descripción">${product.descripcion}</td>
                <td data-label="Categoría">${product.categoria}</td>
                <td data-label="Precio 1">${parseFloat(product.precio1).toFixed(2)}</td>
                <td data-label="Precio 2">${product.precio2 ? parseFloat(product.precio2).toFixed(2) : '-'}</td>
                <td data-label="Precio 3">${product.precio3 ? parseFloat(product.precio3).toFixed(2) : '-'}</td>
                <td data-label="Existencia">${product.existencia}</td>
                <td data-label="Estado">${product.activo ? 'Activo' : 'Inactivo'}</td>
                <td data-label="Acciones">
                    <button class="edit-btn" data-index="${index}">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="btn-danger" data-index="${index}">
                        <span class="material-icons">delete</span>
                    </button>
                </td>
            `;
            productList.appendChild(row);
        });

        // Agregar eventos a los botones de edición y eliminación
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                currentProductIndex = parseInt(index);
                showFormView(true);
            });
        });

        document.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                currentProductIndex = parseInt(index);
                showModal('¿Está seguro de que desea eliminar este producto?', () => {
                    products.splice(currentProductIndex, 1);
                    localStorage.setItem('products', JSON.stringify(products));
                    renderProductList();
                    showToast('Producto eliminado correctamente');
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

    // Evento para el botón de nuevo producto
    if (newProductBtn) {
        newProductBtn.addEventListener('click', () => {
            currentProductIndex = null;
            showFormView(false);
        });
    }

    // Evento para el botón volver
    if (backToListBtn) {
        backToListBtn.addEventListener('click', () => {
            showListView();
        });
    }

    // Evento para el botón cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            showListView();
        });
    }

    // Evento para cerrar el toast
    if (toastClose) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('show');
        });
    }

    // Manejar el envío del formulario
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!productForm.checkValidity()) {
                productForm.reportValidity();
                return;
            }

            const formData = new FormData(productForm);
            const productData = {
                codigo: formData.get('codigo'),
                descripcion: formData.get('descripcion'),
                categoria: formData.get('categoria'),
                subcategoria: formData.get('subcategoria'),
                precio1: formData.get('precio1'),
                precio2: formData.get('precio2'),
                precio3: formData.get('precio3'),
                existencia: formData.get('existencia'),
                almacen: formData.get('almacen'),
                unidad: formData.get('unidad'),
                detalles: formData.get('detalles'),
                fcreado: formData.get('fcreado'),
                fmodificado: formData.get('fmodificado'),
                activo: formData.get('activo') === 'on',
                imagen: previewImage.src !== '/placeholder.svg?height=200&width=300' ? previewImage.src : null
            };

            if (currentProductIndex === null) {
                // Nuevo producto
                const codeExists = products.some(product => product.codigo === productData.codigo);
                if (codeExists) {
                    showModal('El código ya existe. Por favor, use un código único.', () => {});
                    return;
                }
                products.push(productData);
                showToast('Producto guardado correctamente');
            } else {
                // Editar producto existente
                const codeExists = products.some((product, idx) => 
                    idx != currentProductIndex && product.codigo === productData.codigo
                );
                if (codeExists) {
                    showModal('El código ya existe en otro producto. Por favor, use un código único.', () => {});
                    return;
                }
                products[currentProductIndex] = productData;
                showToast('Producto actualizado correctamente');
            }

            localStorage.setItem('products', JSON.stringify(products));
            setTimeout(() => {
                showListView();
            }, 1500);
        });
    }

    // Efectos visuales para los inputs
    const inputs = document.querySelectorAll('.input-container input, .input-container select, .input-container textarea');
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
    renderProductList();
});