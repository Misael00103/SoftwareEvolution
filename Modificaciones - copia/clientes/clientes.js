document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed'); // Depuración

    // Initialize Feather icons
    feather.replace();
    
    // Set current date for creation and modification date fields
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('fcreado').value = today;
    document.getElementById('fmodificado').value = today;
    
    // Array to store clients (simulating a database)
    let clients = [];
    
    // Variable to track if we are editing a client and the index of the client being edited
    let isEditing = false;
    let editIndex = null;
    
    // Get DOM elements
    const appContainer = document.getElementById('appContainer');
    const form = document.getElementById('clientForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmDialog = document.getElementById('confirmDialog');
    const confirmationDetails = document.getElementById('confirmationDetails');
    const closeConfirmDialog = document.getElementById('closeConfirmDialog');
    const cancelConfirmDialog = document.getElementById('cancelConfirmDialog');
    const confirmDialogConfirm = document.getElementById('confirmDialogConfirm');
    const clientList = document.getElementById('clientList');
    const formTitle = document.getElementById('formTitle');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const initialClientDialog = document.getElementById('initialClientDialog');
    const initialClientList = document.getElementById('initialClientList');
    const accessClientsBtn = document.getElementById('accessClientsBtn');
    
    // Verificar que los elementos existen
    console.log('form:', form);
    console.log('confirmDialog:', confirmDialog);

    // Function to render the client list in the main table
    function renderClientList() {
        clientList.innerHTML = '';
        clients.forEach((client, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-label="Nombre">${client.nombre}</td>
                <td data-label="Apellido">${client.apellido}</td>
                <td data-label="Cédula">${client.cedula}</td>
                <td data-label="Teléfono">${client.telefono}</td>
                <td data-label="Correo">${client.correo}</td>
                <td data-label="Tipo">${client.tipoCliente}</td>
                <td data-label="Estado">${client.activo ? 'Activo' : 'Inactivo'}</td>
                <td data-label="Acciones">
                    <button class="edit-btn" data-index="${index}">
                        <i data-feather="edit"></i>
                    </button>
                </td>
            `;
            clientList.appendChild(row);
        });

        // Reemplazar los íconos de Feather después de agregar las filas
        feather.replace();

        // Agregar eventos a los botones de editar
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                editClient(index);
            });
        });
    }
    
    // Function to edit a client
    function editClient(index) {
        isEditing = true;
        editIndex = index;
        const client = clients[index];

        // Cambiar el título del formulario
        formTitle.innerHTML = '<i data-feather="edit"></i> Editar Cliente';
        feather.replace();

        // Cargar los datos del cliente en el formulario
        document.getElementById('nombre').value = client.nombre;
        document.getElementById('apellido').value = client.apellido;
        document.getElementById('cedula').value = client.cedula;
        document.getElementById('direccion').value = client.direccion;
        document.getElementById('telefono').value = client.telefono;
        document.getElementById('celular').value = client.celular || '';
        document.getElementById('correo').value = client.correo;
        document.getElementById('tipoCliente').value = client.tipoCliente;
        document.getElementById('fcreado').value = client.fcreado;
        document.getElementById('fmodificado').value = today; // Actualizar la fecha de modificación
        document.getElementById('activo').checked = client.activo;

        // Enfocar el primer campo
        document.getElementById('nombre').focus();
    }
    
    // Function to render the initial client selection list
    function renderInitialClientList() {
        initialClientList.innerHTML = '';
        if (clients.length === 0) {
            initialClientList.innerHTML = '<p>No hay clientes registrados.</p>';
        } else {
            clients.forEach((client, index) => {
                const item = document.createElement('div');
                item.classList.add('client-selection-item');
                item.innerHTML = `
                    <span>${client.nombre} ${client.apellido} - ${client.cedula}</span>
                `;
                initialClientList.appendChild(item);
            });
        }
    }

    // Show initial client dialog on page load
    initialClientDialog.classList.add('show');
    renderInitialClientList();

    // Access clients button functionality
    if (accessClientsBtn) {
        accessClientsBtn.addEventListener('click', () => {
            initialClientDialog.classList.remove('show');
            appContainer.style.display = 'block';
            renderClientList();
        });
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
            const clientData = {
                nombre: formData.get('nombre'),
                apellido: formData.get('apellido'),
                cedula: formData.get('cedula'),
                direccion: formData.get('direccion'),
                telefono: formData.get('telefono'),
                celular: formData.get('celular'),
                correo: formData.get('correo'),
                tipoCliente: formData.get('tipoCliente'),
                fcreado: formData.get('fcreado'),
                fmodificado: formData.get('fmodificado'),
                activo: formData.get('activo') === 'on'
            };
            
            console.log('Client data:', clientData); // Depuración
            
            // Populate confirmation dialog
            confirmationDetails.innerHTML = `
                <p><strong>Nombre:</strong> ${clientData.nombre}</p>
                <p><strong>Apellido:</strong> ${clientData.apellido}</p>
                <p><strong>Cédula:</strong> ${clientData.cedula}</p>
                <p><strong>Dirección:</strong> ${clientData.direccion}</p>
                <p><strong>Teléfono:</strong> ${clientData.telefono}</p>
                <p><strong>Celular:</strong> ${clientData.celular || 'N/A'}</p>
                <p><strong>Correo:</strong> ${clientData.correo}</p>
                <p><strong>Tipo de Cliente:</strong> ${clientData.tipoCliente}</p>
                <p><strong>Fecha de Creación:</strong> ${clientData.fcreado}</p>
                <p><strong>Fecha de Modificación:</strong> ${clientData.fmodificado}</p>
                <p><strong>Activo:</strong> ${clientData.activo ? 'Sí' : 'No'}</p>
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
            
            // Get form data again to add or update the clients array
            const formData = new FormData(form);
            const newClient = {
                nombre: formData.get('nombre'),
                apellido: formData.get('apellido'),
                cedula: formData.get('cedula'),
                direccion: formData.get('direccion'),
                telefono: formData.get('telefono'),
                celular: formData.get('celular'),
                correo: formData.get('correo'),
                tipoCliente: formData.get('tipoCliente'),
                fcreado: formData.get('fcreado'),
                fmodificado: formData.get('fmodificado'),
                activo: formData.get('activo') === 'on'
            };
            
            // Add or update the client in the array
            if (isEditing) {
                clients[editIndex] = newClient;
                console.log('Client updated:', newClient); // Depuración
                toastMessage.textContent = 'Cliente actualizado correctamente';
            } else {
                clients.push(newClient);
                console.log('New client added:', newClient); // Depuración
                toastMessage.textContent = 'Cliente guardado correctamente';
            }
            console.log('Clients array:', clients); // Depuración
            
            // Update the client list
            renderClientList();
            
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
                
                // Reset form
                resetForm();
            }, 1500);
        });
    }
    
    // Cancel button functionality
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
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
            console.error('form.reset is not a function. Ensure clientForm is a <form> element.');
        }
        document.getElementById('fcreado').value = today;
        document.getElementById('fmodificado').value = today;
        document.getElementById('activo').checked = true;
        formTitle.innerHTML = '<i data-feather="user-plus"></i> Nuevo Cliente';
        feather.replace();
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