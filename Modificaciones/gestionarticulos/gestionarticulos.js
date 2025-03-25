document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed'); // Depuración

    // Initialize Feather icons
    feather.replace();
    
    // Set current date for creation and modification date fields
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fcreado').value = today;
    document.getElementById('fmodificado').value = today;
    
    // Array to store articles (simulating a database)
    let articles = [];
    
    // Variable to track if we are editing an article and the index of the article being edited
    let isEditing = false;
    let editIndex = null;
    
    // Get DOM elements
    const form = document.getElementById('articleForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const newArticleBtn = document.getElementById('newArticleBtn');
    const articleModal = document.getElementById('articleModal');
    const closeArticleModal = document.getElementById('closeArticleModal');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmationDetails = document.getElementById('confirmationDetails');
    const closeConfirmDialog = document.getElementById('closeConfirmDialog');
    const cancelConfirmDialog = document.getElementById('cancelConfirmDialog');
    const confirmDialogConfirm = document.getElementById('confirmDialogConfirm');
    const articleList = document.getElementById('articleList');
    const modalTitle = document.getElementById('modalTitle');
    
    // Verificar que los elementos existen
    console.log('newArticleBtn:', newArticleBtn);
    console.log('articleModal:', articleModal);
    console.log('form:', form);
    console.log('confirmDialog:', confirmDialog);

    // Function to render the article list
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
                </td>
            `;
            articleList.appendChild(row);
        });

        // Reemplazar los íconos de Feather después de agregar las filas
        feather.replace();

        // Agregar eventos a los botones de editar
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                editArticle(index);
            });
        });
    }
    
    // Function to edit an article
    function editArticle(index) {
        isEditing = true;
        editIndex = index;
        const article = articles[index];

        // Cambiar el título del modal
        modalTitle.innerHTML = '<i data-feather="edit"></i> Editar Artículo';
        feather.replace();

        // Cargar los datos del artículo en el formulario
        document.getElementById('codigo').value = article.codigo;
        document.getElementById('nombre').value = article.nombre;
        document.getElementById('descripcion').value = article.descripcion;
        document.getElementById('categoria').value = article.categoria;
        document.getElementById('precio').value = article.precio;
        document.getElementById('stock').value = article.stock;
        document.getElementById('fcreado').value = article.fcreado;
        document.getElementById('fmodificado').value = today; // Actualizar la fecha de modificación
        document.getElementById('activo').checked = article.activo;

        // Abrir el modal
        articleModal.classList.add('show');
        document.getElementById('codigo').focus();
    }
    
    // Open modal when clicking "New Article" button
    if (newArticleBtn) {
        newArticleBtn.addEventListener('click', () => {
            console.log('New Article button clicked'); // Depuración
            isEditing = false;
            editIndex = null;
            resetForm();
            modalTitle.innerHTML = '<i data-feather="plus-circle"></i> Nuevo Artículo';
            feather.replace();
            if (articleModal) {
                articleModal.classList.add('show');
                console.log('Modal should be visible now'); // Depuración
            } else {
                console.error('articleModal not found');
            }
            const codigoInput = document.getElementById('codigo');
            if (codigoInput) {
                codigoInput.focus();
            } else {
                console.error('codigo input not found');
            }
        });
    } else {
        console.error('newArticleBtn not found');
    }
    
    // Close modal
    if (closeArticleModal) {
        closeArticleModal.addEventListener('click', () => {
            console.log('Close modal button clicked'); // Depuración
            articleModal.classList.remove('show');
        });
    } else {
        console.error('closeArticleModal not found');
    }
    
    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted'); // Depuración
            
            // Verificar si el formulario es válido
            if (!form.checkValidity()) {
                console.log('Form validation failed');
                form.reportValidity(); // Mostrar mensajes de validación del navegador
                return;
            }
            
            // Get form data
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
            
            console.log('Article data:', articleData); // Depuración
            
            // Verificar si el código ya existe (solo al agregar, no al editar)
            if (!isEditing) {
                const codeExists = articles.some(article => article.codigo === articleData.codigo);
                if (codeExists) {
                    alert('El código ya existe. Por favor, use un código único.');
                    return;
                }
            } else {
                // Al editar, verificar que el código no esté duplicado con otro artículo
                const codeExists = articles.some((article, idx) => idx !== editIndex && article.codigo === articleData.codigo);
                if (codeExists) {
                    alert('El código ya existe en otro artículo. Por favor, use un código único.');
                    return;
                }
            }
            
            // Populate confirmation modal
            confirmationDetails.innerHTML = `
                <p><strong>Código:</strong> ${articleData.codigo}</p>
                <p><strong>Nombre:</strong> ${articleData.nombre}</p>
                <p><strong>Descripción:</strong> ${articleData.descripcion}</p>
                <p><strong>Categoría:</strong> ${articleData.categoria}</p>
                <p><strong>Precio:</strong> $${parseFloat(articleData.precio).toFixed(2)}</p>
                <p><strong>Stock:</strong> ${articleData.stock}</p>
                <p><strong>Fecha de Creación:</strong> ${articleData.fcreado}</p>
                <p><strong>Fecha de Modificación:</strong> ${articleData.fmodificado}</p>
                <p><strong>Activo:</strong> ${articleData.activo ? 'Sí' : 'No'}</p>
            `;
            
            // Show confirmation dialog
            if (confirmDialog) {
                confirmDialog.classList.add('show');
                console.log('Confirmation dialog should be visible'); // Depuración
            } else {
                console.error('confirmDialog not found');
            }
        });
    } else {
        console.error('form not found');
    }
    
    // Confirm dialog actions
    if (closeConfirmDialog) {
        closeConfirmDialog.addEventListener('click', () => {
            confirmDialog.classList.remove('show');
        });
    }
    
    if (cancelConfirmDialog) {
        cancelConfirmDialog.addEventListener('click', () => {
            confirmDialog.classList.remove('show');
        });
    }
    
    if (confirmDialogConfirm) {
        confirmDialogConfirm.addEventListener('click', () => {
            console.log('Confirm button clicked'); // Depuración
            confirmDialog.classList.remove('show');
            
            // Get form data again to add or update the articles array
            const formData = new FormData(form);
            const newArticle = {
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
            
            // Add or update the article in the array
            if (isEditing) {
                articles[editIndex] = newArticle;
                console.log('Article updated:', newArticle); // Depuración
                toastMessage.textContent = 'Artículo actualizado correctamente';
            } else {
                articles.push(newArticle);
                console.log('New article added:', newArticle); // Depuración
                toastMessage.textContent = 'Artículo guardado correctamente';
            }
            console.log('Articles array:', articles); // Depuración
            
            // Update the article list
            renderArticleList();
            
            // Get submit button
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i data-feather="loader"></i> Guardando...';
            submitBtn.classList.add('bounce');
            submitBtn.disabled = true;
            feather.replace();
            
            // Simulate API call (setTimeout)
            setTimeout(() => {
                // Reset button state
                submitBtn.innerHTML = originalContent;
                submitBtn.classList.remove('bounce');
                submitBtn.disabled = false;
                feather.replace();
                
                // Show success toast
                showToast();
                
                // Reset form and close modal
                resetForm();
                articleModal.classList.remove('show');
            }, 1500);
        });
    }
    
    // Cancel button functionality
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            articleModal.classList.remove('show');
            resetForm();
        });
    }
    
    // Input focus animation
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
    
    // Function to reset the form
    function resetForm() {
        if (form && typeof form.reset === 'function') {
            form.reset();
        } else {
            console.error('form.reset is not a function. Ensure articleForm is a <form> element.');
        }
        document.getElementById('fcreado').value = today;
        document.getElementById('fmodificado').value = today;
        document.getElementById('activo').checked = true;
        isEditing = false;
        editIndex = null;
    }
    
    // Function to show toast notification
    function showToast() {
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});